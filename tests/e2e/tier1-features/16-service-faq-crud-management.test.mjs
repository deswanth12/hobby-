import fs from 'fs';
import path from 'path';
import { describe, it, assert } from '../helpers/test-harness.mjs';
import { handleApiRequest } from '../../../server/apiRouter.cjs';
import { readDb, writeDb, setUserPassword } from '../../../server/db.cjs';
import { generateSitemapXml } from '../../../scripts/generate-sitemap.mjs';

// Helper to simulate HTTP requests against handleApiRequest
function makeSimulatedRequest(options, bodyData = null) {
  return new Promise((resolve, reject) => {
    const { method = 'GET', url = '/', headers = {} } = options;
    const bodyBuffer = bodyData ? Buffer.from(typeof bodyData === 'string' ? bodyData : JSON.stringify(bodyData)) : Buffer.alloc(0);

    // Mock incoming request stream
    const req = {
      method,
      url,
      headers: {
        'host': 'localhost:5173',
        'content-type': 'application/json',
        'content-length': bodyBuffer.length,
        ...headers
      },
      connection: { remoteAddress: '127.0.0.1' },
      socket: { remoteAddress: '127.0.0.1' },
      on: (event, handler) => {
        if (event === 'data' && bodyBuffer.length > 0) {
          handler(bodyBuffer);
        } else if (event === 'end') {
          handler();
        }
        return req;
      }
    };

    let responseHeaders = {};
    const chunks = [];

    const res = {
      statusCode: 200,
      setHeader: (name, val) => { responseHeaders[name.toLowerCase()] = val; },
      writeHead: (code, hdrs) => {
        res.statusCode = code;
        if (hdrs) {
          Object.entries(hdrs).forEach(([k, v]) => { responseHeaders[k.toLowerCase()] = v; });
        }
      },
      end: (chunk) => {
        if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        const rawBody = Buffer.concat(chunks).toString('utf8');
        let json = null;
        try {
          json = JSON.parse(rawBody);
        } catch {
          // not JSON
        }
        resolve({
          statusCode: res.statusCode,
          headers: responseHeaders,
          rawBody,
          json
        });
      }
    };

    handleApiRequest(req, res).catch(reject);
  });
}

