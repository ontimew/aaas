import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Header from './components/Header';
import Hero from './components/Hero';
import Countdown from './components/Countdown';
import Projects from './components/Projects';
import Tickets from './components/Tickets';
import Companhia from './components/Companhia';
import AuthModal from './components/AuthModal';
import AdminPanel from './components/AdminPanel';
import ProfileSettings from './components/ProfileSettings';
import FAQ from './components/FAQ';
import ScrollToTop from './components/ScrollToTop';
import { NotificationProvider } from './components/Notifications';

export type ViewState = 'home' | 'projects' | 'tickets' | 'companhia' | 'admin' | 'profile' | 'faq';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setIsAdmin(user?.email === 'sheliton.contact@gmail.com');
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#050507] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-white/40 text-sm font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <NotificationProvider>
      <div className="bg-[#050507] min-h-screen text-white font-sans overflow-x-hidden selection:bg-purple-500/30 relative">
        {/* Premium ambient background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-[50vw] h-[50vh] bg-purple-600/8 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-0 w-[40vw] h-[40vh] bg-cyan-600/5 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] bg-violet-600/3 rounded-full blur-[200px]" />
        </div>

        {/* Noise texture */}
        <div className="fixed inset-0 opacity-[0.015] pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }} />

        <Header 
          currentView={currentView} 
          setCurrentView={setCurrentView} 
          isAuthenticated={isAuthenticated}
          isAdmin={isAdmin}
          onRequireAuth={() => setIsAuthModalOpen(true)}
        />
        
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
          onSuccess={() => {
            setIsAuthenticated(true);
            setIsAuthModalOpen(false);
          }} 
        />

        <main className="relative z-10">
          <AnimatePresence mode="wait">
            {currentView === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <Hero setCurrentView={setCurrentView} />
                <Countdown />
              </motion.div>
            )}

            {currentView === 'projects' && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <Projects isAuthenticated={isAuthenticated} onRequireAuth={() => setIsAuthModalOpen(true)} />
              </motion.div>
            )}

            {currentView === 'tickets' && (
              <motion.div
                key="tickets"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <Tickets isAuthenticated={isAuthenticated} onRequireAuth={() => setIsAuthModalOpen(true)} />
              </motion.div>
            )}

            {currentView === 'companhia' && (
              <motion.div
                key="companhia"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <Companhia isAuthenticated={isAuthenticated} onRequireAuth={() => setIsAuthModalOpen(true)} />
              </motion.div>
            )}

            {currentView === 'admin' && (
              <motion.div
                key="admin"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <AdminPanel isAuthenticated={isAuthenticated} isAdmin={isAdmin} onRequireAuth={() => setIsAuthModalOpen(true)} />
              </motion.div>
            )}

            {currentView === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <ProfileSettings isAuthenticated={isAuthenticated} onRequireAuth={() => setIsAuthModalOpen(true)} />
              </motion.div>
            )}

            {currentView === 'faq' && (
              <motion.div
                key="faq"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <FAQ />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="relative z-10 py-16 mt-32 border-t border-white/[0.04]">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="font-display text-2xl font-bold mb-4">
              <span className="text-white">BARMY</span>
              <span className="text-gradient-brand">360</span>
            </p>
            <p className="text-white/40 text-sm mb-2">
              Um espaco de fas, para fas.
            </p>
            <p className="text-white/20 text-xs max-w-md mx-auto">
              Projeto independente sem vinculo oficial com BIGHIT MUSIC ou a marca BTS.
            </p>
          </div>
        </footer>

        <ScrollToTop />
      </div>
    </NotificationProvider>
  );
}
