import React from 'react';
import { ShieldCheck, Eye, Sparkles, Clock, Coins, BarChart3, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { BentoStaggeredGrid, BentoStaggeredCard } from './ui/bento-staggered';

export default function FeaturesSection() {
  return (
    <div className="space-y-12 select-none max-w-5xl mx-auto py-8 transition-colors duration-300">
      {/* Section Header */}
      <div className="space-y-2 border-b border-[#E6E5E0] dark:border-[#2E2D2A] pb-6 transition-colors duration-300">
        <span className="text-[10px] font-mono font-black uppercase tracking-wider text-blue-500">
          Onboarding & Foundations
        </span>
        <h2 className="text-3xl md:text-4xl font-serif font-extrabold tracking-tight text-[#1C1C1A] dark:text-[#F5F4F0] transition-colors duration-300">
          Designed for absolute clarity.
        </h2>
        <p className="text-sm font-sans text-[#71706C] dark:text-[#A19F9A] max-w-2xl transition-colors duration-300">
          Alternative investment classes (REITs, InvITs, Corporate Bonds) offer attractive yields, but are often shrouded in opaque regulations and complex lock-ins. Prism exposes the structural realities of your assets.
        </p>
      </div>

      {/* Asymmetrical Motion.dev BentoStaggeredGrid */}
      <BentoStaggeredGrid>
        
        {/* Bento Item 1 (Span 8): Rigorous Compliance Audits */}
        <BentoStaggeredCard index={0} colSpan="md:col-span-8" className="group">
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="bg-blue-500/10 text-blue-500 border border-blue-500/20 p-3 rounded-2xl">
                <ShieldCheck className="w-6 h-6 text-blue-500" />
              </div>
              <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                SEBI/RBI Verified
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-serif font-black text-[#1C1C1A] dark:text-[#F5F4F0]">
                Rigorous Compliance Audits
              </h3>
              <p className="text-xs text-[#71706C] dark:text-[#A19F9A] leading-relaxed max-w-lg">
                Maintains live SEBI and RBI regulatory scorecards for premium alternative investments. Checks board independence ratios, quarterly distribution compliance, and trustee ratings in real-time.
              </p>
            </div>
          </div>

          {/* Interactive Bento Micro Visual: Live Regulatory Score Meter */}
          <div className="mt-6 pt-6 border-t border-[#FAF9F6] dark:border-[#252422] grid grid-cols-3 gap-3 relative z-10">
            <div className="bg-[#FAF9F6] dark:bg-[#252422] p-3 rounded-xl border border-[#E6E5E0] dark:border-[#2E2D2A]">
              <span className="text-[9px] font-mono text-[#71706C] dark:text-[#A19F9A] uppercase block font-bold">Board Ratio</span>
              <span className="text-xs font-serif font-bold text-[#1C1C1A] dark:text-[#F5F4F0] mt-0.5 block">50% Independent</span>
            </div>
            <div className="bg-[#FAF9F6] dark:bg-[#252422] p-3 rounded-xl border border-[#E6E5E0] dark:border-[#2E2D2A]">
              <span className="text-[9px] font-mono text-[#71706C] dark:text-[#A19F9A] uppercase block font-bold">Payout Purity</span>
              <span className="text-xs font-serif font-bold text-emerald-500 mt-0.5 block">≥90% Met Q4</span>
            </div>
            <div className="bg-[#FAF9F6] dark:bg-[#252422] p-3 rounded-xl border border-[#E6E5E0] dark:border-[#2E2D2A]">
              <span className="text-[9px] font-mono text-[#71706C] dark:text-[#A19F9A] uppercase block font-bold">Trustee Rating</span>
              <span className="text-xs font-serif font-bold text-blue-500 mt-0.5 block">CRISIL AAA</span>
            </div>
          </div>
        </BentoStaggeredCard>

        {/* Bento Item 2 (Span 4): Ground Truth Citations */}
        <BentoStaggeredCard index={1} colSpan="md:col-span-4">
          <div className="space-y-4">
            <div className="bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 p-3 rounded-2xl w-fit">
              <Eye className="w-6 h-6 text-indigo-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-serif font-black text-[#1C1C1A] dark:text-[#F5F4F0]">
                Ground Truth Citations
              </h3>
              <p className="text-xs text-[#71706C] dark:text-[#A19F9A] leading-relaxed">
                All board-composition metrics, regulatory warnings, and distribution statistics reference official SEBI filings.
              </p>
            </div>
          </div>

          <div className="mt-6 bg-[#FAF9F6] dark:bg-[#252422] p-3.5 rounded-xl border border-[#E6E5E0] dark:border-[#2E2D2A] text-[10px] font-mono text-[#71706C] dark:text-[#A19F9A] flex items-center justify-between">
            <span className="truncate">Ref: SEBI/HO/DDHS/P/2023</span>
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0 text-indigo-500" />
          </div>
        </BentoStaggeredCard>

        {/* Bento Item 3 (Span 4): Yield Structure Clarity */}
        <BentoStaggeredCard index={2} colSpan="md:col-span-4">
          <div className="space-y-4">
            <div className="bg-amber-500/10 text-amber-500 border border-amber-500/20 p-3 rounded-2xl w-fit">
              <Coins className="w-6 h-6 text-amber-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-serif font-black text-[#1C1C1A] dark:text-[#F5F4F0]">
                Yield Structure Clarity
              </h3>
              <p className="text-xs text-[#71706C] dark:text-[#A19F9A] leading-relaxed">
                Clear, plain-language breakdowns of complex payout rules, lock-in structures, and Section 115UA taxation tiers.
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              Tax Slabs
            </span>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              Sec 115UA
            </span>
          </div>
        </BentoStaggeredCard>

        {/* Bento Item 4 (Span 8): Interactive Suitability Coach */}
        <BentoStaggeredCard index={3} colSpan="md:col-span-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 p-3 rounded-2xl">
                <Sparkles className="w-6 h-6 text-emerald-500" />
              </div>
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Grounded AI Coach
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-serif font-black text-[#1C1C1A] dark:text-[#F5F4F0]">
                Interactive Suitability Coach
              </h3>
              <p className="text-xs text-[#71706C] dark:text-[#A19F9A] leading-relaxed max-w-lg">
                Consult a highly specialized, server-protected Gemini expert that checks assets against your capital preservation or aggressive growth risk boundaries.
              </p>
            </div>
          </div>

          <div className="mt-6 bg-[#FAF9F6] dark:bg-[#252422] p-4 rounded-2xl border border-[#E6E5E0] dark:border-[#2E2D2A] space-y-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-emerald-500 font-bold">
              <span>Suitability Analysis Active</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs text-[#1C1C1A] dark:text-[#F5F4F0] font-sans font-medium italic">
              "Your 15% REIT allocation provides quarterly cashflows aligned with your conservative preservation goals."
            </p>
          </div>
        </BentoStaggeredCard>

      </BentoStaggeredGrid>
    </div>
  );
}
