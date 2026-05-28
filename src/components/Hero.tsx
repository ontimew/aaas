import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Users } from 'lucide-react';

interface HeroProps {
  setCurrentView: (view: 'home' | 'projects' | 'tickets' | 'companhia') => void;
}

export default function Hero({ setCurrentView }: HeroProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4">
      {/* Premium gradient mesh background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-600/5 rounded-full blur-[150px]" />
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-8"
        >
          <span className="px-4 py-2 rounded-full glass-card text-xs font-semibold tracking-wide text-white/80 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            America Latina Tour 2026
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-6 leading-[0.9]"
        >
          <span className="text-gradient">BARMY</span>
          <span className="text-gradient-brand">360</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg md:text-xl text-white/50 font-medium mb-12 max-w-2xl mx-auto leading-relaxed text-balance"
        >
          Hub oficial para projetos de fas, ingressos seguros e conexoes. 
          <span className="text-white/70"> De fas, para fas.</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button 
            onClick={() => setCurrentView('projects')}
            className="group w-full sm:w-auto px-8 py-4 btn-glow text-white text-sm font-semibold rounded-full flex items-center justify-center gap-2"
          >
            <Sparkles size={16} />
            Ver Projetos
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={() => setCurrentView('companhia')}
            className="group w-full sm:w-auto px-8 py-4 btn-ghost text-white/80 text-sm font-semibold rounded-full flex items-center justify-center gap-2"
          >
            <Users size={16} />
            Encontrar Companhia
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-20 grid grid-cols-3 gap-8 max-w-xl mx-auto"
        >
          {[
            { value: '3', label: 'Shows Confirmados' },
            { value: '2.5K+', label: 'Fas Conectados' },
            { value: '12', label: 'Projetos Ativos' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="font-display text-3xl md:text-4xl font-bold text-gradient-brand">{stat.value}</p>
              <p className="text-xs text-white/40 mt-1 font-medium">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050507] to-transparent" />
    </section>
  );
}
