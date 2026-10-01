// src/components/AuthPage.tsx
// Beautiful Firebase-powered Login / Register / Password Reset page

import React, { useState } from 'react';
import { Activity, Mail, Lock, User, Eye, EyeOff, AlertCircle, Loader2, Chrome } from 'lucide-react';
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  resetPassword,
} from '../firebase/authService';

type AuthMode = 'login' | 'register' | 'forgot';

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]         = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  const clearMessages = () => { setError(''); setSuccess(''); };

  const friendlyError = (code: string): string => {
    const map: Record<string, string> = {
      'auth/email-already-in-use':   'An account with this email already exists.',
      'auth/invalid-email':          'Please enter a valid email address.',
      'auth/user-not-found':         'No account found with this email.',
      'auth/wrong-password':         'Incorrect password. Please try again.',
      'auth/weak-password':          'Password must be at least 6 characters.',
      'auth/too-many-requests':      'Too many attempts. Please wait a moment.',
      'auth/popup-closed-by-user':   'Google sign-in was cancelled.',
      'auth/network-request-failed': 'Network error. Check your connection.',
    };
    return map[code] ?? 'Something went wrong. Please try again.';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    setLoading(true);
    try {
      if (mode === 'register') {
        if (!name.trim()) { setError('Please enter your name.'); return; }
        await signUpWithEmail(email, password, name.trim());
      } else if (mode === 'login') {
        await signInWithEmail(email, password);
      } else {
        await resetPassword(email);
        setSuccess('Password reset email sent! Check your inbox.');
      }
    } catch (err: any) {
      setError(friendlyError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    clearMessages();
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(friendlyError(err.code));
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E0E5EC] flex items-center justify-center px-4 py-12">
      {/* Ambient glow blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-400/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-400/10 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-cyan-300/5 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-3xl bg-[#E0E5EC] shadow-[8px_8px_16px_#b8b9be,-8px_-8px_16px_#ffffff] border border-white/60 flex items-center justify-center mb-4">
            <Activity className="w-8 h-8 text-blue-600 animate-pulse" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            AI MEDICAL <span className="text-blue-600">REPORT 3D</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">Your personal clinical intelligence platform</p>
        </div>

        {/* Card */}
        <div className="bg-[#E0E5EC] rounded-3xl shadow-[12px_12px_24px_#b8b9be,-12px_-12px_24px_#ffffff] border border-white/50 p-8">
          {/* Mode Tabs */}
          {mode !== 'forgot' && (
            <div className="flex bg-[#E0E5EC] rounded-2xl shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] p-1.5 mb-6">
              {(['login', 'register'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); clearMessages(); }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    mode === m
                      ? 'bg-blue-600 text-white shadow-[0_4px_12px_rgba(37,99,235,0.4)]'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {m === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              ))}
            </div>
          )}

          {/* Forgot Password heading */}
          {mode === 'forgot' && (
            <div className="mb-6">
              <h2 className="text-xl font-black text-slate-900">Reset Password</h2>
              <p className="text-sm text-slate-500 mt-1">Enter your email to receive a reset link.</p>
            </div>
          )}

          {/* Error / Success messages */}
          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 mb-5 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-2xl px-4 py-3 mb-5 text-sm">
              <span className="text-base">✅</span>
              <span>{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="auth-name"
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-[#E0E5EC] shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] border border-white/40 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="auth-email"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#E0E5EC] shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] border border-white/40 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            {mode !== 'forgot' && (
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="auth-password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-[#E0E5EC] shadow-[inset_4px_4px_8px_#b8b9be,inset_-4px_-4px_8px_#ffffff] border border-white/40 rounded-2xl pl-11 pr-12 py-3.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            )}

            {mode === 'login' && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => { setMode('forgot'); clearMessages(); }}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              id="auth-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-2xl shadow-[0_6px_20px_rgba(37,99,235,0.4)] hover:shadow-[0_8px_24px_rgba(37,99,235,0.5)] transition-all flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</>
              ) : mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : 'Send Reset Link'}
            </button>
          </form>

          {/* Google Sign-In */}
          {mode !== 'forgot' && (
            <>
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-[#E0E5EC] px-3 text-slate-400 font-medium">or continue with</span>
                </div>
              </div>

              <button
                id="auth-google-btn"
                onClick={handleGoogle}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 bg-[#E0E5EC] shadow-[4px_4px_8px_#b8b9be,-4px_-4px_8px_#ffffff] hover:shadow-[6px_6px_12px_#b8b9be,-6px_-6px_12px_#ffffff] border border-white/50 rounded-2xl py-3.5 text-sm font-bold text-slate-700 transition-all disabled:opacity-60"
              >
                {googleLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {/* Google color icon */}
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>
            </>
          )}

          {/* Back link for forgot password */}
          {mode === 'forgot' && (
            <button
              onClick={() => { setMode('login'); clearMessages(); }}
              className="mt-4 w-full text-center text-sm text-blue-600 hover:text-blue-700 font-semibold"
            >
              ← Back to Sign In
            </button>
          )}
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          By signing in you agree to our Terms of Service & Privacy Policy.
        </p>
      </div>
    </div>
  );
}