describe('Tier 1 - Feature 16: Complete Service & FAQ Management (CRUD, Reordering, Recovery, Security)', () => {
  let authToken = null;
  const originalDbState = JSON.parse(JSON.stringify(readDb()));

  // 1. Authenticate to get admin token
  it('16.1: Admin login succeeds and returns valid JWT session token', async () => {
    // Configure admin credential for test suite
    setUserPassword('admin', 'TestAdminPassword#2026');

    const loginRes = await makeSimulatedRequest({
      method: 'POST',
      url: '/api/auth/login'
    }, {
      username: 'admin',
      password: 'TestAdminPassword#2026'
    });

    assert.strictEqual(loginRes.statusCode, 200, `Login failed with ${loginRes.statusCode}: ${loginRes.rawBody}`);
    authToken = loginRes.json?.session?.token;
    assert.ok(authToken, 'Expected JWT token in session response');
  });

  // 2. Security: Unauthenticated write requests rejected with 401
  it('16.2: Unauthenticated write requests to admin content endpoints return 401 Unauthorized', async () => {
    const unauthPost = await makeSimulatedRequest({
      method: 'POST',
      url: '/api/admin/content/services'
    }, {
      title: 'Hacked Service',
      slug: 'hacked-service'
    });
    assert.strictEqual(unauthPost.statusCode, 401, 'Expected 401 Unauthorized for unauthenticated service creation');

    const unauthDelete = await makeSimulatedRequest({
      method: 'DELETE',
      url: '/api/admin/content/services/audit-assurance'
    });
    assert.strictEqual(unauthDelete.statusCode, 401, 'Expected 401 Unauthorized for unauthenticated service deletion');

    const unauthFaqPost = await makeSimulatedRequest({
      method: 'POST',
      url: '/api/admin/content/faqs'
    }, {
      question: 'Unauthorized question?',
      answer: 'Unauthorized answer text'
    });
    assert.strictEqual(unauthFaqPost.statusCode, 401, 'Expected 401 Unauthorized for unauthenticated FAQ creation');
  });

  // 3. Service Validation: Empty title and invalid slug rejected with 400
  it('16.3: Service creation rejects invalid slugs and empty titles with 400 Bad Request', async () => {
    const emptyTitleRes = await makeSimulatedRequest({
      method: 'POST',
      url: '/api/admin/content/services',
      headers: { 'authorization': `Bearer ${authToken}` }
    }, {
      title: '',
      slug: 'valid-slug'
    });
    assert.strictEqual(emptyTitleRes.statusCode, 400, 'Expected 400 for empty title');

    const invalidSlugRes = await makeSimulatedRequest({
      method: 'POST',
      url: '/api/admin/content/services',
      headers: { 'authorization': `Bearer ${authToken}` }
    }, {
      title: 'Invalid Slug Service',
      slug: 'INVALID SLUG with SPACES!'
    });
    assert.strictEqual(invalidSlugRes.statusCode, 400, 'Expected 400 for invalid slug format');
  });

  // 4. Service Creation: Creates new service with all fields
  const testServiceSlug = `e2e-test-service-${Date.now()}`;
  it('16.4: Service creation succeeds with full fields and persists to database', async () => {
    const createRes = await makeSimulatedRequest({
      method: 'POST',
      url: '/api/admin/content/services',
      headers: { 'authorization': `Bearer ${authToken}` }
    }, {
      title: 'E2E Statutory Audit Service',
      slug: testServiceSlug,
      shortDescription: 'Comprehensive test statutory audit overview for E2E.',
      fullDescription: 'Detailed technical scope covering Companies Act 2013 and ICAI Standards on Auditing.',
      statutoryFramework: 'Companies Act 2013, Section 139-143',
      targetClients: 'Corporates, Startups, rayalaseema businesses',
      typicalScenarios: ['Annual statutory financial audit', 'Branch audit'],
      services: ['Balance sheet audit', 'P&L scrutiny', 'CARO 2020 reporting'],
      iconName: 'ShieldCheck',
      status: 'published',
      order: 10,
      seo: {
        metaTitle: 'Statutory Audit E2E | Tirupati CA',
        metaDescription: 'E2E verified description for statutory audit service',
        canonicalUrl: `https://kavithaassociates.com/services/${testServiceSlug}`
      }
    });

    assert.strictEqual(createRes.statusCode, 201, `Expected 201 Created: ${createRes.rawBody}`);
    assert.strictEqual(createRes.json?.service?.id, testServiceSlug);
    assert.strictEqual(createRes.json?.service?.status, 'published');
    assert.strictEqual(createRes.json?.service?.services?.length, 3);
  });

  // 5. Service Validation: Duplicate slug collision rejected
  it('16.5: Duplicate service slug collision rejected with 400 Bad Request', async () => {
    const duplicateRes = await makeSimulatedRequest({
      method: 'POST',
      url: '/api/admin/content/services',
      headers: { 'authorization': `Bearer ${authToken}` }
    }, {
      title: 'Colliding Service',
      slug: testServiceSlug
    });

    assert.strictEqual(duplicateRes.statusCode, 400, 'Expected 400 Bad Request on duplicate slug');
    assert.includes(duplicateRes.json?.error, 'already exists', 'Expected duplicate slug error message');
  });

  // 6. Service Update: Edit fields and toggle draft status
  it('16.6: Service update succeeds and updates fields', async () => {
    const updateRes = await makeSimulatedRequest({
      method: 'PUT',
      url: `/api/admin/content/services/${testServiceSlug}`,
      headers: { 'authorization': `Bearer ${authToken}` }
    }, {
      title: 'Updated E2E Statutory Audit Service',
      shortDescription: 'Updated overview description.',
      status: 'draft'
    });

    assert.strictEqual(updateRes.statusCode, 200, `Expected 200 OK: ${updateRes.rawBody}`);
    assert.strictEqual(updateRes.json?.service?.title, 'Updated E2E Statutory Audit Service');
    assert.strictEqual(updateRes.json?.service?.status, 'draft');
  });

  // 7. Public Content Endpoint: Draft service hidden from public services array
  it('16.7: Public content endpoint hides draft services from public view', async () => {
    const contentRes = await makeSimulatedRequest({
      method: 'GET',
      url: '/api/content'
    });

    assert.strictEqual(contentRes.statusCode, 200);
    const pubServices = contentRes.json?.services || [];
    const foundInPub = pubServices.some(s => s.id === testServiceSlug);
    assert.strictEqual(foundInPub, false, 'Draft service must not appear in public services list');
  });

  // 8. Service Reordering
  it('16.8: Service reordering updates ordering indices in database', async () => {
    const db = readDb();
    const serviceIds = (db.services || []).map(s => s.id);
    const reversed = [...serviceIds].reverse();

    const reorderRes = await makeSimulatedRequest({
      method: 'PUT',
      url: '/api/admin/content/services-reorder',
      headers: { 'authorization': `Bearer ${authToken}` }
    }, {
      orderedIds: reversed
    });

    assert.strictEqual(reorderRes.statusCode, 200);
    const updatedDb = readDb();
    assert.strictEqual(updatedDb.services[0].id, reversed[0], 'First service must match first reordered ID');
  });

  // 9. Service Deletion & Safe Recovery
  it('16.9: Service safe deletion archives to recovery store and recover restores it', async () => {
    // Delete service
    const deleteRes = await makeSimulatedRequest({
      method: 'DELETE',
      url: `/api/admin/content/services/${testServiceSlug}`,
      headers: { 'authorization': `Bearer ${authToken}` }
    });
    assert.strictEqual(deleteRes.statusCode, 200, `Delete failed: ${deleteRes.rawBody}`);

    let db = readDb();
    assert.strictEqual(db.services.some(s => s.id === testServiceSlug), false, 'Service should be removed from active services');
    assert.strictEqual(db.deletedServices.some(s => s.id === testServiceSlug), true, 'Service should be stored in deletedServices');

    // Recover service
    const recoverRes = await makeSimulatedRequest({
      method: 'POST',
      url: `/api/admin/content/services/${testServiceSlug}/recover`,
      headers: { 'authorization': `Bearer ${authToken}` }
    });
    assert.strictEqual(recoverRes.statusCode, 200, `Recover failed: ${recoverRes.rawBody}`);

    db = readDb();
    assert.strictEqual(db.services.some(s => s.id === testServiceSlug), true, 'Service should be restored to active services');
    assert.strictEqual(db.deletedServices.some(s => s.id === testServiceSlug), false, 'Service should be removed from deletedServices');

    // Clean up test service
    await makeSimulatedRequest({
      method: 'DELETE',
      url: `/api/admin/content/services/${testServiceSlug}`,
      headers: { 'authorization': `Bearer ${authToken}` }
    });
  });

  // 10. FAQ Validation: Empty question and answer rejected with 400
  it('16.10: FAQ creation rejects empty question or answer with 400 Bad Request', async () => {
    const emptyQRes = await makeSimulatedRequest({
      method: 'POST',
      url: '/api/admin/content/faqs',
      headers: { 'authorization': `Bearer ${authToken}` }
    }, {
      question: '',
      answer: 'This is a valid answer for testing purposes.'
    });
    assert.strictEqual(emptyQRes.statusCode, 400, 'Expected 400 for empty question');

    const emptyARes = await makeSimulatedRequest({
      method: 'POST',
      url: '/api/admin/content/faqs',
      headers: { 'authorization': `Bearer ${authToken}` }
    }, {
      question: 'Is this a valid test question?',
      answer: ''
    });
    assert.strictEqual(emptyARes.statusCode, 400, 'Expected 400 for empty answer');
  });

  // 11. FAQ Creation: Creates FAQ with category and assigned services
  let testFaqId = null;
  it('16.11: FAQ creation succeeds with category and assigned services', async () => {
    const createFaqRes = await makeSimulatedRequest({
      method: 'POST',
      url: '/api/admin/content/faqs',
      headers: { 'authorization': `Bearer ${authToken}` }
    }, {
      question: 'When is a Tax Audit required under Section 44AB for businesses in Andhra Pradesh?',
      answer: 'Under Section 44AB of the Income Tax Act 1961, audit is mandatory if gross business turnover exceeds ₹1 Crore (or ₹10 Crores if cash transactions are under 5%).',
      statuteReference: 'Section 44AB, Income Tax Act 1961',
      category: 'Income Tax',
      serviceIds: ['income-tax-consultant-tirupati', 'audit-assurance'],
      status: 'published',
      order: 8
    });

    assert.strictEqual(createFaqRes.statusCode, 201, `Expected 201 Created: ${createFaqRes.rawBody}`);
    assert.ok(createFaqRes.json?.faq?.id, 'Expected generated FAQ id');
    testFaqId = createFaqRes.json.faq.id;
    assert.strictEqual(createFaqRes.json?.faq?.serviceIds?.length, 2);
  });

  // 12. FAQ Update & Assignment
  it('16.12: FAQ update edits answer, statute reference, and service assignments', async () => {
    assert.ok(testFaqId, 'testFaqId must be set');
    const updateFaqRes = await makeSimulatedRequest({
      method: 'PUT',
      url: `/api/admin/content/faqs/${testFaqId}`,
      headers: { 'authorization': `Bearer ${authToken}` }
    }, {
      statuteReference: 'Section 44AB(a), Income Tax Act 1961',
      serviceIds: ['income-tax-consultant-tirupati']
    });

    assert.strictEqual(updateFaqRes.statusCode, 200, `Expected 200 OK: ${updateFaqRes.rawBody}`);
    assert.strictEqual(updateFaqRes.json?.faq?.statuteReference, 'Section 44AB(a), Income Tax Act 1961');
    assert.strictEqual(updateFaqRes.json?.faq?.serviceIds?.length, 1);
  });

  // 13. FAQ Reordering
  it('16.13: FAQ reordering updates ordering sequence', async () => {
    const db = readDb();
    const faqIds = (db.faqs || []).map(f => f.id);
    const reversed = [...faqIds].reverse();

    const reorderRes = await makeSimulatedRequest({
      method: 'PUT',
      url: '/api/admin/content/faqs-reorder',
      headers: { 'authorization': `Bearer ${authToken}` }
    }, {
      orderedIds: reversed
    });

    assert.strictEqual(reorderRes.statusCode, 200);
    const updatedDb = readDb();
    assert.strictEqual(updatedDb.faqs[0].id, reversed[0], 'First FAQ must match first reordered ID');
  });

  // 14. FAQ Safe Deletion & Recovery
  it('16.14: FAQ safe deletion archives to recovery store and recover restores it', async () => {
    assert.ok(testFaqId, 'testFaqId must be set');

    // Delete FAQ
    const deleteRes = await makeSimulatedRequest({
      method: 'DELETE',
      url: `/api/admin/content/faqs/${testFaqId}`,
      headers: { 'authorization': `Bearer ${authToken}` }
    });
    assert.strictEqual(deleteRes.statusCode, 200);

    let db = readDb();
    assert.strictEqual(db.faqs.some(f => f.id === testFaqId), false, 'FAQ must be removed from active faqs');
    assert.strictEqual(db.deletedFaqs.some(f => f.id === testFaqId), true, 'FAQ must be in deletedFaqs');

    // Recover FAQ
    const recoverRes = await makeSimulatedRequest({
      method: 'POST',
      url: `/api/admin/content/faqs/${testFaqId}/recover`,
      headers: { 'authorization': `Bearer ${authToken}` }
    });
    assert.strictEqual(recoverRes.statusCode, 200);

    db = readDb();
    assert.strictEqual(db.faqs.some(f => f.id === testFaqId), true, 'FAQ must be restored');
    assert.strictEqual(db.deletedFaqs.some(f => f.id === testFaqId), false, 'FAQ must be removed from deletedFaqs');

    // Clean up test FAQ
    await makeSimulatedRequest({
      method: 'DELETE',
      url: `/api/admin/content/faqs/${testFaqId}`,
      headers: { 'authorization': `Bearer ${authToken}` }
    });
  });

  // 15. Dynamic Sitemap Generation
  it('16.15: Sitemap generator dynamically includes published custom services and excludes drafts', () => {
    const sampleServices = [
      { id: 'custom-tax-audit', status: 'published', updatedAt: '2026-11-01' },
      { id: 'custom-draft-service', status: 'draft', updatedAt: '2026-11-01' }
    ];

    const { xml } = generateSitemapXml([], '2026-11-01', sampleServices);
    assert.includes(xml, 'https://kavithaassociates.com/services/custom-tax-audit', 'Published custom service must appear in sitemap');
    assert.ok(!xml.includes('https://kavithaassociates.com/services/custom-draft-service'), 'Draft service must NOT appear in sitemap');
  });

  // 16. Existing Routes Continuity & App Routing Verification
  it('16.16: App routes preserve all 6 static core services and mount dynamic service route', () => {
    const appSource = fs.readFileSync('src/App.tsx', 'utf8');
    assert.includes(appSource, '/services/audit-assurance', 'Preserves audit assurance route');
    assert.includes(appSource, '/services/gst-consultant-tirupati', 'Preserves GST consultant route');
    assert.includes(appSource, '/services/income-tax-consultant-tirupati', 'Preserves Income Tax route');
    assert.includes(appSource, '/services/company-registration-tirupati', 'Preserves Company Registration route');
    assert.includes(appSource, '/services/virtual-cfo-tirupati', 'Preserves Virtual CFO route');
    assert.includes(appSource, '/services/rera-consultant-tirupati', 'Preserves RERA Consultant route');
    assert.includes(appSource, '/services/:slug', 'Mounts dynamic service detail route');
  });

  // Restore database state after testing
  it('16.17: Database restored to pristine clean state', () => {
    writeDb(originalDbState);
    const finalDb = readDb();
    assert.ok(finalDb.services.length >= 6);
  });
});
