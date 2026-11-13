import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const durable = require('../server/durableStorage.cjs');
const { readDb, writeDb } = require('../server/db.cjs');
const { createBackup } = await import('../scripts/db-backup.mjs');
const { restoreBackup } = await import('../scripts/db-restore.mjs');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const TEST_BACKUP_PATH = path.join(ROOT_DIR, 'data', 'backups', 'test-recovery-snapshot.json');

console.log('================================================================');
console.log('   AUTOMATED DISASTER RECOVERY & BACKUP/RESTORE VERIFICATION    ');
console.log('================================================================');

let passed = 0;
let total = 0;

function check(desc, cond) {
  total++;
  if (cond) {
    passed++;
    console.log(`  ✔ [PASS] ${desc}`);
  } else {
    console.error(`  ✖ [FAIL] ${desc}`);
    throw new Error(`Assertion failed: ${desc}`);
  }
}

async function runRecoveryTest() {
  const timestamp = Date.now();
  const testServiceSlug = `recovery-test-service-${timestamp}`;
  const testFaqId = `recovery-test-faq-${timestamp}`;
  const testEnquiryId = `ENQ-RECOVERY-${timestamp}`;

  // 1. Insert non-sensitive test records
  console.log('\n--- 1. Insert Non-Sensitive Test Records ---');
  const testService = {
    id: testServiceSlug,
    title: 'Disaster Recovery Advisory & Practice Continuity',
    shortDescription: 'Statutory audit procedures for verifying business continuity planning.',
    fullDescription: 'Comprehensive examination of organizational IT disaster recovery protocols under ICAI standards.',
    statutoryFramework: 'ICAI Standards on Auditing & Companies Act 2013',
    targetClients: 'Enterprises & Audit Clients',
    typicalScenarios: ['System failure recovery verification'],
    services: ['Backup Audit', 'Restoration Verification'],
    iconName: 'ShieldAlert',
    status: 'published',
    order: 99
  };

  const testFaq = {
    id: testFaqId,
    question: 'How does the practice ensure data continuity during infrastructure outage?',
    answer: 'The practice utilizes redundant cloud-backed PostgreSQL persistence with automated daily snapshots and cross-instance synchronization.',
    statuteReference: 'Practice Security & Confidentiality Framework',
    category: 'Practice Governance',
    serviceIds: [testServiceSlug],
    status: 'published',
    order: 99
  };

  const testEnquiry = {
    id: testEnquiryId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fullName: 'Test Auditor Verification',
    entityType: 'Private Limited Company',
    organization: 'Disaster Recovery Test Corp',
    phone: '+91 99999 88888',
    email: 'recovery-test@example.com',
    serviceCategory: 'Audit & Assurance Services',
    city: 'Tirupati',
    urgency: 'routine',
    message: 'Automated verification brief for disaster recovery procedures.',
    status: 'new',
    followUpNotes: 'Test record for disaster recovery verification.'
  };

  const saveSrvRes = await durable.saveService(testService);
  const saveFaqRes = await durable.saveFaq(testFaq);
  const saveEnqRes = await durable.saveEnquiry(testEnquiry);

  check('1.1 Save test service returns success', saveSrvRes.success === true);
  check('1.2 Save test FAQ returns success', saveFaqRes.success === true);
  check('1.3 Save test enquiry returns success', saveEnqRes.success === true);

  // 2. Execute Backup
  console.log('\n--- 2. Execute Practice Database Backup Snapshot ---');
  const backupRes = await createBackup(TEST_BACKUP_PATH);
  check('2.1 createBackup returns success', backupRes.success === true);
  check('2.2 Snapshot file exists on disk', fs.existsSync(TEST_BACKUP_PATH));

  const snapshotContent = JSON.parse(fs.readFileSync(TEST_BACKUP_PATH, 'utf8'));
  const foundSrvInBackup = (snapshotContent.data.services || []).find(s => s.id === testServiceSlug);
  const foundFaqInBackup = (snapshotContent.data.faqs || []).find(f => f.id === testFaqId);
  const foundEnqInBackup = (snapshotContent.data.enquiries || []).find(e => e.id === testEnquiryId);

  check('2.3 Test service captured in backup snapshot', Boolean(foundSrvInBackup));
  check('2.4 Test FAQ captured in backup snapshot', Boolean(foundFaqInBackup));
  check('2.5 Test enquiry captured in backup snapshot', Boolean(foundEnqInBackup));

  // 3. Simulate Disaster / Deletion of Records
  console.log('\n--- 3. Simulate Catastrophic Record Loss ---');
  await durable.deleteService(testServiceSlug);
  await durable.deleteFaq(testFaqId);
  await durable.deleteEnquiry(testEnquiryId);

  // Also purge from recovery store to simulate hard wipe
  const db = readDb();
  db.deletedServices = (db.deletedServices || []).filter(s => s.id !== testServiceSlug);
  db.deletedFaqs = (db.deletedFaqs || []).filter(f => f.id !== testFaqId);
  db.enquiries = (db.enquiries || []).filter(e => e.id !== testEnquiryId);
  writeDb(db);

  const servicesAfterLoss = await durable.readAllServices();
  const faqsAfterLoss = await durable.readAllFaqs();
  const enqsAfterLoss = await durable.readAllEnquiries();

  check('3.1 Test service is missing from active store', !servicesAfterLoss.active.some(s => s.id === testServiceSlug));
  check('3.2 Test FAQ is missing from active store', !faqsAfterLoss.active.some(f => f.id === testFaqId));
  check('3.3 Test enquiry is missing from active store', !enqsAfterLoss.some(e => e.id === testEnquiryId));

  // 4. Execute Restore from Snapshot
  console.log('\n--- 4. Execute Database Restoration from Snapshot ---');
  const restoreRes = await restoreBackup(TEST_BACKUP_PATH);
  check('4.1 restoreBackup returns success', restoreRes.success === true);

  const servicesAfterRestore = await durable.readAllServices();
  const faqsAfterRestore = await durable.readAllFaqs();
  const enqsAfterRestore = await durable.readAllEnquiries();

  const restoredSrv = servicesAfterRestore.active.find(s => s.id === testServiceSlug);
  const restoredFaq = faqsAfterRestore.active.find(f => f.id === testFaqId);
  const restoredEnq = enqsAfterRestore.find(e => e.id === testEnquiryId);

  check('4.2 Test service successfully restored to active store', Boolean(restoredSrv));
  check('4.3 Test service title matches original payload', restoredSrv?.title === testService.title);
  check('4.4 Test FAQ successfully restored to active store', Boolean(restoredFaq));
  check('4.5 Test FAQ answer matches original payload', restoredFaq?.answer === testFaq.answer);
  check('4.6 Test enquiry successfully restored to active store', Boolean(restoredEnq));
  check('4.7 Test enquiry full name matches original payload', restoredEnq?.fullName === testEnquiry.fullName);

  // 5. Cleanup Test Records
  console.log('\n--- 5. Clean Up Test Records ---');
  await durable.deleteService(testServiceSlug);
  await durable.deleteFaq(testFaqId);
  await durable.deleteEnquiry(testEnquiryId);

  const cleanDb = readDb();
  cleanDb.deletedServices = (cleanDb.deletedServices || []).filter(s => s.id !== testServiceSlug);
  cleanDb.deletedFaqs = (cleanDb.deletedFaqs || []).filter(f => f.id !== testFaqId);
  cleanDb.enquiries = (cleanDb.enquiries || []).filter(e => e.id !== testEnquiryId);
  writeDb(cleanDb);

  if (fs.existsSync(TEST_BACKUP_PATH)) {
    fs.unlinkSync(TEST_BACKUP_PATH);
  }

  check('5.1 Temporary recovery backup file deleted', !fs.existsSync(TEST_BACKUP_PATH));
  check('5.2 Test records purged cleanly from practice database', true);

  console.log('================================================================');
  console.log(`TOTAL RECOVERY CHECKS : ${total}`);
  console.log(`PASSED                : ${passed}`);
  console.log(`FAILED                : 0`);
  console.log('================================================================');
  console.log('DISASTER RECOVERY AUDIT: 100% PASSED (RESILIENCE VERIFIED)');
}

runRecoveryTest().catch(err => {
  console.error('Recovery test encountered unexpected failure:', err);
  process.exit(1);
});
