import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

const DATES = [
  { id: 'd1', label: '28/10/2026', date: '2026-10-28T19:00:00-03:00' },
  { id: 'd2', label: '30/10/2026', date: '2026-10-30T19:00:00-03:00' },
  { id: 'd3', label: '31/10/2026', date: '2026-10-31T19:00:00-03:00' },
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

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 sm:w-14 sm:h-14 md:w-20 md:h-20 flex items-center justify-center bg-white/[0.03] border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_4px_16px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.4)] ring-1 ring-white/[0.05] rounded-2xl backdrop-blur-[120px] mb-3 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="text-2xl md:text-3xl font-medium font-mono text-white/90 tracking-widest">{value.toString().padStart(2, '0')}</span>
      </div>
      <span className="text-[9px] md:text-[10px] text-white/40 font-semibold uppercase tracking-[0.2em]">{label}</span>
    </div>
  );
}

export default function Countdown() {
  const [times, setTimes] = useState(DATES.map(d => calculateTimeLeft(d.date)));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimes(DATES.map(d => calculateTimeLeft(d.date)));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 px-4 max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight text-white/90">Shows do BTS no Brasil</h2>
        <p className="text-white/50 font-medium md:text-lg">Contador separado para cada data oficial.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {DATES.map((dateObj, i) => (
          <motion.div
            key={dateObj.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="bg-white/[0.03] border border-white/[0.08] rounded-3xl p-8 md:p-10 backdrop-blur-[120px] relative overflow-hidden group hover:border-white/[0.1] transition-all duration-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_4px_16px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.4)] ring-1 ring-white/[0.05]"
          >
            {/* Ambient Card Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-violet-500/10 blur-[60px] transition-all group-hover:bg-violet-500/20 rounded-full pointer-events-none" />
            
            <h3 className="text-lg md:text-xl font-semibold mb-10 flex items-center gap-3 text-white/80">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(139,92,246,0.8)] animate-pulse" />
              {dateObj.label}
            </h3>
            
            <div className="flex justify-between md:justify-center lg:justify-between gap-1 sm:gap-4 md:gap-3">
              <TimeBlock value={times[i].days} label="Dias" />
              <div className="text-white/10 font-mono text-2xl pt-5 hidden sm:block font-light">:</div>
              <TimeBlock value={times[i].hours} label="Horas" />
              <div className="text-white/10 font-mono text-2xl pt-5 hidden sm:block font-light">:</div>
              <TimeBlock value={times[i].minutes} label="Min" />
              <div className="text-white/10 font-mono text-2xl pt-5 hidden sm:block font-light">:</div>
              <TimeBlock value={times[i].seconds} label="Seg" />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
