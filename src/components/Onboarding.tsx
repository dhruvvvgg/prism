import React, { useState } from 'react';
import { 
  Shield, 
  BookOpen, 
  Scale, 
  Lock, 
  ArrowRight, 
  Check, 
  Eye, 
  BarChart3, 
  Sparkles, 
  ChevronDown, 
  ChevronUp,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
import { ConsentPermissions, ConsentObject } from '../types';

interface OnboardingProps {
  onComplete: (consent: ConsentObject) => void;
  permissions: ConsentPermissions;
  setPermissions: React.Dispatch<React.SetStateAction<ConsentPermissions>>;
}

export default function Onboarding({ onComplete, permissions, setPermissions }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState<'intro' | 'persona' | 'consent'>('intro');
  const [selectedPersona, setSelectedPersona] = useState<'Rajesh' | 'Ananya'>('Rajesh');
  const [localSyncStep, setLocalSyncStep] = useState(0); // 0 = idle, 1 = handshake, 2 = fetch, 3 = analyze, 4 = done
  const [isLinking, setIsLinking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Generate default mock consent object based on current toggles
  const generateConsentObject = (): ConsentObject => {
    return {
      consentMode: permissions.analysePortfolio ? 'STORE' : 'VIEW',
      fetchType: 'PERIODIC',
      consentFrequency: 'Monthly',
      dataLife: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + ' (1 Year Expiry)',
      permissionsApproved: permissions,
      timestamp: new Date().toISOString()
    };
  };

  const [activeConsent, setActiveConsent] = useState<ConsentObject>(() => generateConsentObject());

  const handleToggle = (key: keyof ConsentPermissions) => {
    setPermissions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // -------------------------------------------------------------
  // SEAMLESS LOCAL USER ONBOARDING SYNC (NO REDIRECT, NO TABS)
  // -------------------------------------------------------------
  const handleLocalOnboardingSync = () => {
    setIsLinking(true);
    setLocalSyncStep(1);
    setErrorMessage(null);

    // Beautiful dynamic multi-step sync simulation with Signature gradient
    setTimeout(() => {
      setLocalSyncStep(2);
      setTimeout(() => {
        setLocalSyncStep(3);
        setTimeout(() => {
          setLocalSyncStep(4);
          setTimeout(() => {
            // Save selected active persona to localStorage so the app renders Rajesh/Ananya instantly
            localStorage.setItem('prism_active_persona', selectedPersona);

            // Construct secure approved local consent details
            const consentObject: ConsentObject = {
              id: "consent_" + Math.random().toString(36).substring(2, 11),
              consentMode: permissions.analysePortfolio ? 'STORE' : 'VIEW',
              fetchType: 'PERIODIC',
              consentFrequency: 'Monthly',
              dataLife: '1 Year Expiry',
              permissionsApproved: permissions,
              timestamp: new Date().toISOString()
            };

            onComplete(consentObject);
          }, 900);
        }, 1000);
      }, 1000);
    }, 900);
  };

  return (
    <div className="max-w-5xl mx-auto bg-[#FAF9F6] dark:bg-[#121212] min-h-screen pb-24 flex flex-col justify-between px-6 pt-8 transition-colors duration-300">
      <div>
        {/* Header section (Prism Wordmark in Fraunces, NO logo/icon next to it) */}
        <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 mb-12">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-display font-black text-[#0F172A] dark:text-slate-50 tracking-tight">Prism</span>
          </div>
          
          {/* Stepper indicator */}
          <div className="flex items-center space-x-2">
            <span className={`text-[10px] font-bold px-3 py-1 rounded-full transition-all ${
              currentStep === 'intro' ? 'bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900/35' : 'bg-slate-200/60 dark:bg-[#262626] text-[#64748B] dark:text-slate-400'
            }`}>
              1. Pillars
            </span>
            <span className="text-[#64748B] dark:text-slate-500 text-xs">/</span>
            <span className={`text-[10px] font-bold px-3 py-1 rounded-full transition-all ${
              currentStep === 'persona' ? 'bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900/35' : 'bg-slate-200/60 dark:bg-[#262626] text-[#64748B] dark:text-slate-400'
            }`}>
              2. Profile
            </span>
            <span className="text-[#64748B] dark:text-slate-500 text-xs">/</span>
            <span className={`text-[10px] font-bold px-3 py-1 rounded-full transition-all ${
              currentStep === 'consent' ? 'bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900/35' : 'bg-slate-200/60 dark:bg-[#262626] text-[#64748B] dark:text-slate-400'
            }`}>
              3. Consent
            </span>
          </div>
        </div>

        {currentStep === 'intro' && (
          /* ================= STEP 1: INTRO / PILLARS ================= */
          <div className="max-w-4xl mx-auto flex flex-col gap-10 py-6 animate-fadeIn">
            {/* Confident, spacious brand hero area */}
            <div className="relative overflow-hidden bg-slate-900 dark:bg-[#1E1E1E] border border-slate-800 dark:border-neutral-800 p-8 sm:p-12 rounded-[32px] text-white dark:text-slate-100 shadow-xl flex flex-col justify-between min-h-[280px]">
              <div className="max-w-xl space-y-4">
                <span className="text-xs font-bold tracking-widest text-amber-300 uppercase block">
                  Secure Alternative Investing
                </span>
                <h1 className="text-3xl sm:text-5xl font-display font-black text-white leading-none tracking-tight">
                  Understand What You Invest In.
                </h1>
                <p className="text-sm text-slate-300 leading-relaxed max-w-lg font-medium">
                  The Indian alternative assets market is fragmented. Prism brings institution-grade clarity, governance transparency, and read-only AA data control to your retail portfolio.
                </p>
              </div>
            </div>

            {/* The Four Pillars */}
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xs font-bold tracking-widest text-[#64748B] dark:text-slate-400 uppercase">
                  The Four Pillars of Secure Governance
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-4 p-6 bg-white dark:bg-[#1E1E1E] border border-[#E2E8F0] dark:border-slate-800 rounded-2xl shadow-sm transition-all hover:border-blue-200 dark:hover:border-slate-700">
                  <div className="p-3 bg-blue-50 dark:bg-[#262626] rounded-xl text-blue-600 dark:text-blue-400 mt-0.5 shrink-0">
                    <Eye className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A] dark:text-slate-100">Know what you own</h3>
                    <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1 leading-relaxed">Consolidate fragmented holdings in REITs, InvITs, and bonds onto one clean dashboard.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-6 bg-white dark:bg-[#1E1E1E] border border-[#E2E8F0] dark:border-slate-800 rounded-2xl shadow-sm transition-all hover:border-cyan-200 dark:hover:border-slate-700">
                  <div className="p-3 bg-cyan-50 dark:bg-[#262626] rounded-xl text-cyan-600 dark:text-cyan-400 mt-0.5 shrink-0">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A] dark:text-slate-100">Understand what you invest in</h3>
                    <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1 leading-relaxed">Plain-English risk explainers, taxation details, and asset breakdowns with zero fluff.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-6 bg-white dark:bg-[#1E1E1E] border border-[#E2E8F0] dark:border-slate-800 rounded-2xl shadow-sm transition-all hover:border-amber-200 dark:hover:border-slate-700">
                  <div className="p-3 bg-amber-50 dark:bg-[#262626] rounded-xl text-amber-600 dark:text-amber-400 mt-0.5 shrink-0">
                    <Scale className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A] dark:text-slate-100">Governance transparency</h3>
                    <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1 leading-relaxed">Objective governance scoring on board composition and disclosures with verifiable citations.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-6 bg-white dark:bg-[#1E1E1E] border border-[#E2E8F0] dark:border-slate-800 rounded-2xl shadow-sm transition-all hover:border-emerald-200 dark:hover:border-slate-700">
                  <div className="p-3 bg-emerald-50 dark:bg-[#262626] rounded-xl text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A] dark:text-slate-100">Your data, your control</h3>
                    <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1 leading-relaxed">Fully revocable consent. We access holdings dynamically without storing credentials.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Continue to Step 2 styled with Everyday Gradient */}
            <div className="text-center pt-4">
              <button
                onClick={() => setCurrentStep('persona')}
                className="w-full max-w-sm py-4 px-6 bg-everyday text-white rounded-full font-bold text-sm flex items-center justify-center space-x-2 hover:opacity-90 transition-all shadow-md mx-auto cursor-pointer"
              >
                <span>Select Portfolio Profile</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <p className="text-[10px] text-[#A8A29E] mt-3">
                Step 1 of 3 — Choose your starting investment profile next.
              </p>
            </div>
          </div>
        )}

        {currentStep === 'persona' && (
          /* ================= STEP 2: PROFILE SELECTION ================= */
          <div className="max-w-3xl mx-auto flex flex-col gap-6 py-4 animate-fadeIn">
            <button
              onClick={() => setCurrentStep('intro')}
              className="self-start text-xs font-bold text-[#64748B] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-slate-100 flex items-center space-x-1 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Introduction</span>
            </button>

            <div className="text-center space-y-2 mb-2">
              <h2 className="text-2xl font-display font-black text-[#0F172A] dark:text-slate-50 tracking-tight">
                Choose Your Investment Profile
              </h2>
              <p className="text-xs text-[#64748B] dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Prism uses deep, structured static persona datasets to simulate real Indian investor contexts. Select a profile to populate your analytics environment.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {/* Profile A: Rajesh (Conservative) */}
              <div 
                onClick={() => setSelectedPersona('Rajesh')}
                className={`p-6 rounded-[24px] border transition-all cursor-pointer text-left flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  selectedPersona === 'Rajesh' 
                    ? 'bg-blue-50/20 dark:bg-blue-950/10 border-blue-500 ring-2 ring-blue-500/10 shadow-md' 
                    : 'bg-white dark:bg-[#1E1E1E] border-[#E2E8F0] dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl mt-0.5 ${selectedPersona === 'Rajesh' ? 'bg-blue-600 text-white' : 'bg-[#F1F5F9] dark:bg-[#262626] text-[#64748B] dark:text-slate-400'}`}>
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-extrabold text-[#0F172A] dark:text-slate-100">Rajesh (Conservative)</h3>
                      {selectedPersona === 'Rajesh' && (
                        <span className="text-[9px] font-bold tracking-wider uppercase bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-1.5 py-0.5 rounded">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1 leading-relaxed">
                      Age 58, approaching retirement. Focuses heavily on capital preservation, secure cash-flows, sovereign bonds, and tax-efficient Sovereign Gold Bonds.
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      <span className="text-[10px] font-bold bg-[#F1F5F9] dark:bg-[#262626] text-[#334155] dark:text-slate-300 px-2 py-0.5 rounded-md">₹60L Portfolio</span>
                      <span className="text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded-md">40% G-Secs</span>
                      <span className="text-[10px] font-bold bg-yellow-50 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded-md">15% SGBs</span>
                      <span className="text-[10px] font-bold bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 px-2 py-0.5 rounded-md">20% Debt ETFs</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile B: Ananya (Growth-Oriented) - REMOVED PURPLE, styled with Cyan/Teal */}
              <div 
                onClick={() => setSelectedPersona('Ananya')}
                className={`p-6 rounded-[24px] border transition-all cursor-pointer text-left flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  selectedPersona === 'Ananya' 
                    ? 'bg-cyan-50/20 dark:bg-cyan-950/10 border-cyan-500 ring-2 ring-cyan-500/10 shadow-md' 
                    : 'bg-white dark:bg-[#1E1E1E] border-[#E2E8F0] dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl mt-0.5 ${selectedPersona === 'Ananya' ? 'bg-cyan-600 text-white' : 'bg-[#F1F5F9] dark:bg-[#262626] text-[#64748B] dark:text-slate-400'}`}>
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-extrabold text-[#0F172A] dark:text-slate-100">Ananya (Growth-Oriented)</h3>
                      {selectedPersona === 'Ananya' && (
                        <span className="text-[9px] font-bold tracking-wider uppercase bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 px-1.5 py-0.5 rounded">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1 leading-relaxed">
                      Age 29, active aggressive wealth builder. High risk appetite, focusing on aggressive equity indexing combined with high-yield alternative assets (REITs, InvITs).
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      <span className="text-[10px] font-bold bg-[#F1F5F9] dark:bg-[#262626] text-[#334155] dark:text-slate-300 px-2 py-0.5 rounded-md">₹12L Portfolio</span>
                      <span className="text-[10px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-md">65% Equities</span>
                      <span className="text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-md">15% REITs</span>
                      <span className="text-[10px] font-bold bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-400 px-2 py-0.5 rounded-md">15% InvITs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Continue Button styled with Everyday Gradient */}
            <div className="text-center pt-2">
              <button
                onClick={() => setCurrentStep('consent')}
                className="w-full max-w-sm py-4 px-6 bg-everyday text-white rounded-full font-bold text-sm flex items-center justify-center space-x-2 hover:opacity-90 transition-all shadow-md mx-auto cursor-pointer"
              >
                <span>Configure Privacy Consent</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <p className="text-[10px] text-[#A8A29E] mt-3">
                Step 2 of 3 — Secure consolidated consent configuration is next.
              </p>
            </div>
          </div>
        )}

        {currentStep === 'consent' && (
          /* ================= STEP 3: CONSENT CONFIGURATION ================= */
          <div className="max-w-3xl mx-auto flex flex-col gap-6 py-4 animate-fadeIn">
            {/* Back to intro trigger */}
            <button
              onClick={() => setCurrentStep('persona')}
              className="self-start text-xs font-bold text-[#64748B] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-slate-100 flex items-center space-x-1 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Profile Selection</span>
            </button>

            <div className="text-center space-y-2 mb-2">
              <h2 className="text-2xl font-display font-black text-[#0F172A] dark:text-slate-50 tracking-tight">
                Secure Consent Authorization
              </h2>
              <p className="text-xs text-[#64748B] dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Prism operates with zero-knowledge, read-only digital consent. Select the granular permissions you wish to grant to continue.
              </p>
            </div>

            {/* Consent Framework Card */}
            <div className="p-6 bg-white dark:bg-[#1E1E1E] border border-[#E2E8F0] dark:border-slate-800 rounded-[24px] shadow-sm space-y-6 transition-colors duration-300">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-bold text-[#0F172A] dark:text-slate-100">Active Privacy Toggles</h3>
              </div>

              <div className="space-y-4">
                {/* View Portfolio */}
                <div className="flex items-start justify-between space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-[#0F172A] dark:text-slate-100">View Portfolio</span>
                      <span className="text-[9px] bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold px-1.5 py-0.5 rounded border border-blue-100 dark:border-blue-900/35">REQUIRED TO SYNC</span>
                    </div>
                    <p className="text-[11px] text-[#64748B] dark:text-slate-400 mt-1 leading-relaxed">
                      Fetches aggregated holdings across registered depository accounts (NDSL/CDSL).
                    </p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleToggle('viewPortfolio')}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${permissions.viewPortfolio ? 'bg-blue-600' : 'bg-[#E2E8F0] dark:bg-slate-700'}`}
                  >
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${permissions.viewPortfolio ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>

                <hr className="border-t border-[#F1F5F9] dark:border-slate-800/80" />

                {/* Analyse Portfolio */}
                <div className="flex items-start justify-between space-x-4">
                  <div className="flex-1">
                    <span className="text-xs font-bold text-[#0F172A] dark:text-slate-100">Analyse Portfolio</span>
                    <p className="text-[11px] text-[#64748B] dark:text-slate-400 mt-1 leading-relaxed">
                      Assesses credit exposures, interest rate risks, and underlying property occupancy schedules.
                    </p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleToggle('analysePortfolio')}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${permissions.analysePortfolio ? 'bg-blue-600' : 'bg-[#E2E8F0] dark:bg-slate-700'}`}
                  >
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${permissions.analysePortfolio ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>

                <hr className="border-t border-[#F1F5F9] dark:border-slate-800/80" />

                {/* Recommend Products */}
                <div className="flex items-start justify-between space-x-4">
                  <div className="flex-1">
                    <span className="text-xs font-bold text-[#0F172A] dark:text-slate-100">Recommend Products</span>
                    <p className="text-[11px] text-[#64748B] dark:text-slate-400 mt-1 leading-relaxed">
                      Matches specific instrument categories to stated cash flow needs and risk preferences.
                    </p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleToggle('recommendProducts')}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${permissions.recommendProducts ? 'bg-blue-600' : 'bg-[#E2E8F0] dark:bg-slate-700'}`}
                  >
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${permissions.recommendProducts ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Linking Action & Simulator */}
            <div className="space-y-4">
              {isLinking ? (
                <div className="w-full bg-slate-900 dark:bg-[#1E1E1E] border border-slate-800 dark:border-neutral-800 text-white rounded-[24px] py-6 px-8 flex flex-col items-center justify-center space-y-4 shadow-lg animate-fadeIn">
                  <div className="flex items-center space-x-3 text-center">
                    <RefreshCw className="h-5 w-5 animate-spin text-amber-300 shrink-0" />
                    <span className="text-sm font-bold tracking-tight">
                      {localSyncStep === 1 && 'Establishing secure, read-only digital handshake...'}
                      {localSyncStep === 2 && `Retrieving consolidated holdings for ${selectedPersona}...`}
                      {localSyncStep === 3 && 'Applying alternative asset taxonomy frameworks...'}
                      {localSyncStep === 4 && 'Applying risk models & calculating governance scores...'}
                      {localSyncStep === 5 && 'Entering Prism workspace...'}
                    </span>
                  </div>
                  <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden max-w-md">
                    <div 
                      className="bg-amber-400 h-full transition-all duration-700 ease-out" 
                      style={{ width: `${(localSyncStep / 4) * 100}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {errorMessage && (
                    <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900 rounded-xl text-xs font-semibold text-red-700 dark:text-red-400 text-center">
                      {errorMessage}
                    </div>
                  )}
                  <button
                    onClick={handleLocalOnboardingSync}
                    disabled={!permissions.viewPortfolio}
                    className={`w-full py-4 px-6 rounded-full font-bold text-sm flex items-center justify-center space-x-2 transition-all ${
                      permissions.viewPortfolio 
                        ? 'bg-everyday text-white hover:opacity-90 cursor-pointer shadow-md' 
                        : 'bg-[#E2E8F0] dark:bg-slate-800 text-[#64748B] dark:text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <span>Authorize & Link Portfolio</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Informational Disclaimer */}
              <p className="text-[10px] text-center text-[#A8A29E] leading-relaxed px-4">
                Prism operates as a client-side analytics client. By confirming, the dashboard is initialized with selected secure depository records. Consent is fully revocable at any time from your settings panel.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
