import fs from 'fs';

const file = 'C:/kavitha ca/src/pages/admin/AdminEnquiriesPage.tsx';
let raw = fs.readFileSync(file, 'utf8');
const isCrlf = raw.includes('\r\n');
let code = raw.replace(/\r\n/g, '\n');

// 1. In handleSaveStatusAndNotes, update drawer state immediately
const oldSave = `    const ok = adminStorage.updateEnquiryStatus(selectedEnquiry.id, editStatus, editNotes);
    if (ok) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
      loadEnquiries(false);
    }`;

const newSave = `    const ok = adminStorage.updateEnquiryStatus(selectedEnquiry.id, editStatus, editNotes);
    if (ok) {
      setSaveSuccess(true);
      setSelectedEnquiry(prev => prev ? { ...prev, status: editStatus, notes: editNotes } : null);
      setTimeout(() => setSaveSuccess(false), 2500);
      loadEnquiries(false);
    }`;

code = code.replace(oldSave, newSave);

// 2. Null safe search filter
code = code.replace(
  'item.serviceCategory.toLowerCase().includes(query) ||\n      item.city.toLowerCase().includes(query);',
  '(item.serviceCategory || \'\').toLowerCase().includes(query) ||\n      (item.city || \'\').toLowerCase().includes(query);'
);

// 3. Add page clamping effect
const oldPagination = `  // Calculate pagination
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;`;

const newPagination = `  // Calculate pagination
  const totalPages = Math.ceil(filtered.length / pageSize) || 1;

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);`;

if (!code.includes('if (currentPage > totalPages)')) {
  code = code.replace(oldPagination, newPagination);
}

fs.writeFileSync(file, isCrlf ? code.replace(/\n/g, '\r\n') : code, 'utf8');
console.log('AdminEnquiriesPage.tsx updated successfully.');
