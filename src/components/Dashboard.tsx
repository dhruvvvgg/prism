import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { 
  TrendingUp, 
  Building2, 
  Radio, 
  ShieldAlert, 
  Coins, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles, 
  RefreshCw,
  ChevronRight,
  ShieldCheck,
  Percent
} from 'lucide-react';
import { personasData } from '../data';
import { PortfolioAsset, HoldingDetail } from '../types';

interface DashboardProps {
  onNavigateToDiscover: () => void;
}

// Map string icon names to Lucide icons
const getAssetIcon = (iconName: string, isDark: boolean) => {
  const baseClass = "h-5 w-5";
  switch (iconName) {
    case 'TrendingUp': return <TrendingUp className={`${baseClass} text-blue-600 dark:text-blue-400`} />;
    case 'Building2': return <Building2 className={`${baseClass} text-emerald-600 dark:text-emerald-400`} />;
    case 'Radio': return <Radio className={`${baseClass} text-indigo-600 dark:text-indigo-400`} />; // Purple changed to Indigo
    case 'ShieldAlert': return <ShieldAlert className={`${baseClass} text-amber-600 dark:text-amber-400`} />;
    case 'Coins': return <Coins className={`${baseClass} text-yellow-600 dark:text-yellow-400`} />;
    case 'ShieldCheck': return <ShieldCheck className={`${baseClass} text-sky-600 dark:text-sky-400`} />;
    case 'Percent': return <Percent className={`${baseClass} text-teal-600 dark:text-teal-400`} />;
    default: return <TrendingUp className={`${baseClass} text-blue-600 dark:text-blue-400`} />;
  }
};

// Map asset name to unique light/dark color classes (NO purple/violet!)
const getAssetColors = (name: string) => {
  if (name.includes('Equities')) {
    return { bg: 'bg-blue-500', bar: 'bg-blue-500', lightBg: 'bg-blue-50 dark:bg-blue-950/20', border: 'border-blue-100 dark:border-blue-900/30', text: 'text-blue-700 dark:text-blue-400' };
  }
  if (name.includes('REITs')) {
    return { bg: 'bg-emerald-500', bar: 'bg-emerald-500', lightBg: 'bg-emerald-50 dark:bg-emerald-950/20', border: 'border-emerald-100 dark:border-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400' };
  }
  if (name.includes('InvITs')) {
    // Purple replaced with Indigo
    return { bg: 'bg-indigo-500', bar: 'bg-indigo-500', lightBg: 'bg-indigo-50 dark:bg-indigo-950/20', border: 'border-indigo-100 dark:border-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-400' };
  }
  if (name.includes('Corporate')) {
    return { bg: 'bg-amber-500', bar: 'bg-amber-500', lightBg: 'bg-amber-50 dark:bg-amber-950/20', border: 'border-amber-100 dark:border-amber-900/30', text: 'text-amber-700 dark:text-amber-400' };
  }
  if (name.includes('Gold')) {
    return { bg: 'bg-yellow-500', bar: 'bg-yellow-500', lightBg: 'bg-yellow-50 dark:bg-yellow-950/20', border: 'border-yellow-100 dark:border-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400' };
  }
  if (name.includes('Government')) {
    return { bg: 'bg-sky-500', bar: 'bg-sky-500', lightBg: 'bg-sky-50 dark:bg-sky-950/20', border: 'border-sky-100 dark:border-sky-900/30', text: 'text-sky-700 dark:text-sky-400' };
  }
  if (name.includes('Debt')) {
    return { bg: 'bg-teal-500', bar: 'bg-teal-500', lightBg: 'bg-teal-50 dark:bg-teal-950/20', border: 'border-teal-100 dark:border-teal-900/30', text: 'text-teal-700 dark:text-teal-400' };
  }
  return { bg: 'bg-slate-500', bar: 'bg-slate-500', lightBg: 'bg-slate-50 dark:bg-slate-900/30', border: 'border-slate-100 dark:border-slate-800', text: 'text-slate-700 dark:text-slate-400' };
};

