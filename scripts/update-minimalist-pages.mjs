import fs from 'fs';

// Update AdminEnquiriesPage.tsx
let enqCode = fs.readFileSync('src/pages/admin/AdminEnquiriesPage.tsx', 'utf8');
enqCode = enqCode.replaceAll('rounded-2xl border border-gray-200/80 shadow-sm', 'rounded-xl border border-[#EAEAEA]');
enqCode = enqCode.replaceAll('bg-brand-chambers text-white p-6 rounded-2xl border border-emerald-900 shadow-sm', 'bg-neutral-900 text-white p-6 rounded-xl border border-neutral-800');
fs.writeFileSync('src/pages/admin/AdminEnquiriesPage.tsx', enqCode, 'utf8');
console.log('Updated AdminEnquiriesPage.tsx');

// Update AdminSettingsPage.tsx
let setCode = fs.readFileSync('src/pages/admin/AdminSettingsPage.tsx', 'utf8');
setCode = setCode.replaceAll('rounded-2xl border border-gray-200/80 shadow-sm', 'rounded-xl border border-[#EAEAEA]');
setCode = setCode.replaceAll('bg-brand-chambers text-white p-6 sm:p-8 rounded-2xl border border-emerald-900 shadow-sm', 'bg-neutral-900 text-white p-6 sm:p-8 rounded-xl border border-neutral-800');
fs.writeFileSync('src/pages/admin/AdminSettingsPage.tsx', setCode, 'utf8');
console.log('Updated AdminSettingsPage.tsx');
