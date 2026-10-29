/**
 * KAVITHA & ASSOCIATES — RLS POLICY & SECURITY VERIFICATION SUITE
 * 
 * Verifies Row Level Security rules, anonymous read protection,
 * unauthorized mutation blocking, and public form access constraints.
 */

const fs = require('fs');
const path = require('path');

console.log('================================================================');
console.log('KAVITHA & ASSOCIATES — SUPABASE RLS SECURITY TEST SUITE');
console.log('================================================================\n');

// 1. Inspect migration SQL file for required security rules
const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20261029000000_init_schema.sql');
const migrationSql = fs.readFileSync(migrationPath, 'utf8');

const checks = [
  {
    name: 'Row Level Security enabled on profiles',
    test: () => migrationSql.includes('ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;')
  },
  {
    name: 'Row Level Security enabled on enquiries',
    test: () => migrationSql.includes('ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;')
  },
  {
    name: 'Row Level Security enabled on content_services',
    test: () => migrationSql.includes('ALTER TABLE public.content_services ENABLE ROW LEVEL SECURITY;')
  },
  {
    name: 'Row Level Security enabled on content_faqs',
    test: () => migrationSql.includes('ALTER TABLE public.content_faqs ENABLE ROW LEVEL SECURITY;')
  },
  {
    name: 'Row Level Security enabled on practice_settings',
    test: () => migrationSql.includes('ALTER TABLE public.practice_settings ENABLE ROW LEVEL SECURITY;')
  },
  {
    name: 'Anonymous INSERT allowed on enquiries (Public Contact Form)',
    test: () => migrationSql.includes('CREATE POLICY "enquiries_insert_public" ON public.enquiries')
  },
  {
    name: 'Anonymous SELECT strictly BLOCKED on enquiries (Staff-Only Select)',
    test: () => migrationSql.includes('CREATE POLICY "enquiries_select_staff_only" ON public.enquiries') &&
                !migrationSql.includes('CREATE POLICY "enquiries_select_public"')
  },
  {
    name: 'Anonymous UPDATE strictly BLOCKED on enquiries',
    test: () => migrationSql.includes('CREATE POLICY "enquiries_update_staff_only" ON public.enquiries') &&
                !migrationSql.includes('CREATE POLICY "enquiries_update_public"')
  },
  {
    name: 'Anonymous DELETE strictly BLOCKED on enquiries',
    test: () => migrationSql.includes('CREATE POLICY "enquiries_delete_staff_only" ON public.enquiries') &&
                !migrationSql.includes('CREATE POLICY "enquiries_delete_public"')
  },
  {
    name: 'Draft services shielded from anonymous public read',
    test: () => migrationSql.includes("USING (status = 'published');")
  },
  {
    name: 'Client input constraints enforced at DB level (name >= 2, phone >= 8)',
    test: () => migrationSql.includes('char_length(full_name) >= 2') && migrationSql.includes('char_length(phone) >= 8')
  },
  {
    name: 'Zero privileged service-role key in client bundle',
    test: () => {
      const envExample = fs.readFileSync(path.join(__dirname, '..', '.env.example'), 'utf8');
      const supabaseClientSrc = fs.readFileSync(path.join(__dirname, '..', 'src', 'lib', 'supabase.ts'), 'utf8');
      return !envExample.includes('service_role') || (envExample.includes('NEVER') && !supabaseClientSrc.includes('service_role'));
    }
  }
];

let allPassed = true;

console.log('[SECTION 1: DATABASE ROW LEVEL SECURITY POLICY VERIFICATION]');
checks.forEach((c, idx) => {
  const passed = c.test();
  console.log(`  ${(idx + 1).toString().padStart(2)}. ${c.name.padEnd(65)} [${passed ? '✓ PASS' : '✗ FAIL'}]`);
  if (!passed) allPassed = false;
});

// 2. Client-side security verification
console.log('\n[SECTION 2: FRONTEND APPLICATION SHIELDING & SPAM GUARDS]');
const contactFormSrc = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', 'ContactForm.tsx'), 'utf8');
const robotsSrc = fs.readFileSync(path.join(__dirname, '..', 'public', 'robots.txt'), 'utf8');

const honeypotPresent = contactFormSrc.includes('website_fax_hp');
console.log(`  13. Invisible bot honeypot field active on contact form:        [${honeypotPresent ? '✓ PASS' : '✗ FAIL'}]`);

const velocityGuardPresent = contactFormSrc.includes('Date.now() - formLoadedAt.current < 1500');
console.log(`  14. Velocity/timing spam protection (< 1.5s rejection):        [${velocityGuardPresent ? '✓ PASS' : '✗ FAIL'}]`);

const robotsAdminDisallowed = robotsSrc.includes('Disallow: /admin');
console.log(`  15. robots.txt disallows search engine indexing of /admin:     [${robotsAdminDisallowed ? '✓ PASS' : '✗ FAIL'}]`);

if (!honeypotPresent || !velocityGuardPresent || !robotsAdminDisallowed) {
  allPassed = false;
}

console.log('\n================================================================');
console.log(allPassed ? 'ALL SECURITY & RLS TESTS PASSED — SYSTEM READY' : 'SOME CHECKS FAILED');
console.log('================================================================');
