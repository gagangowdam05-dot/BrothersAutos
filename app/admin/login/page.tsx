'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Car, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  KeyRound
} from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawFrom = searchParams.get('from');
  const destination = (rawFrom && !rawFrom.includes('/admin/login')) ? rawFrom : '/admin';

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter your administrator password.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: password.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Check your password.');
      }

      setSuccess(true);
      // Immediately perform a full browser navigation to load the admin dashboard with the new session cookie
      window.location.href = destination;
    } catch (err: any) {
      setError(err.message || 'Incorrect password. Access denied.');
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
              Dealer Portal
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Brothers Autos Admin
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Authorized personnel only &bull; Secure vehicle management
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
            <span>Authentication verified. Redirecting to dashboard...</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label 
              htmlFor="admin-password" 
              className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2"
            >
              Master Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                disabled={loading || success}
                autoFocus
                className="w-full pl-10 pr-11 py-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
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

          <button
            type="submit"
            onClick={() => {
              if (success) {
                window.location.href = destination;
              }
            }}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 active:scale-[0.99] transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Verifying Access...</span>
              </>
            ) : success ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Access Granted &bull; Entering Dashboard...</span>
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Sign In to Dashboard</span>
              </>
            )}
          </button>
        </form>

        {/* Security Note / Environment Notice */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-400">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Secured via <code className="text-amber-300 font-mono">ADMIN_PASSWORD</code> in <code className="text-slate-300 font-mono">.env</code></span>
          </div>
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
