import React from 'react';
import { ShieldCheck, Eye, Sparkles, Clock, Coins, BarChart3, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { BentoStaggeredGrid, BentoStaggeredCard } from './ui/bento-staggered';

export default function FeaturesSection() {
  return (
    <div className="space-y-10 select-none max-w-7xl mx-auto py-6 transition-colors duration-300">
      {/* Section Header */}
      <div className="space-y-2 border-b border-[#E6E5E0] dark:border-[#2E2D2A] pb-5 transition-colors duration-300">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-500">
          Onboarding & Foundations
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-extrabold tracking-tight text-[#1C1C1A] dark:text-[#F5F4F0] transition-colors duration-300">
          Designed for absolute clarity.
        </h2>
        <p className="text-sm sm:text-base font-sans text-[#71706C] dark:text-[#A19F9A] max-w-2xl leading-relaxed transition-colors duration-300">
          Alternative investment classes (REITs, InvITs, Corporate Bonds) offer attractive yields, but are often shrouded in opaque regulations and complex lock-ins. Prism exposes the structural realities of your assets.
        </p>
      </div>

      {/* Asymmetrical Wise.com-Inspired Bento Grid */}
      <BentoStaggeredGrid>
        
        {/* Bento Item 1 (Span 8): Rigorous Compliance Audits */}
        <BentoStaggeredCard index={0} colSpan="md:col-span-8" className="group">
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="bg-blue-500/10 text-blue-500 border border-blue-500/20 p-3 rounded-xl">
                <ShieldCheck className="w-6 h-6 text-blue-500" />
              </div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                SEBI Audit Engine Active
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1C1C1A] dark:text-[#F5F4F0]">
                Rigorous Compliance Audits
              </h3>
              <p className="text-sm sm:text-base text-[#71706C] dark:text-[#A19F9A] leading-relaxed max-w-xl">
                Maintains live SEBI and RBI regulatory scorecards for premium alternative investments. Checks board independence ratios, quarterly distribution compliance, and trustee ratings in real-time.
              </p>
            </div>
          </div>

          {/* Wise-Style Rich Metric Breakdown Bar */}
          <div className="mt-6 pt-5 border-t border-[#FAF9F6] dark:border-[#252422] grid grid-cols-1 sm:grid-cols-3 gap-3 relative z-10">
            <div className="bg-[#FAF9F6] dark:bg-[#252422] p-3.5 rounded-xl border border-[#E6E5E0] dark:border-[#2E2D2A] space-y-1">
              <span className="text-xs font-mono text-[#71706C] dark:text-[#A19F9A] uppercase block font-bold">Board Ratio</span>
              <span className="text-base font-serif font-extrabold text-[#1C1C1A] dark:text-[#F5F4F0] block">50% Independent</span>
              <div className="w-full bg-[#E6E5E0] dark:bg-[#3E3D3A] h-1.5 rounded-full overflow-hidden mt-1">
                <div className="bg-blue-500 h-full w-1/2 rounded-full" />
              </div>
            </div>

            <div className="bg-[#FAF9F6] dark:bg-[#252422] p-3.5 rounded-xl border border-[#E6E5E0] dark:border-[#2E2D2A] space-y-1">
              <span className="text-xs font-mono text-[#71706C] dark:text-[#A19F9A] uppercase block font-bold">Payout Purity</span>
              <span className="text-base font-serif font-extrabold text-emerald-600 dark:text-emerald-400 block">≥90% Met Q4</span>
              <div className="w-full bg-[#E6E5E0] dark:bg-[#3E3D3A] h-1.5 rounded-full overflow-hidden mt-1">
                <div className="bg-emerald-500 h-full w-[90%] rounded-full" />
              </div>
            </div>

            <div className="bg-[#FAF9F6] dark:bg-[#252422] p-3.5 rounded-xl border border-[#E6E5E0] dark:border-[#2E2D2A] space-y-1">
              <span className="text-xs font-mono text-[#71706C] dark:text-[#A19F9A] uppercase block font-bold">Trustee Rating</span>
              <span className="text-base font-serif font-extrabold text-blue-600 dark:text-blue-400 block">CRISIL AAA</span>
              <div className="text-xs font-mono text-blue-500 font-bold">Capital Solvency Verified</div>
            </div>
          </div>
        </BentoStaggeredCard>

        {/* Bento Item 2 (Span 4): Ground Truth Citations */}
        <BentoStaggeredCard index={1} colSpan="md:col-span-4" className="flex flex-col justify-between">
          <div className="space-y-4">
            <div className="bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 p-3 rounded-xl w-fit">
              <Eye className="w-6 h-6 text-indigo-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1C1C1A] dark:text-[#F5F4F0]">
                Ground Truth Citations
              </h3>
              <p className="text-sm sm:text-base text-[#71706C] dark:text-[#A19F9A] leading-relaxed">
                All board-composition metrics, regulatory warnings, and distribution statistics reference official SEBI filings and statutory audit reports.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <div className="bg-[#FAF9F6] dark:bg-[#252422] p-3.5 rounded-xl border border-[#E6E5E0] dark:border-[#2E2D2A] space-y-1">
              <div className="flex items-center justify-between text-xs font-mono text-[#71706C] dark:text-[#A19F9A]">
                <span className="font-bold">SEBI Circular Reference</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              </div>
              <p className="text-xs font-mono font-bold text-[#1C1C1A] dark:text-[#F5F4F0]">SEBI/HO/DDHS/P/2023/115</p>
            </div>
          </div>
        </BentoStaggeredCard>

        {/* Bento Item 3 (Span 4): Yield Structure Clarity */}
        <BentoStaggeredCard index={2} colSpan="md:col-span-4" className="flex flex-col justify-between">
          <div className="space-y-4">
            <div className="bg-amber-500/10 text-amber-500 border border-amber-500/20 p-3 rounded-xl w-fit">
              <Coins className="w-6 h-6 text-amber-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1C1C1A] dark:text-[#F5F4F0]">
                Yield Structure Clarity
              </h3>
              <p className="text-sm sm:text-base text-[#71706C] dark:text-[#A19F9A] leading-relaxed">
                Clear, plain-language breakdowns of complex payout rules, lock-in structures, and Section 115UA taxation tiers.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-[#FAF9F6] dark:border-[#252422] flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              Tax Slabs Verified
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              Sec 115UA Tier
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              0% SGB LTCG Shield
            </span>
          </div>
        </BentoStaggeredCard>

        {/* Bento Item 4 (Span 8): Interactive Suitability Coach */}
        <BentoStaggeredCard index={3} colSpan="md:col-span-8">
          <div className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 p-3 rounded-xl">
                <Sparkles className="w-6 h-6 text-emerald-500" />
              </div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Grounded AI Coach Active
              </span>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1C1C1A] dark:text-[#F5F4F0]">
                Interactive Suitability Coach
              </h3>
              <p className="text-sm sm:text-base text-[#71706C] dark:text-[#A19F9A] leading-relaxed max-w-xl">
                Consult a highly specialized, server-protected Gemini expert that checks assets against your capital preservation or aggressive growth risk boundaries.
              </p>
            </div>
          </div>

          <div className="mt-6 bg-[#FAF9F6] dark:bg-[#252422] p-4 rounded-xl border border-[#E6E5E0] dark:border-[#2E2D2A] space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono text-emerald-500 font-bold">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Suitability Analysis & Risk Verification
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <p className="text-sm sm:text-base text-[#1C1C1A] dark:text-[#F5F4F0] font-sans font-medium italic leading-relaxed">
              "Your 15% REIT allocation provides quarterly cashflows aligned with your conservative preservation goals without introducing unhedged equity risk."
            </p>
            <div className="flex items-center gap-3 text-xs font-mono font-bold text-[#71706C] dark:text-[#A19F9A] pt-2 border-t border-[#E6E5E0]/60 dark:border-[#2E2D2A]">
              <span>Risk: Low Preservation</span>
              <span>•</span>
              <span className="text-emerald-500">Score: 88/100</span>
              <span>•</span>
              <span>SEBI LODR Compliant</span>
            </div>
          </div>
        </BentoStaggeredCard>

        {/* Bento Item 5 (Span 12): Wise.com Inspired Live Asset Comparison Matrix */}
        <BentoStaggeredCard index={4} colSpan="md:col-span-12" className="mt-1">
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FAF9F6] dark:border-[#252422] pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-blue-500 uppercase tracking-wider block mb-0.5">
                  Wise-Grade Asset Directory
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1C1C1A] dark:text-[#F5F4F0]">
                  Alternative Asset Class Comparison
                </h3>
              </div>
              <span className="text-xs font-mono text-[#71706C] dark:text-[#A19F9A]">
                Updated Real-Time via Account Aggregator
              </span>
            </div>

            {/* 4-Column Wise.com Style Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { name: 'REITs (Real Estate)', yield: '8.50% p.a.', tax: 'Sec 115UA Exempt', liquid: 'High (Exchange Traded)', color: 'border-l-blue-500' },
                { name: 'Sovereign Gold (SGB)', yield: '2.50% + Gold', tax: '100% LTCG Tax Free', liquid: '8 Yr Maturity', color: 'border-l-amber-500' },
                { name: 'InvITs (Infra Trust)', yield: '9.20% p.a.', tax: '90% Cashflow Mandate', liquid: 'Moderate', color: 'border-l-indigo-500' },
                { name: 'Govt Securities (G-Sec)', yield: '7.10% p.a.', tax: 'Sovereign Shield', liquid: 'High (RBI Retail)', color: 'border-l-emerald-500' }
              ].map((asset, i) => (
                <div 
                  key={i} 
                  className={`bg-[#FAF9F6] dark:bg-[#252422] border border-[#E6E5E0] dark:border-[#2E2D2A] border-l-4 ${asset.color} p-3.5 rounded-xl space-y-2 hover:border-blue-500 transition-all`}
                >
                  <h4 className="text-sm font-bold text-[#1C1C1A] dark:text-[#F5F4F0]">
                    {asset.name}
                  </h4>
                  <div className="text-base font-serif font-black text-blue-600 dark:text-blue-400">
                    {asset.yield}
                  </div>
                  <div className="space-y-0.5 text-xs font-mono text-[#71706C] dark:text-[#A19F9A]">
                    <div className="flex justify-between">
                      <span>Tax Tier:</span>
                      <span className="font-bold text-[#1C1C1A] dark:text-[#F5F4F0]">{asset.tax}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Liquidity:</span>
                      <span className="font-bold text-[#1C1C1A] dark:text-[#F5F4F0]">{asset.liquid}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </BentoStaggeredCard>

      </BentoStaggeredGrid>
    </div>
  );
}
