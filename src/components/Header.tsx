import { useState } from 'react';
import { Sun, Moon, LogOut, Menu, X, Home, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: any) => void;
  currentTime: Date;
  onLaunchPrism: () => void;
  hasActiveWorkspace: boolean;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onBack?: () => void;
  backLabel?: string;
  googleUser: any;
  onGoogleSignIn: () => void;
  onGoogleSignOut: () => void;
  onLogOut?: () => void;
}

export default function Header({
  currentView,
  setCurrentView,
  currentTime,
  onLaunchPrism,
  hasActiveWorkspace,
  darkMode,
  onToggleDarkMode,
  onBack,
  backLabel,
  googleUser,
  onLogOut,
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-6xl z-50 rounded-xl bg-white/95 dark:bg-[#1C1B19]/95 backdrop-blur-md border border-[#E6E5E0] dark:border-[#2E2D2A]/50 shadow-[0_8px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] px-4 sm:px-6 py-3.5 flex items-center justify-between transition-all duration-300 select-none">
        
        {/* Left Control: Desktop Light/Dark Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleDarkMode}
            className="hidden md:flex items-center gap-1.5 bg-[#FAF9F6] dark:bg-[#252422] border border-[#E6E5E0] dark:border-[#2E2D2A]/60 rounded-lg py-1.5 px-3 shadow-sm text-xs font-semibold text-[#1C1C1A] dark:text-[#F5F4F0] hover:bg-white dark:hover:bg-[#1C1B19] transition-all cursor-pointer"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono text-[9px] tracking-wider uppercase">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-blue-400" />
                <span className="font-mono text-[9px] tracking-wider uppercase">Dark</span>
              </>
            )}
          </button>
        </div>

        {/* Centered Wordmark (Middle on ALL Viewports: Mobile & Desktop) */}
        <div 
          className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center cursor-pointer select-none group"
          onClick={() => setCurrentView('home')}
        >
          <span className="text-2xl font-serif font-black tracking-tight text-[#1C1C1A] dark:text-[#F5F4F0] group-hover:opacity-80 transition-opacity">
            prism
          </span>
        </div>

        {/* Right Controls: Desktop Buttons + Mobile Hamburger Icon */}
        <div className="flex items-center gap-2 sm:gap-3.5">
          {/* Desktop Right Action Buttons */}
          <div className="hidden md:flex items-center gap-2 sm:gap-3.5">
            {hasActiveWorkspace && onLogOut && (
              <button
                onClick={onLogOut}
                className="flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200/60 dark:border-rose-900/40 rounded-lg py-1.5 px-3 text-xs font-bold transition-all cursor-pointer shadow-sm"
                title="Log out and switch investor profile"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            )}

            {onBack && backLabel ? (
              <button
                onClick={onBack}
                className="bg-[#1C1C1A] dark:bg-[#F5F4F0] text-white dark:text-[#121211] hover:bg-[#32312E] dark:hover:bg-[#E2E1DD] font-bold text-xs px-4 sm:px-5 py-2 rounded-lg transition-all ballpark-shadow border border-transparent cursor-pointer"
              >
                ← {backLabel}
              </button>
            ) : hasActiveWorkspace ? (
              <button
                onClick={() => setCurrentView('workspace')}
                className="bg-[#1C1C1A] dark:bg-[#F5F4F0] text-white dark:text-[#121211] hover:bg-[#32312E] dark:hover:bg-[#E2E1DD] font-bold text-xs px-4 sm:px-5 py-2 rounded-lg transition-all ballpark-shadow flex items-center gap-2 border border-transparent cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Active Dashboard</span>
              </button>
            ) : (
              <button
                onClick={onLaunchPrism}
                className="bg-[#1C1C1A] dark:bg-[#F5F4F0] text-white dark:text-[#121211] hover:bg-[#32312E] dark:hover:bg-[#E2E1DD] font-bold text-xs px-4 sm:px-5 py-2 rounded-lg transition-all ballpark-shadow border border-transparent cursor-pointer"
              >
                Get Started
              </button>
            )}
          </div>

          {/* Mobile Burger Toggle Button (< md) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-[#FAF9F6] dark:bg-[#252422] border border-[#E6E5E0] dark:border-[#2E2D2A] text-[#1C1C1A] dark:text-[#F5F4F0] hover:bg-white dark:hover:bg-[#1C1B19] transition-all cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* MOBILE DROPDOWN PANEL OVERLAY (< md) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="md:hidden fixed top-20 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm z-50 rounded-2xl bg-white/95 dark:bg-[#1C1B19]/95 backdrop-blur-xl border border-[#E6E5E0] dark:border-[#2E2D2A] shadow-2xl p-4 space-y-2.5"
          >
            {/* Theme Toggle Button */}
            <button
              onClick={() => {
                onToggleDarkMode();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[#FAF9F6] dark:bg-[#252422] border border-[#E6E5E0] dark:border-[#2E2D2A] text-xs font-bold text-[#1C1C1A] dark:text-[#F5F4F0] cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
                <span>{darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}</span>
              </div>
              <span className="text-[10px] font-mono uppercase bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full">
                {darkMode ? 'Light' : 'Dark'}
              </span>
            </button>

            {/* Dynamic Primary Action Button (Matches Desktop Functionality Exactly) */}
            {onBack && backLabel ? (
              <button
                onClick={() => {
                  onBack();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center p-3 rounded-xl bg-[#1C1C1A] dark:bg-[#F5F4F0] text-white dark:text-[#121211] text-xs font-extrabold cursor-pointer shadow-md"
              >
                ← {backLabel}
              </button>
            ) : hasActiveWorkspace ? (
              <button
                onClick={() => {
                  setCurrentView('workspace');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#1C1C1A] dark:bg-[#F5F4F0] text-white dark:text-[#121211] text-xs font-extrabold cursor-pointer shadow-md"
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Active Dashboard</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </button>
            ) : (
              <button
                onClick={() => {
                  onLaunchPrism();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center p-3 rounded-xl bg-[#1C1C1A] dark:bg-[#F5F4F0] text-white dark:text-[#121211] text-xs font-extrabold cursor-pointer shadow-md"
              >
                Get Started
              </button>
            )}

            {/* Log Out Option (if active workspace session exists) */}
            {hasActiveWorkspace && onLogOut && (
              <button
                onClick={() => {
                  onLogOut();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/40 text-xs font-bold cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
