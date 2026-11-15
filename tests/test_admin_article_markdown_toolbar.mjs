import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';
import { createServer } from 'vite';

console.log('================================================================');
console.log('  TEST SUITE: ADMIN ARTICLE MARKDOWN VISUAL TOOLBAR VERIFICATION  ');
console.log('================================================================\n');

const adminContentPagePath = path.resolve('src/pages/admin/AdminContentPage.tsx');
assert(fs.existsSync(adminContentPagePath), 'AdminContentPage.tsx must exist');
const content = fs.readFileSync(adminContentPagePath, 'utf8');

// --- 1. DOM Element & Ref Conformance ---
console.log('--- 1. DOM Element & Ref Conformance ---');
assert(
  content.includes('id="post-markdown-editor"'),
  'Textarea must have id="post-markdown-editor"'
);
console.log('✔ PASS [Assert 1] Textarea contains id="post-markdown-editor"');

assert(
  content.includes('ref={markdownEditorRef}'),
  'Textarea must be bound to markdownEditorRef'
);
console.log('✔ PASS [Assert 2] Textarea is wired with useRef hook');

assert(
  content.includes('useRef<HTMLTextAreaElement>(null)'),
  'AdminContentPage initializes HTMLTextAreaElement ref'
);
console.log('✔ PASS [Assert 3] Proper TypeScript typing for HTMLTextAreaElement ref');

// --- 2. 1-Click Formatting Actions Verification ---
console.log('\n--- 2. Toolbar Actions & Icon Exports ---');

const expectedActions = [
  'bold',
  'italic',
  'h2',
  'h3',
  'bullet-list',
  'numbered-list',
  'statutory-note',
  'tax-table',
  'link',
  'divider'
];

for (const action of expectedActions) {
  assert(
    content.includes(`data-action="${action}"`),
    `Toolbar must have button with data-action="${action}"`
  );
  assert(
    content.includes(`handleMarkdownFormat('${action}')`),
    `Toolbar button must call handleMarkdownFormat('${action}')`
  );
}
console.log('✔ PASS [Assert 4] All 10 required visual formatting actions configured in DOM');

const requiredIcons = [
  'Bold',
  'Italic',
  'Heading2',
  'Heading3',
  'List',
  'ListOrdered',
  'Quote',
  'Table',
  'Link',
  'Minus'
];

for (const icon of requiredIcons) {
  assert(
    content.includes(icon),
    `AdminContentPage must import and render icon ${icon}`
  );
}
console.log('✔ PASS [Assert 5] All 10 Lucide icons imported and assigned');

// --- 3. Botanical Ledger Luxury Styling Audit ---
console.log('\n--- 3. Botanical Ledger Luxury Theme Compliance ---');
assert(content.includes('#183529'), 'Theme uses primary deep forest green (#183529)');
assert(content.includes('#B49A64'), 'Theme uses statutory muted gold (#B49A64)');
assert(content.includes('#F1EBDD'), 'Theme uses warm parchment background (#F1EBDD)');
assert(content.includes('#FAFAFA'), 'Textarea editor uses crisp luxury background (#FAFAFA)');
assert(content.includes('#D8D0BE'), 'Toolbar and textarea use refined border (#D8D0BE)');
console.log('✔ PASS [Assert 6] Color tokens adhere strictly to Botanical Ledger design system');

// --- 4. Accessibility & UX Safeguards ---
console.log('\n--- 4. Accessibility & Form Safeguards ---');
assert(content.includes('role="toolbar"'), 'Toolbar specifies role="toolbar" for screen readers');
assert(content.includes('aria-label="Article formatting toolbar"'), 'Toolbar specifies descriptive aria-label');
assert(content.includes('onMouseDown={(e) => e.preventDefault()}'), 'Buttons prevent default on mousedown to preserve textarea selection and focus');
assert(!content.includes('<button data-action="bold" type="submit"'), 'Toolbar buttons are strictly type="button" and never type="submit"');
console.log('✔ PASS [Assert 7] Accessibility attributes and selection preservation safeguards active');

