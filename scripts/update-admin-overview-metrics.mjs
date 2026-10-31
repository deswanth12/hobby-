import fs from 'fs';

const file = 'C:/kavitha ca/src/pages/admin/AdminOverviewPage.tsx';
let raw = fs.readFileSync(file, 'utf8');
const isCrlf = raw.includes('\r\n');
let code = raw.replace(/\r\n/g, '\n');

// 1. Replace calculations and remove handleCreateSampleEnquiry
const oldCalcSection = `  const totalEnquiries = enquiries.length;
  const newEnquiries = enquiries.filter(e => e.status === 'new').length;
  const inReviewEnquiries = enquiries.filter(e => e.status === 'in-progress' || e.status === 'in-review').length;
  const closedEnquiries = enquiries.filter(e => e.status === 'contacted' || e.status === 'closed').length;

  const recentEnquiries = enquiries.slice(0, 5);

  const handleExportCSV = () => {
    const csv = adminStorage.exportEnquiriesCSV();
    if (!csv) {
      alert('No enquiries available to export.');
      return;
    }
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', \`Kavitha_Associates_Enquiries_\${new Date().toISOString().split('T')[0]}.csv\`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateSampleEnquiry = () => {
    adminStorage.recordEnquiry({
      fullName: 'Sreenivasulu Naidu',
      entityType: 'Private Limited Company',
      organization: 'Tirupati Agro Processing Pvt Ltd',
      phone: '+91 94401 23456',
      email: 'sreenivas@tirupatiagro.com',
      serviceCategory: 'Taxation & Statutory Compliances',
      city: 'Tirupati',
      urgency: 'statutory-deadline',
      message: 'Urgent consultation requested for GST annual reconciliation and filing before statutory deadline next week.',
    });
    loadData();
  };`;

const newCalcSection = `  const totalEnquiries = enquiries.length;
  const newEnquiries = enquiries.filter(e => e.status === 'new').length;
  const inReviewEnquiries = enquiries.filter(e => e.status === 'in-progress' || e.status === 'in-review').length;
  const contactedEnquiries = enquiries.filter(e => e.status === 'contacted').length;
  const convertedClients = new Set(
    enquiries
      .filter(e => e.status === 'closed')
      .map(e => (e.phone || e.email || e.fullName).trim().toLowerCase())
  ).size;

  const recentEnquiries = enquiries.slice(0, 5);

  const handleExportCSV = () => {
    const csv = adminStorage.exportEnquiriesCSV();
    if (!csv) {
      alert('No enquiries available to export.');
      return;
    }
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', \`Kavitha_Associates_Enquiries_\${new Date().toISOString().split('T')[0]}.csv\`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };`;

code = code.replace(oldCalcSection, newCalcSection);

// 2. Update Card 4 to Converted Clients
const oldCard4 = `          {/* Contacted / Completed */}
          <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Contacted / Closed
              </div>
              <div className="text-3xl font-serif font-bold text-emerald-700 mt-1">
                {closedEnquiries}
              </div>
              <div className="text-[11px] text-emerald-600 mt-0.5">
                Consultation addressed
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>`;

const newCard4 = `          {/* Converted Clients (Deduplicated Closed Engagements) */}
          <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Converted Clients
              </div>
              <div className="text-3xl font-serif font-bold text-emerald-700 mt-1">
                {convertedClients}
              </div>
              <div className="text-[11px] text-emerald-600 mt-0.5">
                Closed client engagements
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>`;

code = code.replace(oldCard4, newCard4);

// 3. Remove "+ Inject Evaluation Sample Enquiry" button
const oldSampleBtn = `<button
                type="button"
                onClick={handleCreateSampleEnquiry}
                className="inline-flex items-center px-3 py-1.5 text-xs text-gray-600 hover:text-brand-darkgreen transition-colors"
              >
                + Inject Evaluation Sample Enquiry
              </button>`;

code = code.replace(oldSampleBtn, '');

// 4. Remove "Create Evaluation Sample" button from empty state
const oldEmptySample = `<button
                  type="button"
                  onClick={handleCreateSampleEnquiry}
                  className="px-4 py-2 text-xs font-bold text-white bg-brand-darkgreen hover:bg-brand-chambers rounded-xl transition-colors duration-200"
                >
                  Create Evaluation Sample
                </button>
                <Link
                  to="/contact"
                  target="_blank"
                  className="px-4 py-2 text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200 inline-flex items-center gap-1"
                >
                  Test Public Contact Form <ExternalLink className="w-3 h-3" />
                </Link>`;

const newEmptySample = `<Link
                  to="/contact"
                  target="_blank"
                  className="px-4 py-2 text-xs font-bold text-white bg-brand-darkgreen hover:bg-brand-chambers rounded-xl transition-colors duration-200 inline-flex items-center gap-1.5"
                >
                  Open Public Contact Form <ExternalLink className="w-3 h-3" />
                </Link>`;

code = code.replace(oldEmptySample, newEmptySample);

fs.writeFileSync(file, isCrlf ? code.replace(/\n/g, '\r\n') : code, 'utf8');
console.log('AdminOverviewPage.tsx updated successfully.');
