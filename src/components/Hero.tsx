import { motion } from 'motion/react';
import { ShieldCheck, Check, RefreshCw, Sparkles, Database } from 'lucide-react';
import { HeroParallaxContainer, HeroParallaxLayer } from './ui/hero-parallax-layers';

interface HeroProps {
  onLaunchPrism: () => void;
  onTryDemo: (personaName: 'Rajesh' | 'Ananya') => void;
  selectedPersonaName?: 'Rajesh' | 'Ananya' | null;
}

export default function Hero({
  onLaunchPrism,
  onTryDemo,
  selectedPersonaName,
}: HeroProps) {
  return (
    <HeroParallaxContainer className="space-y-16 transition-colors duration-300">
      {/* Main Hero Copy - Layer 1: Heading & Action CTA */}
      <HeroParallaxLayer speed={0.35} className="text-center space-y-6 max-w-6xl mx-auto pt-6 sm:pt-8 md:pt-10 select-none">
        <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif font-black tracking-tighter leading-[0.95] sm:leading-[0.9] text-[#1C1C1A] dark:text-[#F5F4F0] transition-colors duration-300">
          Alternative Assets. <br className="hidden md:inline" />
          Fully <span className="animate-shine font-serif">Grounded.</span>
        </h1>
        
        <p className="text-[#51504B] dark:text-[#A19F9A] text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed font-normal transition-colors duration-300">
          Prism automates SEBI/RBI compliance monitoring, aggregates holdings via Account Aggregator Sandbox, and verifies suitability with a grounded AI Coach.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            onClick={onLaunchPrism}
            className="w-full sm:w-auto bg-everyday hover:opacity-90 text-white font-extrabold text-sm sm:text-base px-8 py-4 rounded-full shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer ballpark-shadow"
          >
            <Sparkles className="w-5 h-5" />
            {selectedPersonaName ? `Return to ${selectedPersonaName}'s Workspace` : 'Link Portfolio (AA Framework)'}
          </motion.button>
        </div>
      </HeroParallaxLayer>

      {/* Motion.dev Scroll Parallax Product UI Mockup - Layer 2 */}
      <HeroParallaxLayer speed={0.5} className="relative max-w-6xl mx-auto py-4 px-4 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.01, transition: { duration: 0.3 } }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          onClick={onLaunchPrism}
          className="relative bg-white dark:bg-[#1C1B19] border border-[#E6E5E0] dark:border-[#2E2D2A] rounded-[2rem] p-6 sm:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.06)] ballpark-shadow transition-colors duration-300 overflow-hidden group cursor-pointer"
        >
          {/* Subtle top signature spectrum refraction line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-signature-horizontal opacity-70 group-hover:opacity-100 transition-opacity" />

          {/* Top Mockup Control Bar */}
          <div className="flex items-center justify-between border-b border-[#FAF9F6] dark:border-[#252422] pb-4 mb-6 transition-colors duration-300">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#ECE7E1] dark:bg-[#3E3D3A]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#E2E1DD] dark:bg-[#2E2D2A]" />
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-[#FAF9F6] dark:bg-[#252422] border border-[#E6E5E0] dark:border-[#2E2D2A] rounded-full py-1 px-4 text-[10px] font-mono font-bold text-[#71706C] dark:text-[#A19F9A] transition-colors duration-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>AA Sandbox Active</span>
            </div>
            <div className="w-8" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
            
            {/* Mockup Left Side: Active Pipeline execution steps */}
            <div className="md:col-span-7 space-y-3.5">
              <h3 className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#71706C] dark:text-[#A19F9A] mb-2 transition-colors duration-300">
                Compliance Verification Sequence
              </h3>
              
              <div className="bg-[#FAF9F6] dark:bg-[#252422] border border-[#E6E5E0] dark:border-[#2E2D2A] rounded-2xl p-4 flex items-center gap-3 transition-colors duration-300">
                <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-extrabold text-[#1C1C1A] dark:text-[#F5F4F0] transition-colors duration-300">Consent Request Approved</h4>
                  <p className="text-[10px] text-[#71706C] dark:text-[#A19F9A] font-mono transition-colors duration-300">9999999999@onemoney • Real-time fetch active</p>
                </div>
              </div>

              <div className="bg-[#FAF9F6] dark:bg-[#252422] border border-[#E6E5E0] dark:border-[#2E2D2A] rounded-2xl p-4 flex items-center gap-3 transition-colors duration-300">
                <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-extrabold text-[#1C1C1A] dark:text-[#F5F4F0] transition-colors duration-300">Asset Valuation Sync Complete</h4>
                  <p className="text-[10px] text-[#71706C] dark:text-[#A19F9A] font-mono transition-colors duration-300">Ported 5 asset classes • Net Worth Calculated</p>
                </div>
              </div>

              <div className="bg-white dark:bg-[#1C1B19] border-2 border-blue-500 rounded-2xl p-4 flex items-center gap-3 shadow-sm transition-colors duration-300">
                <div className="w-5 h-5 rounded-full border border-blue-500 border-t-transparent animate-spin" />
                <div className="flex-1">
                  <h4 className="text-xs font-extrabold text-[#1C1C1A] dark:text-[#F5F4F0] transition-colors duration-300">SEBI & RBI Regulation Checks</h4>
                  <p className="text-[10px] text-blue-500 font-mono animate-pulse">Auditing REIT and InvIT quarterly distribution rules...</p>
                </div>
              </div>

              <div className="bg-[#FAF9F6] dark:bg-[#252422] border border-[#E6E5E0] dark:border-[#2E2D2A] rounded-2xl p-4 flex items-center gap-3 opacity-60 transition-colors duration-300">
                <div className="w-5 h-5 rounded-full border border-[#C8C7C2] dark:border-[#5E5D59] flex items-center justify-center font-mono text-[9px] text-[#71706C] dark:text-[#A19F9A]">
                  4
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-extrabold text-[#71706C] dark:text-[#A19F9A] transition-colors duration-300">Suitability Model Executed</h4>
                  <p className="text-[10px] text-[#C8C7C2] dark:text-[#5E5D59] font-mono transition-colors duration-300">Personalized match/mismatch flags ready</p>
                </div>
              </div>
            </div>

            {/* Mockup Right Side: Floatings items */}
            <div className="md:col-span-5 space-y-3.5">
              
              {/* Floating Widget 1: Asset Value */}
              <div className="bg-white dark:bg-[#1C1B19] border border-[#E6E5E0] dark:border-[#2E2D2A] rounded-2xl p-5 shadow-sm space-y-2 transition-colors duration-300">
                <div className="flex items-center justify-between text-[10px] font-sans font-bold text-[#71706C] dark:text-[#A19F9A] transition-colors duration-300">
                  <span>AGGREGATED NET WORTH</span>
                </div>
                <div className="text-3xl font-serif font-black text-[#1C1C1A] dark:text-[#F5F4F0] text-center tracking-wider transition-colors duration-300">
                  INR 14,28,450
                </div>
              </div>

              {/* Floating Widget 2: Compliance Tracker */}
              <div className="bg-white dark:bg-[#1C1B19] border border-[#E6E5E0] dark:border-[#2E2D2A] rounded-2xl p-5 shadow-sm space-y-3 relative overflow-hidden transition-colors duration-300">
                <div className="absolute top-2 right-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 text-[8px] font-mono px-1.5 py-0.5 rounded-full uppercase font-bold">
                  Verified
                </div>
                
                <h4 className="text-xs font-extrabold text-[#1C1C1A] dark:text-[#F5F4F0] flex items-center gap-1.5 transition-colors duration-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                  SEBI Distribution Audit
                </h4>
                
                <div className="border-l-2 border-blue-500 pl-3 py-1 space-y-0.5">
                  <p className="text-[11px] font-extrabold text-[#71706C] dark:text-[#A19F9A] transition-colors duration-300">
                    Embassy Office Parks REIT
                  </p>
                  <p className="text-[9px] text-blue-500 font-mono font-bold">
                    → ≥90% Net Cash Distribution met for Q4
                  </p>
                </div>
              </div>

              {/* Floating Widget 3: Consent Signature */}
              <div className="bg-white dark:bg-[#1C1B19] border border-[#E6E5E0] dark:border-[#2E2D2A] rounded-2xl p-5 shadow-sm space-y-3 transition-colors duration-300">
                <h4 className="text-xs font-extrabold text-[#1C1C1A] dark:text-[#F5F4F0] flex items-center gap-1.5 transition-colors duration-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                  AA Active Consent
                </h4>
                <div className="bg-[#FAF9F6] dark:bg-[#252422] border border-[#E6E5E0] dark:border-[#2E2D2A] rounded-xl p-3 font-mono text-[9px] text-[#71706C] dark:text-[#A19F9A] leading-normal space-y-1 transition-colors duration-300">
                  <p className="font-bold text-[#1C1C1A] dark:text-[#F5F4F0] transition-colors duration-300">Consent ID: aa_cons_93a1</p>
                  <p>Purpose: Wealth Management</p>
                  <p className="pt-1 italic">"Periodic data-life approved for 1 Year. Granular control toggles available in Privacy tab."</p>
                </div>
              </div>

            </div>

          </div>
        </motion.div>
      </HeroParallaxLayer>
    </HeroParallaxContainer>
  );
}
