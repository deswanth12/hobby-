import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const durable = require('../server/durableStorage.cjs');
const { readDb } = require('../server/db.cjs');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const BACKUPS_DIR = path.join(ROOT_DIR, 'data', 'backups');

export async function createBackup(customOutputFile = null) {
  if (!fs.existsSync(BACKUPS_DIR)) {
    fs.mkdirSync(BACKUPS_DIR, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const targetFile = customOutputFile || path.join(BACKUPS_DIR, `backup-${timestamp}.json`);

  // 1. Gather all tables from durable storage / local DB
  const [
    enquiries,
    servicesData,
    faqsData,
    settings,
    slugRedirects
  ] = await Promise.all([
    durable.readAllEnquiries(),
    durable.readAllServices(),
    durable.readAllFaqs(),
    durable.readSettings(),
    durable.readSlugRedirects()
  ]);

  const localDb = readDb();
  const posts = localDb.posts || [];

  const snapshot = {
    version: '1.0.0',
    createdAt: new Date().toISOString(),
    storageProvider: durable.getDurableStatus().provider,
    data: {
      enquiries: enquiries || [],
      services: servicesData.active || [],
      deletedServices: servicesData.deleted || [],
      faqs: faqsData.active || [],
      deletedFaqs: faqsData.deleted || [],
      settings: settings || {},
      slugRedirects: slugRedirects || {},
      posts: posts || []
    }
  };

  const jsonString = JSON.stringify(snapshot, null, 2);
  const checksum = crypto.createHash('sha256').update(jsonString).digest('hex');
  snapshot.checksum = checksum;

  fs.writeFileSync(targetFile, JSON.stringify(snapshot, null, 2), 'utf8');

  return {
    success: true,
    backupFile: targetFile,
    checksum,
    recordCounts: {
      enquiries: snapshot.data.enquiries.length,
      activeServices: snapshot.data.services.length,
      deletedServices: snapshot.data.deletedServices.length,
      activeFaqs: snapshot.data.faqs.length,
      deletedFaqs: snapshot.data.deletedFaqs.length,
      posts: snapshot.data.posts.length
    }
  };
}

// Allow direct CLI execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const customPath = process.argv[2] || null;
  console.log('[db-backup] Starting practice database backup...');
  createBackup(customPath)
    .then(res => {
      console.log(`[db-backup] Backup successfully created at: ${res.backupFile}`);
      console.log(`[db-backup] SHA256: ${res.checksum}`);
      console.log('[db-backup] Record counts:', JSON.stringify(res.recordCounts, null, 2));
    })
    .catch(err => {
      console.error('[db-backup] Backup failed:', err);
      process.exit(1);
    });
}
