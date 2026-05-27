import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, CheckCircle2, Loader2, Lock } from 'lucide-react';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import confetti from 'canvas-confetti';
import { db, auth } from '../firebase';

const projectsData = [
  {
    id: 'p1',
    title: 'Handbanner • Fase 1',
    status: 'VOTAÇÃO ABERTA',
    statusColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    desc: 'Escolha a frase principal de saudação do fan-project oficial.',
    btnText: '[Ver explicação e votar]'
  },
  {
    id: 'p2',
    title: 'Ocean Roxo',
    status: 'EM PLANEJAMENTO',
    statusColor: 'bg-white/10 text-gray-300 border-white/10',
    desc: 'Mapeamento de setores para execução do ocean luminoso durante o show.',
    btnText: '[Ver explicação]'
  },
  {
    id: 'p3',
    title: 'Mensagem Final',
    status: 'EM PLANEJAMENTO',
    statusColor: 'bg-white/10 text-gray-300 border-white/10',
    desc: 'Arrecadação e organização para a faixa coreografada de encerramento.',
    btnText: '[Ver explicação]'
  }
];

interface ProjectsProps {
  isAuthenticated: boolean;
  onRequireAuth: () => void;
}

export default function Projects({ isAuthenticated, onRequireAuth }: ProjectsProps) {
  const [votedOption, setVotedOption] = useState<number | null>(null);
  const [votingOption, setVotingOption] = useState<number | null>(null);
  const [votes, setVotes] = useState([1452, 2408, 890]); // initial mock fallback

  useEffect(() => {
    const q = query(collection(db, 'votes'), where('projectId', '==', 'p1'));
    const unsub = onSnapshot(q, (snap) => {
      let counts = [1452, 2408, 890]; // start with base mock numbers
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
        colors: ['#8b5cf6', '#d946ef', '#ffffff']
      });
    } catch(err) {
      console.error(err);
    } finally {
      setVotingOption(null);
    }
  };

  return (
    <section className="py-24 px-4 max-w-7xl mx-auto">
      <div className="mb-14">
        <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Projetos em andamento</h2>
        <p className="text-gray-400 font-medium md:text-lg">Escolha um projeto para ver explicação, dinâmica, avisos e opções de votação.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
        {projectsData.map((proj, i) => (
          <motion.div
            key={proj.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="backdrop-blur-3xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/[0.05] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_8px_32px_rgba(0,0,0,0.3)] rounded-3xl overflow-hidden flex flex-col hover:border-violet-500/40 transition-all group relative"
          >
            {/* Animated Placeholder Graphic Container */}
            <div className="h-44 bg-[#0a0a0f] relative overflow-hidden flex items-center justify-center border-b border-white/[0.05]">
              {/* Subtle grid pattern / particles overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:16px_16px]" />
              <div className="absolute inset-0 bg-violet-900/10" />
              
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="w-32 h-32 rounded-full border-[1px] border-dashed border-violet-500/30 flex items-center justify-center relative"
              >
                <div className="absolute inset-0 rounded-full border border-violet-400/20 scale-75 animate-pulse" />
                <div className="w-12 h-12 rounded-full bg-violet-600/20 blur-md" />
              </motion.div>
            </div>

            <div className="p-8 flex flex-col flex-1">
              <div className="mb-6">
                <span className={`inline-block px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-bold tracking-widest border ${proj.statusColor}`}>
                  {proj.status}
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3 text-white group-hover:text-violet-300 transition-colors">{proj.title}</h3>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8 flex-1">
                {proj.desc}
              </p>
              <button className="w-full py-3.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 border border-white/10 group-hover:border-violet-500/30">
                {proj.btnText}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* VOTING SECTION COMPONENT WITHIN PROJECTS */}
      <div className="pt-20 border-t border-white/[0.05]">
        <div className="mb-14">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Opções de handbanner</h2>
          <p className="text-violet-400/80 text-sm md:text-base font-semibold uppercase tracking-widest inline-flex items-center gap-2 bg-violet-500/10 px-4 py-2 rounded-full border border-violet-500/20">
             handbanner fase 1 <span className="text-gray-500">•</span> aberta <span className="text-gray-500">•</span> 3 opções
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((opt, i) => {
            const isSelected = votedOption === opt;
            const hasVoted = votedOption !== null;
            return (
              <motion.div
                key={opt}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`rounded-3xl p-5 border transition-all duration-300 relative overflow-hidden group
                  ${isSelected ? 'bg-violet-900/20 border-violet-500 shadow-[0_0_30px_rgba(139,92,246,0.15)]' : 'bg-white/[0.01] border-white/10 hover:border-white/20 hover:bg-white/[0.04]'}`}
              >
                {/* Gradient Accent for selected card */}
                {isSelected && <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-violet-500/10 to-transparent pointer-events-none" />}

                <div className="aspect-[2.5/1] w-full bg-[#1A1A24] rounded-2xl mb-6 flex items-center justify-center border border-white/5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/5 to-transparent" />
                  <span className="text-gray-500/50 font-bold tracking-widest text-lg">PROJETO VISUAL 0{opt}</span>
                </div>
                
                <div className="px-2">
                  <h4 className="text-xl font-bold mb-2">Opção 0{opt}</h4>
                  <div className="flex items-center justify-between mb-8 h-6 relative">
                    <AnimatePresence mode="wait">
                      {hasVoted ? (
                        <motion.p
                          key="results"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="text-sm font-mono tracking-wider font-semibold w-full flex justify-between"
                        >
                          <span className={isSelected ? "text-violet-400" : "text-gray-400"}>
                            {votes[i].toLocaleString()} VOTOS
                          </span>
                          {isSelected && <span className="text-violet-400">SEU VOTO</span>}
                        </motion.p>
                      ) : (
                        <motion.p
                          key="hidden"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="text-sm font-mono tracking-wider font-semibold text-gray-500"
                        >
                          VOTAÇÃO SECRETA
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <button
                    onClick={() => handleVote(opt)}
                    disabled={hasVoted || votingOption !== null}
                    className={`w-full py-3.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 
                      ${isSelected ? 'bg-violet-600 text-white shadow-lg cursor-default border border-violet-400/50' : 
                      (hasVoted ? 'bg-white/[0.01] text-gray-500 border border-transparent cursor-not-allowed' : 'bg-white/10 hover:bg-white/20 text-white border border-white/5')}`}
                  >
                    {votingOption === opt ? (
                       <><Loader2 size={18} className="animate-spin" /> Processando...</>
                    ) : isSelected ? (
                      <><CheckCircle2 size={18} /> Voto Registrado</>
                    ) : !isAuthenticated && !hasVoted ? (
                      <><Lock size={16} /> Fazer Login para Votar</>
                    ) : (
                      hasVoted ? 'Bloqueado' : '[Votar]'
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
