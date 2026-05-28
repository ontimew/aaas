import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, User, LogOut } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: 'home' | 'projects' | 'tickets' | 'companhia' | 'admin' | 'profile') => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  onRequireAuth: () => void;
}

export default function Header({ currentView, setCurrentView, isAuthenticated, isAdmin, onRequireAuth }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const baseMenuItems = [
    { id: 'home', label: 'Início' },
    { id: 'projects', label: 'Projetos e Votações' },
    { id: 'tickets', label: 'Ingressos' },
    { id: 'companhia', label: 'Companhia' }
  ] as const;

  const menuItems = isAdmin 
    ? [...baseMenuItems, { id: 'admin', label: 'Admin (Auditoria)' } as const]
    : baseMenuItems;

  return (
    <>
    <header className={`fixed top-0 w-full z-[100] transition-all duration-500 flex justify-center ${scrolled ? 'bg-white/[0.03] backdrop-blur-[120px] border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.1)]' : 'bg-transparent'}`}>
      <div className="max-w-7xl w-full mx-auto px-6 h-20 flex items-center justify-between relative">
        <button 
          className="flex flex-col cursor-pointer shrink-0 z-10 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 rounded-lg" 
          onClick={() => setCurrentView('home')}
          aria-label="Ir para pagina inicial BARMY360"
        >
          <span className="text-xl md:text-2xl font-extrabold tracking-tight text-white/90">BARMY<span className="text-transparent bg-gradient-to-br from-violet-400 to-indigo-500 bg-clip-text">360</span></span>
          <span className="text-[9px] tracking-[0.2em] text-white/50 font-semibold uppercase mt-0.5">Army Brasil</span>
        </button>

        <div className="absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center z-0">
          <nav aria-label="Navegacao principal" className="flex items-center gap-1 px-1 py-1 bg-white/[0.03] border border-white/[0.08] rounded-full backdrop-blur-[120px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_4px_16px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.4)] ring-1 ring-white/[0.05]">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                aria-current={currentView === item.id ? 'page' : undefined}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 ${
                  currentView === item.id 
                    ? 'bg-white/10 text-white shadow-[0_4px_16px_rgba(0,0,0,0.15)] ring-1 ring-white/10' 
                    : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3 shrink-0 z-10">
          {isAuthenticated ? (
            <div className="hidden lg:flex items-center gap-2">
              <button 
                onClick={() => setCurrentView('profile')}
                className="px-4 py-2 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-white rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_4px_16px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.4)] ring-1 ring-white/[0.05] backdrop-blur-[120px] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50"
                aria-label="Acessar meu perfil"
              >
                <User size={14} className="inline text-violet-400" aria-hidden="true" /> Meu Perfil
              </button>
              <button onClick={handleLogout} className="p-2 bg-white/[0.03] hover:bg-red-500/20 border border-white/[0.08] hover:border-red-500/30 text-white/50 hover:text-red-400 rounded-full transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_4px_16px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.4)] ring-1 ring-white/[0.05] backdrop-blur-[120px] focus:outline-none focus:ring-2 focus:ring-violet-500/50" aria-label="Sair da conta">
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button onClick={onRequireAuth} className="hidden lg:flex px-5 py-2 bg-violet-600/80 hover:bg-violet-500 border border-violet-400/30 text-slate-50 rounded-full text-xs font-semibold transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_8px_32px_rgba(139,92,246,0.3)] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50">
              Login
            </button>
          )}

          <button
            onClick={() => setIsOpen(true)}
            aria-label="Abrir menu de navegacao"
            aria-expanded={isOpen}
            className="lg:hidden p-2 bg-white/[0.03] border border-white/[0.08] rounded-full text-white/70 hover:text-white hover:bg-white/[0.08] transition-all backdrop-blur-[120px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_4px_16px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.4)] ring-1 ring-white/[0.05] focus:outline-none focus:ring-2 focus:ring-violet-500/50"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>

    </header>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 bg-black/80 z-[110] lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 h-full w-full sm:w-84 bg-[#0a0515] shadow-[0_0_80px_rgba(0,0,0,0.8)] border-l border-white/[0.05] z-[120] p-6 flex flex-col lg:hidden"
            >
              <div className="flex justify-end mb-12">
                <button onClick={() => setIsOpen(false)} aria-label="Fechar menu" className="p-3 bg-white/[0.01] rounded-full text-white/50 hover:text-white hover:bg-white/[0.04] transition-all border border-white/[0.05] shadow-[0_8px_32px_0_rgba(0,0,0,0.36),inset_0_1px_0_0_rgba(255,255,255,0.05)] focus:outline-none focus:ring-2 focus:ring-violet-500/50">
                  <X size={18} />
                </button>
              </div>
              <nav className="flex flex-col gap-6 flex-1 px-4">
                {menuItems.map((item, i) => (
                  <motion.button
                    key={item.id}
                    onClick={(e) => { e.preventDefault(); setCurrentView(item.id); setIsOpen(false); }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className={`text-2xl font-medium transition-colors flex items-center group relative overflow-hidden tracking-tight text-left ${currentView === item.id ? 'text-white' : 'text-white/60 hover:text-white'}`}
                  >
                    <span className={`absolute left-0 w-0 h-full transition-all duration-500 ease-out -z-10 rounded-lg ${currentView === item.id ? 'w-full bg-violet-500/20' : 'group-hover:w-full bg-violet-500/10'}`} />
                    <span className="py-2 px-4">{item.label}</span>
                  </motion.button>
                ))}
              </nav>
              
              <div className="mt-8 px-4 flex flex-col gap-4">
                {isAuthenticated ? (
                  <>
                  <button onClick={() => { setCurrentView('profile'); setIsOpen(false); }} className="w-full py-4 bg-white/[0.01] hover:bg-white/[0.04] border border-white/[0.05] text-white rounded-2xl text-center font-semibold flex items-center justify-center gap-2 transition-all">
                    <User size={18} className="text-violet-400" /> Meu Perfil
                  </button>
                  <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full py-4 bg-white/[0.01] hover:bg-red-500/20 text-white/50 hover:text-red-400 border border-white/[0.05] hover:border-red-500/30 rounded-2xl transition-all font-semibold flex items-center justify-center gap-2">
                    <LogOut size={18} /> Sair
                  </button>
                  </>
                ) : (
                  <button 
                    onClick={() => { setIsOpen(false); onRequireAuth(); }}
                    className="w-full py-4 bg-violet-600/80 hover:bg-violet-500 border border-violet-400/30 text-slate-50 rounded-2xl font-semibold transition-all flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_8px_32px_rgba(139,92,246,0.3)]"
                  >
                    Fazer Login no Site
                  </button>
                )}
              </div>
              
              <div className="mt-auto px-4 pb-4 pt-8">
                <p className="text-xs text-white/30 font-semibold tracking-widest uppercase">BARMY360 • 2026</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
