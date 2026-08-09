import React, { useState } from 'react';
import { ShieldCheck, Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pan, setPan] = useState('');
  const [mobile, setMobile] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const demoEmail = 'demo@prism.invest';
  const demoPassword = 'prism2026';
  const demoPan = 'ABCDE1234F';
  const demoMobile = '9876543210';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate inputs
    if (pan.length !== 10) {
      setError('Please enter a valid 10-character PAN.');
      setIsLoading(false);
      return;
    }
    if (mobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      setIsLoading(false);
      return;
    }

    // Simulate small authentic network latency
    setTimeout(() => {
      if (email.trim().toLowerCase() === demoEmail && password === demoPassword) {
        localStorage.setItem('prism_is_logged_in', 'true');
        localStorage.setItem('prism_user_pan', pan.toUpperCase());
        localStorage.setItem('prism_user_mobile', mobile);
        onLoginSuccess();
      } else {
        setError('Invalid email or password. Please use the demo credentials provided.');
        setIsLoading(false);
      }
    }, 800);
  };

  const handleFillDemo = () => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setPan(demoPan);
    setMobile(demoMobile);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#121212] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Elegant Minimalist App branding (Wordmark alone in Fraunces, NO logo/icon next to it) */}
        <h2 className="text-4xl font-display font-black text-[#0F172A] dark:text-slate-50 tracking-tight">
          Prism
        </h2>
        <p className="mt-2 text-sm font-semibold text-[#64748B] dark:text-slate-400">
          Alternative Asset Governance & Analytics
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white dark:bg-[#1E1E1E] py-8 px-6 border border-[#E2E8F0] dark:border-slate-800 shadow-sm rounded-[24px] sm:px-10 transition-colors duration-300">
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-bold tracking-wider text-[#475569] dark:text-slate-300 uppercase">
                Email Address
              </label>
              <div className="mt-1.5 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-[#94A3B8]" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 text-sm bg-[#FAF9F6] dark:bg-[#262626] border border-[#E2E8F0] dark:border-slate-800 rounded-xl text-[#0F172A] dark:text-slate-50 placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold tracking-wider text-[#475569] dark:text-slate-300 uppercase">
                Password
              </label>
              <div className="mt-1.5 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-[#94A3B8]" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 text-sm bg-[#FAF9F6] dark:bg-[#262626] border border-[#E2E8F0] dark:border-slate-800 rounded-xl text-[#0F172A] dark:text-slate-50 placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-[#94A3B8] hover:text-[#475569]" />
                  ) : (
                    <Eye className="h-4 w-4 text-[#94A3B8] hover:text-[#475569]" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="pan" className="block text-xs font-bold tracking-wider text-[#475569] dark:text-slate-300 uppercase">
                Permanent Account Number (PAN)
              </label>
              <div className="mt-1.5 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <span className="text-xs font-bold text-[#94A3B8]">PAN</span>
                </div>
                <input
                  id="pan"
                  name="pan"
                  type="text"
                  required
                  value={pan}
                  onChange={(e) => setPan(e.target.value.toUpperCase())}
                  className="block w-full pl-12 pr-3 py-2.5 text-sm bg-[#FAF9F6] dark:bg-[#262626] border border-[#E2E8F0] dark:border-slate-800 rounded-xl text-[#0F172A] dark:text-slate-50 placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors uppercase"
                  placeholder="ABCDE1234F"
                  maxLength={10}
                />
              </div>
            </div>

            <div>
              <label htmlFor="mobile" className="block text-xs font-bold tracking-wider text-[#475569] dark:text-slate-300 uppercase">
                Mobile Number (Linked to AA)
              </label>
              <div className="mt-1.5 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <span className="text-xs font-bold text-[#94A3B8]">+91</span>
                </div>
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  className="block w-full pl-12 pr-3 py-2.5 text-sm bg-[#FAF9F6] dark:bg-[#262626] border border-[#E2E8F0] dark:border-slate-800 rounded-xl text-[#0F172A] dark:text-slate-50 placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  placeholder="9876543210"
                  maxLength={10}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-400">
                {error}
              </div>
            )}

            <div>
              {/* Login submit styled with Everyday gradient */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-md text-sm font-bold text-white bg-everyday hover:opacity-90 focus:outline-none transition-all cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Preset test credentials */}
          <div className="mt-6 border-t border-[#F1F5F9] dark:border-slate-800/80 pt-5">
            <div className="bg-blue-50/40 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-900/35 rounded-xl p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                </div>
                <div className="ml-3 w-full">
                  <h3 className="text-xs font-bold text-blue-800 dark:text-blue-300 tracking-wider uppercase">
                    Demo Credentials
                  </h3>
                  <div className="mt-2 text-xs font-semibold text-blue-700 dark:text-blue-400 space-y-1">
                    <p>Email: <span className="bg-blue-100/50 dark:bg-blue-950/40 px-1 py-0.5 rounded">{demoEmail}</span></p>
                    <p>Password: <span className="bg-blue-100/50 dark:bg-blue-950/40 px-1 py-0.5 rounded">{demoPassword}</span></p>
                  </div>
                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={handleFillDemo}
                      className="text-xs font-bold text-blue-800 dark:text-blue-300 hover:text-blue-950 dark:hover:text-blue-100 underline underline-offset-2 cursor-pointer"
                    >
                      Auto-fill demo credentials
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
