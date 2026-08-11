import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Header from './components/Header';
import Hero from './components/Hero';
import ModesGrid from './components/ModesGrid';
import FeaturesSection from './components/FeaturesSection';
import IntakeView from './components/IntakeView';
import PipelineView from './components/PipelineView';
import WorkspaceView from './components/WorkspaceView';
import SignatureTransitionOverlay from './components/SignatureTransitionOverlay';

export default function App() {
  // Navigation views: 'home' | 'modes' | 'intake' | 'pipeline' | 'workspace'
  const [currentView, setCurrentView] = useState<'home' | 'modes' | 'intake' | 'pipeline' | 'workspace'>('home');
  const [selectedPersonaName, setSelectedPersonaName] = useState<'Rajesh' | 'Ananya' | null>(null);
  const [showSignatureOverlay, setShowSignatureOverlay] = useState(false);
  
  // App states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Auth states
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);

  // Pipeline states
  const [currentPipelineStep, setCurrentPipelineStep] = useState(0);
  const [pipelineSteps, setPipelineSteps] = useState([
    { name: 'Consent Setup', status: 'idle', desc: 'Validating Account Aggregator digital consent artifact...' },
    { name: 'FIP Data Decryption', status: 'idle', desc: 'Securely decrypting asset holdings from linked financial providers...' },
    { name: 'SEBI / RBI Compliance Verification', status: 'idle', desc: 'Mapping asset structures against latest regulatory boards and indices...' },
    { name: 'Suitability Analysis', status: 'idle', desc: 'Powering up the server-protected suitability chat advisor...' }
  ]);
  const [logs, setLogs] = useState<string[]>([]);
  const activeRunId = useRef<number>(0);

  // Dark mode states
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) {
        return saved === 'true';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  // Clock
  useEffect(() => {
    document.title = 'Prism — Alternative Wealth Compliance';
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  // Google Simulation / link account
  const handleGoogleSignIn = () => {
    setGoogleUser({ email: 'investor.demo@prism.io' });
    setGoogleToken('simulated_token_xyz');
    addLog("Auth: Linked Google Investor profile.");
  };

  const handleGoogleSignOut = () => {
    setGoogleUser(null);
    setGoogleToken(null);
    addLog("Auth: Unlinked profile.");
  };

  // Permissions State for consent and settings
  const [permissions, setPermissions] = useState<{
    viewPortfolio: boolean;
    analysePortfolio: boolean;
    recommendProducts: boolean;
  }>({
    viewPortfolio: true,
    analysePortfolio: true,
    recommendProducts: true,
  });

  // Launch Linkage Pipeline - skips execution linkage page, goes straight to signature overlay -> workspace
  const handleStartPipeline = async (phone: string, newPermissions?: any) => {
    if (newPermissions) {
      setPermissions(newPermissions);
    }
    setIsSubmitting(true);
    setLogs([]);
    const runId = ++activeRunId.current;

    addLog(`AA Framework: Verified consent artifact for ${phone}.`);
    addLog("Resolving portfolio holdings and governance metrics...");

    // Mount workspace view immediately behind the fixed signature overlay
    setCurrentView('workspace');
    setShowSignatureOverlay(true);

    setTimeout(() => {
      if (runId !== activeRunId.current) return;
      setIsSubmitting(false);
      setShowSignatureOverlay(false);
    }, 2500);
  };

  // Launch with specific pre-seeded persona
  const handleSelectPersona = (name: 'Rajesh' | 'Ananya') => {
    setSelectedPersonaName(name);
    handleStartPipeline(name === 'Rajesh' ? 'rajesh.retirement@onemoney' : 'ananya.growth@onemoney', permissions);
  };

  const handleLaunchPrism = () => {
    if (selectedPersonaName) {
      setCurrentView('workspace');
    } else {
      setCurrentView('intake');
    }
  };

  const handleBackToModes = () => {
    setCurrentView('home');
  };

  // Dynamic back labels
  const getBackLabelAndHandler = () => {
    switch (currentView) {
      case 'modes':
      case 'intake':
        return { onBack: () => setCurrentView('home'), label: 'Home' };
      case 'pipeline':
        return { onBack: () => setCurrentView('intake'), label: 'Consent Setup' };
      case 'workspace':
        return { onBack: () => setCurrentView('home'), label: 'Home' };
      default:
        return { onBack: undefined, label: undefined };
    }
  };

  const backConfig = getBackLabelAndHandler();

  const handleLogOut = () => {
    setSelectedPersonaName(null);
    setCurrentView('intake');
    addLog("Auth: Logged out active persona session.");
  };

  return (
    <div className={`min-h-screen bg-[#FAF9F6] dark:bg-[#121211] text-[#1C1C1A] dark:text-[#F5F4F0] flex flex-col font-sans antialiased relative transition-colors duration-300 ${currentView === 'workspace' || currentView === 'intake' ? 'h-screen overflow-hidden' : 'overflow-x-hidden'}`}>
      
      {/* Decorative Premium Ambient Radial Glows (only on header/hero, desaturated in dark mode) */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-500/[0.02] rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 dark:bg-indigo-500/[0.02] rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Dynamic Header */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        currentTime={currentTime}
        onLaunchPrism={handleLaunchPrism}
        hasActiveWorkspace={selectedPersonaName !== null || currentView === 'workspace'}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onBack={backConfig.onBack}
        backLabel={backConfig.label}
        googleUser={googleUser}
        onGoogleSignIn={handleGoogleSignIn}
        onGoogleSignOut={handleGoogleSignOut}
        onLogOut={handleLogOut}
      />

      {/* Main Container */}
      <main className={`flex-1 max-w-[1680px] w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10 pt-20 md:pt-24 relative z-10 ${currentView === 'workspace' || currentView === 'intake' ? 'pb-3 h-[calc(100vh-1rem)] overflow-hidden flex flex-col justify-center' : 'pb-16 flex flex-col justify-center'}`}>
        
        <AnimatePresence mode="wait">
          
          {/* VIEW: HOME */}
          {currentView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-24"
            >
              <Hero
                onLaunchPrism={handleLaunchPrism}
                onTryDemo={handleSelectPersona}
                selectedPersonaName={selectedPersonaName}
              />

              <ModesGrid
                onSelectMode={(mode) => {
                  if (mode === 'dashboard') {
                    setCurrentView('intake');
                  } else if (mode === 'discover') {
                    setCurrentView('workspace');
                  } else {
                    setCurrentView('workspace');
                  }
                }}
                onEnterView={(view) => setCurrentView(view)}
                isStatic={true}
              />

              <FeaturesSection />
            </motion.div>
          )}

          {/* VIEW: INTAKE (Consent Setup / Auth) */}
          {currentView === 'intake' && (
            <motion.div
              key="intake"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full flex-1 flex flex-col justify-center min-h-0 h-full overflow-hidden"
            >
              <IntakeView
                isSubmitting={isSubmitting}
                onSubmit={(phone, permissions, selectedPersona) => {
                  setSelectedPersonaName(selectedPersona);
                  handleStartPipeline(phone, permissions);
                }}
                onCancel={() => setCurrentView('home')}
                googleUser={googleUser}
                onGoogleSignIn={handleGoogleSignIn}
              />
            </motion.div>
          )}

          {/* VIEW: WORKSPACE (Main Alternative Wealth Dashboard) */}
          {currentView === 'workspace' && (
            <motion.div
              key="workspace"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col min-h-0"
            >
              <WorkspaceView
                selectedPersonaName={selectedPersonaName}
                onBackToModes={handleBackToModes}
                googleToken={googleToken}
                onGoogleSignIn={handleGoogleSignIn}
                onHardReset={handleLogOut}
                permissions={permissions}
                onUpdatePermissions={setPermissions}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      <SignatureTransitionOverlay 
        isVisible={showSignatureOverlay} 
        personaName={selectedPersonaName} 
        onComplete={() => setShowSignatureOverlay(false)} 
      />
    </div>
  );
}
