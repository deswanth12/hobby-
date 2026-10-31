import fs from 'fs';

const file = 'C:/kavitha ca/src/pages/admin/AdminOverviewPage.tsx';
let raw = fs.readFileSync(file, 'utf8');
const isCrlf = raw.includes('\r\n');
let code = raw.replace(/\r\n/g, '\n');

const oldCard3 = `          {/* Under Review */}
          <div className="bg-white p-5 rounded-2xl border border-blue-200/80 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-700">
                Under Review
              </div>
              <div className="text-3xl font-serif font-bold text-blue-700 mt-1">
                {inReviewEnquiries}
              </div>
              <div className="text-[11px] text-blue-600 mt-0.5">
                Follow-up in progress
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>`;

const newCard3 = `          {/* Under Review & Active Consultations */}
          <div className="bg-white p-5 rounded-2xl border border-blue-200/80 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-blue-700">
                Active Follow-up
              </div>
              <div className="text-3xl font-serif font-bold text-blue-700 mt-1">
                {inReviewEnquiries + contactedEnquiries}
              </div>
              <div className="text-[11px] text-blue-600 mt-0.5">
                {contactedEnquiries} contacted • {inReviewEnquiries} in review
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>`;

code = code.replace(oldCard3, newCard3);

fs.writeFileSync(file, isCrlf ? code.replace(/\n/g, '\r\n') : code, 'utf8');
console.log('Card 3 updated.');
