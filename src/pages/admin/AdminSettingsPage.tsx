import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  ExternalLink,
  Shield, 
  Database, 
  Sparkles
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { adminStorage } from '../../services/adminStorage';
import { useFirmData } from '../../context/FirmDataContext';

export const AdminSettingsPage: React.FC = () => {
  const { data: firmData, isModified } = useFirmData();
  const session = adminStorage.getSession();

  // Settings form states
  const [primaryPhone, setPrimaryPhone] = useState(firmData.contact.primaryPhone);
  const [secondaryPhone, setSecondaryPhone] = useState(firmData.contact.secondaryPhone || '');
  const [email, setEmail] = useState(firmData.contact.email);
  const [primaryLocation, setPrimaryLocation] = useState(firmData.contact.primaryLocation);
  const [googleMapsUrl, setGoogleMapsUrl] = useState(firmData.contact.googleMapsUrl);
  const [whatsappLink, setWhatsappLink] = useState(firmData.contact.whatsappLink);

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();

    const ok = adminStorage.saveSettingsOverrides({
      primaryPhone: primaryPhone.trim(),
      secondaryPhone: secondaryPhone.trim(),
      email: email.trim(),
      primaryLocation: primaryLocation.trim(),
      googleMapsUrl: googleMapsUrl.trim(),
      whatsappLink: whatsappLink.trim(),
    });

    if (ok) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    }
  };

  const handleResetSettings = () => {
    if (window.confirm('Reset all practice contact information to original baseline?')) {
      adminStorage.resetSettingsOverrides();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
      
      // Update form inputs to baseline
      setTimeout(() => {
        setPrimaryPhone(firmData.contact.primaryPhone);
        setSecondaryPhone(firmData.contact.secondaryPhone || '');
        setEmail(firmData.contact.email);
        setPrimaryLocation(firmData.contact.primaryLocation);
        setGoogleMapsUrl(firmData.contact.googleMapsUrl);
        setWhatsappLink(firmData.contact.whatsappLink);
      }, 100);
    }
  };

  return (
    <AdminLayout 
      title="Practice Settings & Channels" 
      subtitle="Manage chambers contact information, official emails, phone channels, and review infrastructure configuration."
    >
      <div className="space-y-8">

        {/* Success Notification */}
        {saveSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-[#0F3E2E] flex items-center justify-between shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Practice settings saved successfully! Live changes now active across public header, footer, and contact channels.</span>
            </div>
            <a
              href="/contact"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-emerald-700 hover:underline inline-flex items-center font-bold"
            >
              Verify Public Contact Page <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* =========================================================================
              1. CONTACT & PRACTICE DETAILS FORM (Col 7)
              ========================================================================= */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200/80 shadow-sm">
            <div className="pb-4 border-b border-gray-100 mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#0F3E2E]">Official Contact Channels</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  These channels appear across the public navbar, footer, contact page, and WhatsApp button
                </p>
              </div>
              {isModified && (
                <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full font-bold">
                  Customized
                </span>
              )}
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#0F3E2E]" />
                    Primary Phone Channel
                  </label>
                  <input
                    type="text"
                    required
                    value={primaryPhone}
                    onChange={(e) => setPrimaryPhone(e.target.value)}
                    placeholder="+91 96263 50900"
                    className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0F3E2E]/20 focus:border-[#0F3E2E] font-medium"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">Displayed on public header and quick call</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#0F3E2E]" />
                    Secondary Phone Channel
                  </label>
                  <input
                    type="text"
                    value={secondaryPhone}
                    onChange={(e) => setSecondaryPhone(e.target.value)}
                    placeholder="+91 94443 89800"
                    className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0F3E2E]/20 focus:border-[#0F3E2E] font-medium"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">Alternative office landline or mobile</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#0F3E2E]" />
                  Practice Official Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kavithaca2011@gmail.com"
                  className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0F3E2E]/20 focus:border-[#0F3E2E] font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#0F3E2E]" />
                  Chambers Physical Address
                </label>
                <textarea
                  rows={3}
                  required
                  value={primaryLocation}
                  onChange={(e) => setPrimaryLocation(e.target.value)}
                  placeholder="D.No: 18-1-508, 1st Floor, Sri Hari Nilayam, Bhavani Nagar, Tirupati - 517501"
                  className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0F3E2E]/20 focus:border-[#0F3E2E] leading-relaxed font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                  Google Maps Location / Direction URL
                </label>
                <input
                  type="url"
                  required
                  value={googleMapsUrl}
                  onChange={(e) => setGoogleMapsUrl(e.target.value)}
                  placeholder="https://maps.google.com/..."
                  className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0F3E2E]/20 focus:border-[#0F3E2E] font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                  WhatsApp Direct Consultation Link
                </label>
                <input
                  type="url"
                  required
                  value={whatsappLink}
                  onChange={(e) => setWhatsappLink(e.target.value)}
                  placeholder="https://wa.me/919626350900"
                  className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0F3E2E]/20 focus:border-[#0F3E2E] font-mono text-[11px]"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleResetSettings}
                  className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-red-700 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                  Reset to Original Baseline
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center px-5 py-2.5 bg-[#0F3E2E] hover:bg-[#0A2F24] text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                >
                  <Save className="w-3.5 h-3.5 mr-1.5" />
                  Save Practice Settings
                </button>
              </div>

            </form>
          </div>

          {/* =========================================================================
              2. ARCHITECTURE & SECURITY LEDGER (Col 5)
              ========================================================================= */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* System Specs Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <Shield className="w-5 h-5 text-[#0F3E2E]" />
                <h3 className="text-sm font-bold text-[#0F3E2E]">Security & Session Specs</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-500">Authenticated User:</span>
                  <span className="font-bold text-gray-900">{session?.user.displayName || 'Authorized Admin'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-500">Role / Clearance:</span>
                  <span className="font-bold text-emerald-800">{session?.user.role || 'Practice Administrator'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-500">Session Lifetime:</span>
                  <span className="font-mono text-gray-700">60 Minutes</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-500">Brute-Force Guard:</span>
                  <span className="font-bold text-emerald-700">Max 5 Attempts (15-min Lockout)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-500">Public Crawlers:</span>
                  <span className="font-bold text-emerald-700">Disallowed (robots.txt + noindex)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-500">Financial / Tax Data:</span>
                  <span className="font-bold text-emerald-700">Zero Collection (Non-custodial)</span>
                </div>
              </div>
            </div>

            {/* Architecture Disclosure & Production Roadmap */}
            <div className="bg-[#0A2F24] text-white p-6 rounded-2xl border border-emerald-900 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-emerald-800/80">
                <Database className="w-5 h-5 text-gold" />
                <h3 className="text-sm font-bold text-white">Current Architecture & Scope</h3>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed">
                This dashboard uses an isolated, high-performance browser persistence layer (<code className="text-gold">localStorage + BroadcastChannel</code>).
                All public form enquiries and content customizations persist across browser sessions on this machine and update the public website reactively without delay.
              </p>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs space-y-2">
                <div className="font-bold text-gold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Full Multi-User Cloud CMS Upgrade Roadmap:
                </div>
                <p className="text-[11px] text-gray-300 leading-relaxed">
                  For cross-device synchronization where multiple partners edit content or read enquiries from different phones/laptops simultaneously, a dedicated cloud backend is recommended:
                </p>
                <ul className="text-[11px] text-gray-300 list-disc list-inside space-y-1">
                  <li><strong>Option A (Supabase / PostgreSQL):</strong> ₹1,500 – ₹2,500/mo cloud hosting + auth.</li>
                  <li><strong>Option B (Serverless Node / Firebase):</strong> ₹800 – ₹1,500/mo.</li>
                </ul>
                <div className="text-[10px] text-emerald-300 pt-1">
                  Fits within future expansion scope while maintaining the current budget for static deployment.
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </AdminLayout>
  );
};
