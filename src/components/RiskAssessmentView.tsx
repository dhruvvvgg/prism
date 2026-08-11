import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sliders, RefreshCw, ChevronLeft, ShieldCheck, Activity } from 'lucide-react';
import { RISK_QUESTIONS, PRESET_PERSONA_ANSWERS, calculateRiskProfile } from '../utils/riskProfiler';
import { RiskProfile } from '../types';

interface RiskAssessmentViewProps {
  selectedPersonaName: 'Rajesh' | 'Ananya' | null;
  initialRiskProfile?: RiskProfile;
  onSubmit: (riskProfile: RiskProfile) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export default function RiskAssessmentView({
  selectedPersonaName,
  initialRiskProfile,
  onSubmit,
  onBack,
  isSubmitting,
}: RiskAssessmentViewProps) {
  // Initialize answers based on selected persona preset or initial profile
  const [riskAnswers, setRiskAnswers] = useState<Record<string, number>>(() => {
    if (selectedPersonaName === 'Ananya') return PRESET_PERSONA_ANSWERS.Ananya;
    return PRESET_PERSONA_ANSWERS.Rajesh;
  });

  // Re-sync if persona changes
  useEffect(() => {
    if (selectedPersonaName === 'Ananya') {
      setRiskAnswers(PRESET_PERSONA_ANSWERS.Ananya);
    } else if (selectedPersonaName === 'Rajesh') {
      setRiskAnswers(PRESET_PERSONA_ANSWERS.Rajesh);
    }
  }, [selectedPersonaName]);

  const computedRiskProfile = calculateRiskProfile(riskAnswers);

  const handleOptionSelect = (questionId: string, optionIdx: number) => {
    setRiskAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const handlePresetSelect = (name: 'Rajesh' | 'Ananya') => {
    setRiskAnswers(PRESET_PERSONA_ANSWERS[name]);
  };

  const handleSubmit = () => {
    onSubmit(computedRiskProfile);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="w-full max-w-4xl mx-auto space-y-6 py-4 sm:py-6 select-none transition-colors duration-300 h-auto px-4"
    >
      {/* Header Title */}
      <div className="space-y-1 text-center shrink-0">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-500 block flex items-center justify-center gap-1.5">
          <Activity className="w-3.5 h-3.5 inline" />
          Step 2 of 2 — Investor Risk Profiling
        </span>
        <h2 className="text-xl sm:text-2xl font-serif font-extrabold tracking-tight text-[#1C1C1A] dark:text-[#F5F4F0] transition-colors duration-300">
          Tailor Your Risk & Suitability Framework
        </h2>
        <p className="text-xs sm:text-sm text-[#71706C] dark:text-[#A19F9A] max-w-xl mx-auto transition-colors duration-300 leading-relaxed">
          Answer 4 quick questions or select a pre-seeded profile. Your answers explicitly ground the AI Suitability Coach in your real financial risk appetite.
        </p>
      </div>

      {/* Main Questionnaire Card */}
      <div className="bg-white dark:bg-[#1C1B19] border border-[#E6E5E0] dark:border-[#2E2D2A] rounded-[2rem] p-5 sm:p-7 space-y-6 ballpark-shadow h-auto shadow-md">
        
        {/* Header bar with Live Score Badge & Preset Quick Toggles */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#E6E5E0] dark:border-[#2E2D2A] pb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-500 shrink-0" />
            <h3 className="text-xs font-bold text-[#1C1C1A] dark:text-[#F5F4F0] uppercase tracking-wider">
              Risk Profiling Questionnaire
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            {/* Quick Preset Buttons */}
            <div className="flex items-center gap-1 bg-[#FAF9F6] dark:bg-[#252422] p-1 rounded-xl border border-[#E6E5E0] dark:border-[#2E2D2A] overflow-x-auto max-w-full">
              <span className="text-[9px] font-mono font-bold text-[#71706C] dark:text-[#A19F9A] px-1 shrink-0">Presets:</span>
              <button
                type="button"
                onClick={() => handlePresetSelect('Rajesh')}
                className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-all cursor-pointer shrink-0 ${
                  computedRiskProfile.category === 'Conservative'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'text-[#71706C] dark:text-[#A19F9A] hover:text-[#1C1C1A] dark:hover:text-[#F5F4F0]'
                }`}
              >
                Rajesh (Conservative)
              </button>
              <button
                type="button"
                onClick={() => handlePresetSelect('Ananya')}
                className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-all cursor-pointer shrink-0 ${
                  computedRiskProfile.category === 'Aggressive'
                    ? 'bg-blue-500 text-white shadow-xs'
                    : 'text-[#71706C] dark:text-[#A19F9A] hover:text-[#1C1C1A] dark:hover:text-[#F5F4F0]'
                }`}
              >
                Ananya (Aggressive)
              </button>
            </div>

            {/* Score pill */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-mono text-[#71706C] dark:text-[#A19F9A]">Score: <strong className="text-[#1C1C1A] dark:text-[#F5F4F0] font-bold">{computedRiskProfile.score}/100</strong></span>
              <span className={`text-[10px] font-bold font-mono px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border ${
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
        </div>

        {/* 4 Questions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {RISK_QUESTIONS.map((q) => (
            <div key={q.id} className="space-y-2 bg-[#FAF9F6] dark:bg-[#252422]/70 p-3.5 rounded-2xl border border-[#E6E5E0] dark:border-[#2E2D2A] overflow-hidden">
              <div>
                <span className="text-xs font-extrabold text-[#1C1C1A] dark:text-[#F5F4F0] block">{q.title}</span>
                <p className="text-[11px] text-[#71706C] dark:text-[#A19F9A] leading-tight mt-0.5">{q.subtitle}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {q.options.map((opt, optIdx) => {
                  const isSelected = (riskAnswers[q.id] ?? 0) === optIdx;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => handleOptionSelect(q.id, optIdx)}
                      className={`text-left p-2.5 rounded-xl border transition-all text-xs cursor-pointer leading-snug flex flex-col justify-between ${
                        isSelected
                          ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                          : 'border-[#E6E5E0] dark:border-[#2E2D2A] text-[#71706C] dark:text-[#A19F9A] hover:bg-white dark:hover:bg-[#1C1B19]'
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

        {/* Action Row */}
        <div className="flex items-center justify-between pt-4 border-t border-[#E6E5E0] dark:border-[#2E2D2A]">
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="flex items-center gap-1 px-4 py-2 text-xs font-bold text-[#71706C] dark:text-[#A19F9A] hover:text-[#1C1C1A] dark:hover:text-[#F5F4F0] cursor-pointer transition-colors duration-300"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Auth & Consent</span>
          </button>

          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-everyday hover:opacity-95 text-white font-bold text-xs px-6 py-2.5 rounded-full flex items-center gap-2 cursor-pointer shadow-md transition-all duration-300"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Resolving Portfolio...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Complete Assessment & Connect Portfolio →</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
