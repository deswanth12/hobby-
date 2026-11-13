import React, { useState } from 'react';
import { Phone, CheckCircle2, ExternalLink } from 'lucide-react';
import { CrestMonogram } from '../common/CrestMonogram';
import { useFirmProfile } from '../../adapters/backendAdapter';

export const LeadershipProfile: React.FC = () => {
  const firmProfile = useFirmProfile();
  const { partner, contact } = firmProfile;
  const [activeTab, setActiveTab] = useState<'journey' | 'awards' | 'dual' | 'education'>('journey');

  return (
    <div className="w-full bg-[#FAF7F0] rounded-2xl border border-[#D8D0BE] p-6 sm:p-8 lg:p-10 shadow-sm space-y-8">
      {/* Plaque Header & Identification */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-[#D8D0BE] pb-8">
        
        {/* Left: Authoritative Practice Credential Seal (/brand/ka-seal-medallion.webp) & Neutral Crest Monogram (Partner Portrait Quarantined Pending Written Client Authorization) */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center">
          <CrestMonogram
            variant="portrait-placeholder"
            size="portrait"
            partnerName={partner.name}
            className="w-full"
          />
        </div>

        {/* Right: Partner Credentials & Leadership Bio */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-editorial-meta text-xs uppercase tracking-wider text-[#7E5E1E] font-bold px-3 py-1 rounded-full bg-[#F1EBDD] border border-[#D8D0BE]">
              MANAGING PARTNER &amp; SENIOR PRACTITIONER
            </span>
            <span className="font-editorial-meta text-xs font-semibold px-2.5 py-1 rounded-md bg-[#183529] text-[#B49A64] border border-[#B49A64]/30">
              CMA AIR 49 (ICMAI)
            </span>
          </div>

          <h2 className="font-editorial-h2 text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-[#071B14]">
            {partner.name}
          </h2>

          <p className="font-editorial-meta text-sm font-semibold text-[#7E5E1E]">
            {partner.qualifications} (AIR 49 ICMAI) • ICAI Practicing Fellow [REDACTED_MEMBERSHIP_NO]
          </p>

          <p className="font-editorial-body text-sm text-[#35271F] leading-relaxed">
            {partner.summary}
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-[#F1EBDD] border border-[#D8D0BE]">
              <span className="text-[10px] uppercase font-bold text-[#7E5E1E] block font-editorial-meta">Experience</span>
              <span className="font-serif text-sm font-bold text-[#071B14]">{partner.experienceYears}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#F1EBDD] border border-[#D8D0BE]">
              <span className="text-[10px] uppercase font-bold text-[#7E5E1E] block font-editorial-meta">Audit Pedigree</span>
              <span className="font-serif text-sm font-bold text-[#071B14]">Deloitte Big 4</span>
            </div>
            <div className="p-3 rounded-xl bg-[#F1EBDD] border border-[#D8D0BE]">
              <span className="text-[10px] uppercase font-bold text-[#7E5E1E] block font-editorial-meta">Internal Audit</span>
              <span className="font-serif text-sm font-bold text-[#071B14]">Ford Motor Co.</span>
            </div>
            <div className="p-3 rounded-xl bg-[#F1EBDD] border border-[#D8D0BE]">
              <span className="text-[10px] uppercase font-bold text-[#7E5E1E] block font-editorial-meta">Chambers</span>
              <span className="font-serif text-sm font-bold text-[#071B14]">Tirupati, AP</span>
            </div>
          </div>

          {/* Contact Bar */}
          <div className="pt-3 flex flex-wrap items-center gap-4 text-xs font-sans">
            <a
              href={`tel:${contact.primaryPhoneClean}`}
              className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#183529] text-[#F1EBDD] hover:bg-[#071B14] font-semibold border border-[#B49A64]/40 btn-tactile"
            >
              <Phone className="w-3.5 h-3.5 text-[#B49A64]" />
              <span>{contact.primaryPhone}</span>
            </a>

            <a
              href={contact.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FAF7F0] text-[#071B14] hover:bg-[#E8D5B5] font-semibold border border-[#D8D0BE] btn-tactile"
            >
              <span>Connect on WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#7E5E1E]" />
            </a>
          </div>
        </div>

      </div>

      {/* Tabbed Institutional Background Navigation */}
      <div className="space-y-6">
        <div className="flex border-b border-[#D8D0BE] gap-2 overflow-x-auto pb-1" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'journey'}
            onClick={() => setActiveTab('journey')}
            className={`min-h-[44px] px-5 py-2.5 rounded-t-xl font-editorial-meta text-xs uppercase tracking-wider font-bold transition-all ${
              activeTab === 'journey'
                ? 'bg-[#F1EBDD] text-[#071B14] border-t-2 border-[#183529]'
                : 'text-[#525954] hover:text-[#071B14]'
            }`}
          >
            Career Background
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'awards'}
            onClick={() => setActiveTab('awards')}
            className={`min-h-[44px] px-5 py-2.5 rounded-t-xl font-editorial-meta text-xs uppercase tracking-wider font-bold transition-all ${
              activeTab === 'awards'
                ? 'bg-[#F1EBDD] text-[#071B14] border-t-2 border-[#183529]'
                : 'text-[#525954] hover:text-[#071B14]'
            }`}
          >
            Honors &amp; Awards
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'dual'}
            onClick={() => setActiveTab('dual')}
            className={`min-h-[44px] px-5 py-2.5 rounded-t-xl font-editorial-meta text-xs uppercase tracking-wider font-bold transition-all ${
              activeTab === 'dual'
                ? 'bg-[#F1EBDD] text-[#071B14] border-t-2 border-[#183529]'
                : 'text-[#525954] hover:text-[#071B14]'
            }`}
          >
            Dual Competence
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'education'}
            onClick={() => setActiveTab('education')}
            className={`min-h-[44px] px-5 py-2.5 rounded-t-xl font-editorial-meta text-xs uppercase tracking-wider font-bold transition-all ${
              activeTab === 'education'
                ? 'bg-[#F1EBDD] text-[#071B14] border-t-2 border-[#183529]'
                : 'text-[#525954] hover:text-[#071B14]'
            }`}
          >
            Education &amp; Memberships
          </button>
        </div>

        {/* Tab Content 1: Institutional Journey */}
        {activeTab === 'journey' && (
          <div className="space-y-4" role="tabpanel">
            {partner.careerJourney.map((job) => (
              <div key={job.organization} className="p-5 rounded-xl bg-[#F1EBDD] border border-[#D8D0BE]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 mb-2 border-b border-[#D8D0BE]">
                  <div>
                    <h3 className="font-editorial-h3 text-base font-bold font-serif text-[#071B14]">{job.role}</h3>
                    <span className="text-xs font-semibold text-[#7E5E1E]">{job.organization}</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#525954]">{job.period} • {job.location}</span>
                </div>
                <ul className="space-y-1.5 text-xs text-[#35271F] mt-2">
                  {job.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#183529] shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Tab Content 2: Awards */}
        {activeTab === 'awards' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" role="tabpanel">
            {partner.awards.map((award) => (
              <div key={award.title} className="p-5 rounded-xl bg-[#F1EBDD] border border-[#D8D0BE] flex flex-col justify-between">
                <div>
                  <span className="font-editorial-meta text-[10px] text-[#7E5E1E] font-bold uppercase block mb-1">{award.category}</span>
                  <h3 className="font-editorial-h3 text-base font-bold font-serif text-[#071B14]">{award.title}</h3>
                </div>
                <span className="text-xs text-[#525954] mt-4 pt-2 border-t border-[#D8D0BE] block">{award.organization}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tab Content 3: Dual Advantage */}
        {activeTab === 'dual' && (
          <div className="p-5 rounded-xl bg-[#F1EBDD] border border-[#D8D0BE] space-y-4" role="tabpanel">
            <h3 className="font-editorial-h3 text-base font-bold font-serif text-[#071B14]">
              Integrated ICAI + ICMAI Governance Model
            </h3>
            <p className="font-editorial-body text-xs text-[#35271F] leading-relaxed">
              By combining mandatory statutory audit certifications with management cost accounting insights, clients gain both complete statutory defensibility and actionable operating margin clarity.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-lg bg-[#FAF7F0] border border-[#D8D0BE]">
                <strong className="font-serif text-sm font-bold text-[#183529] block mb-1">Chartered Accountancy (ICAI)</strong>
                <p className="font-editorial-body text-xs text-[#525954]">Mandatory external audits, income tax planning &amp; scrutiny litigation, GST reconciliations, and true &amp; fair financial certification.</p>
              </div>
              <div className="p-4 rounded-lg bg-[#FAF7F0] border border-[#D8D0BE]">
                <strong className="font-serif text-sm font-bold text-[#7E5E1E] block mb-1">Cost Accountancy (ICMAI AIR 49)</strong>
                <p className="font-editorial-body text-xs text-[#525954]">Unit cost analysis, working capital optimization, internal financial control (ICFR) diagnostics, and operational cash flow planning.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content 4: Education */}
        {activeTab === 'education' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" role="tabpanel">
            {partner.education.map((edu) => (
              <div key={edu.degree} className="p-4 rounded-xl bg-[#F1EBDD] border border-[#D8D0BE]">
                <span className="font-mono text-xs text-[#7E5E1E] font-semibold">{edu.year}</span>
                <h3 className="font-editorial-h3 text-sm font-bold font-serif text-[#071B14] mt-1">{edu.degree}</h3>
                <p className="font-editorial-body text-xs text-[#525954] mt-0.5">{edu.institution}</p>
                {edu.distinction && (
                  <span className="inline-block mt-3 text-[10px] font-semibold text-[#183529] bg-[#FAF7F0] px-2 py-0.5 rounded border border-[#D8D0BE]">
                    {edu.distinction}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadershipProfile;
