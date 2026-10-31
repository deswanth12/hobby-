import fs from 'fs';

let code = fs.readFileSync('src/pages/admin/AdminOverviewPage.tsx', 'utf8');

// Replace KPI cards with minimalist design
const oldKpiSection = `        {/* =========================================================================
            1. KPI SUMMARY CARDS (Genuine Data Only)
            ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Total Enquiries */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Total Enquiries
              </div>
              <div className="text-3xl font-serif font-bold text-brand-darkgreen mt-1">
                {totalEnquiries}
              </div>
              <div className="text-[11px] text-gray-500 mt-0.5">
                Logged in practice register
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-brand-darkgreen flex items-center justify-center">
              <Inbox className="w-6 h-6" />
            </div>
          </div>

          {/* New / Action Required */}
          <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-700">
                New Action Required
              </div>
              <div className="text-3xl font-serif font-bold text-amber-700 mt-1">
                {newEnquiries}
              </div>
              <div className="text-[11px] text-amber-600 mt-0.5">
                Pending partner review
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
          </div>

          {/* Under Review */}
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
          </div>

          {/* Contacted / Completed */}
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
          </div>
        </div>`;

const newKpiSection = `        {/* =========================================================================
            1. MINIMALIST KPI METRIC CARDS
            ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Total Enquiries */}
          <div className="bg-white p-5 rounded-xl border border-[#EAEAEA] flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                Total Consultations
              </div>
              <div className="text-2xl font-serif font-bold text-neutral-900 mt-1">
                {totalEnquiries}
              </div>
              <div className="text-[11px] text-neutral-500 mt-0.5">
                Practice register
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-neutral-50 border border-neutral-200/60 text-neutral-600 flex items-center justify-center">
              <Inbox className="w-4 h-4" />
            </div>
          </div>

          {/* New / Action Required */}
          <div className="bg-white p-5 rounded-xl border border-[#EAEAEA] flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-amber-700">
                Action Required
              </div>
              <div className="text-2xl font-serif font-bold text-neutral-900 mt-1">
                {newEnquiries}
              </div>
              <div className="text-[11px] text-neutral-500 mt-0.5">
                Pending review
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200/60 text-amber-800 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>

          {/* Under Review */}
          <div className="bg-white p-5 rounded-xl border border-[#EAEAEA] flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                Under Review
              </div>
              <div className="text-2xl font-serif font-bold text-neutral-900 mt-1">
                {inReviewEnquiries}
              </div>
              <div className="text-[11px] text-neutral-500 mt-0.5">
                In progress
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-neutral-50 border border-neutral-200/60 text-neutral-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          {/* Contacted / Completed */}
          <div className="bg-white p-5 rounded-xl border border-[#EAEAEA] flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-700">
                Completed
              </div>
              <div className="text-2xl font-serif font-bold text-neutral-900 mt-1">
                {closedEnquiries}
              </div>
              <div className="text-[11px] text-neutral-500 mt-0.5">
                Addressed
              </div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200/60 text-emerald-800 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
        </div>`;

code = code.replace(oldKpiSection, newKpiSection);

// Replace container cards with rounded-xl border-[#EAEAEA]
code = code.replaceAll('rounded-2xl border border-gray-200/80 shadow-sm', 'rounded-xl border border-[#EAEAEA]');
code = code.replaceAll('bg-brand-chambers text-white p-6 rounded-2xl border border-emerald-900 shadow-sm', 'bg-neutral-900 text-white p-6 rounded-xl border border-neutral-800');

fs.writeFileSync('src/pages/admin/AdminOverviewPage.tsx', code, 'utf8');
console.log('Successfully updated AdminOverviewPage.tsx');
