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

export type ViewState = 'home' | 'projects' | 'tickets' | 'companhia' | 'admin' | 'profile';

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

  const requireAuth = (action: () => void) => {
    if (isAuthenticated) {
      action();
    } else {
      setIsAuthModalOpen(true);
    }
  };

  if (authLoading) return <div className="min-h-screen bg-black text-white flex justify-center items-center">Loading...</div>;

  return (
    <div className="bg-black min-h-screen text-white font-sans overflow-x-hidden selection:bg-violet-500/30 relative">
      {/* Background Orbs for Glassmorphism Context */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[40%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="fixed top-[40%] right-[-10%] w-[30%] h-[30%] rounded-full bg-fuchsia-600/10 blur-[120px] pointer-events-none" />

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

      <main className="pt-20">
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
        </AnimatePresence>
      </main>

      <footer className="py-20 border-t border-white/[0.03] text-center mt-32 relative bg-white/[0.01] backdrop-blur-xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] max-w-4xl h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
        <p className="text-white/40 text-sm font-medium tracking-wide">
          <span className="text-violet-400/80 font-bold">BARMY360</span> • Um espaço de fãs para fãs.
        </p>
        <p className="text-white/20 text-xs mt-3 max-w-lg mx-auto font-medium">
          Este é um projeto independente e não possui nenhum vínculo oficial com a BIGHIT MUSIC ou a marca BTS.
        </p>
      </footer>
    </div>
  );
}
