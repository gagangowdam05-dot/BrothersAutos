'use client';

import React, { useState, Suspense, useId } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Phone,
  AlertCircle, 
  CheckCircle2, 
  KeyRound
} from 'lucide-react';

// Strict Indian 10-digit mobile number regex (starts with 6-9)
const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

function LoginForm() {
  const searchParams = useSearchParams();
  const rawFrom = searchParams.get('from');
  // Prevent open redirect attacks by ensuring destination is a relative path starting with /admin
  const destination = (rawFrom && rawFrom.startsWith('/admin') && !rawFrom.includes('/admin/login')) 
    ? rawFrom 
    : '/admin';

  // Login State
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Accessibility IDs
  const phoneInputId = useId();
  const phoneHintId = useId();
  const passwordInputId = useId();
  const errorAlertId = useId();

  // Sanitize phone input: strip non-numeric characters and cap at 10 digits
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const sanitized = rawValue.replace(/\D/g, '').slice(0, 10);
    setPhone(sanitized);
    if (error) setError(null);
  };

  // Submit Credentials (Mobile Number + Password)
  const handleSubmitCredentials = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const sanitizedPhone = phone.trim();

    // Client-side strict validation
    if (!sanitizedPhone) {
      setError('Please enter your 10-digit registered mobile number.');
      return;
    }

    if (!INDIAN_MOBILE_REGEX.test(sanitizedPhone)) {
      setError('Please enter a valid 10-digit mobile number (e.g. 98765 43210).');
      return;
    }

    if (!password || password.trim().length === 0) {
      setError('Please enter your account password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: sanitizedPhone,
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid mobile number or password.');
      }

      // Direct authentication succeeded
      setSuccess(true);
      window.location.href = destination;
    } catch (err: any) {
      setError(err.message || 'Invalid mobile number or password.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Decorative Brand Card */}
      <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl rounded-2xl shadow-2xl p-8 sm:p-10 relative overflow-hidden">
        {/* Ambient Brand Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Portal Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20 mb-4 ring-4 ring-amber-400/20">
            <ShieldCheck className="w-8 h-8" aria-hidden="true" />
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Dealer Portal
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Brothers Autos Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Authorized personnel only &bull; Secure Authentication
          </p>
        </header>

        {/* Live Accessibility Error Region */}
        {error && (
          <div 
            id={errorAlertId}
            role="alert" 
            aria-live="polite"
            className="mb-6 p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-2.5 animate-shake"
          >
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
            <span className="leading-relaxed font-medium">{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div 
            role="status"
            aria-live="polite"
            className="mb-6 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-200 text-xs flex items-center gap-2.5"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
            <span className="font-medium">Identity verified. Entering Dealer Dashboard...</span>
          </div>
        )}

        {/* Primary Login Form */}
        <form 
          onSubmit={handleSubmitCredentials} 
          noValidate 
          className="space-y-4"
        >
          {/* Mobile Number Input */}
          <div>
            <label 
              htmlFor={phoneInputId} 
              className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
            >
              Registered Mobile Number
            </label>
            <div className="relative">
              <div 
                className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 font-bold text-xs"
                aria-hidden="true"
              >
                <span className="text-slate-400 mr-1">+91</span>
                <Phone className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <input
                id={phoneInputId}
                name="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                maxLength={10}
                value={phone}
                onChange={handlePhoneChange}
                placeholder="10-digit number (e.g. 98765 43210)"
                disabled={loading || success}
                aria-required="true"
                aria-describedby={`${phoneHintId} ${error ? errorAlertId : ''}`.trim()}
                autoFocus
                className="w-full pl-16 pr-4 py-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all disabled:opacity-50"
              />
            </div>
            <span id={phoneHintId} className="text-[11px] text-slate-400 block mt-1">
              {phone.length}/10 digits entered
            </span>
          </div>

          {/* Password Input */}
          <div>
            <label 
              htmlFor={passwordInputId} 
              className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
            >
              Account Password
            </label>
            <div className="relative">
              <div 
                className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500"
                aria-hidden="true"
              >
                <Lock className="w-4 h-4" />
              </div>
              <input
                id={passwordInputId}
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Enter your account password"
                disabled={loading || success}
                aria-required="true"
                aria-describedby={error ? errorAlertId : undefined}
                className="w-full pl-10 pr-11 py-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all disabled:opacity-50"
              />
              <button
                type="button"
                tabIndex={0}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 focus:text-amber-400 focus:outline-none transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" aria-hidden="true" />
                ) : (
                  <Eye className="w-4 h-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="dealer-login-submit"
            type="submit"
            disabled={loading || success}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 active:scale-[0.99] transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                <span>Verifying Credentials...</span>
              </>
            ) : success ? (
              <>
                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                <span>Access Granted &bull; Entering Portal...</span>
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4" aria-hidden="true" />
                <span>Sign In to Dealer Portal</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Return to Public Showroom */}
      <footer className="text-center mt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Return to Public Showroom</span>
        </Link>
      </footer>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-950 bg-radial-pattern">
      <Suspense fallback={
        <div className="text-center text-slate-400 text-xs">
          Loading authentication portal...
        </div>
      }>
        <LoginForm />
      </Suspense>
    </main>
  );
}
