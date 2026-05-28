import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, User, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { NotificationBell } from './Notifications';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: 'home' | 'projects' | 'tickets' | 'companhia' | 'admin' | 'profile' | 'faq') => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  onRequireAuth: () => void;
}

export default function Header({ currentView, setCurrentView, isAuthenticated, isAdmin, onRequireAuth }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentView('home');
  };

  const menuItems = [
    { id: 'home', label: 'Inicio' },
    { id: 'projects', label: 'Projetos' },
    { id: 'tickets', label: 'Ingressos' },
    { id: 'companhia', label: 'Companhia' },
    { id: 'faq', label: 'FAQ' },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin' }] : [])
  ] as const;

  return (
    <>
      <header 
        className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
          scrolled 
            ? 'bg-[#050507]/90 backdrop-blur-2xl border-b border-white/[0.04]' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <button 
              onClick={() => setCurrentView('home')}
              className="font-display text-xl font-bold tracking-tight z-10 group"
            >
              <span className="text-white group-hover:text-white/80 transition-colors">BARMY</span>
              <span className="text-gradient-brand">360</span>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 px-2 py-1.5 rounded-full glass-card">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as any)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    currentView === item.id 
                      ? 'text-white bg-white/[0.1]' 
                      : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3 z-10">
              {isAuthenticated ? (
                <div className="hidden lg:flex items-center gap-2">
                  <NotificationBell />
                  <button 
                    onClick={() => setCurrentView('profile')}
                    className="px-4 py-2 btn-ghost rounded-full text-sm font-medium text-white/70 hover:text-white flex items-center gap-2"
                  >
                    <User size={16} />
                    Perfil
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="p-2 rounded-full text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    aria-label="Sair"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={onRequireAuth}
                  className="hidden lg:flex px-5 py-2.5 btn-glow rounded-full text-sm font-semibold text-white"
                >
                  Entrar
                </button>
              )}

              <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden p-2.5 rounded-full text-white/70 hover:text-white glass-card transition-all"
                aria-label="Abrir menu"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] lg:hidden"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-[#0a0a0f] border-l border-white/[0.04] p-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-12">
                <span className="font-display text-lg font-bold">
                  <span className="text-white">BARMY</span>
                  <span className="text-gradient-brand">360</span>
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2.5 rounded-full text-white/50 hover:text-white glass-card transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex flex-col gap-1 flex-1">
                {menuItems.map((item, i) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => { setCurrentView(item.id as any); setIsOpen(false); }}
                    className={`w-full text-left px-5 py-4 rounded-2xl text-lg font-medium transition-all ${
                      currentView === item.id 
                        ? 'text-white bg-white/[0.06]' 
                        : 'text-white/50 hover:text-white hover:bg-white/[0.03]'
                    }`}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </nav>

              <div className="pt-6 border-t border-white/[0.04] space-y-3">
                {isAuthenticated ? (
                  <>
                    <button 
                      onClick={() => { setCurrentView('profile'); setIsOpen(false); }}
                      className="w-full px-5 py-4 rounded-2xl text-left text-white/60 hover:text-white glass-card transition-all flex items-center gap-3"
                    >
                      <User size={18} className="text-purple-400" />
                      Meu Perfil
                    </button>
                    <button 
                      onClick={() => { handleLogout(); setIsOpen(false); }}
                      className="w-full px-5 py-4 rounded-2xl text-left text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-3"
                    >
                      <LogOut size={18} />
                      Sair
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => { onRequireAuth(); setIsOpen(false); }}
                    className="w-full py-4 btn-glow rounded-2xl text-base font-semibold text-white"
                  >
                    Entrar na Plataforma
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
