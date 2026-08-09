import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { 
  Sparkles, 
  Send, 
  User, 
  ShieldCheck, 
  XCircle, 
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Coins,
  Radio,
  Building2,
  ShieldAlert,
  Percent,
  ChevronRight
} from 'lucide-react';
import { ConsentPermissions, Persona } from '../types';
import { personasData } from '../data';

interface Message {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  groundingSources?: Array<{ title: string; url: string }>;
}

const formatINR = (num: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
};

const getInitialWelcomeMessage = (persona: Persona) => {
  const formattedVal = formatINR(persona.total_portfolio_value);
  const holdingsSummary = persona.asset_allocation
    .slice(0, 3)
    .map(asset => `${asset.percentage}% in ${asset.name}`)
    .join(', ');

  return `Namaste ${persona.persona_name}! I am your Prism Suitability Coach. 

Acknowledging your profile **"${persona.persona_tagline}"** with a total portfolio of **${formattedVal}**, I am here to help you evaluate how alternative asset classes fit into your wealth planning. 

With asset classes like ${holdingsSummary || "your current holdings"}, we can analyze how to optimize or diversify further. Ask me any question about REITs, InvITs, Debt ETFs, Corporate Bonds, G-Secs, or Sovereign Gold Bonds!`;
};

// Map asset name to unique light color classes (NO purple/violet!)
const getAssetColors = (name: string) => {
  if (name.includes('Equities')) return { lightBg: 'bg-blue-50 dark:bg-blue-950/20', border: 'border-blue-100 dark:border-blue-900/30', text: 'text-blue-700 dark:text-blue-400' };
  if (name.includes('REITs')) return { lightBg: 'bg-emerald-50 dark:bg-emerald-950/20', border: 'border-emerald-100 dark:border-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400' };
  if (name.includes('InvITs')) return { lightBg: 'bg-indigo-50 dark:bg-indigo-950/20', border: 'border-indigo-100 dark:border-indigo-900/30', text: 'text-indigo-700 dark:text-indigo-400' }; // Replaced purple with Indigo
  if (name.includes('Corporate')) return { lightBg: 'bg-amber-50 dark:bg-amber-950/20', border: 'border-amber-100 dark:border-amber-900/30', text: 'text-amber-700 dark:text-amber-400' };
  if (name.includes('Gold')) return { lightBg: 'bg-yellow-50 dark:bg-yellow-950/20', border: 'border-yellow-100 dark:border-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400' };
  if (name.includes('Government')) return { lightBg: 'bg-sky-50 dark:bg-sky-950/20', border: 'border-sky-100 dark:border-sky-900/30', text: 'text-sky-700 dark:text-sky-400' };
  if (name.includes('Debt')) return { lightBg: 'bg-teal-50 dark:bg-teal-950/20', border: 'border-teal-100 dark:border-teal-900/30', text: 'text-teal-700 dark:text-teal-400' };
  return { lightBg: 'bg-slate-50 dark:bg-slate-900/30', border: 'border-slate-100 dark:border-slate-800', text: 'text-slate-700 dark:text-slate-400' };
};

interface CoachProps {
  permissions?: ConsentPermissions;
}

