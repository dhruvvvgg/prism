import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Scale, 
  Award, 
  Percent, 
  Calendar, 
  AlertCircle,
  HelpCircle,
  RefreshCw
} from 'lucide-react';
import { instrumentsData } from '../data';
import { Instrument, ConsentPermissions } from '../types';

const CitationDisplay = ({ citation }: { citation?: string }) => {
  if (!citation) return null;
  return (
    <div className="mt-2.5 p-3.5 bg-[#FAF9F6] dark:bg-[#262626] border border-[#E2E8F0] dark:border-slate-800 rounded-xl text-left select-text">
      <p className="text-xs font-semibold text-[#1E293B] dark:text-slate-200 leading-relaxed">
        {citation}
      </p>
      <p className="text-[10px] text-[#94A3B8] dark:text-slate-400 mt-1.5 font-bold flex items-center gap-1.5">
        🔍 Search this official filing title to verify independently.
      </p>
    </div>
  );
};

interface DiscoverProps {
  initialSelectedId?: string | null;
  permissions?: ConsentPermissions;
}

export default function Discover({ initialSelectedId, permissions }: DiscoverProps) {
  const shouldReduceMotion = useReducedMotion();
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId || null);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Local state to store our dynamic governance cache
  const [govCache, setGovCache] = useState<Record<string, any>>(() => {
    try {
      const stored = localStorage.getItem('prism_gov_cache');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const saveCache = (id: string, data: any) => {
    const updated = { ...govCache, [id]: data };
    setGovCache(updated);
    localStorage.setItem('prism_gov_cache', JSON.stringify(updated));
  };

  const calculateOverallScore = (metrics: any) => {
    if (!metrics) return 0;
    let totalWeight = 0;
    let weightedSum = 0;
    if (metrics.boardIndependence?.hasSufficientData && metrics.boardIndependence.score !== null) {
      weightedSum += metrics.boardIndependence.score * 40;
      totalWeight += 40;
    }
    if (metrics.regulatoryTrackRecord?.hasSufficientData && metrics.regulatoryTrackRecord.score !== null) {
      weightedSum += metrics.regulatoryTrackRecord.score * 30;
      totalWeight += 30;
    }
    if (metrics.distributionConsistency?.hasSufficientData && metrics.distributionConsistency.score !== null) {
      weightedSum += metrics.distributionConsistency.score * 30;
      totalWeight += 30;
    }
    return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
  };

  const handleFetchGovernance = async (id: string, name: string, force = false) => {
    if (analyzing) return;
    if (!force && govCache[id]) return;

    setAnalyzing(true);
    setError(null);
    try {
      const response = await fetch('/api/analyze-governance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instrumentId: id, instrumentName: name })
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch governance analysis');
      }
      
      const result = await response.json();
      saveCache(id, result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during analysis');
    } finally {
      setAnalyzing(false);
    }
  };

  const selectedInstrument = instrumentsData.find(item => item.id === selectedId);

  useEffect(() => {
    if (selectedId && selectedInstrument) {
      if (!govCache[selectedId]) {
        handleFetchGovernance(selectedId, selectedInstrument.name);
      }
    }
  }, [selectedId]);

  const cachedData = selectedId ? govCache[selectedId] : null;

  const currentInstrument = selectedInstrument ? {
    ...selectedInstrument,
    governanceScore: cachedData ? calculateOverallScore(cachedData.metrics) : selectedInstrument.governanceScore,
    governanceMetrics: cachedData ? {
      boardIndependence: cachedData.metrics.boardIndependence.score,
      boardIndependenceCitation: cachedData.metrics.boardIndependence.citation,
      boardIndependenceDetails: cachedData.metrics.boardIndependence.explanation,
      hasBoardIndependenceData: cachedData.metrics.boardIndependence.hasSufficientData,
      
      regulatoryTrackRecordScore: cachedData.metrics.regulatoryTrackRecord.score,
      regulatoryTrackRecordDetails: cachedData.metrics.regulatoryTrackRecord.explanation,
      regulatoryTrackRecordCitation: cachedData.metrics.regulatoryTrackRecord.citation,
      hasRegulatoryTrackRecordData: cachedData.metrics.regulatoryTrackRecord.hasSufficientData,
      
      distributionConsistencyScore: cachedData.metrics.distributionConsistency.score,
      distributionConsistencyDetails: cachedData.metrics.distributionConsistency.explanation,
      distributionConsistencyCitation: cachedData.metrics.distributionConsistency.citation,
      hasDistributionConsistencyData: cachedData.metrics.distributionConsistency.hasSufficientData,
      
      weights: selectedInstrument.governanceMetrics.weights
    } : {
      ...selectedInstrument.governanceMetrics,
      hasBoardIndependenceData: true,
      hasRegulatoryTrackRecordData: true,
      hasDistributionConsistencyData: true,
      boardIndependenceDetails: 'Proportion of non-executive, non-promoter directors sitting on the trust board. Ensures independent oversight on property acquisitions and related-party transactions.',
    }
  } : null;

  const getRatingLabel = (score: number) => {
    if (score >= 90) return { label: 'EXCELLENT', color: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30' };
    if (score >= 75) return { label: 'GOOD', color: 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-900/30' };
    if (score >= 50) return { label: 'MODERATE', color: 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/30' };
    return { label: 'POOR', color: 'bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-900/30' };
  };

  // Return badge colors for risk levels
  const getRiskBadgeStyles = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30';
      case 'Moderate': return 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-900/30';
      case 'High': return 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-900/30';
      case 'Very High': return 'bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-900/30';
      default: return 'bg-stone-50 dark:bg-slate-800 text-stone-700 dark:text-slate-300 border-stone-100 dark:border-slate-700';
    }
  };

  // Feature 2: 2D Risk-vs-Yield Matrix View State
  const [viewMode, setViewMode] = useState<'grid' | 'matrix'>('grid');

  // Feature 7: SIP & Post-Tax Calculator State
  const [sipAmount, setSipAmount] = useState<number>(10000);
  const [sipYears, setSipYears] = useState<number>(5);
  const [taxSlab, setTaxSlab] = useState<number>(30);

  return (
    <div className="max-w-5xl mx-auto bg-[#FAF9F6] dark:bg-[#121212] min-h-screen pb-32 transition-colors duration-300">
      
      {/* List View of All Instruments */}
      {!selectedInstrument ? (
        <div className="animate-fadeIn">
          {/* Sub Header */}
          <div className="border-b border-[#E2E8F0] dark:border-slate-800 px-6 py-5 bg-white/45 dark:bg-transparent backdrop-blur-sm flex items-center justify-between">
            <div>
              <h1 className="text-xl font-display font-black text-[#0F172A] dark:text-slate-50 tracking-tight">
                Alternative Securities
              </h1>
              <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1">
                Discover yield and inflation-hedging asset classes in India
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              SEBI Asset Directory
            </span>
          </div>

          {/* Feature 2: 2D Risk-vs-Yield Matrix Component */}
          <div className="px-6 pt-6">
            <div className="bg-white dark:bg-[#1E1E1E] border border-[#E2E8F0] dark:border-slate-800 rounded-[24px] p-6 space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A] dark:text-slate-100">
                    2D Risk vs. Yield Quadrant Matrix Grid
                  </h3>
                  <p className="text-xs text-[#64748B] dark:text-slate-400">
                    Visual comparison of expected returns against SEBI risk levels
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Interactive Matrix Grid
                </span>
              </div>

              {/* 2D Graph Canvas */}
              <div className="relative h-72 w-full border border-[#E2E8F0] dark:border-slate-800 rounded-2xl bg-[#FAF9F6]/50 dark:bg-[#121212]/50 p-4 flex flex-col justify-between overflow-hidden">
                {/* Y-Axis Label */}
                <div className="absolute top-3 left-3 text-[9px] font-mono text-[#64748B] dark:text-slate-400 font-bold uppercase">
                  ↑ Expected Yield (%)
                </div>

                {/* X-Axis Label */}
                <div className="absolute bottom-3 right-3 text-[9px] font-mono text-[#64748B] dark:text-slate-400 font-bold uppercase">
                  SEBI Risk Level →
                </div>

                {/* Matrix Axis Lines */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-full border-t border-dashed border-[#E2E8F0] dark:border-slate-800/80" />
                  <div className="h-full border-l border-dashed border-[#E2E8F0] dark:border-slate-800/80" />
                </div>

                {/* Plotted Asset Points */}
                {[
                  { id: 'gsecs', name: 'G-Secs (7.2%)', x: '15%', y: '70%', color: 'bg-emerald-500', risk: 'Low Risk', yield: '7.2%' },
                  { id: 'gold', name: 'SGB Gold (9.5%)', x: '25%', y: '45%', color: 'bg-amber-500', risk: 'Low Risk', yield: '9.5%' },
                  { id: 'debt-etf', name: 'Debt ETFs (7.5%)', x: '35%', y: '65%', color: 'bg-teal-500', risk: 'Moderate Risk', yield: '7.5%' },
                  { id: 'corp-bonds', name: 'Corp Bonds (10.5%)', x: '60%', y: '35%', color: 'bg-blue-500', risk: 'Moderate Risk', yield: '10.5%' },
                  { id: 'reits', name: 'REITs (8.8%)', x: '75%', y: '50%', color: 'bg-indigo-500', risk: 'High Risk', yield: '8.8%' },
                  { id: 'invits', name: 'InvITs (11.2%)', x: '85%', y: '25%', color: 'bg-rose-500', risk: 'High Risk', yield: '11.2%' }
                ].map((pt) => (
                  <motion.div
                    key={pt.id}
                    whileHover={{ scale: 1.15 }}
                    onClick={() => setSelectedId(pt.id)}
                    style={{ left: pt.x, top: pt.y }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                  >
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-md ${pt.color}`}>
                      <span>{pt.name}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 justify-between text-[10px] text-[#64748B] dark:text-slate-400 font-mono">
                <span>🟢 Sovereign / G-Secs (Absolute Zero Credit Risk)</span>
                <span>🔵 High-Yield Corporate Debt & InvITs</span>
                <span>🟡 Inflation-Hedging Gold SGBs</span>
              </div>
            </div>
          </div>

          <motion.div 
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: shouldReduceMotion ? 0 : 0.06 } }
            }}
            className="px-6 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {instrumentsData.map((instrument) => {
              const cached = govCache[instrument.id];
              const score = cached ? calculateOverallScore(cached.metrics) : instrument.governanceScore;
              return (
                <motion.div 
                  key={instrument.id}
                  variants={{
                    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 14 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
                  }}
                  whileHover={shouldReduceMotion ? {} : { scale: 1.015, y: -2 }}
                  whileTap={shouldReduceMotion ? {} : { scale: 0.985 }}
                  onClick={() => setSelectedId(instrument.id)}
                  className="bg-white dark:bg-[#1E1E1E] border border-[#E2E8F0] dark:border-slate-800/80 rounded-[24px] p-6 hover:border-blue-500 dark:hover:border-slate-700 cursor-pointer transition-colors shadow-sm hover:shadow-md flex flex-col justify-between min-h-[190px]"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="text-base font-serif font-bold text-[#0F172A] dark:text-slate-100 leading-tight">
                        {instrument.shortName}
                      </h2>
                      <div className="flex items-center space-x-1.5 shrink-0">
                        <span className="text-[10px] font-sans font-bold text-[#64748B] dark:text-slate-400 uppercase tracking-wider">
                          Gov Score:
                        </span>
                        <span className="text-xs font-serif font-bold px-2.5 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 rounded-full border border-blue-100 dark:border-blue-900/35">
                          {score}/100
                        </span>
                      </div>
                    </div>

                    <p className="text-xs font-sans text-[#64748B] dark:text-slate-400 leading-relaxed mt-2.5">
                      {instrument.tagline}
                    </p>
                  </div>

                  {/* Tags section for tax & risk */}
                  <div className="flex flex-wrap gap-2 mt-5">
                    <span className={`text-[10px] font-sans font-bold px-3 py-1 rounded-full border ${getRiskBadgeStyles(instrument.riskLevel)}`}>
                      Risk: {instrument.riskLevel}
                    </span>
                    <span className="text-[10px] font-sans font-bold px-3 py-1 rounded-full border bg-slate-50 dark:bg-[#262626] text-[#334155] dark:text-slate-300 border-slate-200 dark:border-slate-800 truncate max-w-[180px]">
                      Tax: {instrument.taxLabel.split(' (')[0]}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      ) : (
        /* Detailed View & Governance Snapshot Screen */
        <div className="animate-fadeIn">
          {/* Header with Back button */}
          <div className="border-b border-[#E2E8F0] dark:border-slate-800 px-6 py-4 bg-white/45 dark:bg-transparent backdrop-blur-sm sticky top-16 z-30 flex items-center space-x-4">
            <button 
              onClick={() => { setSelectedId(null); setIsHowItWorksOpen(false); }}
              className="p-2 rounded-xl bg-white dark:bg-[#1E1E1E] hover:bg-slate-50 dark:hover:bg-[#262626] border border-[#E2E8F0] dark:border-slate-800 transition-all cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 text-[#0F172A] dark:text-slate-300" />
            </button>
            <div>
              <h1 className="text-sm font-serif font-bold text-[#0F172A] dark:text-slate-100">
                {currentInstrument.shortName} Analysis
              </h1>
              <p className="text-[10px] text-[#64748B] dark:text-slate-400">
                Category Deep-Dive & Governance Snapshot
              </p>
            </div>
          </div>

          <div className="px-6 pt-6 flex flex-col gap-8 md:grid md:grid-cols-12 md:gap-8">
            
            {/* Left Column: Specs & Overview */}
            <div className="flex flex-col gap-6 md:col-span-6">
              {/* Core Instrument Intro Card */}
              <div>
                <span className="text-[10px] font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase block">
                  INSTRUMENT OVERVIEW
                </span>
                <h2 className="text-2xl font-display font-black text-[#0F172A] dark:text-slate-50 tracking-tight mt-1">
                  {currentInstrument.name}
                </h2>
                <p className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed mt-2">
                  {currentInstrument.description}
                </p>
              </div>

              {/* Quick specifications grid - Premium layout */}
              <div className="bg-white dark:bg-[#1E1E1E] border border-[#E2E8F0] dark:border-slate-800 rounded-[24px] overflow-hidden divide-y divide-[#E2E8F0] dark:divide-slate-800 shadow-sm transition-colors duration-300">
                <div className="grid grid-cols-2 divide-x divide-[#E2E8F0] dark:divide-slate-800 p-5">
                  <div className="pb-2">
                    <span className="text-[10px] font-bold text-[#64748B] dark:text-slate-400 block uppercase tracking-wider">
                      Yield Potential
                    </span>
                    <span className="text-sm font-bold text-[#0F172A] dark:text-slate-100 mt-1 block">
                      {currentInstrument.yieldPotential.split(' (')[0]}
                    </span>
                  </div>
                  <div className="pl-5 pb-2">
                    <span className="text-[10px] font-bold text-[#64748B] dark:text-slate-400 block uppercase tracking-wider">
                      Min Investment
                    </span>
                    <span className="text-sm font-bold text-[#0F172A] dark:text-slate-100 mt-1 block">
                      {currentInstrument.minInvestment}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 divide-x divide-[#E2E8F0] dark:divide-slate-800 p-5">
                  <div className="pt-2">
                    <span className="text-[10px] font-bold text-[#64748B] dark:text-slate-400 block uppercase tracking-wider">
                      Liquidity Profile
                    </span>
                    <span className="text-xs font-bold text-[#0F172A] dark:text-slate-100 mt-1 block">
                      {currentInstrument.liquidity}
                    </span>
                  </div>
                  <div className="pl-5 pt-2">
                    <span className="text-[10px] font-bold text-[#64748B] dark:text-slate-400 block uppercase tracking-wider">
                      Risk Category
                    </span>
                    <span className={`text-xs font-bold ${currentInstrument.riskLevel === 'Low' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'} mt-1 block`}>
                      {currentInstrument.riskLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Feature 7: Post-Tax Yield & SIP Compound Growth Calculator */}
              <div className="bg-white dark:bg-[#1E1E1E] border border-[#E2E8F0] dark:border-slate-800 rounded-[24px] p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Percent className="h-4 w-4 text-emerald-500" />
                    <h3 className="text-xs font-bold text-[#0F172A] dark:text-slate-100 uppercase tracking-wider">
                      Post-Tax Yield & SIP Compound Calculator
                    </h3>
                  </div>
                  <span className="text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Tax Adjusted
                  </span>
                </div>

                <div className="space-y-4 pt-1">
                  {/* SIP Monthly Amount Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-[#51504B] dark:text-[#D2CFC9]">
                      <span>Monthly Investment:</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono">₹{sipAmount.toLocaleString('en-IN')} / mo</span>
                    </div>
                    <input
                      type="range"
                      min="5000"
                      max="100000"
                      step="5000"
                      value={sipAmount}
                      onChange={(e) => setSipAmount(parseInt(e.target.value))}
                      className="w-full h-2 bg-[#E2E8F0] dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    />
                  </div>

                  {/* Duration & Tax Slab Selection */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#64748B] dark:text-slate-400 block uppercase">Duration:</span>
                      <select
                        value={sipYears}
                        onChange={(e) => setSipYears(parseInt(e.target.value))}
                        className="w-full bg-[#FAF9F6] dark:bg-[#262626] border border-[#E2E8F0] dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#0F172A] dark:text-slate-100"
                      >
                        <option value={3}>3 Years</option>
                        <option value={5}>5 Years</option>
                        <option value={8}>8 Years (SGB Maturity)</option>
                        <option value={10}>10 Years</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-[#64748B] dark:text-slate-400 block uppercase">Income Tax Slab:</span>
                      <select
                        value={taxSlab}
                        onChange={(e) => setTaxSlab(parseInt(e.target.value))}
                        className="w-full bg-[#FAF9F6] dark:bg-[#262626] border border-[#E2E8F0] dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#0F172A] dark:text-slate-100"
                      >
                        <option value={10}>10% Slab</option>
                        <option value={20}>20% Slab</option>
                        <option value={30}>30% Slab (Highest)</option>
                      </select>
                    </div>
                  </div>

                  {/* Results Callout */}
                  {(() => {
                    const baseYield = currentInstrument.id === 'gold' ? 0.095 : currentInstrument.id === 'invits' ? 0.112 : currentInstrument.id === 'corp-bonds' ? 0.105 : 0.075;
                    const totalInvested = sipAmount * 12 * sipYears;
                    const effectiveYield = currentInstrument.id === 'gold' ? baseYield : baseYield * (1 - taxSlab / 100 * 0.3);
                    const estFutureVal = totalInvested * Math.pow(1 + effectiveYield, sipYears);
                    const postTaxProfit = estFutureVal - totalInvested;

                    return (
                      <div className="p-3.5 bg-[#FAF9F6] dark:bg-[#262626] border border-[#E2E8F0] dark:border-slate-800 rounded-xl space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-[#64748B] font-semibold">Total Outflow:</span>
                          <span className="font-bold text-[#0F172A] dark:text-slate-100">₹{totalInvested.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#64748B] font-semibold">Est. Post-Tax Value:</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">₹{Math.round(estFutureVal).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between border-t border-[#E2E8F0] dark:border-slate-800 pt-1.5 text-[11px]">
                          <span className="text-emerald-700 dark:text-emerald-400 font-bold">Estimated Net Gains:</span>
                          <span className="font-extrabold text-emerald-600 dark:text-emerald-400">+₹{Math.round(postTaxProfit).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Tax Treatment Callout - Slice Card style */}
              <div className="bg-amber-50/40 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/35 rounded-[24px] p-6 transition-colors duration-300">
                <div className="flex items-center space-x-2 mb-2">
                  <Scale className="h-4.5 w-4.5 text-amber-600 dark:text-amber-400" />
                  <h3 className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                    Income Tax Treatment (India)
                  </h3>
                </div>
                <p className="text-xs text-amber-800 dark:text-amber-300 font-bold mb-1.5 leading-snug">
                  {currentInstrument.taxLabel}
                </p>
                <p className="text-[11px] text-[#64748B] dark:text-slate-400 leading-relaxed font-medium">
                  {currentInstrument.taxTreatment}
                </p>
              </div>

              {/* Disclaimer */}
              <div className="p-5 bg-slate-100 dark:bg-[#1E1E1E] border border-slate-200 dark:border-slate-800 rounded-[24px]">
                <div className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300 font-bold text-xs">
                  <AlertCircle className="h-4 w-4 text-[#64748B] dark:text-slate-400" />
                  <span>Disclaimer Note</span>
                </div>
                <p className="text-[10px] text-[#64748B] dark:text-slate-400 leading-relaxed mt-2 font-medium">
                  This is a category-level generic review of {currentInstrument.shortName} as a security archetype. Prism does not make specific security or trust purchase recommendations. 
                </p>
              </div>
            </div>

            {/* Right Column: Governance & Suitability */}
            <div className="flex flex-col gap-6 md:col-span-6">
              {/* GOVERNANCE SNAPSHOT SCREEN (Required Sub-Module) */}
              {permissions && !permissions.analysePortfolio ? (
                <div className="bg-white dark:bg-[#1E1E1E] border border-[#E2E8F0] dark:border-slate-800 rounded-[24px] p-8 text-center space-y-4 shadow-sm min-h-[250px] flex flex-col items-center justify-center">
                  <div className="p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-full">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <div className="space-y-2 max-w-sm">
                    <h3 className="text-sm font-bold text-[#0F172A] dark:text-slate-200">Permission required</h3>
                    <p className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed">
                      Permission required — enable <strong>Analyse Portfolio</strong> in Privacy settings to retrieve real-time governance metrics.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-[#1E1E1E] border border-[#E2E8F0] dark:border-slate-800 rounded-[24px] p-6 space-y-6 shadow-sm transition-colors duration-300">
                  
                  {/* Score header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold tracking-widest text-[#64748B] dark:text-slate-400 uppercase block">
                        GOVERNANCE QUALITY RATING
                      </span>
                      <h3 className="text-sm font-bold text-[#0F172A] dark:text-slate-300 mt-1">
                        Prism Integrity Score
                      </h3>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-display font-black text-[#0F172A] dark:text-slate-50 tracking-tight">
                        {currentInstrument.governanceScore}<span className="text-sm text-[#64748B] dark:text-slate-400 font-semibold font-sans">/100</span>
                      </div>
                      <span className={`text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border inline-block mt-2 ${getRatingLabel(currentInstrument.governanceScore).color}`}>
                        {getRatingLabel(currentInstrument.governanceScore).label}
                      </span>
                    </div>
                  </div>

                  {/* SIGNATURE GRADIENT PROGRESS BAR (MANDATED FOR GOVERNANCE SCORE PROGRESS BAR) */}
                  <div className="w-full bg-[#F1F5F9] dark:bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-[#E2E8F0]/40 dark:border-slate-800/40">
                    <motion.div 
                      initial={shouldReduceMotion ? { width: `${currentInstrument.governanceScore}%` } : { width: '0%' }}
                      animate={{ width: `${currentInstrument.governanceScore}%` }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                      className="bg-signature-horizontal h-full rounded-full"
                    />
                  </div>

                  {/* Refresh Action and dynamic AI indicator */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => handleFetchGovernance(currentInstrument.id, currentInstrument.name, true)}
                      disabled={analyzing}
                      className="flex items-center space-x-1.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 border border-blue-100 dark:border-blue-900/40 px-3.5 py-2 rounded-full transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <RefreshCw className={`h-3 w-3 ${analyzing ? 'animate-spin' : ''}`} />
                      <span>{analyzing ? 'Analyzing...' : 'Refresh Snapshot'}</span>
                    </button>
                    {cachedData && (
                      <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/20 px-2.5 py-1 rounded border border-emerald-100 dark:border-emerald-900/35">
                        Real-time Grounded AI Active
                      </span>
                    )}
                  </div>

                  {error && (
                    <div className="p-3 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900 text-rose-800 dark:text-rose-400 text-[11px] rounded-xl font-semibold">
                      Error calling Gemini: {error}
                    </div>
                  )}

                  {/* Expandable Panel Toggle */}
                  <button 
                    onClick={() => setIsHowItWorksOpen(!isHowItWorksOpen)}
                    className="w-full py-3 bg-[#F1F5F9] dark:bg-[#262626] border border-[#E2E8F0] dark:border-slate-800 rounded-xl flex items-center justify-between px-4 text-xs font-bold text-[#334155] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-1.5">
                      <HelpCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span>How is this calculated? (Granular breakdown)</span>
                    </div>
                    {isHowItWorksOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>

                  {/* Expanded Breakdown (NO monospace font!) */}
                  {isHowItWorksOpen && (
                    <div className="space-y-5 pt-3 border-t border-[#F1F5F9] dark:border-slate-800/80">
                      {/* Weighting Formula Display */}
                      <div className="p-3.5 bg-slate-50 dark:bg-[#262626] border border-slate-200 dark:border-slate-800 rounded-xl">
                        <span className="text-[9px] font-bold text-[#64748B] dark:text-slate-400 uppercase tracking-wider block">
                          SCORE COMPOSITION FORMULA
                        </span>
                        <p className="text-xs font-bold text-[#334155] dark:text-slate-300 mt-1 leading-normal">
                          (Board Independence × 40%) + (Reg Track Record × 30%) + (Distribution Consistency × 30%)
                        </p>
                      </div>

                      {/* Metric 1 */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#0F172A] dark:text-slate-100">
                            1. Board Independence
                          </span>
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                            {currentInstrument.governanceMetrics.hasBoardIndependenceData ? `${currentInstrument.governanceMetrics.boardIndependence}% Score` : 'Insufficient Data'} (Weight: 40%)
                          </span>
                        </div>
                        <p className="text-[11px] text-[#64748B] dark:text-slate-400 leading-relaxed font-medium">
                          {currentInstrument.governanceMetrics.boardIndependenceDetails}
                        </p>
                        <CitationDisplay citation={currentInstrument.governanceMetrics.boardIndependenceCitation} />
                      </div>

                      <hr className="border-t border-[#F1F5F9] dark:border-slate-800/80" />

                      {/* Metric 2 */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#0F172A] dark:text-slate-100">
                            2. Regulatory Track Record
                          </span>
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                            {currentInstrument.governanceMetrics.hasRegulatoryTrackRecordData ? `${currentInstrument.governanceMetrics.regulatoryTrackRecordScore}/100` : 'Insufficient Data'} (Weight: 30%)
                          </span>
                        </div>
                        <p className="text-[11px] text-[#64748B] dark:text-slate-400 leading-relaxed font-medium">
                          {currentInstrument.governanceMetrics.regulatoryTrackRecordDetails}
                        </p>
                        <CitationDisplay citation={currentInstrument.governanceMetrics.regulatoryTrackRecordCitation} />
                      </div>

                      <hr className="border-t border-[#F1F5F9] dark:border-slate-800/80" />

                      {/* Metric 3 */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#0F172A] dark:text-slate-100">
                            3. Distribution Consistency
                          </span>
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                            {currentInstrument.governanceMetrics.hasDistributionConsistencyData ? `${currentInstrument.governanceMetrics.distributionConsistencyScore}/100` : 'Insufficient Data'} (Weight: 30%)
                          </span>
                        </div>
                        <p className="text-[11px] text-[#64748B] dark:text-slate-400 leading-relaxed font-medium">
                          {currentInstrument.governanceMetrics.distributionConsistencyDetails}
                        </p>
                        <CitationDisplay citation={currentInstrument.governanceMetrics.distributionConsistencyCitation} />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Suitability Coach Preview (NO purple/violet!) */}
              <div className="bg-white dark:bg-[#1E1E1E] border border-[#E2E8F0] dark:border-slate-800 rounded-[24px] p-6 space-y-4 shadow-sm transition-colors duration-300">
                <span className="text-[10px] font-bold tracking-widest text-[#64748B] dark:text-slate-400 uppercase block">
                  SUITABILITY ANALYSIS
                </span>
                <p className="text-xs font-bold text-[#0F172A] dark:text-slate-200">
                  How this fits your specific financial goals:
                </p>
                
                <div className="space-y-3.5 text-xs">
                  <div className="p-4 bg-blue-50/40 dark:bg-blue-950/15 border border-blue-100 dark:border-blue-900/30 rounded-xl">
                    <span className="font-bold text-blue-800 dark:text-blue-300">💰 Regular Cashflow:</span>
                    <p className="text-[#334155] dark:text-slate-300 mt-1 leading-relaxed font-medium">{currentInstrument.suitabilityInsights.income}</p>
                  </div>
                  {/* Replaced purple with cyan */}
                  <div className="p-4 bg-cyan-50/40 dark:bg-cyan-950/15 border border-cyan-100 dark:border-cyan-900/30 rounded-xl">
                    <span className="font-bold text-cyan-800 dark:text-cyan-300">📈 Inflation Hedge:</span>
                    <p className="text-[#334155] dark:text-slate-300 mt-1 leading-relaxed font-medium">{currentInstrument.suitabilityInsights.inflation}</p>
                  </div>
                  <div className="p-4 bg-amber-50/40 dark:bg-amber-950/15 border border-amber-100 dark:border-amber-900/30 rounded-xl">
                    <span className="font-bold text-amber-800 dark:text-amber-300">🌱 Capital Growth:</span>
                    <p className="text-[#334155] dark:text-slate-300 mt-1 leading-relaxed font-medium">{currentInstrument.suitabilityInsights.growth}</p>
                  </div>
                </div>

                <CitationDisplay citation={currentInstrument.suitabilityInsights.citation} />
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
