import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  AlertCircle, 
  ArrowLeft, 
  KeyRound, 
  Mail, 
  CheckCircle2, 
  Database,
  Cloud 
} from 'lucide-react';
import { adminStorage } from '../../services/adminStorage';
import { SEOHead } from '../../components/SEOHead';

export const AdminLoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password Reset Modal states
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState<{ loading: boolean; message?: string; success?: boolean }>({
    loading: false,
  });

  const navigate = useNavigate();
  const location = useLocation();

  const isCloud = adminStorage.isCloudConnected();

  // Redirect target after successful login
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await adminStorage.authenticateAsync(username, password);
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setError(res.error || 'Authentication failed. Please verify credentials.');
      }
    } catch {
      setError('An unexpected error occurred during authentication.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetStatus({ loading: true });

    try {
      const res = await adminStorage.requestPasswordReset(resetEmail);
      setResetStatus({
        loading: false,
        success: res.success,
        message: res.message,
      });
    } catch (err) {
      setResetStatus({
        loading: false,
        success: false,
        message: (err as Error).message || 'Failed to dispatch password reset request.',
      });
    }
  };

  const handlePreFill = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F4] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-brand-pale selection:text-brand-primary">
      <SEOHead title="Admin Login — Practice Console" description="Authorized Administrative Access" noIndex={true} />

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Return to Public Website */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center text-xs font-semibold text-[#0F3E2E] hover:text-[#C5A059] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Return to Public Website
          </Link>

          {isCloud ? (
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full font-bold">
              <Cloud className="w-3 h-3 text-emerald-700" /> Supabase DB Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] text-gray-600 bg-gray-200/70 px-2 py-0.5 rounded-full font-semibold">
              <Database className="w-3 h-3 text-gray-500" /> Local Storage Mode
            </span>
          )}
        </div>

        {/* Firm Crest & Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0A2F24] border-2 border-[#C5A059] shadow-lg mb-4">
            <span className="font-serif text-2xl font-bold text-[#C5A059]">KA</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A2F24] tracking-tight">
            Kavitha & Associates
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#5A7368] font-bold mt-1">
            Practice Management Console
          </p>
        </div>

        {/* Login Box */}
        <div className="mt-8 bg-white py-8 px-6 sm:px-10 shadow-card rounded-2xl border border-gray-200/80">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
            <Lock className="w-5 h-5 text-[#0F3E2E]" />
            <div>
              <h2 className="text-base font-bold text-[#0F3E2E]">Authorized Partner Login</h2>
              <p className="text-xs text-gray-500">Sign in to manage enquiries and published practice data</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                Username / Email ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. kavitha or cakavithasrj@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0F3E2E]/20 focus:border-[#0F3E2E] transition-all bg-gray-50/50"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                  Access Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowResetModal(true)}
                  className="text-xs text-[#0F3E2E] hover:text-gold font-semibold transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter security password"
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0F3E2E]/20 focus:border-[#0F3E2E] transition-all bg-gray-50/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#0F3E2E] hover:bg-[#0A2F24] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0F3E2E] transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Authenticating Session...' : 'Enter Practice Dashboard →'}
              </button>
            </div>
          </form>

          {/* Quick Demo Pre-Fill Buttons for Evaluation (Development / QA Mode Only) */}
          {import.meta.env.DEV && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  Evaluation Test Credentials (Dev Only):
                </span>
                <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Authorized Client Profiles
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-left">
                <button
                  type="button"
                  onClick={() => handlePreFill('kavitha', 'Tirupati@CA2026')}
                  className="p-2.5 rounded-lg border border-gray-200 hover:border-[#0F3E2E] hover:bg-emerald-50/50 text-left transition-all group"
                >
                  <div className="text-xs font-bold text-[#0F3E2E] group-hover:text-emerald-900">
                    CA Kavitha Vijay
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono mt-0.5">kavitha</div>
                </button>
                <button
                  type="button"
                  onClick={() => handlePreFill('admin', 'KavithaAssoc#2026')}
                  className="p-2.5 rounded-lg border border-gray-200 hover:border-[#0F3E2E] hover:bg-emerald-50/50 text-left transition-all group"
                >
                  <div className="text-xs font-bold text-[#0F3E2E] group-hover:text-emerald-900">
                    Practice Admin
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono mt-0.5">admin</div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Security Policy Badge */}
        <div className="mt-6 text-center text-xs text-gray-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span>Restricted Portal • Row Level Security • 15-Min Lockout Protection</span>
        </div>
      </div>

      {/* =========================================================================
          PASSWORD RECOVERY MODAL
          ========================================================================= */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-200">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
              <Mail className="w-5 h-5 text-[#0F3E2E]" />
              <h3 className="text-base font-bold text-[#0F3E2E]">Password Recovery</h3>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              Enter your registered practice email address. When connected to Supabase Auth, a secure password recovery link will be dispatched to your inbox.
            </p>

            {resetStatus.message && (
              <div className={`mb-4 p-3.5 rounded-xl text-xs flex items-start gap-2 ${
                resetStatus.success 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {resetStatus.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                )}
                <div className="leading-relaxed">{resetStatus.message}</div>
              </div>
            )}

            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Registered Email Address:
                </label>
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="e.g. cakavithasrj@gmail.com"
                  className="w-full text-xs p-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#0F3E2E]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowResetModal(false);
                    setResetStatus({ loading: false });
                  }}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resetStatus.loading}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#0F3E2E] hover:bg-[#0A2F24] rounded-xl transition-all disabled:opacity-50"
                >
                  {resetStatus.loading ? 'Dispatching...' : 'Send Recovery Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
