/**
 * tests/challenger_m1_it2_empirical.mjs
 *
 * Empirical Adversarial Test Harness for Milestone 1 Iteration 2
 * Verifies fixes in src/v8/adapters/contentAdapter.ts:
 * 1. Corridor Resolution: getServiceBySlug('virtual-cfo-tirupati') resolves to Advisory & Consulting
 * 2. All 6 Canonical Practice Corridors (PRAC-01 through PRAC-06) resolve
 * 3. Draft Quarantine & Leak Prevention across all accessors
 * 4. Fuzzing & Malformed Slug Injection Resistance
 * 5. FAQs, Audit Spotlight, and Core Practice Disciplines
 */

import { createServer } from 'vite';
import assert from 'node:assert';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function check(condition, testName, failureDetail = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✔ [PASS] ${testName}`);
  } else {
    failedTests++;
    const err = `  ✖ [FAIL] ${testName}${failureDetail ? ' :: ' + failureDetail : ''}`;
    console.error(err);
    failures.push(err);
  }
}

async function runSuite() {
  console.log('========================================================================');
  console.log('CHALLENGER M1 IT2: EMPIRICAL ADVERSARIAL VERIFICATION HARNESS');
  console.log('========================================================================\n');

  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });

  try {
    const adapter = await vite.ssrLoadModule('/src/v8/adapters/contentAdapter.ts');
    const {
      getPublishedArticles,
      getArticleBySlug,
      isDraftArticle,
      getFeaturedInsights,
      getRelatedArticles,
      getAllArticleTags,
      getArticlesByTag,
      searchPublishedArticles,
      getAllServices,
      getServiceBySlug,
      getCorePracticeAreas,
      getAuditSpotlightServices,
      getPublishedFaqs,
      getFaqsByCategory
    } = adapter;

    // -------------------------------------------------------------------------
    // SECTION 1: RESOLUTION OF 'virtual-cfo-tirupati' (M1 IT2 Targeted Defect)
    // -------------------------------------------------------------------------
    console.log('--- SECTION 1: M1 IT2 DEFECT VERIFICATION (virtual-cfo-tirupati) ---');

    const cfoSvc = getServiceBySlug('virtual-cfo-tirupati');
    check(
      cfoSvc !== undefined && cfoSvc !== null,
      'getServiceBySlug("virtual-cfo-tirupati") resolves non-null entity',
      `Got: ${cfoSvc}`
    );

    if (cfoSvc) {
      check(
        /Virtual CFO|Advisory/i.test(cfoSvc.title),
        `Title contains "Virtual CFO" or "Advisory" (got: "${cfoSvc.title}")`,
        `Title: ${cfoSvc.title}`
      );
      check(
        cfoSvc.id === 'advisory-consulting' || cfoSvc.id === 'virtual-cfo' || cfoSvc.id === 'virtual-cfo-tirupati',
        `Entity ID maps to valid category ("advisory-consulting" or alias) (got: "${cfoSvc.id}")`,
        `ID: ${cfoSvc.id}`
      );
      check(
        Array.isArray(cfoSvc.services) && cfoSvc.services.length >= 4,
        `Provides >= 4 advisory deliverables (found ${cfoSvc.services?.length})`
      );
      check(
        typeof cfoSvc.shortDescription === 'string' && cfoSvc.shortDescription.length > 20,
        'Has rich shortDescription (> 20 chars)'
      );
      check(
        typeof cfoSvc.fullDescription === 'string' && cfoSvc.fullDescription.length > 50,
        'Has rich fullDescription (> 50 chars)'
      );
      check(
        typeof cfoSvc.statutoryFramework === 'string' && cfoSvc.statutoryFramework.length > 0,
        `Cites statutory framework: "${cfoSvc.statutoryFramework}"`
      );
      check(
        Array.isArray(cfoSvc.typicalScenarios) && cfoSvc.typicalScenarios.length >= 2,
        `Provides >= 2 typical scenarios (found ${cfoSvc.typicalScenarios?.length})`
      );
    }

    // -------------------------------------------------------------------------
    // SECTION 2: ALL 6 CANONICAL PRACTICE CORRIDORS
    // -------------------------------------------------------------------------
    console.log('\n--- SECTION 2: ALL 6 CANONICAL CORRIDORS ---');

    const canonicalCorridors = [
      {
        slug: 'audit-assurance',
        expectedId: 'audit-assurance',
        titleRegex: /Audit|Assurance/i,
        code: 'PRAC-01',
        minServices: 4
      },
      {
        slug: 'income-tax-consultant-tirupati',
        expectedId: 'income-tax',
        titleRegex: /Income Tax|Direct Tax/i,
        code: 'PRAC-02',
        minServices: 4
      },
      {
        slug: 'gst-consultant-tirupati',
        expectedId: 'gst',
        titleRegex: /GST|Indirect Tax/i,
        code: 'PRAC-03',
        minServices: 4
      },
      {
        slug: 'company-registration-tirupati',
        expectedId: 'corporate-business',
        titleRegex: /Corporate|Company/i,
        code: 'PRAC-04',
        minServices: 4
      },
      {
        slug: 'virtual-cfo-tirupati',
        expectedId: 'advisory-consulting',
        titleRegex: /Virtual CFO|Advisory/i,
        code: 'PRAC-05',
        minServices: 4
      },
      {
        slug: 'rera-consultant-tirupati',
        expectedId: 'rera-compliance',
        titleRegex: /RERA|Real Estate/i,
        code: 'PRAC-06',
        minServices: 4
      }
    ];

    for (const corr of canonicalCorridors) {
      const svc = getServiceBySlug(corr.slug);
      check(
        svc !== undefined && svc !== null,
        `Corridor [${corr.code}] "${corr.slug}" resolves successfully`,
        `Returned: ${svc}`
      );
      if (svc) {
        check(
          corr.titleRegex.test(svc.title),
          `Corridor [${corr.code}] title "${svc.title}" matches expected regex`,
          `Expected ${corr.titleRegex}, got "${svc.title}"`
        );
        check(
          svc.id === corr.expectedId || svc.id === corr.slug,
          `Corridor [${corr.code}] entity id matches "${corr.expectedId}" (got: "${svc.id}")`,
          `Expected ${corr.expectedId}, got ${svc.id}`
        );
        check(
          Array.isArray(svc.services) && svc.services.length >= corr.minServices,
          `Corridor [${corr.code}] has >= ${corr.minServices} services (found ${svc.services?.length})`
        );
      }
    }

    // Legacy Aliases Resolution
    console.log('\n--- SECTION 2B: LEGACY V7 ALIASES RESOLUTION ---');
    const legacyAliases = [
      { slug: 'income-tax', expectedId: 'income-tax' },
      { slug: 'gst', expectedId: 'gst' },
      { slug: 'corporate-business', expectedId: 'corporate-business' },
      { slug: 'advisory-consulting', expectedId: 'advisory-consulting' },
      { slug: 'rera-compliance', expectedId: 'rera-compliance' }
    ];

    for (const alias of legacyAliases) {
      const svc = getServiceBySlug(alias.slug);
      check(
        svc !== undefined && svc !== null,
        `Legacy alias "${alias.slug}" resolves successfully`
      );
      if (svc) {
        check(
          svc.id === alias.expectedId,
          `Legacy alias "${alias.slug}" maps to entity id "${alias.expectedId}" (got: "${svc.id}")`
        );
      }
    }

    // Core Practice Areas
    console.log('\n--- SECTION 2C: getCorePracticeAreas() STRUCTURE ---');
    const corePractices = getCorePracticeAreas();
    check(
      Array.isArray(corePractices) && corePractices.length === 6,
      `getCorePracticeAreas() returns exactly 6 disciplines (got ${corePractices?.length})`
    );

    const expectedCodes = ['PRAC-01', 'PRAC-02', 'PRAC-03', 'PRAC-04', 'PRAC-05', 'PRAC-06'];
    const expectedRoutes = [
      '/services/audit-assurance',
      '/services/income-tax-consultant-tirupati',
      '/services/gst-consultant-tirupati',
      '/services/company-registration-tirupati',
      '/services/virtual-cfo-tirupati',
      '/services/rera-consultant-tirupati'
    ];

    corePractices.forEach((cp, idx) => {
      check(
        cp.order === idx + 1,
        `Core practice #${idx + 1} order === ${idx + 1}`
      );
      check(
        cp.disciplineCode === expectedCodes[idx],
        `Core practice #${idx + 1} code === "${expectedCodes[idx]}" (got: "${cp.disciplineCode}")`
      );
      check(
        cp.routePath === expectedRoutes[idx],
        `Core practice #${idx + 1} routePath === "${expectedRoutes[idx]}" (got: "${cp.routePath}")`
      );
      check(
        cp.isCorePractice === true,
        `Core practice #${idx + 1} isCorePractice === true`
      );
    });

    // -------------------------------------------------------------------------
    // SECTION 3: DRAFT QUARANTINE & ISOLATION (Adversarial Probing)
    // -------------------------------------------------------------------------
    console.log('\n--- SECTION 3: STRICT DRAFT ARTICLE QUARANTINE ---');
    const draftSlug = 'internal-audit-best-practices';

    // 3.1 Direct queries
    check(
      getArticleBySlug(draftSlug) === undefined,
      'getArticleBySlug("internal-audit-best-practices") returns undefined (Draft Quarantine)'
    );
    check(
      getArticleBySlug('INTERNAL-AUDIT-BEST-PRACTICES') === undefined,
      'getArticleBySlug uppercase draft slug returns undefined'
    );
    check(
      getArticleBySlug('  internal-audit-best-practices  ') === undefined,
      'getArticleBySlug whitespace-padded draft slug returns undefined'
    );
    check(
      getArticleBySlug('internal-audit-best-practices.md') === undefined,
      'getArticleBySlug with .md extension returns undefined'
    );

    // 3.2 isDraftArticle
    check(
      isDraftArticle(draftSlug) === true,
      'isDraftArticle("internal-audit-best-practices") returns true'
    );
    check(
      isDraftArticle('INTERNAL-AUDIT-BEST-PRACTICES') === true,
      'isDraftArticle is case-insensitive (returns true)'
    );
    check(
      isDraftArticle('statutory-audit-guidelines-2026') === false,
      'isDraftArticle on published article returns false'
    );
    check(
      isDraftArticle('non-existent-article-xyz') === false,
      'isDraftArticle on non-existent article returns false'
    );

    // 3.3 Collections
    const published = getPublishedArticles();
    check(
      Array.isArray(published) && published.length > 0,
      `getPublishedArticles() returns non-empty array (count: ${published.length})`
    );
    check(
      !published.some(a => a.slug === draftSlug),
      'getPublishedArticles() strictly excludes draft slug'
    );
    check(
      !published.some(a => a.draft === true),
      'getPublishedArticles() contains zero articles with draft === true'
    );
    check(
      !published.some(a => a.content.includes('DRAFT WORKING PAPER')),
      'getPublishedArticles() contains zero articles with draft working paper text'
    );

    // 3.4 Featured Insights
    const feat = getFeaturedInsights(3);
    check(
      feat !== null && feat.leadArticle.slug !== draftSlug && !feat.leadArticle.draft,
      'getFeaturedInsights() lead article is not draft'
    );
    check(
      feat !== null && feat.companionArticles.every(a => a.slug !== draftSlug && !a.draft),
      'getFeaturedInsights() companion articles contain zero drafts'
    );

    // 3.5 Tags
    const draftTags = ['Internal Audit', 'Risk Management', 'Corporate Governance', 'Internal Controls'];
    for (const tag of draftTags) {
      const tagged = getArticlesByTag(tag);
      check(
        !tagged.some(a => a.slug === draftSlug || a.draft),
        `getArticlesByTag("${tag}") strictly excludes draft articles`
      );
    }

    const allTags = getAllArticleTags();
    const publishedTags = new Set(published.flatMap(a => a.tags));
    const leakedTag = allTags.find(t => !publishedTags.has(t));
    check(
      !leakedTag,
      'getAllArticleTags() contains only tags from published articles'
    );

    // 3.6 Related Articles
    for (const pub of published) {
      const rel = getRelatedArticles(pub.slug, 3);
      check(
        !rel.some(a => a.slug === draftSlug || a.draft),
        `getRelatedArticles("${pub.slug}") strictly excludes drafts`
      );
    }
    const relToDraft = getRelatedArticles(draftSlug, 3);
    check(
      Array.isArray(relToDraft) && relToDraft.length === 0,
      'getRelatedArticles(draftSlug) returns empty array (refuses draft)'
    );

    // 3.7 Search Probing
    const probeKeywords = [
      'internal audit',
      'Section 138',
      'Operational Risk Appraisal',
      'RBIA',
      'Risk Management',
      'DRAFT WORKING PAPER',
      'internal-audit-best-practices',
      'Procure-to-Pay',
      'Order-to-Cash',
      'CMA Dimension'
    ];
    for (const kw of probeKeywords) {
      const res = searchPublishedArticles(kw);
      check(
        !res.some(a => a.slug === draftSlug || a.draft || a.content.includes('DRAFT WORKING PAPER')),
        `searchPublishedArticles("${kw}") does not leak draft article`
      );
    }

    // -------------------------------------------------------------------------
    // SECTION 4: SLUG FUZZING & ADVERSARIAL RESILIENCE
    // -------------------------------------------------------------------------
    console.log('\n--- SECTION 4: SLUG FUZZING & INJECTION RESILIENCE ---');

    const fuzzVectors = [
      '../',
      '../../../../etc/passwd',
      '..\\..\\..\\windows\\win.ini',
      'content/posts/internal-audit-best-practices.md',
      '..%2f..%2f',
      'internal-audit-best-practices\0',
      'audit-assurance\0',
      '\0',
      'audit\x1b[31m-assurance',
      'audit\r\nassurance',
      'internal%2Daudit%2Dbest%2Dpractices',
      '%2e%2e%2f',
      '\u200Binternal-audit-best-practices\u200B',
      '\uFF41\uFF55\uFF44\uFF49\uFF54',
      "' OR '1'='1",
      '"; DROP TABLE posts; --',
      '<script>alert(1)</script>',
      'javascript:alert(1)',
      '',
      '   ',
      '\n\r\t',
      'a'.repeat(2000),
      '/'.repeat(100),
      null,
      undefined,
      12345,
      {},
      [],
      true
    ];

    for (const vector of fuzzVectors) {
      const desc = typeof vector === 'string' ? JSON.stringify(vector.slice(0, 25)) : typeof vector;
      let artThrew = false;
      let artRes;
      try {
        artRes = getArticleBySlug(vector);
      } catch (e) {
        artThrew = true;
      }
      check(
        !artThrew && (artRes === undefined || (artRes && !artRes.draft)),
        `getArticleBySlug(${desc}) safe (no leak, no crash)`
      );

      let svcThrew = false;
      let svcRes;
      try {
        svcRes = getServiceBySlug(vector);
      } catch (e) {
        svcThrew = true;
      }
      check(
        !svcThrew,
        `getServiceBySlug(${desc}) safe (no crash)`
      );
    }

    // -------------------------------------------------------------------------
    // SECTION 5: AUDIT SPOTLIGHT & STATUTORY FAQS
    // -------------------------------------------------------------------------
    console.log('\n--- SECTION 5: AUDIT SPOTLIGHT & FAQS INTEGRITY ---');

    const spotlight = getAuditSpotlightServices();
    check(
      Array.isArray(spotlight) && spotlight.length >= 4,
      `getAuditSpotlightServices() returns >= 4 audit engagements (found ${spotlight?.length})`
    );

    const faqs = getPublishedFaqs();
    check(
      Array.isArray(faqs) && faqs.length >= 6,
      `getPublishedFaqs() returns catalogue of statutory FAQs (found ${faqs?.length})`
    );

    const taxFaqs = getPublishedFaqs('income-tax-consultant-tirupati');
    check(
      Array.isArray(taxFaqs) && taxFaqs.length > 0,
      `getPublishedFaqs("income-tax-consultant-tirupati") returns tax FAQs (found ${taxFaqs?.length})`
    );

    const auditFaqs = getPublishedFaqs('audit-assurance');
    check(
      Array.isArray(auditFaqs) && auditFaqs.length > 0,
      `getPublishedFaqs("audit-assurance") returns audit FAQs (found ${auditFaqs?.length})`
    );

    const corpFaqs = getFaqsByCategory('Corporate & RERA');
    check(
      Array.isArray(corpFaqs) && corpFaqs.length > 0,
      `getFaqsByCategory("Corporate & RERA") returns matching FAQs (found ${corpFaqs?.length})`
    );

    // Summary
    console.log('\n========================================================================');
    console.log(`TOTAL EMPIRICAL ASSERTIONS: ${totalTests}`);
    console.log(`PASSED: ${passedTests}`);
    console.log(`FAILED: ${failedTests}`);
    console.log('========================================================================\n');

    if (failedTests > 0) {
      console.error(`VERDICT: REJECT (${failedTests} failures)`);
      failures.forEach(f => console.error(f));
      process.exitCode = 1;
    } else {
      console.log('VERDICT: APPROVE (100% EMPIRICAL STRESS TESTS PASSED)');
      process.exitCode = 0;
    }

  } finally {
    await vite.close();
  }
}

runSuite().catch(err => {
  console.error('Unhandled fatal error in test runner:', err);
  process.exit(1);
});
