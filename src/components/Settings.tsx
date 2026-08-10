import React, { useState } from 'react';
import { 
  Shield, 
  Trash2, 
  RefreshCw, 
  Eye, 
  BarChart3, 
  Sparkles, 
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { ConsentPermissions, Persona } from '../types';

interface SettingsProps {
  permissions: ConsentPermissions;
  setPermissions: React.Dispatch<React.SetStateAction<ConsentPermissions>>;
  onHardReset: () => void;
  onRevokeAll?: () => void;
  activePersona?: Persona | null;
}

export default function Settings({ permissions, setPermissions, onHardReset, onRevokeAll, activePersona }: SettingsProps) {
  const [syncState, setSyncState] = useState<'idle' | 'syncing' | 'synced'>('idle');

  // Load dynamically based on current selected persona or fallback to localStorage
  const getPersonaData = () => {
    if (activePersona?.persona_name === 'Rajesh') {
      return {
        email: 'rajesh.gopal@gmail.com',
        phone: '+91 98450 12345',
        pan: 'ABCDE1234F',
        displayName: 'Rajesh Gopal',
        initials: 'RG'
      };
    } else if (activePersona?.persona_name === 'Ananya') {
      return {
        email: 'ananya.roy@gmail.com',
        phone: '+91 91234 56789',
        pan: 'XYZWY9876A',
        displayName: 'Ananya Roy',
        initials: 'AR'
      };
    } else {
      const savedEmail = localStorage.getItem('prism_user_email') || 'rajesh.gopal@gmail.com';
      const savedMobile = localStorage.getItem('prism_user_mobile') || '+91 98450 12345';
      const savedPan = localStorage.getItem('prism_user_pan') || 'ABCDE1234F';
      return {
        email: savedEmail,
        phone: savedMobile,
        pan: savedPan,
        displayName: 'Rajesh Gopal',
        initials: 'RG'
      };
    }
  };

  const { email, phone, pan, displayName, initials } = getPersonaData();
  const maskedPan = pan.length >= 10 ? `${pan.substring(0, 5)}****${pan.substring(9)}` : pan;
  const maskedMobile = phone.includes('+91') 
    ? `+91 ${phone.replace('+91', '').trim().substring(0, 3)}*** **${phone.slice(-2)}`
    : phone;

  const handleToggle = (key: keyof ConsentPermissions) => {
    const next = {
      ...permissions,
      [key]: !permissions[key]
    };
    setPermissions(next);
    triggerSync(next);
  };

  const triggerSync = (updatedPermissions: ConsentPermissions) => {
    setSyncState('syncing');
    
    // Simulate updating the Account Aggregator server with updated consent parameters
    setTimeout(() => {
      setSyncState('synced');
      setTimeout(() => {
        setSyncState('idle');
      }, 1500);
    }, 1000);
  };

  const handleManualRevokeAll = () => {
    if (confirm('Are you sure you want to revoke all consents? This will unlink your portfolio and wipe all local cached aggregator records.')) {
      if (onRevokeAll) {
        onRevokeAll();
      } else {
        onHardReset();
      }
    }
  };

  return (
    <div className="w-full space-y-6 font-sans">
      
      {/* Top Notification Status (replaces sticky header) */}
      <div className="flex items-center justify-between pb-2 border-b border-[#E6E5E0] dark:border-[#2E2D2A]">
        <h2 className="text-sm font-extrabold text-[#1C1C1A] dark:text-[#F5F4F0]">Privacy and Security Policy Controls</h2>
        {syncState === 'syncing' && (
          <div className="flex items-center space-x-1.5 text-xs text-blue-600 dark:text-blue-400 font-bold">
            <RefreshCw className="h-3 w-3 animate-spin" />
            <span>Updating AA gateway...</span>
          </div>
        )}
        {syncState === 'synced' && (
          <div className="flex items-center space-x-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Synced!</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6 md:grid md:grid-cols-12 md:gap-8 items-stretch animate-fadeIn">
        
        {/* Left Column: Linked Identity & Consent Toggles */}
        <div className="flex flex-col gap-6 md:col-span-6 justify-between">
          {/* User Identity Box */}
          <div className="bg-white dark:bg-[#1E1E1E] border border-[#E2E8F0] dark:border-slate-800 rounded-[24px] p-6 space-y-4 shadow-sm transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-[#64748B] dark:text-slate-400 uppercase block">
                  LINKED DEPOSITORY IDENTITY
                </span>
                <span className="text-base font-bold text-[#0F172A] dark:text-slate-100 mt-0.5 block">
                  {displayName}
                </span>
              </div>
              <div className="h-10 w-10 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/35 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs shrink-0">
                {initials}
              </div>
            </div>

            {/* Clean Identity Metadata Rows - 100% Uniform Horizontal Alignment */}
            <div className="space-y-2 pt-3 border-t border-[#E2E8F0] dark:border-slate-800 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-[#E2E8F0]/50 dark:border-slate-800/50">
                <span className="text-[10px] font-bold text-[#64748B] dark:text-slate-400 uppercase tracking-wider">Email Address</span>
                <span className="font-semibold text-[#0F172A] dark:text-slate-200 font-mono select-all">{email}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[#E2E8F0]/50 dark:border-slate-800/50">
                <span className="text-[10px] font-bold text-[#64748B] dark:text-slate-400 uppercase tracking-wider">PAN Number</span>
                <span className="font-bold text-[#0F172A] dark:text-slate-200 font-mono">{maskedPan}</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-[10px] font-bold text-[#64748B] dark:text-slate-400 uppercase tracking-wider">Mobile Number</span>
                <span className="font-bold text-[#0F172A] dark:text-slate-200 font-mono">{maskedMobile}</span>
              </div>
            </div>
          </div>

          {/* Consent Parameters Settings Block - Perfectly balanced height with proportional spacing */}
          <div className="bg-white dark:bg-[#1E1E1E] border border-[#E2E8F0] dark:border-slate-800 rounded-[24px] p-6 flex-1 flex flex-col justify-between shadow-sm transition-colors duration-300">
            <div>
              <div className="flex items-center space-x-2 pb-2 border-b border-[#E2E8F0] dark:border-slate-800 mb-3">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-sm font-bold text-[#0F172A] dark:text-slate-100">Consent Parameters</h2>
              </div>

              <p className="text-xs text-[#64748B] dark:text-slate-400 leading-relaxed font-medium mb-4">
                These parameters are enforced at the Account Aggregator (AA) gateway level. Toggling any switch instantly sends a digital revoke certificate to the aggregator node.
              </p>
            </div>

            <div className="space-y-5 flex-1 flex flex-col justify-around py-1">
              {/* View Portfolio */}
              <div className="flex items-start justify-between space-x-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-1.5">
                    <Eye className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-bold text-[#0F172A] dark:text-slate-200">View Portfolio</span>
                  </div>
                  <p className="text-[11px] text-[#64748B] dark:text-slate-400 mt-1 leading-relaxed">
                    Grants read access to CDSL/NSDL security holdings and balances. Required to run basic portfolio listings.
                  </p>
                </div>
                <button 
                  type="button"
                  onClick={() => handleToggle('viewPortfolio')}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${permissions.viewPortfolio ? 'bg-blue-600' : 'bg-[#E2E8F0] dark:bg-slate-700'}`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${permissions.viewPortfolio ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>

              <hr className="border-t border-[#E2E8F0] dark:border-slate-800" />

              {/* Analyse Portfolio */}
              <div className="flex items-start justify-between space-x-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-1.5">
                    <BarChart3 className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xs font-bold text-[#0F172A] dark:text-slate-200">Analyse Portfolio</span>
                  </div>
                  <p className="text-[11px] text-[#64748B] dark:text-slate-400 mt-1 leading-relaxed">
                    Grants permission to run metrics on property occupancy schedules, regulatory track records, and corporate credit ratings.
                  </p>
                </div>
                <button 
                  type="button"
                  onClick={() => handleToggle('analysePortfolio')}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${permissions.analysePortfolio ? 'bg-blue-600' : 'bg-[#E2E8F0] dark:bg-slate-700'}`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${permissions.analysePortfolio ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>

              <hr className="border-t border-[#E2E8F0] dark:border-slate-800" />

              {/* Recommend Products */}
              <div className="flex items-start justify-between space-x-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-1.5">
                    <Sparkles className="h-4.5 w-4.5 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs font-bold text-[#0F172A] dark:text-slate-200">Recommend Products</span>
                  </div>
                  <p className="text-[11px] text-[#64748B] dark:text-slate-400 mt-1 leading-relaxed">
                    Allows Prism to suggest tailored category-level instruments based on your conservative/aggressive cashflow goals.
                  </p>
                </div>
                <button 
                  type="button"
                  onClick={() => handleToggle('recommendProducts')}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${permissions.recommendProducts ? 'bg-blue-600' : 'bg-[#E2E8F0] dark:bg-slate-700'}`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${permissions.recommendProducts ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Connection Metadata, Onboarding Reset & Revocation */}
        <div className="flex flex-col gap-6 md:col-span-6 justify-between">
          <div className="space-y-6 flex-1 flex flex-col justify-start">
            {/* Connection Metadata Status */}
            <div className="bg-white dark:bg-[#1E1E1E] border border-[#E2E8F0] dark:border-slate-800 rounded-[24px] p-6 space-y-4 shadow-sm transition-colors duration-300">
              <span className="text-[10px] font-bold tracking-widest text-[#64748B] dark:text-slate-400 uppercase block">
                CONNECTION METADATA
              </span>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 bg-[#FAF9F6] dark:bg-[#262626] rounded-xl border border-[#E2E8F0] dark:border-slate-800 flex flex-col justify-between">
                  <span className="text-[#64748B] dark:text-slate-400 block text-[9px] uppercase font-bold">Data Encryption</span>
                  <span className="text-[#0F172A] dark:text-slate-200 font-bold mt-1 text-xs block whitespace-nowrap">256-bit AES</span>
                </div>
                <div className="p-3.5 bg-[#FAF9F6] dark:bg-[#262626] rounded-xl border border-[#E2E8F0] dark:border-slate-800 flex flex-col justify-between">
                  <span className="text-[#64748B] dark:text-slate-400 block text-[9px] uppercase font-bold">Depository Status</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold mt-1 text-xs block flex items-center space-x-1 whitespace-nowrap">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block mr-1"></span>
                    <span>Active (Verified)</span>
                  </span>
                </div>
                <div className="p-3.5 bg-[#FAF9F6] dark:bg-[#262626] rounded-xl border border-[#E2E8F0] dark:border-slate-800 flex flex-col justify-between">
                  <span className="text-[#64748B] dark:text-slate-400 block text-[9px] uppercase font-bold">Sync Frequency</span>
                  <span className="text-[#0F172A] dark:text-slate-200 font-bold mt-1 text-xs block whitespace-nowrap">Periodic (Monthly)</span>
                </div>
                <div className="p-3.5 bg-[#FAF9F6] dark:bg-[#262626] rounded-xl border border-[#E2E8F0] dark:border-slate-800 flex flex-col justify-between">
                  <span className="text-[#64748B] dark:text-slate-400 block text-[9px] uppercase font-bold">Consent Expiry</span>
                  <span className="text-[#0F172A] dark:text-slate-200 font-bold mt-1 text-xs block whitespace-nowrap">July 2027</span>
                </div>
              </div>
            </div>

            {/* Hard Revocation Block (Now placed above Evaluation Playroom for perfect alignment) */}
            <div className="bg-rose-50/40 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/30 rounded-[24px] p-6 space-y-4 shadow-sm transition-colors duration-300">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                <h3 className="text-xs font-bold tracking-widest text-rose-800 dark:text-rose-300 uppercase">
                  Emergency Data Revocation
                </h3>
              </div>
              <p className="text-xs text-rose-800 dark:text-rose-400 leading-relaxed font-medium">
                If you wish to terminate your association with Prism immediately, you can trigger a full revocation. This immediately instructs the SEBI Account Aggregator to shred your digital access keys.
              </p>
              <button
                onClick={handleManualRevokeAll}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-3.5 rounded-full transition-all flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Revoke All Access & Unlink Account</span>
              </button>
            </div>

            {/* Demo Settings Block (Now placed at the bottom for beautiful balanced alignment) */}
            <div className="bg-blue-50/40 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-900/30 rounded-[24px] p-6 space-y-4 shadow-sm transition-colors duration-300">
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400 animate-spin" style={{ animationDuration: '3s' }} />
                <h3 className="text-xs font-bold tracking-widest text-blue-800 dark:text-blue-300 uppercase">
                  Evaluation Playroom
                </h3>
              </div>
              <p className="text-xs text-blue-800 dark:text-blue-400 leading-relaxed font-medium">
                For evaluation and compliance review, you can reset your onboarding and identity settings back to scratch to try out different profiles.
              </p>
              <button
                onClick={() => {
                  onHardReset();
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3.5 rounded-full transition-all flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Restart First-Run Onboarding</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
