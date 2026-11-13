import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Sparkles, 
  Clock, 
  Cloud, 
  AlertCircle,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  Check,
  X,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { adminStorage } from '../../services/adminStorage';
import { useFirmData } from '../../context/FirmDataContext';
import { isSafeUrl } from '../../lib/markdown';
import { ADMIN_ROUTES } from '../../config/adminConfig';

export const AdminSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: firmData, isModified } = useFirmData();
  const session = adminStorage.getSession();

  // Active tab state: 'channels' | 'security'
  const [activeTab, setActiveTab] = useState<'channels' | 'security'>(() => {
    return window.location.search.includes('tab=security') ? 'security' : 'channels';
  });

  // Settings form states
  const [primaryPhone, setPrimaryPhone] = useState(firmData.contact.primaryPhone);
  const [secondaryPhone, setSecondaryPhone] = useState(firmData.contact.secondaryPhone || '');
  const [email, setEmail] = useState(firmData.contact.email);
  const [primaryLocation, setPrimaryLocation] = useState(firmData.contact.primaryLocation);
  const [googleMapsUrl, setGoogleMapsUrl] = useState(firmData.contact.googleMapsUrl);
  const [whatsappLink, setWhatsappLink] = useState(firmData.contact.whatsappLink);
  const [openingHours, setOpeningHours] = useState('Mon - Sat: 9:30 AM - 7:30 PM | Sun: Closed / Prior Appointment Only');

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const isCloud = adminStorage.isCloudConnected();

  // Password change form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState<string | null>(null);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<string | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);

  // Live checklist criteria
  const hasMinLength = newPassword.length >= 12;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const hasMatch = Boolean(newPassword && confirmPassword && newPassword === confirmPassword);

  const criteriaCount = [hasMinLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
  
  const getStrengthLabel = () => {
    if (!newPassword) return { label: 'Not Entered', color: 'text-gray-400', bg: 'bg-gray-200', percent: 0 };
    if (criteriaCount <= 2) return { label: 'Weak', color: 'text-red-600', bg: 'bg-red-500', percent: 25 };
    if (criteriaCount <= 4) return { label: 'Moderate', color: 'text-amber-600', bg: 'bg-amber-500', percent: 65 };
    return { label: 'Strong', color: 'text-emerald-700', bg: 'bg-emerald-600', percent: 100 };
  };

  const strength = getStrengthLabel();

  useEffect(() => {
    adminStorage.fetchSettingsRemote().then((remote) => {
      if (remote.openingHours) {
        setOpeningHours(remote.openingHours);
      }
    });
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const cleanMapsUrl = googleMapsUrl.trim();
    const cleanWhatsapp = whatsappLink.trim();

    if (cleanMapsUrl && !isSafeUrl(cleanMapsUrl)) {
      setValidationError('Invalid Google Maps URL. Only safe web protocols (https://) are permitted.');
      return;
    }

    if (cleanWhatsapp && !isSafeUrl(cleanWhatsapp)) {
      setValidationError('Invalid WhatsApp Link. Only safe web protocols (https://) are permitted.');
      return;
    }

    const ok = adminStorage.saveSettingsOverrides({
      primaryPhone: primaryPhone.trim(),
      secondaryPhone: secondaryPhone.trim(),
      email: email.trim(),
      primaryLocation: primaryLocation.trim(),
      googleMapsUrl: cleanMapsUrl,
      whatsappLink: cleanWhatsapp,
      openingHours: openingHours.trim(),
    });

    if (ok) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    }
  };

  const handleResetSettings = () => {
    if (window.confirm('Reset all practice contact information to original baseline?')) {
      setValidationError(null);
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
        setOpeningHours('Mon - Sat: 9:30 AM - 7:30 PM | Sun: Closed / Prior Appointment Only');
      }, 100);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordErrorMessage(null);
    setPasswordSuccessMessage(null);

    const cleanCurrent = currentPassword.trim();
    const cleanNew = newPassword.trim();
    const cleanConfirm = confirmPassword.trim();

    if (!cleanCurrent) {
      setPasswordErrorMessage('Please enter your current access password.');
      return;
    }

    if (!cleanNew) {
      setPasswordErrorMessage('Please enter a new password.');
      return;
    }

    if (!hasMinLength || !hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      setPasswordErrorMessage('New password must satisfy all 5 complexity criteria (at least 12 characters, uppercase, lowercase, number, and special symbol).');
      return;
    }

    if (cleanNew !== cleanConfirm) {
      setPasswordErrorMessage('New password and confirmation password do not match.');
      return;
    }

    if (cleanCurrent === cleanNew) {
      setPasswordErrorMessage('New password must be different from your current password.');
      return;
    }

    setPasswordChangeLoading(true);

    try {
      const res = await adminStorage.changePassword(cleanCurrent, cleanNew);
      if (res.success) {
        setPasswordSuccessMessage(res.message || 'Password updated successfully with PBKDF2-SHA512. All existing sessions have been terminated.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setRedirectCountdown(3);

        let remaining = 3;
        const intervalId = setInterval(() => {
          remaining -= 1;
          if (remaining <= 0) {
            clearInterval(intervalId);
            navigate(ADMIN_ROUTES.login);
          } else {
            setRedirectCountdown(remaining);
          }
        }, 1000);
      } else {
        setPasswordErrorMessage(res.error || 'Failed to update password. Please check your credentials.');
      }
    } catch (err) {
      setPasswordErrorMessage((err as Error).message || 'A network error occurred while updating password.');
    } finally {
      setPasswordChangeLoading(false);
    }
  };

  return (
    <AdminLayout 
      title="Practice Settings & Channels" 
      subtitle="Manage chambers contact information, official emails, phone channels, and review infrastructure configuration."
    >
      <div className="space-y-6">

        {/* Tab Navigation Controls */}
        <div className="flex border-b border-gray-200 gap-6">
          <button
            type="button"
            onClick={() => {
              setActiveTab('channels');
              window.history.replaceState(null, '', window.location.pathname);
            }}
            className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'channels'
                ? 'border-brand-darkgreen text-brand-darkgreen'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Phone className="w-4 h-4" /> Practice Channels & Info
          </button>
          
          <button
            type="button"
            onClick={() => {
              setActiveTab('security');
              window.history.replaceState(null, '', `${window.location.pathname}?tab=security`);
            }}
            className={`pb-3 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'security'
                ? 'border-brand-darkgreen text-brand-darkgreen'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <Lock className="w-4 h-4" /> Account & Security
          </button>
        </div>

        {/* =========================================================================
            TAB 1: PRACTICE CHANNELS & INFO
            ========================================================================= */}
        {activeTab === 'channels' && (
          <div className="space-y-8 animate-in fade-in">
            {/* Success Notification */}
            {saveSuccess && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-brand-darkgreen flex items-center justify-between shadow-sm animate-in fade-in">
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

            {/* Validation Error Notification */}
            {validationError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-800 flex items-center gap-2 shadow-sm animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* 1. CONTACT & PRACTICE DETAILS FORM (Col 7) */}
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-xl border border-[#EAEAEA]">
                <div className="pb-4 border-b border-gray-100 mb-6 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h2 className="text-base font-bold text-brand-darkgreen">Official Contact Channels</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      These channels appear across the public navbar, footer, contact page, and WhatsApp button
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isCloud ? (
                      <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <Cloud className="w-3 h-3 text-emerald-600" /> Cloud Synced
                      </span>
                    ) : (
                      <span className="text-[10px] bg-gray-100 text-gray-700 border border-gray-200 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <Database className="w-3 h-3 text-gray-500" /> Local Mode
                      </span>
                    )}
                    {isModified && (
                      <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full font-bold">
                        Customized
                      </span>
                    )}
                  </div>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-brand-darkgreen" />
                        Primary Phone Channel
                      </label>
                      <input
                        type="text"
                        required
                        value={primaryPhone}
                        onChange={(e) => setPrimaryPhone(e.target.value)}
                        placeholder="+91 96263 50900"
                        className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-darkgreen/20 focus:border-brand-darkgreen font-medium"
                      />
                      <span className="text-[10px] text-gray-400 mt-1 block">Displayed on public header and quick call</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-brand-darkgreen" />
                        Secondary Phone Channel
                      </label>
                      <input
                        type="text"
                        value={secondaryPhone}
                        onChange={(e) => setSecondaryPhone(e.target.value)}
                        placeholder="+91 95421 53906"
                        className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-darkgreen/20 focus:border-brand-darkgreen font-medium"
                      />
                      <span className="text-[10px] text-gray-400 mt-1 block">Alternative office landline or mobile</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-brand-darkgreen" />
                      Practice Official Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="cakavithasrj@gmail.com"
                      className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-darkgreen/20 focus:border-brand-darkgreen font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-brand-darkgreen" />
                      Chambers Working Hours & Appointments
                    </label>
                    <input
                      type="text"
                      required
                      value={openingHours}
                      onChange={(e) => setOpeningHours(e.target.value)}
                      placeholder="Mon - Sat: 9:30 AM - 7:30 PM | Sun: Closed / Prior Appointment Only"
                      className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-darkgreen/20 focus:border-brand-darkgreen font-medium"
                    />
                    <span className="text-[10px] text-gray-400 mt-1 block">Standard consultation timings in Tirupati chambers</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-brand-darkgreen" />
                      Chambers Physical Address
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={primaryLocation}
                      onChange={(e) => setPrimaryLocation(e.target.value)}
                      placeholder="19-12-46, 1st Floor, Near Bairagipetteda Arch, Tirupati, Andhra Pradesh 517501, India"
                      className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-darkgreen/20 focus:border-brand-darkgreen leading-relaxed font-medium"
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
                      className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-darkgreen/20 focus:border-brand-darkgreen font-mono text-[11px]"
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
                      className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-darkgreen/20 focus:border-brand-darkgreen font-mono text-[11px]"
                    />
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleResetSettings}
                      className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-red-700 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                      Reset to Baseline
                    </button>

                    <button
                      type="submit"
                      className="inline-flex items-center px-5 py-2.5 bg-brand-darkgreen hover:bg-brand-chambers text-white text-xs font-bold rounded-xl transition-colors duration-200 shadow-sm"
                    >
                      <Save className="w-3.5 h-3.5 mr-1.5" />
                      Save Practice Settings
                    </button>
                  </div>
                </form>
              </div>

              {/* 2. ARCHITECTURE & SECURITY LEDGER (Col 5) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white p-6 rounded-xl border border-[#EAEAEA] space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                    <Shield className="w-5 h-5 text-brand-darkgreen" />
                    <h3 className="text-sm font-bold text-brand-darkgreen">Security & Session Specs</h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <span className="text-gray-500">Database Engine:</span>
                      <span className="font-bold text-gray-900">
                        {isCloud ? 'Supabase Postgres (Cloud DB)' : 'Local Persistent KV (Browser)'}
                      </span>
                    </div>
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
                      <span className="text-gray-500">Row Level Security:</span>
                      <span className="font-bold text-emerald-700">Enforced on all tables</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <span className="text-gray-500">Public Crawlers:</span>
                      <span className="font-bold text-emerald-700">Disallowed (robots.txt + noindex)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <span className="text-gray-500">Tax / Financial Data:</span>
                      <span className="font-bold text-emerald-700">Zero Collection (Non-custodial)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-brand-chambers text-white p-6 rounded-2xl border border-emerald-900 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-emerald-800/80">
                    <Database className="w-5 h-5 text-gold" />
                    <h3 className="text-sm font-bold text-white">Database Migration & Config</h3>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed">
                    The CMS includes a complete production migration script:
                    <code className="text-gold block mt-1 font-mono text-[11px] bg-black/30 p-1.5 rounded">
                      supabase/migrations/20261029000000_init_schema.sql
                    </code>
                  </p>

                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs space-y-2">
                    <div className="font-bold text-gold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Supabase Connecting Steps:
                    </div>
                    <ol className="text-[11px] text-gray-300 list-decimal list-inside space-y-1">
                      <li>Create a free project at <a href="https://supabase.com" target="_blank" rel="noreferrer" className="underline text-gold">supabase.com</a>.</li>
                      <li>Paste <code className="text-emerald-300">supabase/schema.sql</code> into the Supabase SQL Editor and click Run.</li>
                      <li>Copy Project URL and Anon Key into <code className="text-emerald-300">.env</code>.</li>
                      <li>Deploy to Netlify or Cloudflare Pages.</li>
                    </ol>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: ACCOUNT & SECURITY (SELF-SERVICE PASSWORD CHANGE)
            ========================================================================= */}
        {activeTab === 'security' && (
          <div className="space-y-6 animate-in fade-in">

            {/* Success Notification with Auto-Logout Countdown */}
            {passwordSuccessMessage && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 shadow-sm animate-in fade-in flex items-start justify-between">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">{passwordSuccessMessage}</p>
                    {redirectCountdown !== null && (
                      <p className="text-[11px] text-emerald-700 mt-1 font-mono">
                        Redirecting to administrator login in {redirectCountdown} second{redirectCountdown !== 1 ? 's' : ''}...
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(ADMIN_ROUTES.login)}
                  className="px-2.5 py-1 text-[11px] font-bold bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition-colors shrink-0 ml-3"
                >
                  Log In Now
                </button>
              </div>
            )}

            {/* Error Notification */}
            {passwordErrorMessage && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-800 flex items-center gap-2 shadow-sm animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{passwordErrorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left 7 Columns: Password Change Form */}
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-xl border border-[#EAEAEA] space-y-6">
                <div className="pb-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h2 className="text-base font-bold text-brand-darkgreen flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-brand-darkgreen" />
                      Update Access Password
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Changing your password will revoke all existing sessions across devices. You will be required to log in again.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full font-bold">
                    PBKDF2-SHA512
                  </span>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-5">
                  
                  {/* Field 1: Current Password */}
                  <div>
                    <label 
                      htmlFor="currentPassword" 
                      className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider"
                    >
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        id="currentPassword"
                        name="currentPassword"
                        type={showCurrentPassword ? 'text' : 'password'}
                        required
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter your current access password"
                        autoComplete="current-password"
                        className="w-full text-xs p-3 pr-10 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-darkgreen/20 focus:border-brand-darkgreen font-mono text-[11px]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1"
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Field 2: New Password */}
                  <div>
                    <label 
                      htmlFor="newPassword" 
                      className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        id="newPassword"
                        name="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new strong password"
                        autoComplete="new-password"
                        className="w-full text-xs p-3 pr-10 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-darkgreen/20 focus:border-brand-darkgreen font-mono text-[11px]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Live Strength Indicator */}
                    {newPassword && (
                      <div className="mt-2 space-y-1 animate-in fade-in">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-gray-500 font-medium">Password Strength:</span>
                          <span className={`font-bold ${strength.color}`}>{strength.label}</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${strength.bg} transition-all duration-300`} 
                            style={{ width: `${strength.percent}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Field 3: Confirm New Password */}
                  <div>
                    <label 
                      htmlFor="confirmPassword" 
                      className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider"
                    >
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password to confirm"
                        autoComplete="new-password"
                        className="w-full text-xs p-3 pr-10 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-darkgreen/20 focus:border-brand-darkgreen font-mono text-[11px]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-1"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {confirmPassword && (
                      <span className={`text-[10px] mt-1 block font-medium flex items-center gap-1 ${
                        hasMatch ? 'text-emerald-700' : 'text-red-600'
                      }`}>
                        {hasMatch ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        {hasMatch ? 'Passwords match' : 'Passwords do not match'}
                      </span>
                    )}
                  </div>

                  {/* Live Requirements Checklist */}
                  <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2.5">
                    <span className="text-[11px] font-bold text-neutral-800 uppercase tracking-wider block">
                      Live Security Requirements
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <li className={`flex items-center gap-1.5 transition-colors ${hasMinLength ? 'text-emerald-700 font-semibold' : 'text-neutral-500'}`}>
                        {hasMinLength ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <span className="w-3.5 h-3.5 rounded-full border border-neutral-300 inline-block shrink-0" />}
                        <span>At least 12 characters</span>
                      </li>
                      <li className={`flex items-center gap-1.5 transition-colors ${hasUpper ? 'text-emerald-700 font-semibold' : 'text-neutral-500'}`}>
                        {hasUpper ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <span className="w-3.5 h-3.5 rounded-full border border-neutral-300 inline-block shrink-0" />}
                        <span>Uppercase letter (A–Z)</span>
                      </li>
                      <li className={`flex items-center gap-1.5 transition-colors ${hasLower ? 'text-emerald-700 font-semibold' : 'text-neutral-500'}`}>
                        {hasLower ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <span className="w-3.5 h-3.5 rounded-full border border-neutral-300 inline-block shrink-0" />}
                        <span>Lowercase letter (a–z)</span>
                      </li>
                      <li className={`flex items-center gap-1.5 transition-colors ${hasNumber ? 'text-emerald-700 font-semibold' : 'text-neutral-500'}`}>
                        {hasNumber ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <span className="w-3.5 h-3.5 rounded-full border border-neutral-300 inline-block shrink-0" />}
                        <span>Numeric digit (0–9)</span>
                      </li>
                      <li className={`flex items-center gap-1.5 transition-colors ${hasSpecial ? 'text-emerald-700 font-semibold' : 'text-neutral-500'}`}>
                        {hasSpecial ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <span className="w-3.5 h-3.5 rounded-full border border-neutral-300 inline-block shrink-0" />}
                        <span>Special symbol (!@#$%^&*)</span>
                      </li>
                      <li className={`flex items-center gap-1.5 transition-colors ${hasMatch ? 'text-emerald-700 font-semibold' : 'text-neutral-500'}`}>
                        {hasMatch ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <span className="w-3.5 h-3.5 rounded-full border border-neutral-300 inline-block shrink-0" />}
                        <span>Passwords match</span>
                      </li>
                    </ul>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex items-center justify-end">
                    <button
                      type="submit"
                      disabled={passwordChangeLoading || !hasMinLength || !hasUpper || !hasLower || !hasNumber || !hasSpecial || !hasMatch || !currentPassword}
                      className="inline-flex items-center px-6 py-2.5 bg-brand-darkgreen hover:bg-brand-chambers disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl transition-colors duration-200 shadow-sm"
                    >
                      <Lock className="w-3.5 h-3.5 mr-1.5" />
                      {passwordChangeLoading ? 'Updating Password...' : 'Update Password & Re-authenticate'}
                    </button>
                  </div>

                </form>
              </div>

              {/* Right 5 Columns: Security Ledger & Account Identity */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Authenticated Account Card */}
                <div className="bg-white p-6 rounded-xl border border-[#EAEAEA] space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                    <UserCheck className="w-5 h-5 text-brand-darkgreen" />
                    <h3 className="text-sm font-bold text-brand-darkgreen">Active Administrator Session</h3>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <span className="text-gray-500">Account Identity:</span>
                      <span className="font-mono font-bold text-gray-900">{session?.user.username || 'admin'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <span className="text-gray-500">Display Name:</span>
                      <span className="font-bold text-gray-900">{session?.user.displayName || 'Authorized Admin'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <span className="text-gray-500">Clearance Tier:</span>
                      <span className="font-bold text-emerald-800">{session?.user.role || 'Practice Administrator'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <span className="text-gray-500">Session Status:</span>
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active (Token Authenticated)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cryptographic Architecture Card */}
                <div className="bg-brand-chambers text-white p-6 rounded-2xl border border-emerald-900 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-emerald-800/80 border-b">
                    <ShieldCheck className="w-5 h-5 text-gold" />
                    <h3 className="text-sm font-bold text-white">Cryptographic Safeguards</h3>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed">
                    Credentials are protected using industry-standard zero-knowledge cryptographic safeguards:
                  </p>

                  <ul className="text-[11px] text-gray-300 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-gold font-bold">•</span>
                      <span><strong>PBKDF2-HMAC-SHA512:</strong> 100,000 computational rounds applied with a high-entropy 16-byte random salt.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold font-bold">•</span>
                      <span><strong>Distributed Revocation:</strong> Instant revocation epoch invalidates all existing JWT session tokens across all serverless instances.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold font-bold">•</span>
                      <span><strong>Constant-Time Verification:</strong> Mitigates side-channel timing attacks during password validation.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gold font-bold">•</span>
                      <span><strong>Zero Plaintext Storage:</strong> Plaintext passwords are never stored, logged, or serialized to responses.</span>
                    </li>
                  </ul>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};
