import { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, RefreshCw, Sparkles, Check, Phone, Mail, CreditCard, Sliders, ShieldCheck, Zap, Activity } from 'lucide-react';
import { RISK_QUESTIONS, PRESET_PERSONA_ANSWERS, calculateRiskProfile } from '../utils/riskProfiler';
import { RiskProfile } from '../types';

interface IntakeViewProps {
  isSubmitting: boolean;
  onSubmit: (
    phone: string,
    permissions: { viewPortfolio: boolean; analysePortfolio: boolean; recommendProducts: boolean },
    selectedPersona: 'Rajesh' | 'Ananya' | null,
    riskProfile?: RiskProfile
  ) => void;
  onCancel: () => void;
  googleUser: any;
  onGoogleSignIn: () => void;
}

export default function IntakeView({
  isSubmitting,
  onSubmit,
  onCancel,
  googleUser,
  onGoogleSignIn,
}: IntakeViewProps) {
  const [email, setEmail] = useState('rajesh.gopal@gmail.com');
  const [phone, setPhone] = useState('+91 98450 12345');
  const [pan, setPan] = useState('ABCDE1234F');
  const [selectedPersona, setSelectedPersona] = useState<'Rajesh' | 'Ananya' | null>('Rajesh');

  const [permissions, setPermissions] = useState({
    viewPortfolio: true,
    analysePortfolio: true,
    recommendProducts: true,
  });

  // Risk Questionnaire state (pre-seeded to Rajesh by default)
  const [riskAnswers, setRiskAnswers] = useState<Record<string, number>>(PRESET_PERSONA_ANSWERS.Rajesh);
  
  // Dynamic computed risk profile from generic scoring function
  const computedRiskProfile = calculateRiskProfile(riskAnswers);

  const personas = [
    {
      name: 'Rajesh' as const,
      tagline: 'Near Retirement (Conservative)',
      desc: 'Holds primarily Sovereign Gold, G-Secs, and liquid Debt ETFs. Income focused.',
    },
    {
      name: 'Ananya' as const,
      tagline: 'Aggressive Capital Growth',
      desc: 'High concentration in REITs, InvITs, and Equities. High risk tolerance.',
    },
  ];

  const handleSelectShortcut = (name: 'Rajesh' | 'Ananya') => {
    setSelectedPersona(name);
    if (name === 'Rajesh') {
      setEmail('rajesh.gopal@gmail.com');
      setPhone('+91 98450 12345');
      setPan('ABCDE1234F');
      setRiskAnswers(PRESET_PERSONA_ANSWERS.Rajesh);
    } else {
      setEmail('ananya.roy@gmail.com');
      setPhone('+91 91234 56789');
      setPan('XYZWY9876A');
      setRiskAnswers(PRESET_PERSONA_ANSWERS.Ananya);
    }
    setPermissions({
      viewPortfolio: true,
      analysePortfolio: true,
      recommendProducts: true,
    });
  };

  const handleOptionSelect = (questionId: string, optionIdx: number) => {
    setRiskAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const togglePermission = (key: keyof typeof permissions) => {
    if (key === 'viewPortfolio') return;
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFormSubmit = () => {
    onSubmit(`${phone} (${pan})`, permissions, selectedPersona, computedRiskProfile);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="w-full max-w-5xl lg:max-w-6xl mx-auto space-y-3 sm:space-y-4 py-1 select-none transition-colors duration-300 h-full flex flex-col justify-between overflow-y-auto scrollbar-thin px-1"
    >
      {/* Title */}
      <div className="space-y-1 text-center shrink-0">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-500 block">
          Account Aggregator Setup & Investor Risk Assessment
        </span>
        <h2 className="text-xl sm:text-2xl font-serif font-extrabold tracking-tight text-[#1C1C1A] dark:text-[#F5F4F0] transition-colors duration-300">
          Link Your Alternative Assets & Profile Suitability
        </h2>
        <p className="text-xs sm:text-sm text-[#71706C] dark:text-[#A19F9A] max-w-2xl mx-auto transition-colors duration-300 leading-relaxed">
          Establish encrypted Account Aggregator access and complete your risk profiling to ground suitability recommendations in your real financial capacity.
        </p>
      </div>

      {/* Input canvas */}
      <div className="bg-white dark:bg-[#1C1B19] border border-[#E6E5E0] dark:border-[#2E2D2A] rounded-[2rem] p-4 sm:p-5 space-y-4 ballpark-shadow flex-1 flex flex-col justify-between min-h-0 overflow-y-auto scrollbar-thin">
        
        {/* Email, Phone, PAN Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[#71706C] dark:text-[#A19F9A] block uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-3.5 h-3.5 text-[#71706C] dark:text-[#A19F9A]" />
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setSelectedPersona(null); }}
                disabled={isSubmitting}
                placeholder="rajesh.gopal@gmail.com"
                className="w-full bg-[#FAF9F6] dark:bg-[#252422] border border-[#E6E5E0] dark:border-[#2E2D2A] rounded-xl pl-10 pr-3 py-2 text-xs text-[#1C1C1A] dark:text-[#F5F4F0] focus:outline-none focus:border-blue-500 transition-colors duration-300"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[#71706C] dark:text-[#A19F9A] block uppercase tracking-wider">
              Phone Number
            </label>
            <div className="relative flex items-center">
              <Phone className="absolute left-3.5 w-3.5 h-3.5 text-[#71706C] dark:text-[#A19F9A]" />
              <input
                type="text"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setSelectedPersona(null); }}
                disabled={isSubmitting}
                placeholder="+91 98450 12345"
                className="w-full bg-[#FAF9F6] dark:bg-[#252422] border border-[#E6E5E0] dark:border-[#2E2D2A] rounded-xl pl-10 pr-3 py-2 text-xs text-[#1C1C1A] dark:text-[#F5F4F0] focus:outline-none focus:border-blue-500 transition-colors duration-300"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-[#71706C] dark:text-[#A19F9A] block uppercase tracking-wider">
              PAN Number
            </label>
            <div className="relative flex items-center">
              <CreditCard className="absolute left-3.5 w-3.5 h-3.5 text-[#71706C] dark:text-[#A19F9A]" />
              <input
                type="text"
                value={pan}
                onChange={(e) => { setPan(e.target.value.toUpperCase()); setSelectedPersona(null); }}
                disabled={isSubmitting}
                maxLength={10}
                placeholder="ABCDE1234F"
                className="w-full bg-[#FAF9F6] dark:bg-[#252422] border border-[#E6E5E0] dark:border-[#2E2D2A] rounded-xl pl-10 pr-3 py-2 text-xs text-[#1C1C1A] dark:text-[#F5F4F0] uppercase font-mono focus:outline-none focus:border-blue-500 transition-colors duration-300"
              />
            </div>
          </div>
        </div>

        {/* RISK PROFILING QUESTIONNAIRE SECTION */}
        <div className="bg-[#FAF9F6] dark:bg-[#252422]/60 border border-[#E6E5E0] dark:border-[#2E2D2A] rounded-2xl p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E6E5E0] dark:border-[#2E2D2A] pb-2.5">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-500" />
              <h3 className="text-xs font-bold text-[#1C1C1A] dark:text-[#F5F4F0] uppercase tracking-wider">
                Risk Assessment Questionnaire
              </h3>
            </div>
            
            {/* Live Computed Score Indicator */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-[#71706C] dark:text-[#A19F9A]">Score: <strong className="text-[#1C1C1A] dark:text-[#F5F4F0]">{computedRiskProfile.score}/100</strong></span>
              <span className={`text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full border ${
                computedRiskProfile.category === 'Conservative'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                  : computedRiskProfile.category === 'Moderate'
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                  : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
              }`}>
                {computedRiskProfile.category.toUpperCase()} PROFILE
              </span>
            </div>
          </div>

          {/* Questions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {RISK_QUESTIONS.map((q) => (
              <div key={q.id} className="space-y-1.5 bg-white dark:bg-[#1C1B19] p-3 rounded-xl border border-[#E6E5E0] dark:border-[#2E2D2A]">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-[#1C1C1A] dark:text-[#F5F4F0]">{q.title}</span>
                </div>
                <p className="text-[10px] text-[#71706C] dark:text-[#A19F9A] leading-tight mb-2">{q.subtitle}</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = (riskAnswers[q.id] ?? 0) === optIdx;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => handleOptionSelect(q.id, optIdx)}
                        className={`text-left p-2 rounded-lg border transition-all text-[10px] cursor-pointer leading-snug ${
                          isSelected
                            ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                            : 'border-[#E6E5E0] dark:border-[#2E2D2A] text-[#71706C] dark:text-[#A19F9A] hover:bg-[#FAF9F6] dark:hover:bg-[#252422]'
                        }`}
                      >
                        <div className="font-extrabold">{opt.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Consent Permissions Checkboxes */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-[#71706C] dark:text-[#A19F9A] block uppercase tracking-wider">
            Granular Consent Permissions
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {[
              { key: 'viewPortfolio' as const, label: 'View Balances', desc: 'Read asset values & balances' },
              { key: 'analysePortfolio' as const, label: 'Analyse Compliance', desc: 'Perform board & regulatory checks' },
              { key: 'recommendProducts' as const, label: 'Suitability Coach', desc: 'Dialogue with AI Advisor' }
            ].map((p) => (
              <motion.button
                key={p.key}
                type="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.15 }}
                disabled={isSubmitting}
                onClick={() => togglePermission(p.key)}
                className={`text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between h-20 ${
                  permissions[p.key]
                    ? 'border-blue-500 bg-blue-500/5 dark:bg-blue-500/10 shadow-xs'
                    : 'border-[#E6E5E0] dark:border-[#2E2D2A] hover:bg-[#FAF9F6] dark:hover:bg-[#252422]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-extrabold text-[#1C1C1A] dark:text-[#F5F4F0]">{p.label}</span>
                  {permissions[p.key] && (
                    <div className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-[#71706C] dark:text-[#A19F9A] leading-tight">{p.desc}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Action Row */}
        <div className="flex items-center justify-between pt-3 border-t border-[#FAF9F6] dark:border-[#2E2D2A] text-[#71706C] dark:text-[#A19F9A] transition-colors duration-300">
          <div className="hidden sm:flex items-center flex-wrap gap-2 font-sans text-[10px]">
            <div className="inline-flex items-center gap-1 text-[9px] text-[#4285F4] font-bold font-mono uppercase bg-[#4285F4]/5 dark:bg-[#4285F4]/10 border border-[#4285F4]/10 rounded-full px-2 py-0.5">
              <Sparkles className="w-2.5 h-2.5" />
              SECURE ACCOUNT AGGREGATOR ACCESS
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-bold text-[#71706C] dark:text-[#A19F9A] hover:text-[#1C1C1A] dark:hover:text-[#F5F4F0] cursor-pointer transition-colors duration-300"
            >
              Cancel
            </button>
            
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              onClick={handleFormSubmit}
              disabled={!phone.trim() || !email.trim() || !pan.trim() || isSubmitting}
              className="bg-everyday hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs px-6 py-2.5 rounded-full flex items-center gap-1.5 cursor-pointer shadow transition-all duration-300"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Requesting Consent...</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Sign Consent & Launch Dashboard</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Pre-seeded Persona Shortcuts */}
      {!isSubmitting && (
        <div className="space-y-2 shrink-0 pt-1">
          <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#71706C] dark:text-[#A19F9A] block text-center transition-colors duration-300">
            Or select a pre-seeded regulatory profile:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {personas.map((p) => (
              <motion.button
                key={p.name}
                type="button"
                whileHover={{ scale: 1.015, y: -1 }}
                whileTap={{ scale: 0.985 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                onClick={() => handleSelectShortcut(p.name)}
                className={`bg-white dark:bg-[#1C1B19] border rounded-2xl p-3 text-left transition-all text-xs space-y-1 cursor-pointer ballpark-shadow group transition-colors duration-300 ${
                  selectedPersona === p.name 
                    ? 'border-blue-500 bg-blue-500/5 dark:bg-blue-500/10' 
                    : 'border-[#E6E5E0] dark:border-[#2E2D2A] hover:bg-[#FAF9F6] dark:hover:bg-[#252422] hover:border-blue-500'
                }`}
              >
                <span className="font-extrabold text-[#1C1C1A] dark:text-[#F5F4F0] block flex items-center justify-between transition-colors duration-300">
                  {p.name} ({p.tagline})
                  <span className="opacity-0 group-hover:opacity-100 text-blue-500 transition-opacity">→</span>
                </span>
                <span className="text-[#71706C] dark:text-[#D2CFC9] text-[11px] leading-relaxed transition-colors duration-300">
                  {p.desc}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
