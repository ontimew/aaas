import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin } from 'lucide-react';

const DATES = [
  { id: 'd1', label: '28 Out', fullDate: '28 de Outubro, 2026', date: '2026-10-28T19:00:00-03:00', venue: 'Estadio Morumbi' },
  { id: 'd2', label: '30 Out', fullDate: '30 de Outubro, 2026', date: '2026-10-30T19:00:00-03:00', venue: 'Estadio Morumbi' },
  { id: 'd3', label: '31 Out', fullDate: '31 de Outubro, 2026', date: '2026-10-31T19:00:00-03:00', venue: 'Estadio Morumbi' },
];

function calculateTimeLeft(targetDate: string) {
  const difference = +new Date(targetDate) - +new Date();
  if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center glass-card rounded-2xl">
          <span className="font-display text-2xl md:text-3xl font-bold text-white tabular-nums">
            {value.toString().padStart(2, '0')}
          </span>
        </div>
      </div>
      <span className="text-[10px] text-white/40 mt-2 font-semibold uppercase tracking-widest">{label}</span>
    </div>
  );
}

function Separator() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-1">
      <div className="w-1 h-1 rounded-full bg-white/20" />
      <div className="w-1 h-1 rounded-full bg-white/20" />
    </div>
  );
}

export default function Countdown() {
  const [times, setTimes] = useState(DATES.map(d => calculateTimeLeft(d.date)));
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimes(DATES.map(d => calculateTimeLeft(d.date)));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-32 px-4 relative">
      {/* Section header */}
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-xs font-semibold text-white/60 mb-6">
            <Calendar size={14} className="text-purple-400" />
            CONTAGEM REGRESSIVA
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-gradient mb-4">
            Shows no Brasil
          </h2>
          <p className="text-white/40 max-w-lg mx-auto">
            Tres noites historicas em Sao Paulo. Escolha sua data.
          </p>
        </motion.div>

        {/* Date selector tabs */}
        <div className="flex justify-center gap-2 mb-12">
          {DATES.map((date, i) => (
            <button
              key={date.id}
              onClick={() => setActiveIndex(i)}
              className={`px-6 py-3 rounded-full text-sm font-semibold transition-all ${
                activeIndex === i 
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                  : 'text-white/50 hover:text-white/70 border border-transparent hover:border-white/10'
              }`}
            >
              {date.label}
            </button>
          ))}
        </div>

        {/* Active countdown card */}
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          <div className="glass-card rounded-3xl p-8 md:p-12 relative overflow-hidden">
            {/* Glow effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />
            
            {/* Date info */}
            <div className="text-center mb-10 relative z-10">
              <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
                {DATES[activeIndex].fullDate}
              </h3>
              <p className="text-white/40 text-sm flex items-center justify-center gap-2">
                <MapPin size={14} className="text-purple-400" />
                {DATES[activeIndex].venue}, Sao Paulo
              </p>
            </div>

            {/* Timer */}
            <div className="flex items-center justify-center gap-2 md:gap-4 relative z-10">
              <TimeUnit value={times[activeIndex].days} label="Dias" />
              <Separator />
              <TimeUnit value={times[activeIndex].hours} label="Horas" />
              <Separator />
              <TimeUnit value={times[activeIndex].minutes} label="Min" />
              <Separator />
              <TimeUnit value={times[activeIndex].seconds} label="Seg" />
            </div>
          </div>
        </motion.div>

        {/* All dates overview */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {DATES.map((date, i) => (
            <motion.button
              key={date.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onClick={() => setActiveIndex(i)}
              className={`p-6 rounded-2xl text-left transition-all glass-card-hover ${
                activeIndex === i ? 'border-purple-500/30' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Show {i + 1}</span>
                <span className={`w-2 h-2 rounded-full ${activeIndex === i ? 'bg-purple-400' : 'bg-white/20'}`} />
              </div>
              <p className="font-display text-lg font-bold text-white">{date.fullDate}</p>
              <p className="text-sm text-white/40 mt-1">{times[i].days} dias restantes</p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