export default function Coach({ permissions }: CoachProps) {
  const shouldReduceMotion = useReducedMotion();
  const [activePersonaName, setActivePersonaName] = useState<string>('Rajesh');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load active persona on mount and initialize greeting
  useEffect(() => {
    const savedPersonaName = localStorage.getItem('prism_active_persona') || 'Rajesh';
    setActivePersonaName(savedPersonaName);
    const resolvedPersona = personasData.find(p => p.persona_name === savedPersonaName) || personasData[0];
    setMessages([
      {
        id: 'welcome',
        sender: 'coach',
        text: getInitialWelcomeMessage(resolvedPersona)
      }
    ]);
  }, []);

  const activePersona = personasData.find(p => p.persona_name === activePersonaName) || personasData[0];

  // Scroll to bottom whenever messages or typing state changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleReset = () => {
    const savedPersonaName = localStorage.getItem('prism_active_persona') || 'Rajesh';
    const resolvedPersona = personasData.find(p => p.persona_name === savedPersonaName) || personasData[0];
    setMessages([
      {
        id: 'welcome',
        sender: 'coach',
        text: getInitialWelcomeMessage(resolvedPersona)
      }
    ]);
    setInputText('');
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isTyping) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      // Build previous history
      const history = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({
          role: m.sender === 'user' ? 'user' : 'model',
          text: m.text
        }));

      const res = await fetch('/api/suitability-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personaName: activePersonaName,
          message: userMsg.text,
          history
        })
      });

      if (!res.ok) throw new Error('Failed to get suitability coach response');
      const data = await res.json();

      const coachMsg: Message = {
        id: `coach-${Date.now()}`,
        sender: 'coach',
        text: data.text,
        groundingSources: data.groundingSources
      };

      setMessages(prev => [...prev, coachMsg]);
    } catch (err) {
      console.error('Coach chat error:', err);
      const coachMsg: Message = {
        id: `coach-${Date.now()}`,
        sender: 'coach',
        text: "I am having trouble connecting to the coaching system right now. However, based on your profile, conservative investors benefit from Government Securities and SGBs for capital safety, whereas growth-seeking investors can explore REITs or InvITs for yields. Please check your network or try again shortly."
      };
      setMessages(prev => [...prev, coachMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickStarts = [
    { label: 'Steady Income', prompt: 'Which alternative assets provide the steadiest passive income for my profile?' },
    { label: 'Inflation Hedging', prompt: 'How can I protect my purchasing power from inflation with alternative assets?' },
    { label: 'Capital Safety', prompt: 'Which debt or bond categories offer the absolute highest capital safety for me?' },
    { label: 'REITs vs InvITs', prompt: 'Can you compare REITs and InvITs in the context of my current holdings?' }
  ];

  const renderFormattedText = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      let trimmed = line.trim();
      const isBullet = trimmed.startsWith('*') || trimmed.startsWith('-');
      if (isBullet) {
        trimmed = trimmed.replace(/^[\*\-\s]+/, '');
      }
      
      const parts = [];
      const boldRegex = /\*\*(.*?)\*\*/g;
      let match;
      let lastIndex = 0;
      
      while ((match = boldRegex.exec(trimmed)) !== null) {
        const matchIndex = match.index;
        if (matchIndex > lastIndex) {
          parts.push(trimmed.substring(lastIndex, matchIndex));
        }
        parts.push(
          <strong key={matchIndex} className="font-extrabold text-[#0F172A] dark:text-slate-100">
            {match[1]}
          </strong>
        );
        lastIndex = boldRegex.lastIndex;
      }
      
      if (lastIndex < trimmed.length) {
        parts.push(trimmed.substring(lastIndex));
      }
      
      if (isBullet) {
        return (
          <li key={idx} className="ml-5 list-disc pl-1 my-1.5 text-xs text-[#334155] dark:text-slate-300 leading-relaxed font-medium">
            {parts.length > 0 ? parts : trimmed}
          </li>
        );
      }
      
      if (trimmed === '') {
        return <div key={idx} className="h-2" />;
      }
      
      return (
        <p key={idx} className="text-xs text-[#334155] dark:text-slate-300 leading-relaxed my-1.5 font-medium">
          {parts.length > 0 ? parts : trimmed}
        </p>
      );
    });
  };

  const isAnalysePortfolioOff = permissions && !permissions.analysePortfolio;
  const isRecommendProductsOff = permissions && !permissions.recommendProducts;
  const showGatedState = isAnalysePortfolioOff || isRecommendProductsOff;
  const gatedPermissionLabel = isAnalysePortfolioOff ? 'Analyse Portfolio' : 'Recommend Products';

  return (
    <div className="max-w-5xl mx-auto bg-[#FAF9F6] dark:bg-[#121212] min-h-screen pb-32 flex flex-col font-sans transition-colors duration-300">
      
      {/* Sleek Sub Header Control Bar */}
      <div className="border-b border-[#E2E8F0] dark:border-slate-800 px-6 py-4 bg-white/45 dark:bg-transparent backdrop-blur-sm flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 bg-everyday rounded-xl text-white">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <div>
            <span className="text-base font-display font-black text-[#0F172A] dark:text-slate-50 tracking-tight block">Suitability Coach</span>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">Grounded AI Advisor</span>
          </div>
        </div>
        
        {/* Dynamic Coach Status Badge */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold border bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-300 border-blue-100 dark:border-blue-900/30">
            <span>Profile: {activePersona.persona_name}</span>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-100 flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#1E1E1E] border border-[#E2E8F0] dark:border-slate-800 transition-all cursor-pointer"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Reset Chat</span>
          </motion.button>
        </div>
      </div>

      {showGatedState ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white dark:bg-[#1E1E1E] border border-[#E2E8F0] dark:border-slate-800 rounded-[24px] p-8 text-center space-y-4 shadow-sm max-w-md w-full">
            <div className="mx-auto w-12 h-12 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-[#0F172A] dark:text-slate-100">Permission required</h3>
              <p className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed">
                Permission required — enable <strong>{gatedPermissionLabel}</strong> in Privacy settings to initialize suitability analysis chats.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Main split container */
        <div className="flex-1 p-6 flex flex-col gap-6 md:grid md:grid-cols-12 md:items-start md:gap-8 animate-fadeIn">
          
          {/* Left Panel: Active Persona & Grounding Information */}
          <div className="md:col-span-4 flex flex-col gap-6 md:sticky md:top-24">
            {/* Grounded Profile card */}
            <div className="bg-white dark:bg-[#1E1E1E] border border-[#E2E8F0] dark:border-slate-800/80 p-5 rounded-[24px] shadow-sm transition-colors duration-300">
              <span className="text-[9px] font-bold tracking-widest text-[#64748B] dark:text-slate-400 uppercase block mb-3">
                ACTIVE GROUNDING DATA
              </span>
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-extrabold text-sm bg-everyday shadow-sm">
                  {activePersona.persona_name[0]}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#0F172A] dark:text-slate-100">{activePersona.persona_name}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold leading-tight mt-0.5">{activePersona.persona_tagline}</p>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 space-y-4">
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-400 font-bold block">Aggregated Value</span>
                  <span className="text-sm font-bold text-[#0F172A] dark:text-slate-50 mt-1 block">{formatINR(activePersona.total_portfolio_value)}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-400 font-bold block mb-2">Portfolio Mix</span>
                  <div className="space-y-1.5">
                    {activePersona.asset_allocation.map((asset, idx) => {
                      const colors = getAssetColors(asset.name);
                      return (
                        <div key={idx} className={`flex items-center justify-between p-2.5 rounded-xl border text-[11px] font-bold ${colors.lightBg} ${colors.border} ${colors.text}`}>
                          <span>{asset.name}</span>
                          <span>{asset.percentage}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Static Coach Intro Card */}
            <div className="bg-white dark:bg-[#1E1E1E] border border-[#E2E8F0] dark:border-slate-800/80 p-5 rounded-[24px] shadow-sm">
              <h3 className="text-xs font-bold text-[#0F172A] dark:text-slate-200 mb-2 flex items-center space-x-2">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
                <span>Regulatory Safety Rails</span>
              </h3>
              <p className="text-[11px] text-[#64748B] dark:text-slate-400 leading-relaxed font-medium">
                Prism Suitability Coach offers category-level suitability guidance based on SEBI distribution frameworks and Indian regulatory guidelines. We never suggest or broker specific commercial securities.
              </p>
            </div>
          </div>

          {/* Right Panel: Chat Interface */}
          <div className="md:col-span-8 bg-white dark:bg-[#1E1E1E] border border-[#E2E8F0] dark:border-slate-800 rounded-[24px] shadow-sm flex flex-col h-[520px] md:h-[620px] overflow-hidden transition-colors duration-300">
            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#FAF9F6]/40 dark:bg-transparent">
              {messages.map((msg) => (
                <motion.div 
                  key={msg.id} 
                  initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="space-y-3"
                >
                  <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex items-start space-x-2.5 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      {/* Avatar */}
                      <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                        msg.sender === 'user' 
                          ? 'bg-everyday text-white' 
                          : 'bg-slate-200 dark:bg-slate-800 text-[#0F172A] dark:text-slate-200'
                      }`}>
                        {msg.sender === 'user' ? <User className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />}
                      </div>

                      {/* Bubble content */}
                      <div className={`p-4 rounded-[20px] text-xs shadow-sm ${
                        msg.sender === 'user' 
                          ? 'bg-everyday text-white font-semibold' 
                          : 'bg-[#F8FAFC] dark:bg-[#262626] border border-[#E2E8F0] dark:border-slate-800 text-[#0F172A] dark:text-slate-100'
                      }`}>
                        {msg.sender === 'user' ? msg.text : renderFormattedText(msg.text)}
                      </div>
                    </div>
                  </div>

                  {/* Rendering citations if they exist */}
                  {msg.sender === 'coach' && msg.groundingSources && msg.groundingSources.length > 0 && (
                    <div className="ml-12 max-w-[80%] p-4 bg-slate-50 dark:bg-[#262626] border border-slate-200 dark:border-slate-800 rounded-[20px] space-y-2.5">
                      <div className="text-[10px] uppercase tracking-wider font-bold text-[#64748B] dark:text-slate-400 flex items-center gap-1.5">
                        <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Verified Regulatory Sources</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.groundingSources.map((source, sIdx) => (
                          <a
                            key={sIdx}
                            href={source.url}
                            target="_blank"
                            referrerPolicy="no-referrer"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1E1E1E] hover:bg-slate-100 dark:hover:bg-slate-800 border border-[#E2E8F0] dark:border-slate-800 rounded-full text-[10px] font-bold text-blue-700 dark:text-blue-400 transition-all shadow-sm"
                          >
                            <span>{source.title}</span>
                            <ChevronRight className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}

              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex justify-start"
                >
                  <div className="flex items-start space-x-2.5 max-w-[85%]">
                    <div className="p-2 rounded-xl shrink-0 mt-0.5 bg-slate-200 dark:bg-slate-800 text-blue-600">
                      <Sparkles className="h-3.5 w-3.5 animate-spin" />
                    </div>
                    <div className="bg-[#F8FAFC] dark:bg-[#262626] border border-[#E2E8F0] dark:border-slate-800 p-4 rounded-2xl flex items-center space-x-2 shadow-sm">
                      <span className="text-xs text-[#64748B] dark:text-slate-400 font-semibold mr-1">Evaluating suitability...</span>
                      <motion.div 
                        animate={{ scale: [1, 1.3, 1] }} 
                        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.2 }}
                        className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" 
                      />
                      <motion.div 
                        animate={{ scale: [1, 1.3, 1] }} 
                        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.35 }}
                        className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" 
                      />
                      <motion.div 
                        animate={{ scale: [1, 1.3, 1] }} 
                        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.5 }}
                        className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" 
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input & Quickstart region */}
            <div className="p-4 bg-white dark:bg-[#1E1E1E] border-t border-[#E2E8F0] dark:border-slate-800 space-y-3">
              {/* Quickstart suggestions */}
              <div className="flex flex-wrap items-center gap-2 py-1">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider shrink-0 mr-1 select-none">
                  Quick Audits:
                </span>
                {quickStarts.map((item, idx) => (
                  <motion.button
                    key={idx}
                    type="button"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (!isTyping) {
                        handleSendMessage(item.prompt);
                      }
                    }}
                    disabled={isTyping}
                    className="inline-flex items-center text-[10px] font-bold leading-none px-3 py-2 bg-[#F1F5F9] dark:bg-[#262626] hover:bg-blue-50 dark:hover:bg-blue-950/20 border border-slate-200 dark:border-slate-800 text-[#334155] dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 rounded-full transition-all cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {item.label}
                  </motion.button>
                ))}
              </div>

              {/* Chat Input form */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputText);
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={isTyping}
                  placeholder="Ask suitability coach..."
                  className="flex-1 bg-[#F8FAFC] dark:bg-[#262626] border border-[#E2E8F0] dark:border-slate-800 focus:border-blue-500 focus:bg-white dark:focus:bg-[#1E1E1E] rounded-xl px-4 py-3 text-xs outline-none transition-all disabled:opacity-50 font-medium text-[#0F172A] dark:text-slate-100"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!inputText.trim() || isTyping}
                  className="p-3 bg-everyday disabled:bg-slate-100 dark:disabled:bg-slate-800 text-white disabled:text-slate-400 rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-sm"
                >
                  <Send className="h-4 w-4" />
                </motion.button>
              </form>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
