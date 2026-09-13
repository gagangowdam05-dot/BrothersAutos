'use client';

import React, { useState, Suspense } from 'react';
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
  Sparkles,
  KeyRound,
  Building2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const DEMO_ACCOUNTS = [
  {
    role: 'ADMIN',
    name: 'Super Admin (All Dealerships)',
    phone: '9876543210',
    password: 'Admin@1234',
    badge: 'Full Access',
  },
  {
    role: 'DEALER',
    name: 'Brothers Central Hub (Andheri)',
    phone: '9820011223',
    password: 'Dealer@123',
    badge: 'Dealer 1',
  },
  {
    role: 'DEALER',
    name: 'Apex Motors (Bandra West)',
    phone: '9820022334',
    password: 'Dealer@123',
    badge: 'Dealer 2',
  },
  {
    role: 'DEALER',
    name: 'Prestige Wheels (South Mumbai)',
    phone: '9820033445',
    password: 'Dealer@123',
    badge: 'Dealer 3',
  },
  {
    role: 'DEALER',
    name: 'Royal Auto Plaza (Thane)',
    phone: '9820044556',
    password: 'Dealer@123',
    badge: 'Dealer 4',
  },
  {
    role: 'DEALER',
    name: 'Urban Drive Dealership (Navi Mumbai)',
    phone: '9820055667',
    password: 'Dealer@123',
    badge: 'Dealer 5',
  },
  {
    role: 'DEALER',
    name: 'Elite Pre-Owned Hub (Worli)',
    phone: '9820066778',
    password: 'Dealer@123',
    badge: 'Dealer 6',
  },
];

function LoginForm() {
  const searchParams = useSearchParams();
  const rawFrom = searchParams.get('from');
  const destination = (rawFrom && !rawFrom.includes('/admin/login')) ? rawFrom : '/admin';

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits, max 10 chars
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(val);
    if (error) setError(null);
  };

  const handleSelectDemo = (account: typeof DEMO_ACCOUNTS[0]) => {
    setPhone(account.phone);
    setPassword(account.password);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone.trim()) {
      setError('Please enter your 10-digit registered mobile number.');
      return;
    }

    if (phone.length !== 10) {
      setError('Mobile number must be exactly 10 digits (e.g. 9820011223).');
      return;
    }

    if (!password.trim()) {
      setError('Please enter your account password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phone.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Please check your mobile number and password.');
      }

      setSuccess(true);
      // Full browser navigation to ensure new session cookie is utilized
      window.location.href = destination;
    } catch (err: any) {
      setError(err.message || 'Incorrect mobile number or password.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Decorative Brand Card */}
      <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl rounded-2xl shadow-2xl p-8 sm:p-10 relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20 mb-4 ring-4 ring-amber-400/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Multi-Dealer Portal
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Brothers Autos Admin
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Authorized personnel only &bull; Individual dealer credentials
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-6 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-200 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Identity verified. Entering Dealer Dashboard...</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mobile Number Input */}
          <div>
            <label 
              htmlFor="dealer-phone" 
              className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
            >
              Registered Mobile Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 font-bold text-xs">
                <span className="text-slate-400 mr-1">+91</span>
                <Phone className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <input
                id="dealer-phone"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={10}
                value={phone}
                onChange={handlePhoneChange}
                placeholder="10-digit number (e.g. 9820011223)"
                disabled={loading || success}
                autoFocus
                className="w-full pl-16 pr-4 py-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all disabled:opacity-50"
              />
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">
              {phone.length}/10 digits entered
            </span>
          </div>

          {/* Password Input */}
          <div>
            <label 
              htmlFor="dealer-password" 
              className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
            >
              Account Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="dealer-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your account password"
                disabled={loading || success}
                className="w-full pl-10 pr-11 py-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 active:scale-[0.99] transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : success ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Access Granted &bull; Entering Portal...</span>
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Sign In to Dealer Portal</span>
              </>
            )}
          </button>
        </form>

        {/* 1-Click Demo Accounts Selector */}
        <div className="mt-6 pt-4 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => setShowDemoAccounts(!showDemoAccounts)}
            className="w-full flex items-center justify-between text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors py-1 cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Quick Test: Select Demo Account ({DEMO_ACCOUNTS.length})</span>
            </span>
            {showDemoAccounts ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showDemoAccounts && (
            <div className="mt-3 space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {DEMO_ACCOUNTS.map((acc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectDemo(acc)}
                  className="w-full text-left p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="truncate pr-2">
                    <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                      {acc.name}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      {acc.phone} &bull; <span className="text-slate-500">{acc.password}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                    acc.role === 'ADMIN'
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                      : 'bg-blue-400/20 text-blue-300 border border-blue-400/40'
                  }`}>
                    {acc.badge}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Back to Public Site */}
      <div className="text-center mt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Public Showroom</span>
        </Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-950 bg-radial-pattern">
      <Suspense fallback={
        <div className="text-center text-slate-400 text-xs">
          Loading authentication portal...
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