// --- 5. Production Module Execution via Vite SSR ---
console.log('\n--- 5. Pure Logic Execution from Production Source (markdownToolbar.ts) ---');

const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  optimizeDeps: { noDiscovery: true }
});

const { formatMarkdown } = await vite.ssrLoadModule('/src/utils/markdownToolbar.ts');

function testFormat(original, start, end, action) {
  const { updated, selStart, selEnd } = formatMarkdown(original, start, end, action);
  return { result: updated, selStart, selEnd };
}

// 5.1 Bold wrapping, placeholder, whitespace trimming & toggle
const boldUnselected = testFormat('', 0, 0, 'bold');
assert.strictEqual(boldUnselected.result, '**text**');
assert.strictEqual(boldUnselected.selStart, 2);
assert.strictEqual(boldUnselected.selEnd, 6);
assert.strictEqual(boldUnselected.result.substring(boldUnselected.selStart, boldUnselected.selEnd), 'text');
console.log('✔ PASS [Assert 8] Bold (unselected) inserts **text** and selects inner text');

const boldSelected = testFormat('Section 87A Rebate', 8, 18, 'bold'); // "87A Rebate"
assert.strictEqual(boldSelected.result, 'Section **87A Rebate**', 'Wrapped properly');
console.log('✔ PASS [Assert 9] Bold (selected) wraps selected word with **');

// Edge case: double-click selection with trailing whitespace
const boldWithSpaces = testFormat('Tax audit is mandatory.', 4, 10, 'bold'); // "audit "
assert.strictEqual(boldWithSpaces.result, 'Tax **audit** is mandatory.', 'Trims trailing whitespace outside asterisks');

// Edge case: toggle bold off when already bolded
const boldToggle = testFormat('Section **87A** Rebate', 8, 15, 'bold'); // "**87A**"
assert.strictEqual(boldToggle.result, 'Section 87A Rebate', 'Toggles bold off');
console.log('✔ PASS [Assert 9b] Bold edge cases: CommonMark whitespace defense and toggle-off verified');

// 5.2 Italic wrapping, placeholder & toggle
const italicUnselected = testFormat('', 0, 0, 'italic');
assert.strictEqual(italicUnselected.result, '*text*');
assert.strictEqual(italicUnselected.selStart, 1);
assert.strictEqual(italicUnselected.selEnd, 5);
console.log('✔ PASS [Assert 10] Italic (unselected) inserts *text* and selects inner text');

const italicSelected = testFormat('bona fide assessee', 5, 9, 'italic'); // "fide"
assert.strictEqual(italicSelected.result, 'bona *fide* assessee');
console.log('✔ PASS [Assert 11] Italic (selected) wraps selection with *');

const italicToggle = testFormat('bona *fide* assessee', 5, 11, 'italic'); // "*fide*"
assert.strictEqual(italicToggle.result, 'bona fide assessee', 'Toggles italic off');
console.log('✔ PASS [Assert 11b] Italic toggle-off verified');

// 5.3 Heading 2 & Heading 3
const h2Unselected = testFormat('', 0, 0, 'h2');
assert.strictEqual(h2Unselected.result, '## Heading\n');
assert.strictEqual(h2Unselected.result.substring(h2Unselected.selStart, h2Unselected.selEnd), 'Heading');

const h2Selected = testFormat('Tax Analysis', 0, 12, 'h2');
assert.strictEqual(h2Selected.result, '## Tax Analysis\n');

// Edge case: strip existing heading hashes
const h2Clean = testFormat('# Existing Heading', 0, 18, 'h2');
assert.strictEqual(h2Clean.result, '## Existing Heading\n', 'Strips single hash before applying H2');

const h3Unselected = testFormat('Intro', 5, 5, 'h3');
assert.strictEqual(h3Unselected.result, 'Intro\n\n### Subheading\n');
console.log('✔ PASS [Assert 12] H2 and H3 generate valid Markdown headers with proper newline offsets & hash cleanup');

// 5.4 Lists
const bulletSelected = testFormat('Item A\nItem B', 0, 13, 'bullet-list');
assert.strictEqual(bulletSelected.result, '- Item A\n- Item B');