export default function Dashboard({ onNavigateToDiscover }: DashboardProps) {
  const shouldReduceMotion = useReducedMotion();
  const [activePersonaName, setActivePersonaName] = useState<string>(() => {
    return localStorage.getItem('prism_active_persona') || 'Rajesh';
  });

  const currentPersona = personasData.find(p => p.persona_name === activePersonaName) || personasData[0];

  const [portfolioAssets, setPortfolioAssets] = useState<PortfolioAsset[]>(currentPersona.asset_allocation);
  const [totalValue, setTotalValue] = useState<number>(currentPersona.total_portfolio_value);
  const [totalChange24h, setTotalChange24h] = useState<number>(currentPersona.total_change_24h);
  const [holdingsDetail, setHoldingsDetail] = useState<HoldingDetail[]>(currentPersona.holdings_detail);

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('Just now');
  const [syncError, setSyncError] = useState<string | null>(null);

  // Format currency in Indian Rupees style (Lakhs / Crores separator)
  const formatINR = (num: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num);
  };

  const handlePersonaChange = (name: string) => {
    setActivePersonaName(name);
    localStorage.setItem('prism_active_persona', name);
    const persona = personasData.find(p => p.persona_name === name) || personasData[0];
    setPortfolioAssets(persona.asset_allocation);
    setTotalValue(persona.total_portfolio_value);
    setTotalChange24h(persona.total_change_24h);
    setHoldingsDetail(persona.holdings_detail);
  };

  const syncPortfolioData = async () => {
    setIsSyncing(true);
    setSyncError(null);
    try {
      const persona = personasData.find(p => p.persona_name === activePersonaName) || personasData[0];
      setPortfolioAssets(persona.asset_allocation);
      setTotalValue(persona.total_portfolio_value);
      setTotalChange24h(persona.total_change_24h);
      setHoldingsDetail(persona.holdings_detail);
      setLastSyncedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err: any) {
      console.error('Failed to sync portfolio:', err);
      setSyncError(err.message || 'An error occurred during secure data fetching.');
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    syncPortfolioData();
  }, [activePersonaName]);

  const consentObjStr = localStorage.getItem('prism_latest_consent_object');
  const hasActiveConsent = !!consentObjStr;

  return (
    <div className="max-w-5xl mx-auto bg-[#FAF9F6] dark:bg-[#121212] min-h-screen pb-32 transition-colors duration-300">
      
      {/* Sleek Sub-Header Control Bar */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-[#E2E8F0] dark:border-slate-800 bg-white/40 dark:bg-transparent backdrop-blur-sm">
        <span className="text-xs font-bold tracking-wider text-[#64748B] dark:text-slate-400 uppercase">
          Workspace Hub
        </span>
        <div className="flex items-center space-x-3">
          {hasActiveConsent && (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={syncPortfolioData}
              disabled={isSyncing}
              className="p-1.5 rounded-xl border border-[#E2E8F0] dark:border-slate-800 hover:bg-white dark:hover:bg-[#262626] transition-all cursor-pointer text-[#475569] dark:text-slate-400 disabled:opacity-50 flex items-center space-x-1"
              title="Force sync data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="text-[10px] font-bold hidden sm:inline">Sync</span>
            </motion.button>
          )}
          <div className="flex items-center space-x-2 bg-white dark:bg-[#1E1E1E] px-3 py-1 rounded-full border border-[#E2E8F0] dark:border-slate-800">
            <span className={`w-1.5 h-1.5 rounded-full ${hasActiveConsent ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
            <span className="text-[10px] font-bold text-[#334155] dark:text-slate-300">
              {hasActiveConsent ? 'AA Consented' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      {!hasActiveConsent ? (
        <div className="px-6 pt-16 flex flex-col items-center justify-center text-center">
          <div className="bg-white dark:bg-[#1E1E1E] border border-[#E2E8F0] dark:border-slate-800 rounded-[24px] p-8 max-w-md w-full shadow-sm space-y-6">
            <div className="mx-auto w-12 h-12 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-display font-bold text-[#0F172A] dark:text-slate-50 tracking-tight">Portfolio Disconnected</h2>
              <p className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed">
                No active portfolio found. Please connect your accounts via secure SEBI Account Aggregator to continue.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                localStorage.setItem('prism_active_tab', 'onboarding');
                window.location.reload();
              }}
              className="w-full py-3.5 px-6 bg-everyday text-white font-bold text-xs rounded-full hover:opacity-95 transition shadow-sm cursor-pointer"
            >
              Connect Account Aggregator
            </motion.button>
          </div>
        </div>
      ) : (
        <div className="px-6 pt-6 flex flex-col gap-8">
          
          {/* Persona Switcher Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#1E1E1E] border border-[#E2E8F0] dark:border-slate-800/80 rounded-[24px] p-6 shadow-sm transition-colors duration-300">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase block">
                Active Portfolio Profile
              </span>
              <h3 className="text-base font-bold text-[#0F172A] dark:text-slate-100 mt-0.5">
                {activePersonaName === 'Rajesh' ? 'Rajesh (Conservative)' : 'Ananya (Growth-Oriented)'}
              </h3>
              <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1 leading-relaxed">
                {activePersonaName === 'Rajesh' 
                  ? 'Focuses heavily on capital preservation, secure cashflows, and tax-exempt Sovereign Gold Bonds near retirement.' 
                  : 'Focuses on aggressive indexing, high-yield alternative REITs & InvITs, and fast wealth compounding.'}
              </p>
            </div>
            
            <div className="flex bg-[#F1F5F9] dark:bg-[#262626] p-1 rounded-full border border-[#E2E8F0] dark:border-slate-800 self-start md:self-center shrink-0">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePersonaChange('Rajesh')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activePersonaName === 'Rajesh'
                    ? 'bg-white dark:bg-[#1E1E1E] text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-[#64748B] dark:text-slate-400 hover:text-[#334155] dark:hover:text-slate-200'
                }`}
              >
                Rajesh
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePersonaChange('Ananya')}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activePersonaName === 'Ananya'
                    ? 'bg-white dark:bg-[#1E1E1E] text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-[#64748B] dark:text-slate-400 hover:text-[#334155] dark:hover:text-slate-200'
                }`}
              >
                Ananya
              </motion.button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activePersonaName}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="flex flex-col gap-6 md:grid md:grid-cols-12 md:gap-8"
            >
              {/* Left Column - Portfolio Value & Asset Listings */}
              <div className="flex flex-col gap-8 md:col-span-7">
                {isSyncing ? (
                  <div className="bg-white dark:bg-[#1E1E1E] border border-[#E2E8F0] dark:border-slate-800 rounded-[24px] p-8 shadow-sm flex flex-col items-center justify-center text-center py-16 space-y-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <RefreshCw className="h-4 w-4 text-blue-600 animate-pulse" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-sm font-bold text-[#0F172A] dark:text-slate-100">Fetching your latest data...</h3>
                      <p className="text-xs text-[#64748B] dark:text-slate-400 max-w-xs leading-relaxed">
                        Securely communicating with the Account Aggregator nodes to retrieve your financial assets.
                      </p>
                    </div>
                  </div>
                ) : syncError ? (
                  <div className="bg-white dark:bg-[#1E1E1E] border border-rose-100 dark:border-rose-950/20 rounded-[24px] p-8 shadow-sm flex flex-col items-center justify-center text-center py-12 space-y-4">
                    <div className="w-12 h-12 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center">
                      <ShieldAlert className="h-6 w-6" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-sm font-bold text-rose-800 dark:text-rose-400">Failed to Retrieve Financial Data</h3>
                      <p className="text-xs text-rose-600 dark:text-rose-300 max-w-xs leading-relaxed">
                        {syncError}
                      </p>
                    </div>
                    <button 
                      onClick={syncPortfolioData}
                      className="px-4 py-2 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold text-xs rounded-full border border-rose-100 dark:border-rose-900 transition-colors cursor-pointer"
                    >
                      Retry Fetching Data
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Total Value Section */}
                    <motion.div 
                      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white dark:bg-[#1E1E1E] border border-[#E2E8F0] dark:border-slate-800 rounded-[24px] p-8 shadow-sm transition-colors duration-300"
                    >
                      <span className="text-xs font-bold tracking-wider text-[#64748B] dark:text-slate-400 uppercase">
                        Aggregated Portfolio Value
                      </span>
                      
                      <div className="mt-2 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4">
                        <h1 className="text-4xl sm:text-5xl font-display font-black text-[#0F172A] dark:text-slate-50 tracking-tight leading-none">
                          {formatINR(totalValue)}
                        </h1>
                        
                        <div className={`flex items-center space-x-1 px-3 py-1.5 rounded-full border self-start ${
                          totalChange24h >= 0 
                            ? 'bg-emerald-50 dark:bg-emerald-950/25 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30' 
                            : 'bg-rose-50 dark:bg-rose-950/25 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-900/30'
                        }`}>
                          {totalChange24h >= 0 ? (
                            <ArrowUpRight className="h-4 w-4 stroke-[2.5]" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 stroke-[2.5]" />
                          )}
                          <span className="text-xs font-extrabold">
                            {totalChange24h >= 0 ? `+${totalChange24h}%` : `${totalChange24h}%`}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-[11px] text-[#64748B] dark:text-slate-400 mt-4 flex items-center space-x-2 flex-wrap gap-y-1">
                        <span>Updated: {lastSyncedTime}</span>
                        <span className="inline-block w-1 h-1 rounded-full bg-[#E2E8F0] dark:bg-slate-800"></span>
                        <span>Securely synchronized via SEBI Account Aggregator</span>
                      </p>

                      {/* Stacked Percentage Allocation Bar */}
                      <div className="mt-8">
                        <div className="flex h-3.5 rounded-full overflow-hidden bg-[#F1F5F9] dark:bg-slate-800">
                          {portfolioAssets.map((asset, idx) => {
                            const colors = getAssetColors(asset.name);
                            return (
                              <motion.div 
                                key={idx}
                                initial={shouldReduceMotion ? { width: `${asset.percentage}%` } : { width: '0%' }}
                                animate={{ width: `${asset.percentage}%` }}
                                transition={{ duration: 0.8, delay: idx * 0.05, ease: 'easeOut' }}
                                className={`${colors.bar} h-full`}
                                title={`${asset.name}: ${asset.percentage}%`}
                              />
                            );
                          })}
                        </div>
                        
                        {/* Custom Mini Legend */}
                        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
                          {portfolioAssets.map((asset, idx) => {
                            const colors = getAssetColors(asset.name);
                            return (
                              <div key={idx} className="flex items-center space-x-2">
                                <span className={`w-2.5 h-2.5 rounded-full ${colors.bg}`}></span>
                                <span className="text-xs text-[#334155] dark:text-slate-300 font-bold">{asset.name.split(' ')[0]}</span>
                                <span className="text-xs text-[#64748B] dark:text-slate-400 font-semibold">{asset.percentage}%</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>

                    {/* Allocation Listings Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-1">
                        <h2 className="text-xs font-bold tracking-widest text-[#64748B] dark:text-slate-400 uppercase">
                          Asset Allocation Breakdown
                        </h2>
                      </div>

                      <motion.div 
                        initial="hidden"
                        animate="show"
                        variants={{
                          hidden: { opacity: 0 },
                          show: { opacity: 1, transition: { staggerChildren: shouldReduceMotion ? 0 : 0.05 } }
                        }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                      >
                        {portfolioAssets.map((asset, idx) => {
                          const colors = getAssetColors(asset.name);
                          return (
                            <motion.div 
                              key={idx}
                              variants={{
                                hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
                                show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
                              }}
                              whileHover={shouldReduceMotion ? {} : { scale: 1.015, y: -2 }}
                              whileTap={shouldReduceMotion ? {} : { scale: 0.985 }}
                              className="bg-white dark:bg-[#1E1E1E] border border-[#E2E8F0] dark:border-slate-800 rounded-[24px] p-5 flex flex-col justify-between shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors min-h-[140px] cursor-pointer"
                            >
                              <div className="flex justify-between items-start">
                                <div className={`p-2.5 rounded-xl ${colors.lightBg} ${colors.border}`}>
                                  {getAssetIcon(asset.icon, false)}
                                </div>
                                <span className="text-xs font-semibold text-[#64748B] dark:text-slate-400">
                                  {asset.percentage}% share
                                </span>
                              </div>

                              <div className="mt-4">
                                <h3 className="text-sm font-bold text-[#0F172A] dark:text-slate-100">
                                  {asset.name}
                                </h3>
                                <div className="flex justify-between items-baseline mt-1.5">
                                  <span className="text-xs text-[#64748B] dark:text-slate-400 font-semibold">
                                    {asset.count} {asset.count === 1 ? 'asset' : 'assets'}
                                  </span>
                                  <span className="text-sm font-bold text-[#0F172A] dark:text-slate-50">
                                    {formatINR(asset.value)}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    </div>

                    {/* Individual Holdings & Instruments Detail Panel */}
                    <div className="bg-white dark:bg-[#1E1E1E] border border-[#E2E8F0] dark:border-slate-800 rounded-[24px] p-6 shadow-sm transition-colors duration-300">
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="text-xs font-bold tracking-widest text-[#64748B] dark:text-slate-400 uppercase">
                          Individual Holdings & Instruments ({holdingsDetail.length})
                        </h3>
                        <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Depository Sync</span>
                      </div>
                      
                      <div className="space-y-4">
                        {holdingsDetail.map((holding, idx) => {
                          const colors = getAssetColors(holding.category);
                          return (
                            <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-800/50 last:border-b-0 last:pb-0">
                              <div>
                                <h4 className="text-xs font-bold text-[#0F172A] dark:text-slate-100 leading-normal">{holding.instrument_name}</h4>
                                <div className="flex items-center space-x-1.5 mt-1">
                                  <span className={`w-2 h-2 rounded-full ${colors.bg}`}></span>
                                  <span className="text-[10px] text-[#64748B] dark:text-slate-400 font-bold">{holding.category}</span>
                                  <span className="text-[10px] text-[#A8A29E] dark:text-slate-600">•</span>
                                  <span className="text-[10px] text-[#64748B] dark:text-slate-400 font-semibold">{holding.units_or_quantity}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-bold text-[#0F172A] dark:text-slate-50">
                                  {formatINR(holding.value)}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Right Column - Sticky Insights Panel */}
              <div className="flex flex-col gap-6 md:col-span-5 md:sticky md:top-24 self-start">
                
                {/* Dynamic Client-Side Portfolio Insights */}
                <div className="bg-white dark:bg-[#1E1E1E] border border-slate-100 dark:border-slate-800 rounded-[24px] p-6 relative overflow-hidden shadow-sm transition-colors duration-300">
                  
                  <div className="flex items-center space-x-2 mb-4">
                    <Sparkles className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-xs font-bold tracking-widest text-blue-800 dark:text-blue-300 uppercase">
                      Smart Insights
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {activePersonaName === 'Rajesh' ? (
                      <>
                        <div className="flex items-start space-x-3">
                          <span className="text-sm mt-0.5 shrink-0">🛡️</span>
                          <div>
                            <p className="text-xs font-bold text-[#0F172A] dark:text-slate-100">Capital Preservation Active</p>
                            <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1 leading-relaxed">
                              Your conservative portfolio holds 60% in secure fixed income instruments providing robust capital protection near retirement with stable yield generation.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <span className="text-sm mt-0.5 shrink-0">💡</span>
                          <div>
                            <p className="text-xs font-bold text-[#0F172A] dark:text-slate-100">Tax Optimization Notice</p>
                            <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1 leading-relaxed">
                              Sovereign Gold Bonds (15% allocation) are completely tax-exempt upon maturity, offering a highly tax-efficient hedge against inflation.
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-start space-x-3">
                          <span className="text-sm mt-0.5 shrink-0">🚀</span>
                          <div>
                            <p className="text-xs font-bold text-[#0F172A] dark:text-slate-100">Compounding Engine Active</p>
                            <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1 leading-relaxed">
                              Aggressive growth allocation with 65% in Equities & Mutual Funds, maximizing potential capital compounding and long-term appreciation.
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <span className="text-sm mt-0.5 shrink-0">🏢</span>
                          <div>
                            <p className="text-xs font-bold text-[#0F172A] dark:text-slate-100">Real Estate & Infra Yields</p>
                            <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1 leading-relaxed">
                              Your 15% REITs and 15% InvITs exposure adds robust cash-flowing real asset backing with an optimized yield-to-growth ratio.
                            </p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* CTA to Discover Tab styled with Everyday Gradient */}
                  <motion.button 
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onNavigateToDiscover}
                    className="w-full mt-6 bg-everyday text-white font-bold text-xs py-3.5 rounded-full hover:opacity-90 transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow"
                  >
                    <span>Discover Alternative Yields</span>
                    <ChevronRight className="h-4 w-4 stroke-[2.5]" />
                  </motion.button>
                </div>

              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
