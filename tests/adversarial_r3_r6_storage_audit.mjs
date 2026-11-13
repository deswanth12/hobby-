import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const durable = require('../server/durableStorage.cjs');
const { handleApiRequest } = require('../server/apiRouter.cjs');
const { readDb, writeDb, SESSION_SECRET } = require('../server/db.cjs');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

console.log('================================================================================');
console.log('       ADVERSARIAL R3 & R6 PERSISTENCE, DURABILITY & FAILOVER AUDIT             ');
console.log('================================================================================\n');

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;
const findings = [];

function auditCheck(id, title, isVulnerable, details = '') {
  totalChecks++;
  if (isVulnerable) {
    failedChecks++;
    console.log(`  \x1b[31m[CONFIRMED DEFECT]\x1b[0m ${id}: ${title}`);
    if (details) console.log(`    Evidence: ${details}`);
    findings.push({ id, title, details });
  } else {
    passedChecks++;
    console.log(`  \x1b[32m[VERIFIED SECURE]\x1b[0m ${id}: ${title}`);
  }
}

// Helper to simulate HTTP requests to handleApiRequest
function simulateApi(method, url, headers = {}, body = null) {
  return new Promise((resolve) => {
    const bodyStr = body ? (typeof body === 'string' ? body : JSON.stringify(body)) : '';
    const bodyBuf = Buffer.from(bodyStr);

    const req = {
      method,
      url,
      headers: {
        'host': 'localhost:5173',
        'content-type': 'application/json',
        'content-length': bodyBuf.length,
        ...headers
      },
      connection: { remoteAddress: '127.0.0.1' },
      socket: { remoteAddress: '127.0.0.1' },
      on: (event, handler) => {
        if (event === 'data' && bodyBuf.length > 0) handler(bodyBuf);
        else if (event === 'end') handler();
        return req;
      }
    };

    let statusCode = 200;
    const resHeaders = {};
    const chunks = [];

    const res = {
      statusCode: 200,
      setHeader: (name, val) => { resHeaders[name.toLowerCase()] = val; },
      writeHead: (code, hdrs) => {
        statusCode = code;
        if (hdrs) Object.entries(hdrs).forEach(([k, v]) => { resHeaders[k.toLowerCase()] = v; });
      },
      end: (chunk) => {
        if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        const rawBody = Buffer.concat(chunks).toString('utf8');
        let json = null;
        try { json = JSON.parse(rawBody); } catch {}
        resolve({
          statusCode: res.statusCode || statusCode,
          headers: resHeaders,
          rawBody,
          json
        });
      }
    };

    handleApiRequest(req, res).catch(err => {
      resolve({ statusCode: 500, headers: {}, rawBody: String(err), json: { error: String(err) } });
    });
  });
}

