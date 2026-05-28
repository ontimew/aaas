import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, CheckCircle2, Loader2, Lock, Vote, Sparkles } from 'lucide-react';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import confetti from 'canvas-confetti';
import { db, auth } from '../firebase';

const projectsData = [
  {
    id: 'p1',
    title: 'Handbanner - Fase 1',
    status: 'VOTACAO ABERTA',
    isLive: true,
    desc: 'Escolha a frase principal de saudacao do fan-project oficial.',
    progress: 75
  },
  {
    id: 'p2',
    title: 'Ocean Roxo',
    status: 'EM PLANEJAMENTO',
    isLive: false,
    desc: 'Mapeamento de setores para execucao do ocean luminoso durante o show.',
    progress: 30
  },
  {
    id: 'p3',
    title: 'Mensagem Final',
    status: 'EM PLANEJAMENTO',
    isLive: false,
    desc: 'Arrecadacao e organizacao para a faixa coreografada de encerramento.',
    progress: 15
  }
];

interface ProjectsProps {
  isAuthenticated: boolean;
  onRequireAuth: () => void;
}

export default function Projects({ isAuthenticated, onRequireAuth }: ProjectsProps) {
  const [votedOption, setVotedOption] = useState<number | null>(null);
  const [votingOption, setVotingOption] = useState<number | null>(null);
  const [votes, setVotes] = useState([1452, 2408, 890]);

  useEffect(() => {
    const q = query(collection(db, 'votes'), where('projectId', '==', 'p1'));
    const unsub = onSnapshot(q, (snap) => {
      let counts = [1452, 2408, 890];
      let userVotedFor = null;
      snap.forEach(doc => {
        const data = doc.data();
        if(data.optionId >= 1 && data.optionId <= 3) {
          counts[data.optionId - 1]++;
        }
        if (auth.currentUser && data.userId === auth.currentUser.uid) {
          userVotedFor = data.optionId;
        }
      });
      setVotes(counts);
      setVotedOption(userVotedFor);
    }, (error) => {
      console.error('Firestore Error:', error);
    });
    return () => unsub();
  }, [isAuthenticated]);

  const handleVote = async (opt: number) => {
    if (!isAuthenticated || !auth.currentUser) {
      onRequireAuth();
      return;
    }
    setVotingOption(opt);
    try {
      await addDoc(collection(db, 'votes'), {
        projectId: 'p1',
        optionId: opt,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp()
      });
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#06b6d4', '#ffffff']
      });
    } catch(err) {
      console.error(err);
    } finally {
      setVotingOption(null);
    }
  };

  const totalVotes = votes.reduce((a, b) => a + b, 0);

  return (
    <section className="pt-32 pb-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-xs font-semibold text-white/60 mb-6">
            <Sparkles size={14} className="text-purple-400" />
            FAN PROJECTS
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-gradient mb-4">
            Projetos em Andamento
          </h1>
          <p className="text-white/40 max-w-xl text-lg">
            Participe dos projetos oficiais da comunidade ARMY Brasil para os shows de 2026.
          </p>
        </motion.div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {projectsData.map((proj, i) => (
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card glass-card-hover rounded-3xl overflow-hidden flex flex-col"
            >
              {/* Visual header */}
              <div className="h-40 bg-gradient-to-br from-purple-500/10 to-cyan-500/5 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="w-24 h-24 rounded-full border border-dashed border-purple-500/30 flex items-center justify-center"
                >
                  <div className="w-16 h-16 rounded-full bg-purple-500/10 backdrop-blur-sm" />
                </motion.div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                {/* Status badge */}
                <div className="mb-4">
                  <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${
                    proj.isLive 
                      ? 'badge-live' 
                      : 'badge-pending'
                  }`}>
                    {proj.isLive && <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />}
                    {proj.status}
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold text-white mb-2">{proj.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed mb-6 flex-1">{proj.desc}</p>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-white/40">Progresso</span>
                    <span className="text-white/60 font-medium">{proj.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${proj.progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"
                    />
                  </div>
                </div>

                <button className="w-full py-3 btn-ghost rounded-xl text-sm font-medium text-white/70 hover:text-white flex items-center justify-center gap-2">
                  Ver detalhes
                  <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Voting section */}
        <div className="pt-16 border-t border-white/[0.04]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-xs font-semibold text-white/60 mb-6">
              <Vote size={14} className="text-purple-400" />
              VOTACAO ATIVA
            </span>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-gradient mb-4">
              Opcoes de Handbanner
            </h2>
            <p className="text-white/40 max-w-lg">
              Escolha a frase que representara a ARMY Brasil nos shows. Seu voto e secreto ate o fim.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((opt, i) => {
              const isSelected = votedOption === opt;
              const hasVoted = votedOption !== null;
              const percentage = hasVoted ? Math.round((votes[i] / totalVotes) * 100) : 0;
              
              return (
                <motion.div
                  key={opt}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`glass-card rounded-3xl p-6 relative overflow-hidden transition-all duration-300 ${
                    isSelected 
                      ? 'border-purple-500/40 shadow-[0_0_40px_-10px_rgba(168,85,247,0.3)]' 
                      : 'glass-card-hover'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-cyan-500" />
                  )}

                  {/* Visual placeholder */}
                  <div className="aspect-[2/1] w-full bg-white/[0.02] rounded-2xl mb-6 flex items-center justify-center border border-white/[0.04] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent" />
                    <span className="text-white/20 font-display font-bold text-lg">DESIGN 0{opt}</span>
                  </div>
                  
                  <h4 className="font-display text-xl font-bold mb-3">Opcao 0{opt}</h4>
                  
                  {/* Results or hidden state */}
                  <div className="mb-6 h-12">
                    <AnimatePresence mode="wait">
                      {hasVoted ? (
                        <motion.div
                          key="results"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-2"
                        >
                          <div className="flex justify-between text-sm">
                            <span className={isSelected ? "text-purple-400 font-medium" : "text-white/50"}>
                              {votes[i].toLocaleString()} votos
                            </span>
                            <span className={isSelected ? "text-purple-400 font-bold" : "text-white/40"}>
                              {percentage}%
                            </span>
                          </div>
                          <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className={`h-full rounded-full ${isSelected ? 'bg-gradient-to-r from-purple-500 to-cyan-500' : 'bg-white/20'}`}
                            />
                          </div>
                        </motion.div>
                      ) : (
                        <motion.p
                          key="hidden"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-white/30 text-sm"
                        >
                          Resultados revelados apos votar
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <button
                    onClick={() => handleVote(opt)}
                    disabled={hasVoted || votingOption !== null}
                    className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                      isSelected 
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 cursor-default' 
                        : hasVoted 
                          ? 'bg-white/[0.02] text-white/30 border border-white/[0.04] cursor-not-allowed' 
                          : 'btn-glow'
                    }`}
                  >
                    {votingOption === opt ? (
                       <><Loader2 size={16} className="animate-spin" /> Votando...</>
                    ) : isSelected ? (
                      <><CheckCircle2 size={16} /> Seu Voto</>
                    ) : !isAuthenticated && !hasVoted ? (
                      <><Lock size={14} /> Login para Votar</>
                    ) : (
                      hasVoted ? 'Bloqueado' : 'Votar'
                    )}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
