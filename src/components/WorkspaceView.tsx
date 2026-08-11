import { useState, useEffect, KeyboardEvent, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { 
  TrendingUp, TrendingDown, Building2, Radio, ShieldCheck, ShieldAlert,
  Percent, Coins, HelpCircle, MessageSquare, Send, RefreshCw, 
  ExternalLink, CheckSquare, Settings, Compass, Info, Check, AlertTriangle, LogOut,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { instrumentsData, personasData, mockPortfolioAssets, mockTotalValue, mockTotalChange24h, sebiCircularsData } from '../data';
import { Instrument, Persona, ConsentPermissions, SEBICircularInfo } from '../types';
import SettingsTabContent from './Settings';
import InteractiveDonutChart from './DonutChart';

interface WorkspaceViewProps {
  selectedPersonaName: 'Rajesh' | 'Ananya' | null;
  onBackToModes: () => void;
  googleToken: string | null;
  onGoogleSignIn: () => void;
  onHardReset?: () => void;
  permissions?: ConsentPermissions;
  onUpdatePermissions?: (newPermissions: ConsentPermissions) => void;
}

export default function WorkspaceView({
  selectedPersonaName,
  onBackToModes,
  googleToken,
  onGoogleSignIn,
  onHardReset,
  permissions: externalPermissions,
  onUpdatePermissions,
}: WorkspaceViewProps) {
  const shouldReduceMotion = useReducedMotion();
  // Tabs: 'dashboard' | 'discover' | 'coach' | 'checklist' | 'settings'
  const [activeTab, setActiveTab] = useState<'dashboard' | 'discover' | 'coach' | 'checklist' | 'settings'>('dashboard');

  // Feature 1: Donut Chart Hover State
  const [hoveredSlice, setHoveredSlice] = useState<{ name: string; pct: number; color: string } | null>(null);

  // Feature 5: Stress Test Simulator Sliders
  const [stressRate, setStressRate] = useState<number>(0);
  const [stressInflation, setStressInflation] = useState<number>(0);

  // Sidebar Collapse / Shrink State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Feature 10: SEBI Circular Popup State
  const [activeCircular, setActiveCircular] = useState<SEBICircularInfo | null>(null);
  
  // Local permissions fallback sync with external prop
  const [localPermissions, setLocalPermissions] = useState<ConsentPermissions>(
    externalPermissions || { viewPortfolio: true, analysePortfolio: true, recommendProducts: true }
  );

  useEffect(() => {
    if (externalPermissions) {
      setLocalPermissions(externalPermissions);
    }
  }, [externalPermissions]);

  const permissions = externalPermissions || localPermissions;
  const setPermissions = (newPermissions: ConsentPermissions) => {
    setLocalPermissions(newPermissions);
    if (onUpdatePermissions) onUpdatePermissions(newPermissions);
  };
  
  // Active Persona State
  const [activePersona, setActivePersona] = useState<Persona | null>(null);
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument>(instrumentsData[0]);
  
  // Coach Chat State - isolated per persona
  const [chatHistory, setChatHistory] = useState<Array<{ id: string; role: 'user' | 'model'; text: string }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Helper to render bold markdown syntax (**text**) cleanly
  const renderChatMessageText = (text: string) => {
    if (!text) return null;
    const parts = [];
    const boldRegex = /\*\*(.*?)\*\*/g;
    let match;
    let lastIndex = 0;
    
    while ((match = boldRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      parts.push(
        <strong key={match.index} className="font-extrabold text-[#1C1C1A] dark:text-[#F5F4F0]">
          {match[1]}
        </strong>
      );
      lastIndex = boldRegex.lastIndex;
    }
    
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    
    return parts.length > 0 ? parts : text;
  };

  // Sync active persona and reset chat history for current persona
  useEffect(() => {
    if (selectedPersonaName) {
      const found = personasData.find(p => p.persona_name === selectedPersonaName);
      setActivePersona(found || null);
      const fullName = found?.persona_name || selectedPersonaName;
      setChatHistory([
        {
          id: `init-${selectedPersonaName}`,
          role: 'model',
          text: `Welcome to the Prism Suitability Coach. I have initialized the grounded audit context for **${fullName}** (${found?.persona_tagline || 'Investor Profile'}). I am referencing verified SEBI & RBI regulatory guidelines to evaluate risk exposure and suitability.`
        }
      ]);
    } else {
      setActivePersona(null);
      setChatHistory([
        {
          id: 'init-default',
          role: 'model',
          text: "Welcome to the Prism Suitability Coach. I am an AI specialist trained on SEBI and RBI regulatory frameworks for Indian alternative investments. How can I help audit your portfolio or guide your asset discovery today?"
        }
      ]);
    }
  }, [selectedPersonaName]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isChatLoading]);

  // Regulatory checklist states
  const [checklistItems, setChecklistItems] = useState([
    { id: 'item1', text: 'Verify REIT distributes at least 90% of NDCF quarterly', checked: true, category: 'REITs' },
    { id: 'item2', text: 'Check that InvIT net leverage stays under 70% of total asset value', checked: true, category: 'InvITs' },
    { id: 'item3', text: 'Audit board independence matches or exceeds 50%', checked: false, category: 'Corporate Governance' },
    { id: 'item4', text: 'Confirm high-yield bond credit rating is BBB- or higher', checked: true, category: 'Bonds' },
    { id: 'item5', text: 'Validate Sovereign Gold Bond (SGB) interest payouts semi-annually', checked: false, category: 'Sovereign Debt' },
    { id: 'item6', text: 'Inspect that mutual funds do not hold toxic promoter-pledged paper', checked: false, category: 'Equities' },
  ]);

  // Toggle checklist item
  const toggleChecklistItem = (id: string) => {
    setChecklistItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  // Icon mapping helper
  const getAssetIcon = (iconName: string) => {
    switch (iconName) {
      case 'TrendingUp': return <TrendingUp className="w-4 h-4 text-emerald-500" />;
      case 'Building2': return <Building2 className="w-4 h-4 text-blue-500" />;
      case 'Radio': return <Radio className="w-4 h-4 text-indigo-500" />;
      case 'ShieldAlert': return <ShieldAlert className="w-4 h-4 text-amber-500" />;
      case 'ShieldCheck': return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
      case 'Coins': return <Coins className="w-4 h-4 text-amber-500" />;
      case 'Percent': return <Percent className="w-4 h-4 text-teal-500" />;
      default: return <Coins className="w-4 h-4 text-blue-500" />;
    }
  };

  // Chat Submission
  const handleSendChat = async (overrideText?: string) => {
    const textToSend = overrideText || chatInput;
    if (!textToSend.trim() || isChatLoading) return;

    const userMsg = { id: Date.now().toString(), role: 'user' as const, text: textToSend };
    setChatHistory(prev => [...prev, userMsg]);
    if (!overrideText) setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          persona: activePersona ? activePersona.persona_name : 'General Investor',
          history: chatHistory.map(h => ({ role: h.role, text: h.text }))
        }),
      });

      if (!response.ok) {
        throw new Error('API server returned an error');
      }

      const data = await response.json();
      setChatHistory(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model' as const,
        text: data.reply || "Sorry, I had an issue processing your request."
      }]);
    } catch (err: any) {
      setChatHistory(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model' as const,
        text: `Error connecting to Suitability Coach API: ${err.message}. Please verify the server is active.`
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendChat();
    }
  };

  // Determine active portfolio dataset
  const portfolioTotal = activePersona ? activePersona.total_portfolio_value : mockTotalValue;
  const portfolioChange = activePersona ? activePersona.total_change_24h : mockTotalChange24h;
  const portfolioAssets = activePersona 
    ? activePersona.asset_allocation.map(a => ({
        name: a.name,
        value: a.value,
        percentage: a.percentage,
        change24h: a.change24h,
        count: a.count,
        icon: a.icon || 'Coins'
      }))
    : mockPortfolioAssets;

  const holdingsList = activePersona 
    ? activePersona.holdings_detail 
    : [
        { instrument_name: "Embassy Office Parks REIT", category: "REITs (Real Estate)", value: 150000, units_or_quantity: "450 units" },
        { instrument_name: "India Grid Trust", category: "InvITs (Infrastructure)", value: 180000, units_or_quantity: "1300 units" },
        { instrument_name: "7.18% GOI 2033 Bond", category: "Corporate Bonds (Debt)", value: 110000, units_or_quantity: "1100 units" },
        { instrument_name: "Sovereign Gold Bond 2023-I", category: "Sovereign Gold Bonds", value: 76150, units_or_quantity: "12 grams" }
      ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-140px)] lg:min-h-[600px] select-none py-2 font-sans"
    >
      {/* LEFT COLUMN: Sidebar Navigation Panel with Responsive Mobile & Widescreen Motion Sizing */}
      <motion.div 
        animate={{ width: typeof window !== 'undefined' && window.innerWidth < 1024 ? '100%' : (isSidebarCollapsed ? 80 : 280) }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-full lg:w-auto bg-white dark:bg-[#1C1B19] border border-[#E6E5E0] dark:border-[#2E2D2A] rounded-[2rem] p-4 sm:p-5 flex flex-col justify-start lg:justify-between h-auto lg:h-full ballpark-shadow transition-colors duration-300 overflow-hidden shrink-0"
      >
        <AnimatePresence mode="wait">
          {isSidebarCollapsed ? (
            /* COLLAPSED RAIL VIEW (Compact Icon Mode for Desktop) */
            <motion.div
              key="collapsed-rail"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center justify-between h-full w-full py-2 space-y-6"
            >
              <div className="flex flex-col items-center space-y-5">
                {/* Profile Avatar Badge */}
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="h-10 w-10 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center font-extrabold text-sm shadow-sm cursor-pointer"
                  title={activePersona ? `${activePersona.persona_name}'s Wealth` : 'My Portfolio'}
                >
                  {activePersona ? activePersona.persona_name[0] : 'P'}
                </motion.div>

                {/* Compact Nav Icon Rail */}
                <nav className="flex flex-col gap-3">
                  {[
                    { id: 'dashboard' as const, label: 'Portfolio Dashboard', icon: <Building2 className="w-5 h-5" /> },
                    { id: 'discover' as const, label: 'Discover Assets', icon: <Compass className="w-5 h-5" /> },
                    { id: 'coach' as const, label: 'Suitability Coach', icon: <MessageSquare className="w-5 h-5" /> },
                    { id: 'checklist' as const, label: 'Compliance Checklist', icon: <CheckSquare className="w-5 h-5" /> },
                    { id: 'settings' as const, label: 'Privacy & Settings', icon: <Settings className="w-5 h-5" /> }
                  ].map((tab) => (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setActiveTab(tab.id)}
                      title={tab.label}
                      className={`p-3 rounded-xl transition-all cursor-pointer ${
                        activeTab === tab.id
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 shadow-sm'
                          : 'text-[#71706C] dark:text-[#A19F9A] hover:bg-[#FAF9F6] dark:hover:bg-[#252422] hover:text-[#1C1C1A] dark:hover:text-[#F5F4F0]'
                      }`}
                    >
                      {tab.icon}
                    </motion.button>
                  ))}
                </nav>
              </div>

              {/* Expand Sidebar Button (Desktop Only) */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSidebarCollapsed(false)}
                className="hidden lg:flex p-3 rounded-xl bg-[#FAF9F6] dark:bg-[#252422] hover:bg-slate-200 dark:hover:bg-[#2E2D2A] border border-[#E6E5E0] dark:border-[#2E2D2A] text-[#71706C] dark:text-[#A19F9A] hover:text-[#1C1C1A] dark:hover:text-[#F5F4F0] transition-all cursor-pointer shadow-sm"
                title="Expand Sidebar"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          ) : (
            /* EXPANDED FULL SIDEBAR VIEW (Responsive Layout) */
            <motion.div
              key="expanded-sidebar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col justify-start lg:justify-between h-auto lg:h-full space-y-3 lg:space-y-5"
            >
              <div className="space-y-3 lg:space-y-5">
                {/* Active Profile Info Card - Responsive Banner */}
                <div className="p-3.5 sm:p-4 bg-[#FAF9F6] dark:bg-[#252422] border border-[#E6E5E0] dark:border-[#2E2D2A] rounded-2xl space-y-1 transition-colors duration-300">
                  <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-blue-500 block">
                    Active Investment Profile
                  </span>
                  <div className="flex items-center justify-between lg:block">
                    <h3 className="text-base sm:text-lg font-serif font-black text-[#1C1C1A] dark:text-[#F5F4F0] transition-colors duration-300">
                      {activePersona ? `${activePersona.persona_name}'s Wealth` : 'My Linked Portfolio'}
                    </h3>
                    <span className="lg:hidden text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      AA Verified
                    </span>
                  </div>
                  <p className="text-[11px] text-[#71706C] dark:text-[#A19F9A] leading-relaxed transition-colors duration-300">
                    {activePersona ? activePersona.persona_tagline : 'Linked via Account Aggregator secure Sandbox mode.'}
                  </p>
                </div>

                {/* Navigation Tabs - Mobile Optimized Proportional Distance */}
                <nav className="flex lg:flex-col overflow-x-auto scrollbar-none gap-2.5 w-full items-center lg:items-stretch">
                  {[
                    { id: 'dashboard' as const, label: 'Portfolio Dashboard', shortLabel: 'Dashboard', icon: <Building2 className="w-4 h-4 shrink-0" /> },
                    { id: 'discover' as const, label: 'Discover Assets', shortLabel: 'Discover', icon: <Compass className="w-4 h-4 shrink-0" /> },
                    { id: 'coach' as const, label: 'Suitability Coach', shortLabel: 'Coach', icon: <MessageSquare className="w-4 h-4 shrink-0" /> },
                    { id: 'checklist' as const, label: 'Compliance Checklist', shortLabel: 'Checklist', icon: <CheckSquare className="w-4 h-4 shrink-0" /> },
                    { id: 'settings' as const, label: 'Privacy & Settings', shortLabel: 'Settings', icon: <Settings className="w-4 h-4 shrink-0" /> }
                  ].map((tab) => (
                    <motion.button
                      key={tab.id}
                      whileHover={{ x: shouldReduceMotion ? 0 : 4 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 sm:gap-3 px-3.5 py-2.5 sm:py-3 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                        activeTab === tab.id
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 lg:border-none lg:border-l-2 lg:border-blue-500 shadow-sm'
                          : 'text-[#71706C] dark:text-[#A19F9A] hover:bg-[#FAF9F6] dark:hover:bg-[#252422] hover:text-[#1C1C1A] dark:hover:text-[#F5F4F0]'
                      }`}
                    >
                      {tab.icon}
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden">{tab.shortLabel}</span>
                    </motion.button>
                  ))}
                </nav>
              </div>

              {/* Regulatory Footer & Shrink Button (Desktop Widescreen Only) */}
              <div className="hidden lg:block space-y-3.5 pt-4 border-t border-[#FAF9F6] dark:border-[#2E2D2A]">
                <div className="px-3 text-[9px] font-mono text-[#71706C] dark:text-[#A19F9A] flex items-center justify-between">
                  <span>SEBI & RBI Framework</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">● Active</span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsSidebarCollapsed(true)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#FAF9F6] dark:bg-[#252422] hover:bg-slate-200 dark:hover:bg-[#2E2D2A] border border-[#E6E5E0] dark:border-[#2E2D2A] text-xs font-bold text-[#71706C] dark:text-[#A19F9A] hover:text-[#1C1C1A] dark:hover:text-[#F5F4F0] transition-all cursor-pointer shadow-sm"
                  title="Shrink sidebar for wider right content view"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Shrink Sidebar</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* RIGHT COLUMN: Dynamic Active Screen View Container */}
      <motion.div 
        layout="position"
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="flex-1 min-w-0 border border-[#E6E5E0] dark:border-[#2E2D2A] bg-white dark:bg-[#1C1B19] rounded-[2rem] flex flex-col h-[500px] md:h-[600px] lg:h-full overflow-hidden ballpark-shadow transition-colors duration-300"
      >
        
        {/* HEADER BAR FOR ACTIVE SCREEN */}
        <div className="border-b border-[#FAF9F6] dark:border-[#2E2D2A] bg-[#FAF9F6]/60 dark:bg-[#252422]/60 px-6 py-4 flex items-center justify-between transition-colors duration-300">
          <div className="flex items-center gap-3">
            <div className="bg-white dark:bg-[#1C1B19] border border-[#E6E5E0] dark:border-[#2E2D2A] p-2 rounded-lg text-blue-500 transition-colors duration-300">
              {activeTab === 'dashboard' ? <Building2 className="w-4 h-4" /> : activeTab === 'discover' ? <Compass className="w-4 h-4" /> : activeTab === 'coach' ? <MessageSquare className="w-4 h-4" /> : activeTab === 'checklist' ? <CheckSquare className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-xs font-serif font-bold text-[#1C1C1A] dark:text-[#F5F4F0] transition-colors duration-300">
                {activeTab === 'dashboard' ? 'Portfolio Allocation & Holdings' : activeTab === 'discover' ? 'Alternative Asset Explorer' : activeTab === 'coach' ? 'AI Suitability Coach (Interactive)' : activeTab === 'checklist' ? 'SEBI / RBI Compliance Checkpoints' : 'Privacy & Consent Settings'}
              </h3>
              <p className="text-[9px] text-[#71706C] dark:text-[#A19F9A] font-sans uppercase tracking-widest font-bold transition-colors duration-300">
                {activePersona ? `Seeded Profile: ${activePersona.persona_name}` : 'Sandbox Live Account Aggregator Feed'}
              </p>
            </div>
          </div>
        </div>

        {/* CONTAINER VIEWPORTS */}
        <div className={`flex-1 select-text ${activeTab === 'coach' ? 'flex flex-col min-h-0 overflow-hidden p-6' : 'p-6 md:p-8 overflow-y-auto scrollbar-thin'}`}>
          
          {/* TAB 1: PORTFOLIO DASHBOARD */}
          {activeTab === 'dashboard' && (
            <motion.div 
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: shouldReduceMotion ? 0 : 0.06 } }
              }}
              className="space-y-6"
            >
              {/* Highlight Cards */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Hero Master Card: Aggregated Portfolio Value (Span 7) */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
                  }}
                  whileHover={shouldReduceMotion ? {} : { y: -2 }}
                  className="md:col-span-7 bg-[#FAF9F6] dark:bg-[#252422] border-2 border-[#E6E5E0] dark:border-[#2E2D2A] border-t-blue-500 rounded-3xl p-6 sm:p-7 transition-colors duration-300 shadow-sm relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#71706C] dark:text-[#A19F9A]">
                        Aggregated Net Worth (AA Linked)
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[9px] font-mono font-extrabold uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                        <ShieldCheck className="w-3 h-3 text-emerald-500" />
                        AA Sandbox Verified
                      </span>
                    </div>

                    <div>
                      <h4 className="text-4xl sm:text-5xl font-serif font-black text-[#1C1C1A] dark:text-[#F5F4F0] tracking-tight transition-colors duration-300">
                        ₹{portfolioTotal.toLocaleString('en-IN')}
                      </h4>
                    </div>
                  </div>

                  {/* Multi-segment Asset Distribution Bar */}
                  <div className="mt-6 pt-5 border-t border-[#E6E5E0]/60 dark:border-[#2E2D2A] space-y-2.5">
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#71706C] dark:text-[#A19F9A]">
                      <span>ASSET ALLOCATION BREAKDOWN</span>
                      <span>5 INSTRUMENT CLASSES</span>
                    </div>
                    
                    <div className="h-3.5 w-full bg-[#E6E5E0] dark:bg-[#1C1B19] rounded-full overflow-hidden flex p-0.5 gap-0.5 border border-[#E6E5E0] dark:border-[#2E2D2A]">
                      <div style={{ width: '40%' }} className="bg-emerald-500 h-full rounded-l-full" title="Govt Securities (40%)" />
                      <div style={{ width: '20%' }} className="bg-teal-500 h-full" title="Debt ETFs (20%)" />
                      <div style={{ width: '15%' }} className="bg-indigo-500 h-full" title="Equities (15%)" />
                      <div style={{ width: '15%' }} className="bg-amber-500 h-full" title="SGBs (15%)" />
                      <div style={{ width: '10%' }} className="bg-blue-500 h-full rounded-r-full" title="Corporate Bonds (10%)" />
                    </div>

                    {/* Horizontal Inline Legend Line (Matching User Screenshot Exactly) */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2.5 text-xs sm:text-sm font-mono font-semibold text-[#51504B] dark:text-[#D2CFC9]">
                      {[
                        { name: 'Govt Sec', pct: 40, color: 'bg-emerald-500' },
                        { name: 'Debt ETFs', pct: 20, color: 'bg-teal-500' },
                        { name: 'Equities', pct: 15, color: 'bg-indigo-500' },
                        { name: 'SGB Gold', pct: 15, color: 'bg-amber-500' },
                        { name: 'Corp Bonds', pct: 10, color: 'bg-blue-500' }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${item.color} shrink-0`} />
                          <span>{item.name} ({item.pct}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Audit Score Card (Span 5) */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.3 } }
                  }}
                  whileHover={shouldReduceMotion ? {} : { y: -2 }}
                  className="md:col-span-5 bg-[#FAF9F6] dark:bg-[#252422] border-2 border-[#E6E5E0] dark:border-[#2E2D2A] border-t-emerald-500 rounded-3xl p-6 sm:p-7 transition-colors duration-300 flex flex-col justify-between shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#71706C] dark:text-[#A19F9A]">
                        Diversity Audit Score
                      </span>
                      <span className="text-[9px] font-mono font-bold text-blue-500 uppercase">
                        SEBI Scorecard
                      </span>
                    </div>

                    {permissions.analysePortfolio ? (
                      <div>
                        <h4 className="text-3xl font-serif font-black text-emerald-600 dark:text-emerald-400 mt-1">
                          {activePersona && activePersona.persona_name === 'Rajesh' ? '88/100 (High Preservation)' : activePersona ? '72/100 (Aggressive Growth)' : '81/100 (Balanced Risk)'}
                        </h4>
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full mt-2">
                          ✓ Optimal Liquidity & Payout Structure
                        </span>
                      </div>
                    ) : (
                      <div>
                        <h4 className="text-xl font-serif font-bold text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1.5">
                          <AlertTriangle className="w-4.5 h-4.5 inline" />
                          Analysis Disabled
                        </h4>
                        <span className="text-[10px] font-mono text-amber-500 block mt-1">
                          Privacy restriction active
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#E6E5E0]/60 dark:border-[#2E2D2A]">
                    <p className="text-xs text-[#71706C] dark:text-[#A19F9A] leading-relaxed">
                      {permissions.analysePortfolio
                        ? 'Measures structural compliance, lock-in safety weights, and liquidity ratings as guided by SEBI regulations.'
                        : 'Permission required — enable "Analyse Portfolio" in Privacy & Settings to unlock structural audit scoring.'}
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Feature 5: What-If Macro Stress Test & Inflation Simulator */}
              <div className="bg-[#FAF9F6] dark:bg-[#252422] border-2 border-[#E6E5E0] dark:border-[#2E2D2A] rounded-3xl p-6 space-y-4 shadow-sm transition-colors duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="w-4 h-4 text-blue-500" />
                    <h4 className="text-sm font-bold text-[#1C1C1A] dark:text-[#F5F4F0]">
                      Interactive "What-If" Macro Stress Test Simulator
                    </h4>
                  </div>
                  <span className="text-[9px] font-mono font-bold text-blue-500 uppercase bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                    Real-Time Simulation
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Interest Rate Delta Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-[#51504B] dark:text-[#D2CFC9]">
                      <span>RBI Repo Rate Change:</span>
                      <span className="text-blue-600 dark:text-blue-400 font-mono">{stressRate > 0 ? `+${stressRate}%` : `${stressRate}%`}</span>
                    </div>
                    <input
                      type="range"
                      min="-2"
                      max="3"
                      step="0.5"
                      value={stressRate}
                      onChange={(e) => setStressRate(parseFloat(e.target.value))}
                      className="w-full h-2 bg-[#E6E5E0] dark:bg-[#1C1B19] rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <div className="flex justify-between text-[9px] font-mono text-[#71706C] dark:text-[#A19F9A]">
                      <span>-2% (Rate Cuts)</span>
                      <span>0% (Baseline)</span>
                      <span>+3% (Tightening)</span>
                    </div>
                  </div>

                  {/* Inflation Delta Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-[#51504B] dark:text-[#D2CFC9]">
                      <span>Inflation Shock Expectation:</span>
                      <span className="text-amber-600 dark:text-amber-400 font-mono">+{stressInflation}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="6"
                      step="1"
                      value={stressInflation}
                      onChange={(e) => setStressInflation(parseFloat(e.target.value))}
                      className="w-full h-2 bg-[#E6E5E0] dark:bg-[#1C1B19] rounded-lg appearance-none cursor-pointer accent-amber-600"
                    />
                    <div className="flex justify-between text-[9px] font-mono text-[#71706C] dark:text-[#A19F9A]">
                      <span>0% (4% CPI target)</span>
                      <span>+3% (Moderate)</span>
                      <span>+6% (High CPI)</span>
                    </div>
                  </div>
                </div>

                {/* Simulated Outcome Banner */}
                <div className="p-4 bg-white dark:bg-[#1C1B19] border border-[#E6E5E0] dark:border-[#2E2D2A] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#71706C] dark:text-[#A19F9A] uppercase block">
                      SIMULATED PORTFOLIO YIELD IMPACT
                    </span>
                    <span className="font-extrabold text-[#1C1C1A] dark:text-[#F5F4F0] text-sm">
                      Projected Annual Return: {(7.8 - stressRate * 0.4 + stressInflation * 0.25).toFixed(2)}%
                    </span>
                  </div>

                  <div className="text-right">
                    <span className={`font-extrabold text-xs px-2.5 py-1 rounded-full border inline-block ${
                      stressInflation > 2 ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                    }`}>
                      {stressInflation > 2 ? '✓ SGBs & REITs Actively Hedging Inflation' : '✓ Standard Stable Payouts'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Detailed Holdings List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-serif font-bold text-[#1C1C1A] dark:text-[#F5F4F0] transition-colors duration-300">
                    Individual Holdings Audit
                  </h4>
                  <span className="text-[10px] font-mono text-[#71706C] dark:text-[#A19F9A] sm:hidden">
                    Scroll horizontally ↔
                  </span>
                </div>
                <div className="border border-[#E6E5E0] dark:border-[#2E2D2A] rounded-2xl overflow-x-auto scrollbar-thin bg-[#FAF9F6]/20 dark:bg-[#1C1B19]/20">
                  <table className="w-full text-left border-collapse text-sm min-w-[540px] sm:min-w-full">
                    <thead>
                      <tr className="bg-[#FAF9F6] dark:bg-[#252422] border-b border-[#E6E5E0] dark:border-[#2E2D2A] text-[#71706C] dark:text-[#A19F9A] font-bold text-xs uppercase tracking-wider">
                        <th className="p-3 sm:p-3.5">Instrument</th>
                        <th className="p-3 sm:p-3.5">Category</th>
                        <th className="p-3 sm:p-3.5 text-right">Holdings</th>
                        <th className="p-3 sm:p-3.5 text-right">Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E6E5E0] dark:divide-[#2E2D2A] text-[#51504B] dark:text-[#D2CFC9]">
                      {holdingsList.map((h, i) => (
                        <tr key={i} className="hover:bg-[#FAF9F6]/50 dark:hover:bg-[#252422]/50 transition-colors">
                          <td className="p-3 sm:p-3.5 font-bold text-[#1C1C1A] dark:text-[#F5F4F0] text-xs sm:text-sm">{h.instrument_name}</td>
                          <td className="p-3 sm:p-3.5 text-neutral-500 dark:text-neutral-400 text-[11px] sm:text-xs font-semibold">{h.category}</td>
                          <td className="p-3 sm:p-3.5 text-right font-mono text-[11px] sm:text-xs font-medium">{h.units_or_quantity}</td>
                          <td className="p-3 sm:p-3.5 text-right font-bold text-[#1C1C1A] dark:text-[#F5F4F0] text-xs sm:text-sm">₹{h.value.toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: DISCOVER PORTAL */}
          {activeTab === 'discover' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
              {/* Instrument list */}
              <div className="lg:col-span-5 flex flex-col gap-3">
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#71706C] dark:text-[#A19F9A]">
                  Select Asset Class
                </span>
                <div className="space-y-2 max-h-[380px] lg:max-h-[500px] overflow-y-auto pr-1">
                  {instrumentsData.map((inst) => (
                    <button
                      key={inst.id}
                      onClick={() => setSelectedInstrument(inst)}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                        selectedInstrument.id === inst.id
                          ? 'border-blue-500 bg-blue-500/5 dark:bg-blue-500/10'
                          : 'border-[#E6E5E0] dark:border-[#2E2D2A] hover:bg-[#FAF9F6] dark:hover:bg-[#252422]'
                      }`}
                    >
                      <div>
                        <h4 className="text-xs font-extrabold text-[#1C1C1A] dark:text-[#F5F4F0] block">
                          {inst.name}
                        </h4>
                        <span className="text-[10px] text-[#71706C] dark:text-[#A19F9A]">
                          {inst.riskLevel} Risk • Yield: {inst.yieldPotential.split(' ')[0]}
                        </span>
                      </div>
                      <div className="bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black px-2 py-1 rounded-lg">
                        {inst.governanceScore}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Instrument Details Sheet */}
              <div className="lg:col-span-7 bg-[#FAF9F6]/50 dark:bg-[#252422]/20 border border-[#E6E5E0] dark:border-[#2E2D2A] rounded-2xl p-6 space-y-6 overflow-y-auto max-h-[420px] lg:max-h-[500px]">
                {/* Header */}
                <div className="border-b border-[#E6E5E0] dark:border-[#2E2D2A] pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full border border-blue-500/20 whitespace-nowrap shrink-0">
                        {selectedInstrument.shortName} Rating
                      </span>
                      <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 whitespace-nowrap">
                        AA Audited
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-xs sm:text-sm font-bold text-[#1C1C1A] dark:text-[#F5F4F0]">
                      <span className="text-[#71706C] dark:text-[#A19F9A]">Governance Score:</span>
                      <span className="text-blue-500 font-extrabold text-base sm:text-lg">{selectedInstrument.governanceScore}/100</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-[#1C1C1A] dark:text-[#F5F4F0] mt-2 leading-tight">
                    {selectedInstrument.name}
                  </h3>
                  <p className="text-xs text-[#71706C] dark:text-[#A19F9A] mt-1 leading-relaxed italic">
                    “{selectedInstrument.tagline}”
                  </p>
                </div>

                {/* Main description */}
                <div className="space-y-2">
                  <label className="text-[10px] font-sans font-bold text-[#71706C] dark:text-[#A19F9A] uppercase tracking-wider block">
                    Product Summary
                  </label>
                  <p className="text-xs leading-relaxed text-[#51504B] dark:text-[#D2CFC9]">
                    {selectedInstrument.description}
                  </p>
                </div>

                {/* Metric breakdown */}
                <div className="space-y-3">
                  <label className="text-[10px] font-sans font-bold text-[#71706C] dark:text-[#A19F9A] uppercase tracking-wider block">
                    SEBI & RBI Audit Sub-Scores
                  </label>
                  
                  <div className="space-y-4">
                    {/* Board Independence */}
                    <div className="space-y-1 bg-white dark:bg-[#1C1B19] border border-[#E6E5E0] dark:border-[#2E2D2A] p-4 rounded-xl">
                      <div className="flex justify-between text-xs font-bold text-[#1C1C1A] dark:text-[#F5F4F0]">
                        <span>Board Independence</span>
                        <span className="text-blue-500">{selectedInstrument.governanceMetrics.boardIndependence}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#FAF9F6] dark:bg-[#252422] rounded-full overflow-hidden border border-[#E6E5E0]/60 dark:border-[#2E2D2A]/60">
                        <motion.div 
                          initial={shouldReduceMotion ? { width: `${selectedInstrument.governanceMetrics.boardIndependence}%` } : { width: '0%' }}
                          animate={{ width: `${selectedInstrument.governanceMetrics.boardIndependence}%` }}
                          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                          className="h-full bg-signature-horizontal rounded-full"
                        />
                      </div>
                      <p className="text-[9px] text-[#71706C] dark:text-[#A19F9A] pt-1 leading-relaxed italic">
                        {selectedInstrument.governanceMetrics.boardIndependenceCitation}
                      </p>
                    </div>

                    {/* Regulatory Track Record */}
                    <div className="space-y-1 bg-white dark:bg-[#1C1B19] border border-[#E6E5E0] dark:border-[#2E2D2A] p-4 rounded-xl">
                      <div className="flex justify-between text-xs font-bold text-[#1C1C1A] dark:text-[#F5F4F0]">
                        <span>Regulatory Track Record</span>
                        <span className="text-blue-500">{selectedInstrument.governanceMetrics.regulatoryTrackRecordScore}/100</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#FAF9F6] dark:bg-[#252422] rounded-full overflow-hidden border border-[#E6E5E0]/60 dark:border-[#2E2D2A]/60">
                        <motion.div 
                          initial={shouldReduceMotion ? { width: `${selectedInstrument.governanceMetrics.regulatoryTrackRecordScore}%` } : { width: '0%' }}
                          animate={{ width: `${selectedInstrument.governanceMetrics.regulatoryTrackRecordScore}%` }}
                          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                          className="h-full bg-signature-horizontal rounded-full"
                        />
                      </div>
                      <p className="text-xs text-[#51504B] dark:text-[#D2CFC9] leading-relaxed pt-1">
                        {selectedInstrument.governanceMetrics.regulatoryTrackRecordDetails}
                      </p>
                      <p className="text-[9px] text-[#71706C] dark:text-[#A19F9A] leading-relaxed italic">
                        {selectedInstrument.governanceMetrics.regulatoryTrackRecordCitation}
                      </p>
                    </div>

                    {/* Payout Consistency */}
                    <div className="space-y-1 bg-white dark:bg-[#1C1B19] border border-[#E6E5E0] dark:border-[#2E2D2A] p-4 rounded-xl">
                      <div className="flex justify-between text-xs font-bold text-[#1C1C1A] dark:text-[#F5F4F0]">
                        <span>Payout Consistency</span>
                        <span className="text-blue-500">{selectedInstrument.governanceMetrics.distributionConsistencyScore}/100</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#FAF9F6] dark:bg-[#252422] rounded-full overflow-hidden border border-[#E6E5E0]/60 dark:border-[#2E2D2A]/60">
                        <motion.div 
                          initial={shouldReduceMotion ? { width: `${selectedInstrument.governanceMetrics.distributionConsistencyScore}%` } : { width: '0%' }}
                          animate={{ width: `${selectedInstrument.governanceMetrics.distributionConsistencyScore}%` }}
                          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                          className="h-full bg-signature-horizontal rounded-full"
                        />
                      </div>
                      <p className="text-xs text-[#51504B] dark:text-[#D2CFC9] leading-relaxed pt-1">
                        {selectedInstrument.governanceMetrics.distributionConsistencyDetails}
                      </p>
                      <p className="text-[9px] text-[#71706C] dark:text-[#A19F9A] leading-relaxed italic">
                        {selectedInstrument.governanceMetrics.distributionConsistencyCitation}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Suitability Insights */}
                <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-blue-500 font-extrabold">
                    <Info className="w-4 h-4" />
                    <span>Suitability Insights</span>
                  </div>
                  <div className="space-y-2.5 text-xs text-[#51504B] dark:text-[#D2CFC9] leading-relaxed">
                    <p><strong>Income Generation:</strong> {selectedInstrument.suitabilityInsights.income}</p>
                    <p><strong>Inflation Protection:</strong> {selectedInstrument.suitabilityInsights.inflation}</p>
                    <p><strong>Capital Growth:</strong> {selectedInstrument.suitabilityInsights.growth}</p>
                    <p className="text-[9px] text-[#71706C] dark:text-[#A19F9A] italic border-t border-blue-500/10 pt-2">
                      {selectedInstrument.suitabilityInsights.citation}
                    </p>
                  </div>
                </div>

                {/* Secondary details */}
                <div className="grid grid-cols-2 gap-4 border-t border-[#E6E5E0] dark:border-[#2E2D2A] pt-4 text-xs">
                  <div>
                    <span className="text-[#71706C] dark:text-[#A19F9A] block font-semibold">Tax Treatment</span>
                    <span className="text-[#1C1C1A] dark:text-[#F5F4F0] font-bold">{selectedInstrument.taxLabel}</span>
                  </div>
                  <div>
                    <span className="text-[#71706C] dark:text-[#A19F9A] block font-semibold">Yield Potential</span>
                    <span className="text-[#1C1C1A] dark:text-[#F5F4F0] font-bold">{selectedInstrument.yieldPotential}</span>
                  </div>
                  <div>
                    <span className="text-[#71706C] dark:text-[#A19F9A] block font-semibold">Min Investment</span>
                    <span className="text-[#1C1C1A] dark:text-[#F5F4F0] font-bold">{selectedInstrument.minInvestment}</span>
                  </div>
                  <div>
                    <span className="text-[#71706C] dark:text-[#A19F9A] block font-semibold">Liquidity Rating</span>
                    <span className="text-[#1C1C1A] dark:text-[#F5F4F0] font-bold">{selectedInstrument.liquidity}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 3: CO-PILOT CHAT COACH */}
          {activeTab === 'coach' && (
            (!permissions.analysePortfolio || !permissions.recommendProducts) ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 my-auto">
                <div className="w-14 h-14 bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center border border-amber-500/20 shadow-sm">
                  <AlertTriangle className="w-7 h-7" />
                </div>
                <div className="space-y-2 max-w-md">
                  <h3 className="text-base font-extrabold text-[#1C1C1A] dark:text-[#F5F4F0]">Suitability Coach Disabled</h3>
                  <p className="text-xs text-[#71706C] dark:text-[#A19F9A] leading-relaxed">
                    Permission required — enable <strong>{!permissions.analysePortfolio ? 'Analyse Portfolio' : 'Recommend Products'}</strong> in Privacy & Settings to initialize suitability analysis chats.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setActiveTab('settings')}
                    className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Open Privacy & Settings</span>
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col flex-1 h-full min-h-0 space-y-3">
                {/* Chat Canvas */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-0 scrollbar-thin pb-4">
                  {chatHistory.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className={`flex flex-col max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed shadow-sm transition-colors duration-300 ${
                        msg.role === 'user'
                          ? 'bg-[#1C1C1A] dark:bg-blue-600 text-white self-end rounded-tr-none'
                          : 'bg-[#FAF9F6] dark:bg-[#252422] text-[#51504B] dark:text-[#D2CFC9] border border-[#E6E5E0] dark:border-[#2E2D2A] self-start rounded-tl-none'
                      }`}
                    >
                      <span className={`text-[8px] uppercase font-bold block mb-1 ${msg.role === 'user' ? 'text-blue-200' : 'text-blue-500'}`}>
                        {msg.role === 'user' ? 'You' : 'Suitability Coach'}
                      </span>
                      <p className="whitespace-pre-wrap leading-relaxed">{renderChatMessageText(msg.text)}</p>
                    </motion.div>
                  ))}
                  
                  {isChatLoading && (
                    <motion.div 
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#FAF9F6] dark:bg-[#252422] text-[#71706C] dark:text-[#A19F9A] border border-[#E6E5E0] dark:border-[#2E2D2A] self-start rounded-2xl rounded-tl-none p-4 text-xs flex items-center gap-2 shadow-sm"
                    >
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-500" />
                      <span>Analyzing SEBI & RBI regulatory guidelines...</span>
                      <div className="flex items-center space-x-1 ml-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      </div>
                    </motion.div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Bottom Controls Region: Single Divider Line with Balanced Spacing */}
                <div className="border-t border-[#E6E5E0] dark:border-[#2E2D2A] pt-3.5 space-y-3 mt-auto transition-colors duration-300">
                  {/* Persona-Isolated Suggestions pills */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    <span className="text-[10px] font-bold text-[#71706C] dark:text-[#A19F9A] uppercase tracking-wider shrink-0 mr-1 select-none">
                      Quick Audits:
                    </span>
                    {(
                      (activePersona?.persona_name === 'Rajesh' || selectedPersonaName === 'Rajesh')
                        ? [
                            { label: "💼 Retirement Audit", text: "Audit my retirement asset allocation against standard capital preservation goals." },
                            { label: "🛡️ Gold & G-Sec Safety", text: "How do Sovereign Gold Bonds and G-Secs protect capital safety for my profile?" },
                            { label: "💰 REIT Tax Exemption", text: "Explain Section 115UA tax exemptions on REIT dividends for conservative investors." },
                            { label: "📊 Debt vs Bonds Yield", text: "Compare corporate bond ratings vs G-Sec yields for a capital preservation portfolio." }
                          ]
                        : (activePersona?.persona_name === 'Ananya' || selectedPersonaName === 'Ananya')
                        ? [
                            { label: "🔥 Growth & Yield Audit", text: "Check my aggressive allocation. Am I holding too much infrastructure leverage?" },
                            { label: "🏗️ REITs vs InvITs", text: "Can you compare REITs and InvITs in the context of my aggressive holdings?" },
                            { label: "💰 InvIT Distribution Tax", text: "Explain Section 115UA tax exemptions on InvIT cash distributions." },
                            { label: "⚡ Leverage Risk Balance", text: "How can I balance high-yield InvITs with debt capital safety?" }
                          ]
                        : [
                            { label: "💼 Audit Profile", text: "Audit current asset allocation against standard capital preservation goals." },
                            { label: "💰 REIT Tax Exemption", text: "Explain Section 115UA tax exemptions on REIT dividends for Indian residents." },
                            { label: "🛡️ Sovereign Gold Bonds", text: "Are Sovereign Gold Bonds completely exempt from Capital Gains at maturity?" }
                          ]
                    ).map((s, idx) => (
                      <motion.button
                        key={idx}
                        type="button"
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        onClick={() => handleSendChat(s.text)}
                        className="inline-flex items-center text-[10px] font-bold leading-none px-3.5 py-2 rounded-full bg-[#FAF9F6] dark:bg-[#252422] border border-[#E6E5E0] dark:border-[#2E2D2A] hover:border-blue-500 dark:hover:border-blue-500 hover:bg-white dark:hover:bg-[#1C1B19] text-[#71706C] dark:text-[#A19F9A] hover:text-[#1C1C1A] dark:hover:text-[#F5F4F0] cursor-pointer transition-all shadow-sm shrink-0"
                      >
                        {s.label}
                      </motion.button>
                    ))}
                  </div>

                  {/* Chat input box */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Ask about compliance ratings, portfolio suitabilities, or Indian taxation slabs..."
                      className="flex-1 bg-[#FAF9F6] dark:bg-[#252422] border border-[#E6E5E0] dark:border-[#2E2D2A] rounded-xl px-4 py-3 text-xs text-[#1C1C1A] dark:text-[#F5F4F0] placeholder-[#A19F9A] dark:placeholder-[#5E5D59] focus:outline-none focus:border-blue-500 transition-colors duration-300"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSendChat()}
                      disabled={!chatInput.trim() || isChatLoading}
                      className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all cursor-pointer shadow-sm"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )
          )}

          {/* TAB 4: COMPLIANCE CHECKLIST */}
          {activeTab === 'checklist' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="bg-blue-500/5 border border-blue-500/10 p-5 rounded-2xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-extrabold text-[#1C1C1A] dark:text-[#F5F4F0]">Regulatory Verification Protocol</h4>
                  <p className="text-xs text-[#71706C] dark:text-[#A19F9A] leading-relaxed">
                    SEBI guidelines mandate rigorous operational rules for retail assets. Check off these key audits as you inspect each underlying trust deed or debt offering prospectus.
                  </p>
                </div>
              </div>

              {/* Checklist Group */}
              <div className="space-y-3">
                {checklistItems.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.01, y: -1 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ duration: 0.15 }}
                    onClick={() => toggleChecklistItem(item.id)}
                    className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer select-none transition-all duration-200 ${
                      item.checked
                        ? 'border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10'
                        : 'border-[#E6E5E0] dark:border-[#2E2D2A] bg-white dark:bg-[#1C1B19] hover:bg-[#FAF9F6]/50 dark:hover:bg-[#252422]/50'
                    }`}
                  >
                    <div className="mt-0.5">
                      {item.checked ? (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          className="w-5 h-5 rounded bg-emerald-500 text-white flex items-center justify-center border border-emerald-500"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </motion.div>
                      ) : (
                        <div className="w-5 h-5 rounded border border-[#E6E5E0] dark:border-[#2E2D2A] bg-[#FAF9F6] dark:bg-[#252422] transition-colors" />
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className={`text-xs sm:text-sm font-bold transition-all duration-200 ${item.checked ? 'text-emerald-800 dark:text-emerald-400 line-through opacity-70' : 'text-[#1C1C1A] dark:text-[#F5F4F0]'}`}>
                          {item.text}
                        </span>
                        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                          <span className="text-[9px] font-mono font-bold uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded">
                            {item.category}
                          </span>
                          {/* Feature 10: Interactive SEBI Circular Tooltip Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const keys = Object.keys(sebiCircularsData);
                              const matchKey = keys.find(k => sebiCircularsData[k].category.toLowerCase().includes(item.category.toLowerCase())) || keys[0];
                              setActiveCircular(sebiCircularsData[matchKey]);
                            }}
                            className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg hover:bg-amber-500/20 transition-all cursor-pointer flex items-center gap-1 shrink-0 shadow-sm"
                          >
                            <span>SEBI Circular</span>
                            <span>📜</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Bottom statistics on compliance */}
              <div className="bg-[#FAF9F6] dark:bg-[#252422] border border-[#E6E5E0] dark:border-[#2E2D2A] rounded-2xl p-5 flex items-center justify-between text-xs transition-colors duration-300">
                <span className="font-semibold text-[#71706C] dark:text-[#A19F9A]">Checklist Audits Complete</span>
                <span className="font-mono font-bold text-blue-500">
                  {checklistItems.filter(i => i.checked).length} / {checklistItems.length} Verified
                </span>
              </div>
            </motion.div>
          )}

          {/* TAB 5: PRIVACY & SETTINGS */}
          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <SettingsTabContent
                permissions={permissions}
                setPermissions={setPermissions}
                onHardReset={onHardReset || onBackToModes}
                onRevokeAll={onHardReset || onBackToModes}
                activePersona={activePersona}
              />
            </motion.div>
          )}

        </div>
      </motion.div>



      {/* Feature 10: Interactive SEBI Circular Popup Modal */}
      <AnimatePresence>
        {activeCircular && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setActiveCircular(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#1C1B19] border border-[#E6E5E0] dark:border-[#2E2D2A] rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#E6E5E0] dark:border-[#2E2D2A] pb-3">
                <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  {activeCircular.category} ({activeCircular.year})
                </span>
                <button
                  onClick={() => setActiveCircular(null)}
                  className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-bold text-[#1C1C1A] dark:text-[#F5F4F0]">
                  {activeCircular.title}
                </h3>
                <p className="text-[11px] font-mono text-[#71706C] dark:text-[#A19F9A]">
                  Official Circular ID: {activeCircular.code}
                </p>
                <p className="text-xs text-[#51504B] dark:text-[#D2CFC9] leading-relaxed pt-2">
                  {activeCircular.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E6E5E0] dark:border-[#2E2D2A] flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono text-[#71706C] dark:text-[#A19F9A]">
                  SEBI Regulatory Reference
                </span>
                <span className="font-mono font-bold text-[#1C1C1A] dark:text-[#F5F4F0] bg-[#FAF9F6] dark:bg-[#252422] px-2.5 py-1 rounded-lg border border-[#E6E5E0] dark:border-[#2E2D2A]">
                  {activeCircular.code}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
