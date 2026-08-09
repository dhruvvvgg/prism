import { useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface SignatureTransitionOverlayProps {
  isVisible: boolean;
  onComplete?: () => void;
  personaName?: string | null;
}

export default function SignatureTransitionOverlay({
  isVisible,
  onComplete,
  personaName,
}: SignatureTransitionOverlayProps) {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="signature-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.2 : 0.4 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 dark:bg-[#121110]/95 backdrop-blur-2xl overflow-hidden select-none transition-colors duration-300"
        >
          {/* Animated Spectrum Gradient Beam Sweep */}
          {!shouldReduceMotion && (
            <>
              {/* Refracting spectrum radial beam 1 */}
              <motion.div
                initial={{ scale: 0.2, opacity: 0, rotate: -45 }}
                animate={{ 
                  scale: [0.3, 2.0, 2.8], 
                  opacity: [0, 0.7, 0],
                  rotate: [-45, 0, 45]
                }}
                transition={{ duration: 2.3, ease: [0.16, 1, 0.3, 1] }}
                className="absolute w-[900px] h-[900px] rounded-full blur-[100px] bg-signature pointer-events-none opacity-50 dark:opacity-60"
              />

              {/* Counter-rotating refracting prism ray */}
              <motion.div
                initial={{ scale: 0.1, opacity: 0, rotate: 90 }}
                animate={{ 
                  scale: [0.2, 1.8, 2.4], 
                  opacity: [0, 0.6, 0],
                  rotate: [90, 45, 0]
                }}
                transition={{ duration: 2.3, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="absolute w-[750px] h-[750px] rounded-full blur-[80px] bg-signature-horizontal pointer-events-none opacity-40 dark:opacity-50"
              />

              {/* Shimmering line light streak across diagonal */}
              <motion.div
                initial={{ x: '-100%', opacity: 0 }}
                animate={{ x: '100%', opacity: [0, 1, 0] }}
                transition={{ duration: 1.8, delay: 0.3, ease: 'easeInOut' }}
                className="absolute w-[200%] h-32 bg-signature-horizontal blur-md rotate-45 pointer-events-none"
              />
            </>
          )}

          {/* Central Refraction Focus Card */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, y: 20 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.05, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="relative z-10 bg-white/90 dark:bg-[#1C1B19]/90 border border-[#E6E5E0] dark:border-[#2E2D2A] rounded-[2.5rem] p-8 md:p-12 max-w-lg w-full mx-4 shadow-[0_32px_80px_rgba(0,0,0,0.15)] dark:shadow-[0_32px_80px_rgba(0,0,0,0.7)] backdrop-blur-2xl text-center space-y-6 transition-colors duration-300"
          >
            {/* Glowing Icon Prism */}
            <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
              <motion.div
                animate={shouldReduceMotion ? {} : { rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full bg-signature p-1 blur-sm opacity-80"
              />
              <div className="relative w-full h-full rounded-full bg-[#FAF9F6] dark:bg-[#121110] border border-[#E6E5E0] dark:border-[#2E2D2A] flex items-center justify-center text-amber-500 shadow-inner">
                <Sparkles className="w-9 h-9 text-amber-500 animate-pulse" />
              </div>
            </div>

            {/* Typography */}
            <div className="space-y-2">
              <motion.span
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="inline-flex items-center gap-1.5 text-[10px] font-mono font-extrabold uppercase tracking-widest px-3.5 py-1 rounded-full bg-signature-horizontal text-white shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Refracting Prism Spectrum
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-[#1C1C1A] dark:text-[#F5F4F0] transition-colors duration-300"
              >
                {personaName ? `Resolving ${personaName}'s Portfolio` : 'Resolving Asset Spectrum'}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="text-xs text-[#71706C] dark:text-[#A19F9A] max-w-xs mx-auto font-sans leading-relaxed transition-colors duration-300"
              >
                Mapping SEBI/RBI compliance boundaries & AA verified holdings into your grounded dashboard...
              </motion.p>
            </div>

            {/* Signature Spectrum Progress Bar */}
            <div className="space-y-2 pt-2">
              <div className="w-full bg-[#FAF9F6] dark:bg-[#252422] h-2.5 rounded-full overflow-hidden p-0.5 border border-[#E6E5E0] dark:border-[#2E2D2A]">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: shouldReduceMotion ? 0.3 : 2.2, ease: 'easeInOut' }}
                  className="bg-signature-horizontal h-full rounded-full"
                />
              </div>
              <div className="flex justify-between items-center text-[9px] font-mono text-[#71706C] dark:text-[#A19F9A] font-bold px-1">
                <span>AA CONSENT VERIFIED</span>
                <span>AA SANDBOX SYNC</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
