import { motion } from 'motion/react';

interface HeroProps {
  setCurrentView: (view: 'home' | 'projects' | 'tickets' | 'companhia') => void;
}

export default function Hero({ setCurrentView }: HeroProps) {
  return (
    <section className="relative pt-40 pb-20 px-4 min-h-[75vh] flex items-center justify-center overflow-hidden" aria-labelledby="hero-title">
      {/* Subtle Background Glows - reduced blur on mobile for performance */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] md:w-[600px] md:h-[600px] bg-violet-600/10 blur-[60px] md:blur-[140px] rounded-full pointer-events-none" aria-hidden="true" />
      <div className="absolute top-0 right-0 w-[200px] h-[200px] md:w-[400px] md:h-[400px] bg-indigo-500/10 blur-[60px] md:blur-[120px] rounded-full pointer-events-none" aria-hidden="true" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-block mb-6"
        >
          <span className="px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_4px_16px_rgba(255,255,255,0.05),0_4px_24px_rgba(0,0,0,0.5)] ring-1 ring-white/[0.05] text-[10px] font-bold tracking-[0.2em] text-violet-300 backdrop-blur-[120px] uppercase">
            America Latina - Shows 2026
          </span>
        </motion.div>

        <motion.h1
          id="hero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-[6rem] font-extrabold tracking-tighter mb-6 bg-gradient-to-br from-white via-white to-white/40 bg-clip-text text-transparent drop-shadow-sm pb-2 leading-none"
        >
          BARMY<span className="text-transparent bg-gradient-to-br from-violet-400 to-indigo-600 bg-clip-text">360</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-base md:text-xl text-white/70 font-medium mb-10 max-w-2xl mx-auto leading-relaxed md:leading-snug text-balance"
        >
          Um espaco seguro para projetos e apoio. Matchmaking de companhia e compras supervisionados
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button 
            onClick={() => setCurrentView('projects')}
            className="w-full sm:w-auto px-6 py-3 bg-violet-600/80 backdrop-blur-[120px] border border-violet-400/30 text-slate-50 text-sm font-semibold rounded-full flex items-center justify-center gap-2 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_4px_16px_rgba(255,255,255,0.05),0_8px_32px_rgba(139,92,246,0.3)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),inset_0_4px_16px_rgba(255,255,255,0.1),0_12px_40px_rgba(139,92,246,0.4)] hover:bg-violet-500/90 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          >
            Acessar Projetos
          </button>
          <button 
            onClick={() => setCurrentView('companhia')}
            className="w-full sm:w-auto px-6 py-3 bg-white/[0.03] backdrop-blur-[120px] border border-white/[0.08] ring-1 ring-white/[0.05] text-white text-sm font-semibold rounded-full flex items-center justify-center gap-2 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_4px_16px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.4)] hover:bg-white/[0.08] hover:border-white/[0.1] hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          >
            Encontrar Companhia
          </button>
        </motion.div>
      </div>
    </section>
  );
}
