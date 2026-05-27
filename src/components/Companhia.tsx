import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Users, UserPlus, MapPin, Calendar, User, Lock, ShieldCheck, Loader2, X } from 'lucide-react';
import { collection, query, where, onSnapshot, doc, updateDoc, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Tooltip } from './Tooltip';

interface CompanhiaProps {
  isAuthenticated: boolean;
  onRequireAuth: () => void;
}

export default function Companhia({ isAuthenticated, onRequireAuth }: CompanhiaProps) {
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [connections, setConnections] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ show: '', sector: '', age: '' });
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'connections'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const fetched = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter((doc: any) => doc.type === 'buscar');
      setConnections(fetched);
    });
    return () => unsub();
  }, []);

  const handleConnect = async (id: string, currentConnectedWith: string[]) => {
    if (!auth.currentUser) return;
    setConnectingId(id);
    try {
      const connRef = doc(db, 'connections', id);
      await updateDoc(connRef, {
        connectedWith: [...(currentConnectedWith || []), auth.currentUser.uid]
      });
    } catch(err) {
      console.error(err);
    } finally {
      setConnectingId(null);
    }
  };

  const handlePublish = async (e: any) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setIsPublishing(true);
    try {
      await addDoc(collection(db, 'connections'), {
        type: 'buscar',
        show: formData.show,
        sector: formData.sector,
        age: formData.age,
        userId: auth.currentUser.uid,
        name: auth.currentUser.displayName || 'Anônimo',
        verified: true,
        connectedWith: [],
        createdAt: serverTimestamp()
      });
      setIsModalOpen(false);
      setFormData({ show: '', sector: '', age: '' });
    } catch(err) {
      console.error(err);
    } finally {
      setIsPublishing(false);
    }
  };

  const openModal = () => {
    if (!isAuthenticated) {
      onRequireAuth();
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <section className="py-24 px-4 max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 text-white/90">Encontre sua Companhia</h2>
        <p className="text-white/50 font-medium max-w-2xl mx-auto leading-relaxed md:text-lg">
          Vai sozinha ao evento? Conecte-se com outras ARMYs para dividir a experiência e garantir segurança coletiva durante todo o dia. Acesso restrito a fãs verificados.
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-red-500/5 border border-red-500/20 rounded-[2rem] p-8 md:p-10 mb-16 flex flex-col md:flex-row items-start md:items-center gap-8 backdrop-blur-[120px] relative overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_4px_16px_rgba(255,255,255,0.05),0_8px_32px_rgba(239,68,68,0.2)] ring-1 ring-white/[0.05]"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 blur-[100px] pointer-events-none" />
        <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-48 h-48 bg-red-900/10 blur-[80px] pointer-events-none" />
        
        <div className="p-5 bg-gradient-to-b from-red-500/10 to-red-500/5 border border-red-500/10 rounded-3xl text-red-400 shrink-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] backdrop-blur-md relative z-10">
          <ShieldAlert size={36} className="text-red-400" />
        </div>
        <div className="relative z-10">
          <h3 className="text-red-300 font-bold text-xl mb-4 tracking-tight">Protocolo de Segurança Indispensável</h3>
          <ul className="text-white/60 text-sm md:text-base space-y-3 font-medium list-disc ml-5 leading-relaxed">
            <li>Nenhuma conta anônima interage no painel. O <strong className="text-red-300 font-bold">Login Oficial</strong> é obrigatório para visualização.</li>
            <li>Marque encontros físicos <strong className="text-red-300 font-bold">apenas</strong> dentro do estádio ou nas filas oficiais supervisionadas.</li>
            <li>Compartilhe sua localização em tempo real permanentemente com familiares ou responsáveis.</li>
          </ul>
        </div>
      </motion.div>

      <div className="flex justify-center mb-20">
        <Tooltip content="Crie um anúncio para encontrar sua companhia" position="top">
          <button 
            onClick={openModal}
            className="w-full max-w-xs h-14 flex flex-col items-center justify-center gap-1 bg-violet-600/80 hover:bg-violet-600/90 border border-violet-400/30 text-slate-50 rounded-full transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_4px_16px_rgba(255,255,255,0.1),0_8px_24px_rgba(139,92,246,0.3)] backdrop-blur-[120px] group relative overflow-hidden px-6"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <div className="flex items-center gap-2">
                <UserPlus size={16} className="text-violet-200" />
                <span className="font-semibold text-sm tracking-wide">Quero um Padrinho/Madrinha</span>
            </div>
          </button>
        </Tooltip>
      </div>

      <div className="mb-14 w-full flex flex-col md:flex-row gap-3 items-center bg-white/[0.03] p-3 rounded-3xl border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_4px_16px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.4)] ring-1 ring-white/[0.05] backdrop-blur-[120px]">
        <div className="w-full md:w-auto text-[10px] font-bold text-white/30 px-4 tracking-[0.2em] shrink-0 uppercase mb-2 md:mb-0">
          Filtrar Conexões
        </div>
        
        <Tooltip content="Filtrar perfis pelo dia do show" className="w-full flex-1">
          <div className="w-full relative">
            <select defaultValue="" className="w-full bg-[#050505]/50 hover:bg-[#050505]/80 border border-white/[0.05] text-white/80 text-xs font-semibold rounded-2xl px-4 py-3 outline-none focus:border-violet-500/50 transition-all appearance-none cursor-pointer backdrop-blur-[80px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.6)]">
                <option value="" disabled>Data do Show</option>
                <option className="bg-black text-white" value="28">28/10/2026</option>
                <option className="bg-black text-white" value="30">30/10/2026</option>
                <option className="bg-black text-white" value="31">31/10/2026</option>
            </select>
          </div>
        </Tooltip>
        
        <Tooltip content="Filtrar perfis por setor do ingresso" className="w-full flex-1">
          <div className="w-full relative">
            <select defaultValue="" className="w-full bg-[#050505]/50 hover:bg-[#050505]/80 border border-white/[0.05] text-white/80 text-xs font-semibold rounded-2xl px-4 py-3 outline-none focus:border-violet-500/50 transition-all appearance-none cursor-pointer backdrop-blur-[80px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.6)]">
                <option value="" disabled>Setor do Ingresso</option>
                <option className="bg-black text-white">Pista Premium</option>
                <option className="bg-black text-white">Pista Comum</option>
                <option className="bg-black text-white">Cadeira Inferior</option>
                <option className="bg-black text-white">Cadeira Superior</option>
            </select>
          </div>
        </Tooltip>
        
        <Tooltip content="Filtrar perfis por faixa etária" className="w-full md:max-w-[160px]">
          <div className="w-full relative">
            <select defaultValue="" className="w-full bg-[#050505]/50 hover:bg-[#050505]/80 border border-white/[0.05] text-white/80 text-xs font-semibold rounded-2xl px-4 py-3 outline-none focus:border-violet-500/50 transition-all appearance-none cursor-pointer backdrop-blur-[80px] shadow-[inset_0_2px_10px_rgba(0,0,0,0.6)]">
                <option value="" disabled>Faixa Etária</option>
                <option className="bg-black text-white">18-20 anos</option>
                <option className="bg-black text-white">21-25 anos</option>
                <option className="bg-black text-white">26-30 anos</option>
                <option className="bg-black text-white">30+ anos</option>
            </select>
          </div>
        </Tooltip>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {connections.map((person, i) => {
          const isConnected = person.connectedWith?.includes(auth.currentUser?.uid);
          return (
          <motion.div
            key={person.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.1] hover:bg-white/[0.08] rounded-[2rem] p-8 transition-all duration-500 relative group backdrop-blur-[120px] ring-1 ring-white/[0.05] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_4px_16px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.4)]"
          >
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-[0_4px_16px_rgba(139,92,246,0.3)] ring-1 ring-white/10 relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {person.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h4 className="font-bold text-xl text-white/90 mb-1 tracking-tight group-hover:text-white transition-colors">{person.name}</h4>
                  <span className="flex items-center gap-1.5 text-[10px] text-emerald-400/80 font-semibold uppercase tracking-[0.1em]">
                    <UserPlus size={12} />
                    Busca Padrinho/Madrinha
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-4 text-sm text-white/60 font-medium bg-white/[0.01] py-3 px-5 rounded-full border border-white/[0.03]">
                <Calendar size={16} className="text-violet-400" />
                <span>Show: {person.show}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-white/60 font-medium bg-white/[0.01] py-3 px-5 rounded-full border border-white/[0.03]">
                <MapPin size={16} className="text-violet-400" />
                <span>{person.sector}</span>
              </div>
            </div>

            <button 
              onClick={() => isAuthenticated ? handleConnect(person.id, person.connectedWith) : onRequireAuth()}
              disabled={connectingId === person.id || isConnected || person.userId === auth.currentUser?.uid}
              className={`w-full py-4 rounded-full text-sm font-semibold transition-all duration-300 border flex justify-center items-center gap-2 shadow-[0_8px_32px_0_rgba(0,0,0,0.36),inset_0_1px_0_0_rgba(255,255,255,0.05)] ${
                isConnected
                ? 'bg-violet-600/20 text-violet-300 border-violet-500/30'
                : person.userId === auth.currentUser?.uid
                ? 'bg-white/[0.01] text-white/40 border-white/[0.05]'
                : 'bg-white/[0.01] hover:bg-white/[0.04] text-white/80 hover:text-white border-white/[0.05]'
              }`}
            >
              {connectingId === person.id ? (
                <><Loader2 size={16} className="animate-spin" /> Conectando...</>
              ) : isConnected ? (
                <><ShieldCheck size={16} /> Solicitação Enviada</>
              ) : person.userId === auth.currentUser?.uid ? (
                <><User size={16} /> Seu Perfil</>
              ) : (
                <><UserPlus size={16} /> Conectar</>
              )}
            </button>
          </motion.div>
        )})}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-3xl z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30, rotateX: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30, rotateX: -10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white/[0.01] border border-white/[0.05] w-full max-w-md rounded-[2rem] p-8 md:p-10 relative overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_80px_rgba(139,92,246,0.1)] ring-1 ring-white/[0.05]"
              style={{ transformPerspective: 1000 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-transparent opacity-50 pointer-events-none" />
              <div className="absolute -top-32 -left-32 w-64 h-64 bg-violet-500/20 rounded-full blur-[80px] pointer-events-none" />

              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors bg-white/[0.01] hover:bg-white/[0.1] p-2 rounded-full z-20 backdrop-blur-md border border-white/[0.05]"
              >
                <X size={20} />
              </button>
              
              <div className="flex flex-col text-center items-center mb-8 relative z-10">
                <div className="w-16 h-16 rounded-[1.5rem] bg-white/[0.01] border border-white/[0.1] flex items-center justify-center mb-4 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/30 to-fuchsia-500/30 opacity-100" />
                  <UserPlus size={24} className="relative z-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Quero um Padrinho/Madrinha
                </h3>
                <p className="text-white/50 text-sm">Proteja-se. Encontre outras ARMYs.</p>
              </div>

              <form onSubmit={handlePublish} className="flex flex-col gap-4 relative z-10">
                <select 
                  required
                  value={formData.show}
                  onChange={(e) => setFormData({...formData, show: e.target.value})}
                  className="w-full bg-white/[0.01] border border-white/[0.05] rounded-full px-5 py-4 text-white outline-none focus:border-violet-500/50 focus:bg-white/[0.01] transition-all font-medium text-sm appearance-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
                >
                  <option value="" disabled>Qual Data?</option>
                  <option value="28/10/2026" className="bg-black text-white">28/10/2026</option>
                  <option value="30/10/2026" className="bg-black text-white">30/10/2026</option>
                  <option value="31/10/2026" className="bg-black text-white">31/10/2026</option>
                </select>

                <select 
                  required
                  value={formData.sector}
                  onChange={(e) => setFormData({...formData, sector: e.target.value})}
                  className="w-full bg-white/[0.01] border border-white/[0.05] rounded-full px-5 py-4 text-white outline-none focus:border-violet-500/50 focus:bg-white/[0.01] transition-all font-medium text-sm appearance-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
                >
                  <option value="" disabled>Qual Setor?</option>
                  <option value="Pista Premium" className="bg-black text-white">Pista Premium</option>
                  <option value="Pista Comum" className="bg-black text-white">Pista Comum</option>
                  <option value="Cadeira Inferior" className="bg-black text-white">Cadeira Inferior</option>
                  <option value="Cadeira Superior" className="bg-black text-white">Cadeira Superior</option>
                </select>

                <select 
                  required
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="w-full bg-white/[0.01] border border-white/[0.05] rounded-full px-5 py-4 text-white outline-none focus:border-violet-500/50 focus:bg-white/[0.01] transition-all font-medium text-sm appearance-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
                >
                  <option value="" disabled>Sua Faixa Etária</option>
                  <option value="18-20 anos" className="bg-black text-white">18-20 anos</option>
                  <option value="21-25 anos" className="bg-black text-white">21-25 anos</option>
                  <option value="26-30 anos" className="bg-black text-white">26-30 anos</option>
                  <option value="30+ anos" className="bg-black text-white">30+ anos</option>
                </select>

                <button 
                  type="submit"
                  disabled={isPublishing}
                  className="w-full mt-4 py-4 bg-violet-600/80 hover:bg-violet-500 border border-violet-400/30 text-slate-50 rounded-full font-bold transition-all flex items-center justify-center gap-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_8px_32px_rgba(139,92,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isPublishing ? <Loader2 size={18} className="animate-spin" /> : 'Publicar'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