function issueTestToken(username = 'admin', role = 'admin') {
  const payload = {
    sub: username,
    name: 'Test Administrator',
    role,
    jti: 'test-audit-' + crypto.randomBytes(16).toString('hex'),
    iat: Math.floor(Date.now() / 1000) + 60,
    exp: Math.floor(Date.now() / 1000) + 3600
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(payloadB64).digest('base64url');
  return { token: `ka_jwt.${payloadB64}.${sig}`, payload };
}

async function runAdversarialAudit() {
  const schemaSql = fs.readFileSync(path.join(ROOT_DIR, 'supabase', 'schema.sql'), 'utf8');

  // ---------------------------------------------------------------------------
  // 1. Audit Check: STRICT_DURABLE_STORAGE Enforcement Bypass
  // ---------------------------------------------------------------------------
  console.log('\n--- 1. Testing STRICT_DURABLE_STORAGE Failover & Silent Ephemeral Writes ---');
  process.env.STRICT_DURABLE_STORAGE = 'true';
  // Note: VERCEL is not set, or even if set, mutations other than enquiry don't check it

  // 1.1 Test saveService with STRICT_DURABLE_STORAGE=true when durable is unconfigured
  const testService = {
    id: 'adversarial-strict-service-test',
    title: 'Strict Mode Leak Test Service',
    shortDescription: 'Testing if saveService silently writes to local storage in strict mode',
    status: 'published'
  };
  const saveSrvRes = await durable.saveService(testService);
  // It returns success: true and writes to local DB!
  const localDbAfterSrv = readDb();
  const srvWrittenLocally = (localDbAfterSrv.services || []).some(s => s.id === testService.id);

  auditCheck(
    'R3-DEFECT-01',
    'saveService silently writes to ephemeral local storage when STRICT_DURABLE_STORAGE=true',
    saveSrvRes.success === true && srvWrittenLocally,
    `saveService returned success=${saveSrvRes.success} without Supabase connection, persisting record to local DB.`
  );

  // 1.2 Test saveFaq with STRICT_DURABLE_STORAGE=true
  const testFaq = {
    id: 'adversarial-strict-faq-test',
    question: 'Strict Mode FAQ Test?',
    answer: 'Testing if saveFaq silently writes to local storage',
    status: 'published'
  };
  const saveFaqRes = await durable.saveFaq(testFaq);
  const localDbAfterFaq = readDb();
  const faqWrittenLocally = (localDbAfterFaq.faqs || []).some(f => f.id === testFaq.id);

  auditCheck(
    'R3-DEFECT-02',
    'saveFaq silently writes to ephemeral local storage when STRICT_DURABLE_STORAGE=true',
    saveFaqRes.success === true && faqWrittenLocally,
    `saveFaq returned success=${saveFaqRes.success} without Supabase connection, persisting record to local DB.`
  );

  // 1.3 Test saveSettings with STRICT_DURABLE_STORAGE=true
  const saveSettingsRes = await durable.saveSettings({ primaryPhone: '+91 99999 11111' });
  auditCheck(
    'R3-DEFECT-03',
    'saveSettings silently writes to ephemeral local storage when STRICT_DURABLE_STORAGE=true',
    saveSettingsRes.success === true,
    `saveSettings returned success=${saveSettingsRes.success} without Supabase connection.`
  );

  // 1.4 Test updateUserPassword with STRICT_DURABLE_STORAGE=true
  const savePassRes = await durable.updateUserPassword('admin', 'TestNewPassword#1234');
  auditCheck(
    'R3-DEFECT-04',
    'updateUserPassword silently writes to ephemeral local storage when STRICT_DURABLE_STORAGE=true',
    savePassRes.success === true,
    `updateUserPassword returned success=${savePassRes.success} without Supabase connection.`
  );

  // Clean up test items from localDb
  const cleanDb = readDb();
  cleanDb.services = (cleanDb.services || []).filter(s => s.id !== testService.id);
  cleanDb.faqs = (cleanDb.faqs || []).filter(f => f.id !== testFaq.id);
  writeDb(cleanDb);

  // ---------------------------------------------------------------------------
  // 2. Audit Check: Blog Posts / Articles Durability & Database Schema Missing
  // ---------------------------------------------------------------------------
  console.log('\n--- 2. Testing Blog Post Durability & Supabase Schema Completeness ---');

  // Check 2.1: Supabase schema.sql lacks posts or blogs table
  const hasPostsTable = schemaSql.includes('CREATE TABLE IF NOT EXISTS public.posts') || 
                        schemaSql.includes('CREATE TABLE public.posts') ||
                        schemaSql.includes('CREATE TABLE IF NOT EXISTS public.blogs') ||
                        schemaSql.includes('CREATE TABLE public.blogs');

  auditCheck(
    'R3-DEFECT-05',
    'Supabase schema and migrations completely lack posts/blogs table',
    !hasPostsTable,
    'schema.sql and migration files define 0 tables for blog posts or articles.'
  );

  // Check 2.2: durableStorage.cjs lacks post methods
  const hasDurablePostMethods = typeof durable.savePost === 'function' || typeof durable.readAllPosts === 'function';
  auditCheck(
    'R3-DEFECT-06',
    'server/durableStorage.cjs has zero durable persistence methods for posts/blogs',
    !hasDurablePostMethods,
    'durableStorage.cjs does not export savePost, readAllPosts, deletePost, or handle Supabase sync for posts.'
  );

  // Check 2.3: apiRouter.cjs POST /api/admin/content/posts/:slug writes strictly to ephemeral local DB
  const adminAuth = issueTestToken('admin');
  const postSlug = 'adversarial-ephemeral-post-test';
  const postPayload = {
    title: 'Ephemeral Blog Post Test',
    excerpt: 'This post will be permanently lost on serverless cold start',
    content: '# Content\nTesting durability hole',
    draft: false
  };
  const postApiRes = await simulateApi(
    'PUT',
    `/api/admin/content/posts/${postSlug}`,
    { 
      'authorization': `Bearer ${adminAuth.token}`,
      'origin': 'https://kavithaassociates.com'
    },
    postPayload
  );

  const dbAfterPost = readDb();
  const postInLocalDb = (dbAfterPost.posts || []).some(p => p.slug === postSlug);

  auditCheck(
    'R3-DEFECT-07',
    'Admin blog mutation endpoint writes exclusively to ephemeral local storage (data loss on container death)',
    postApiRes.statusCode === 200 && postInLocalDb,
    `PUT /api/admin/content/posts/${postSlug} returned 200 and wrote only to local practice_db.json with zero cloud persistence.`
  );

  // ---------------------------------------------------------------------------
  // 3. Audit Check: Draft Content Leaked Publicly via /api/content
  // ---------------------------------------------------------------------------
  console.log('\n--- 3. Testing Public Content Leakage of Drafts & Deleted Items via /api/content ---');

  // Insert a draft post and draft service into DB
  const draftDb = readDb();
  draftDb.services = draftDb.services || [];
  draftDb.services.push({
    id: 'confidential-unreleased-service',
    title: 'Confidential Internal Practice Area',
    shortDescription: 'Unpublished draft service',
    status: 'draft',
    order: 999
  });
  draftDb.deletedServices = draftDb.deletedServices || [];
  draftDb.deletedServices.push({
    id: 'scrapped-service-archive',
    title: 'Archived Scrapped Service',
    shortDescription: 'Deleted service',
    status: 'published',
    deletedAt: new Date().toISOString()
  });
  draftDb.faqs = draftDb.faqs || [];
  draftDb.faqs.push({
    id: 'confidential-internal-faq',
    question: 'Confidential Internal Question?',
    answer: 'Confidential draft answer',
    status: 'draft',
    order: 999
  });
  draftDb.posts = draftDb.posts || [];
  draftDb.posts.push({
    slug: 'unreleased-draft-article',
    title: 'Unreleased Confidential Audit Commentary',
    content: 'Secret merger commentary',
    draft: true
  });
  writeDb(draftDb);

  // Call unauthenticated public /api/content
  const contentRes = await simulateApi('GET', '/api/content');
  const body = contentRes.json || {};

  const leakedDraftService = (body.allServices || []).some(s => s.id === 'confidential-unreleased-service');
  const leakedDeletedService = (body.deletedServices || []).some(s => s.id === 'scrapped-service-archive');
  const leakedDraftFaq = (body.allFaqs || []).some(f => f.id === 'confidential-internal-faq');
  const leakedDraftPost = (body.allPosts || []).some(p => p.slug === 'unreleased-draft-article');

  auditCheck(
    'R3-DEFECT-08',
    'Unauthenticated GET /api/content leaks unpublished draft services via allServices',
    leakedDraftService,
    'Anonymous response contains draft services in "allServices".'
  );

  auditCheck(
    'R3-DEFECT-09',
    'Unauthenticated GET /api/content leaks deleted/archived services via deletedServices',
    leakedDeletedService,
    'Anonymous response contains soft-deleted services in "deletedServices".'
  );

  auditCheck(
    'R3-DEFECT-10',
    'Unauthenticated GET /api/content leaks unpublished draft FAQs via allFaqs',
    leakedDraftFaq,
    'Anonymous response contains draft FAQs in "allFaqs".'
  );

  auditCheck(
    'R3-DEFECT-11',
    'Unauthenticated GET /api/content leaks unpublished draft blog posts via allPosts',
    leakedDraftPost,
    'Anonymous response contains draft articles in "allPosts".'
  );

  // Clean up
  const cleanDb2 = readDb();
  cleanDb2.services = (cleanDb2.services || []).filter(s => s.id !== 'confidential-unreleased-service');
  cleanDb2.deletedServices = (cleanDb2.deletedServices || []).filter(s => s.id !== 'scrapped-service-archive');
  cleanDb2.faqs = (cleanDb2.faqs || []).filter(f => f.id !== 'confidential-internal-faq');
  cleanDb2.posts = (cleanDb2.posts || []).filter(p => p.slug !== 'unreleased-draft-article' && p.slug !== postSlug);
  writeDb(cleanDb2);

  // ---------------------------------------------------------------------------
  // 4. Audit Check: Misleading / Fake Storage Status Reporting
  // ---------------------------------------------------------------------------
  console.log('\n--- 4. Testing Storage Status Mode Accuracy in /api/health and /api/status ---');

  const statusRes = await simulateApi('GET', '/api/status');
  const statusJson = statusRes.json || {};

  const claimsSharedPostgresWhenOffline = statusJson.status === 'connected' && 
                                          statusJson.database === 'PostgreSQL / Shared Database Active' &&
                                          statusJson.synchronized === true &&
                                          !durable.isDurableConfigured();

  auditCheck(
    'R3-DEFECT-12',
    'GET /api/status deceptively claims "PostgreSQL / Shared Database Active" and "connected" when Supabase is completely unconfigured',
    claimsSharedPostgresWhenOffline,
    `Response: status="${statusJson.status}", database="${statusJson.database}", synchronized=${statusJson.synchronized} despite isDurableConfigured()=false.`
  );

  // ---------------------------------------------------------------------------
  // 5. Audit Check: RLS Policy Inconsistencies & Soft-Delete Leaks in Supabase
  // ---------------------------------------------------------------------------
  console.log('\n--- 5. Testing Supabase RLS Policy Inconsistencies ---');

  // 5.1 Check if services_read_published policy lacks deleted_at IS NULL
  const srvPolicyMatch = schemaSql.match(/CREATE POLICY "services_read_published" ON public\.content_services[\s\S]*?USING\s*\((.*?)\);/);
  const srvUsingClause = srvPolicyMatch ? srvPolicyMatch[1].trim() : '';
  const srvLacksDeletedAtCheck = !srvUsingClause.includes('deleted_at');

  auditCheck(
    'R3-DEFECT-13',
    'Supabase RLS services_read_published policy fails to check deleted_at IS NULL (deleted services accessible to anon users)',
    srvLacksDeletedAtCheck,
    `Policy USING clause is: "${srvUsingClause}" (does not filter out soft-deleted records).`
  );

  // 5.2 Check if faqs_read_published policy lacks deleted_at IS NULL
  const faqPolicyMatch = schemaSql.match(/CREATE POLICY "faqs_read_published" ON public\.content_faqs[\s\S]*?USING\s*\((.*?)\);/);
  const faqUsingClause = faqPolicyMatch ? faqPolicyMatch[1].trim() : '';
  const faqLacksDeletedAtCheck = !faqUsingClause.includes('deleted_at');

  auditCheck(
    'R3-DEFECT-14',
    'Supabase RLS faqs_read_published policy fails to check deleted_at IS NULL (deleted FAQs accessible to anon users)',
    faqLacksDeletedAtCheck,
    `Policy USING clause is: "${faqUsingClause}" (does not filter out soft-deleted records).`
  );

  // 5.3 Check if enquiries_insert_public allows setting status or notes
  const enqInsertMatch = schemaSql.match(/CREATE POLICY "enquiries_insert_public" ON public\.enquiries[\s\S]*?WITH CHECK\s*\(([\s\S]*?)\);/);
  const enqCheckClause = enqInsertMatch ? enqInsertMatch[1].trim() : '';
  const enqAllowsArbitraryStatus = !enqCheckClause.includes('status');

  auditCheck(
    'R3-DEFECT-15',
    'Supabase RLS enquiries_insert_public policy allows anonymous callers to inject non-new status and forged follow-up notes',
    enqAllowsArbitraryStatus,
    `Policy WITH CHECK clause is: "${enqCheckClause}" (does not constrain status='new' or follow_up_notes IS NULL).`
  );

  // 5.4 Check if content_services and content_faqs lack created_at column
  const srvTableMatch = schemaSql.match(/CREATE TABLE IF NOT EXISTS public\.content_services\s*\(([\s\S]*?)\);/);
  const srvColumns = srvTableMatch ? srvTableMatch[1] : '';
  const srvLacksCreatedAt = !srvColumns.includes('created_at');

  auditCheck(
    'R3-DEFECT-16',
    'content_services table lacks created_at column despite durableStorage.cjs referencing row.created_at',
    srvLacksCreatedAt,
    'content_services schema does not define created_at column.'
  );

  // ---------------------------------------------------------------------------
  // 6. Audit Check: Concurrency & Duplicate Submissions Deduplication
  // ---------------------------------------------------------------------------
  console.log('\n--- 6. Testing Concurrency, Duplicate Submissions & Non-Atomic Renaming ---');
  delete process.env.STRICT_DURABLE_STORAGE;

  // 6.1 Duplicate Submission across Serverless Instances
  // When Container B receives an identical enquiry submission but has fresh local cache, does it deduplicate?
  const testPhone = '+91 91234 56789';
  const testMsg = 'Adversarial deduplication test message across serverless cold starts';

  // Simulate Container A receiving the submission
  const enq1Res = await simulateApi('POST', '/api/enquiries', {}, {
    fullName: 'Deduplication Test Client',
    phone: testPhone,
    message: testMsg,
    city: 'Tirupati'
  });

  // Now simulate Container B (which starts with empty enquiries in memory/disk)
  const simulatedContainerBDb = readDb();
  simulatedContainerBDb.enquiries = []; // Wipe local cache to simulate Container B cold start
  writeDb(simulatedContainerBDb);

  const enq2Res = await simulateApi('POST', '/api/enquiries', {}, {
    fullName: 'Deduplication Test Client',
    phone: testPhone,
    message: testMsg,
    city: 'Tirupati'
  });

  const isDuplicateDetected = enq2Res.json?.duplicate === true;
  auditCheck(
    'R3-DEFECT-17',
    'Enquiry deduplication fails across distributed serverless instances (relies only on local container memory)',
    !isDuplicateDetected,
    `Container B created new record ID ${enq2Res.json?.enquiry?.id} instead of detecting duplicate because db.enquiries was not cached locally.`
  );

  // Clean up enquiries
  const cleanDb3 = readDb();
  cleanDb3.enquiries = (cleanDb3.enquiries || []).filter(e => e.phone !== testPhone);
  writeDb(cleanDb3);

  console.log('\n================================================================================');
  console.log(`TOTAL AUDIT CHECKS : ${totalChecks}`);
  console.log(`CONFIRMED DEFECTS  : ${failedChecks}`);
  console.log(`VERIFIED SECURE    : ${passedChecks}`);
  console.log('================================================================================\n');

  return { totalChecks, failedChecks, passedChecks, findings };
}

runAdversarialAudit().catch(err => {
  console.error('Audit run error:', err);
  process.exit(1);
});
