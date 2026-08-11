import { Sun, Moon, LogOut } from 'lucide-react';

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
  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-[1680px] z-50 rounded-xl bg-white/95 dark:bg-[#1C1B19]/95 backdrop-blur-md border border-[#E6E5E0] dark:border-[#2E2D2A]/50 shadow-[0_8px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] px-4 sm:px-6 py-3.5 flex items-center justify-between transition-all duration-300 select-none">
      {/* Dark/Light Mode Toggle Pill (Left) */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleDarkMode}
          className="flex items-center gap-1.5 bg-[#FAF9F6] dark:bg-[#252422] border border-[#E6E5E0] dark:border-[#2E2D2A]/60 rounded-lg py-1.5 px-3 shadow-sm text-xs font-semibold text-[#1C1C1A] dark:text-[#F5F4F0] hover:bg-white dark:hover:bg-[#1C1B19] transition-all cursor-pointer"
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline-block font-mono text-[9px] tracking-wider uppercase">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline-block font-mono text-[9px] tracking-wider uppercase">Dark</span>
            </>
          )}
        </button>
      </div>

      {/* Centered Wordmark (Middle) - No full stop */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center cursor-pointer select-none group"
        onClick={() => setCurrentView('home')}
      >
        <span className="text-2xl font-serif font-black tracking-tight text-[#1C1C1A] dark:text-[#F5F4F0] group-hover:opacity-80 transition-opacity">
          prism
        </span>
      </div>

      {/* Dynamic Navigation Options & Action Button (Right) */}
      <div className="flex items-center gap-2 sm:gap-3.5">

        {/* Log Out Button when active workspace session exists */}
        {hasActiveWorkspace && onLogOut && (
          <button
            onClick={onLogOut}
            className="flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200/60 dark:border-rose-900/40 rounded-lg py-1.5 px-3 text-xs font-bold transition-all cursor-pointer shadow-sm"
            title="Log out and switch investor profile"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        )}

        {/* Minimal Style Primary Button */}
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
            <span className="hidden xs:inline">Active Dashboard</span>
            <span className="xs:hidden">Dashboard</span>
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
    </header>
  );
}
