import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Save, ShieldAlert, Loader2, Ticket, Users, Activity, Camera } from 'lucide-react';
import { updateProfile } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { auth, db, storage } from '../firebase';

// Mock dataview for charts
const mockChartData = [
  { name: 'Jan', Activity: 5 },
  { name: 'Feb', Activity: 12 },
  { name: 'Mar', Activity: 8 },
  { name: 'Apr', Activity: 18 },
  { name: 'May', Activity: 24 },
  { name: 'Jun', Activity: 15 },
];

interface ProfileSettingsProps {
  isAuthenticated: boolean;
  onRequireAuth: () => void;
}

export default function ProfileSettings({ isAuthenticated, onRequireAuth }: ProfileSettingsProps) {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Stats
  const [stats, setStats] = useState({
    ticketsSold: 0,
    ticketsBought: 0,
    connections: 0,
    isLoading: true
  });

  useEffect(() => {
    if (auth.currentUser) {
      setDisplayName(auth.currentUser.displayName || '');
      setEmail(auth.currentUser.email || '');
      setPhotoURL(auth.currentUser.photoURL || null);
      fetchStats();
    }
  }, [isAuthenticated]);

  const fetchStats = async () => {
    if (!auth.currentUser) return;
    try {
      const qSeller = query(collection(db, 'tickets'), where('sellerId', '==', auth.currentUser.uid));
      const sellerSnap = await getDocs(qSeller);
      
      const qBuyer = query(collection(db, 'tickets'), where('buyerId', '==', auth.currentUser.uid));
      const buyerSnap = await getDocs(qBuyer);

      setStats({
        ticketsSold: sellerSnap.size,
        ticketsBought: buyerSnap.size,
        connections: 2, // Mock for now as connections aren't fully integrated with DB yet
        isLoading: false
      });
    } catch (err) {
      console.error("Error fetching stats", err);
      setStats(s => ({ ...s, isLoading: false }));
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="py-32 px-4 max-w-7xl mx-auto flex justify-center items-center h-[50vh]">
        <div className="text-center bg-white/[0.01] border border-white/[0.05] p-10 rounded-3xl">
          <ShieldAlert size={48} className="text-amber-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Login Necessário</h2>
          <p className="text-white/50 mb-6">Entre na sua conta para acessar e editar seu perfil.</p>
          <button onClick={onRequireAuth} className="px-6 py-3 bg-violet-600/80 rounded-xl font-bold text-slate-50">Fazer Login</button>
        </div>
      </section>
    );
  }

  const handleUpdateProfile = async (e: any) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    setIsUpdating(true);
    setMessage(null);

    try {
      await updateProfile(auth.currentUser, { displayName, photoURL });
      setMessage({ text: 'Perfil atualizado com sucesso!', type: 'success' });
    } catch (err: any) {
      console.error(err);
      setMessage({ text: 'Erro ao atualizar perfil.', type: 'error' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePhotoChange = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file || !auth.currentUser) return;
    
    setIsUploadingPhoto(true);
    try {
      const storageRef = ref(storage, `profile_photos/${auth.currentUser.uid}`);
      await uploadBytes(storageRef, file);
      const newPhotoURL = await getDownloadURL(storageRef);
      setPhotoURL(newPhotoURL);
      await updateProfile(auth.currentUser, { photoURL: newPhotoURL });
    } catch (err) {
      console.error("Erro ao subir foto", err);
      setMessage({ text: 'Erro ao fazer upload da foto.', type: 'error' });
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  return (
    <section className="py-24 px-4 max-w-7xl mx-auto relative z-10">
      <div className="text-left mb-10">
        <h2 className="text-3xl md:text-5xl font-black mb-4 flex items-center gap-4">
          <User className="text-violet-500" size={40} /> Dashboard do Fã
        </h2>
        <p className="text-white/50 font-medium">Acompanhe suas estatísticas, ingressos e informações pessoais.</p>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/[0.01] border border-white/[0.05] rounded-3xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.36),inset_0_1px_0_0_rgba(255,255,255,0.05)] flex items-center gap-5 relative overflow-hidden group">
          <div className="absolute bottom-0 left-0 right-0 h-16 opacity-30 pointer-events-none">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockChartData}>
                <Line type="monotone" dataKey="Activity" stroke="#d946ef" strokeWidth={2} dot={false} isAnimationActive={true} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 relative z-10">
            <Ticket size={24} />
          </div>
          <div className="relative z-10">
            <p className="text-white/50 text-sm font-semibold mb-1">Ingressos Comprados</p>
            <h3 className="text-3xl font-black">{stats.isLoading ? <Loader2 size={18} className="animate-spin" /> : stats.ticketsBought}</h3>
          </div>
        </div>

        <div className="bg-white/[0.01] border border-white/[0.05] rounded-3xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.36),inset_0_1px_0_0_rgba(255,255,255,0.05)] flex items-center gap-5 relative overflow-hidden group">
          <div className="absolute bottom-0 left-0 right-0 h-16 opacity-30 pointer-events-none">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockChartData}>
                <Line type="monotone" dataKey="Activity" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={true} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 relative z-10">
            <Activity size={24} />
          </div>
          <div className="relative z-10">
            <p className="text-white/50 text-sm font-semibold mb-1">Ingressos Anunciados</p>
            <h3 className="text-3xl font-black">{stats.isLoading ? <Loader2 size={18} className="animate-spin" /> : stats.ticketsSold}</h3>
          </div>
        </div>

        <div className="bg-white/[0.01] border border-white/[0.05] rounded-3xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.36),inset_0_1px_0_0_rgba(255,255,255,0.05)] flex items-center gap-5 relative overflow-hidden group">
          <div className="absolute bottom-0 left-0 right-0 h-16 opacity-30 pointer-events-none">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockChartData}>
                <Line type="monotone" dataKey="Activity" stroke="#8b5cf6" strokeWidth={2} dot={false} isAnimationActive={true} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 relative z-10">
            <Users size={24} />
          </div>
          <div className="relative z-10">
            <p className="text-white/50 text-sm font-semibold mb-1">Conexões Ativas</p>
            <h3 className="text-3xl font-black">{stats.isLoading ? <Loader2 size={18} className="animate-spin" /> : stats.connections}</h3>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 border border-white/[0.05] bg-white/[0.01] rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.36),inset_0_1px_0_0_rgba(255,255,255,0.05)] text-center flex flex-col items-center">
          <div className="relative mb-6 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-28 h-28 rounded-full bg-white/[0.01] border border-white/[0.1] flex items-center justify-center text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl relative overflow-hidden transition-transform group-hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/30 to-fuchsia-500/30 opacity-100" />
              {photoURL ? (
                <img src={photoURL} alt="Perfil" className="w-full h-full object-cover relative z-10" />
              ) : (
                <span className="text-4xl font-black text-white relative z-10 drop-shadow-md">
                  {displayName ? displayName.charAt(0).toUpperCase() : (email ? email.charAt(0).toUpperCase() : 'U')}
                </span>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex flex-col justify-center items-center">
                 {isUploadingPhoto ? <Loader2 className="animate-spin" size={24} /> : <Camera size={24} />}
              </div>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handlePhotoChange} 
            />
          </div>
          
          <h3 className="text-xl font-bold mb-1">{displayName || 'Sem Nome'}</h3>
          <p className="text-white/50 text-sm">{email}</p>
          <div className="mt-6 inline-block px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold uppercase tracking-widest">
            Membro Verificado
          </div>
        </div>

        <div className="md:col-span-2 border border-white/[0.05] bg-white/[0.01] rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.36),inset_0_1px_0_0_rgba(255,255,255,0.05)]">
          <h3 className="text-2xl font-bold mb-6">Informações Pessoais</h3>

          <form onSubmit={handleUpdateProfile} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-white/50 ml-1">Nome de Exibição</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                <input 
                  type="text" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-white/[0.01] border border-white/[0.05] rounded-full px-5 py-4 text-white placeholder:text-white/30 outline-none focus:border-violet-500/50 focus:bg-white/[0.01] transition-all font-medium text-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] pl-12"
                  placeholder="Como gostaria de ser chamado?"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-white/50 ml-1">E-mail (Apenas Leitura)</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                <input 
                  type="email" 
                  readOnly
                  value={email}
                  className="w-full bg-white/[0.01] text-white/40 border border-white/[0.05] rounded-full px-5 py-4 outline-none cursor-not-allowed font-medium text-sm pl-12"
                />
              </div>
              <p className="text-xs text-white/30 ml-2 mt-1">O e-mail usado para login não pode ser alterado no momento.</p>
            </div>

            {message && (
              <div className={`p-4 rounded-xl border font-medium text-sm text-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                {message.text}
              </div>
            )}

            <button 
              type="submit"
              disabled={isUpdating}
              className="mt-4 py-4 w-full md:w-auto md:px-8 self-end bg-violet-600/80 hover:bg-violet-500 border border-violet-400/30 text-slate-50 rounded-full font-bold transition-all flex items-center justify-center gap-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_8px_32px_rgba(139,92,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Salvar Alterações</>}
            </button>
          </form>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="mt-8 border border-white/[0.05] bg-white/[0.01] rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.36),inset_0_1px_0_0_rgba(255,255,255,0.05)]">
        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
           <Activity className="text-violet-500" /> Atividade Recente
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { id: 1, type: 'ticket_purchased', text: 'Você comprou um ingresso', date: 'Há 2 horas', icon: Ticket, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
            { id: 2, type: 'connection_accepted', text: 'Sua conexão para companhia foi aceita', date: 'Há 1 dia', icon: Users, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
            { id: 3, type: 'ticket_sold', text: 'Seu ingresso foi repassado', date: 'Há 3 dias', icon: Activity, color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/20' },
            { id: 4, type: 'profile_update', text: 'Você atualizou seu perfil', date: 'Há 1 semana', icon: User, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
            { id: 5, type: 'account_created', text: 'Conta BARMY360 criada', date: 'Há 2 semanas', icon: ShieldAlert, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' }
          ].map(activity => (
            <motion.div 
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 bg-white/[0.01] p-4 rounded-2xl border border-white/[0.03] hover:bg-white/[0.04] transition-colors"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${activity.bg} ${activity.border} border`}>
                <activity.icon className={activity.color} size={20} />
              </div>
              <div>
                <p className="text-white/90 font-semibold text-sm">{activity.text}</p>
                <p className="text-white/40 text-xs font-medium mt-1">{activity.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