// Edge case: preserve empty lines in bullet list without phantom bullets
const bulletWithEmpty = testFormat('Item A\n\nItem B', 0, 14, 'bullet-list');
assert.strictEqual(bulletWithEmpty.result, '- Item A\n\n- Item B', 'Preserves blank line without dangling bullet');

const numSelected = testFormat('Step One\nStep Two', 0, 17, 'numbered-list');
assert.strictEqual(numSelected.result, '1. Step One\n2. Step Two');
console.log('✔ PASS [Assert 13] Bullet & Numbered lists format multi-line selections iteratively without corrupting blank lines');

// 5.5 Statutory Callout Note
const statNoteUnselected = testFormat('', 0, 0, 'statutory-note');
assert(statNoteUnselected.result.startsWith('> **Statutory Note**: '));
assert(statNoteUnselected.result.includes('Section 44AB'));

const statNoteSelected = testFormat('Penalty under Section 271B is 0.5% of turnover.', 0, 47, 'statutory-note');
assert.strictEqual(statNoteSelected.result, '> **Statutory Note**: Penalty under Section 271B is 0.5% of turnover.\n');

// Edge case: multi-line statutory note must prefix subsequent lines with '>'
const statNoteMulti = testFormat('Clause (a): Turnover over 1 Cr.\nClause (b): Cash under 5%.', 0, 58, 'statutory-note');
assert.strictEqual(statNoteMulti.result, '> **Statutory Note**: Clause (a): Turnover over 1 Cr.\n> Clause (b): Cash under 5%.\n');
console.log('✔ PASS [Assert 14] Statutory Note correctly creates blockquote callout with all lines prefixed for MarkdownRenderer');

// 5.6 Tax / Data Table
const tableUnselected = testFormat('Previous text', 13, 13, 'tax-table');
assert(tableUnselected.result.includes('| Category | Old Regime | New Regime |'));
assert(tableUnselected.result.includes('| :--- | :--- | :--- |'));
assert(tableUnselected.result.includes('| Sample | Data | Data |'));
// Cursor selects 'Sample'
assert.strictEqual(tableUnselected.result.substring(tableUnselected.selStart, tableUnselected.selEnd), 'Sample');

// Edge case: selected text preserved as table row instead of discarded
const tableSelected = testFormat('Section 80C\nSection 80D', 0, 23, 'tax-table');
assert(tableSelected.result.includes('| Section 80C | Data | Data |'));
assert(tableSelected.result.includes('| Section 80D | Data | Data |'));
console.log('✔ PASS [Assert 15] Tax Table inserts 3-column statutory tax grid and preserves selected rows');

// 5.7 Link & Divider
const linkUnselected = testFormat('', 0, 0, 'link');
assert.strictEqual(linkUnselected.result, '[Link Text](https://)');
assert.strictEqual(linkUnselected.result.substring(linkUnselected.selStart, linkUnselected.selEnd), 'Link Text');

const linkSelected = testFormat('Income Tax Portal', 0, 17, 'link');
assert.strictEqual(linkSelected.result, '[Income Tax Portal](https://)');
assert.strictEqual(linkSelected.result.substring(linkSelected.selStart, linkSelected.selEnd), 'https://');

// Edge case: URL selected
const linkUrlSelected = testFormat('https://incometax.gov.in', 0, 24, 'link');
assert.strictEqual(linkUrlSelected.result, '[Link Text](https://incometax.gov.in)');
assert.strictEqual(linkUrlSelected.result.substring(linkUrlSelected.selStart, linkUrlSelected.selEnd), 'Link Text');

const divider = testFormat('Paragraph 1', 11, 11, 'divider');
assert.strictEqual(divider.result, 'Paragraph 1\n\n---\n\n');
console.log('✔ PASS [Assert 16] Link wraps text/URLs; Divider cleanly isolates horizontal rule');

await vite.close();

console.log('\n================================================================');
console.log('  ALL MARKDOWN TOOLBAR PRODUCTION ASSERTIONS PASSED (100%)      ');
console.log('================================================================');
