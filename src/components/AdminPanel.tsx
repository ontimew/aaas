import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { motion } from 'motion/react';
import { ShieldAlert, CheckCircle2, XCircle, Trash2, ShieldCheck } from 'lucide-react';

interface AdminPanelProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  onRequireAuth: () => void;
}

export default function AdminPanel({ isAuthenticated, isAdmin, onRequireAuth }: AdminPanelProps) {
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    if (!isAdmin) return;
    const q = query(collection(db, 'tickets'));
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const fetchedTickets = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTickets(fetchedTickets);
      } else {
        setTickets([]);
      }
    });
    return () => unsub();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <section className="py-32 px-4 max-w-7xl mx-auto flex justify-center items-center h-[50vh]">
        <div className="text-center bg-white/[0.01] border border-white/[0.05] p-10 rounded-3xl">
          <ShieldAlert size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Acesso Negado</h2>
          <p className="text-white/50 mb-6">Apenas administradores podem acessar a auditoria.</p>
          <button onClick={onRequireAuth} className="px-6 py-3 bg-violet-600/80 rounded-xl font-bold text-slate-50">Fazer Login</button>
        </div>
      </section>
    );
  }

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const ref = doc(db, 'tickets', id);
      await updateDoc(ref, { status });
    } catch(err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'tickets', id));
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <section className="py-24 px-4 max-w-7xl mx-auto relative z-10">
      <div className="text-left mb-10">
        <h2 className="text-3xl md:text-5xl font-black mb-4 flex items-center gap-4">
          <ShieldAlert className="text-red-500" size={40} /> Admin: Auditoria
        </h2>
        <p className="text-white/50 font-medium">Gerencie o status dos ingressos na plataforma e faça a auditoria.</p>
      </div>

      <div className="bg-white/[0.01] border border-white/[0.05] rounded-3xl overflow-hidden backdrop-blur-3xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.01] text-white/50 uppercase tracking-widest text-[10px] font-bold border-b border-white/[0.05]">
                <th className="p-5">Vendedor</th>
                <th className="p-5">Ingresso</th>
                <th className="p-5">Preço</th>
                <th className="p-5">Data Show</th>
                <th className="p-5">Status Atual</th>
                <th className="p-5 text-right">Ações de Auditoria</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-white/50 font-medium">Nenhum ingresso encontrado.</td>
                </tr>
              ) : (
                tickets.map(ticket => (
                  <tr key={ticket.id} className="hover:bg-white/[0.04] transition-colors">
                    <td className="p-5 font-semibold text-white/90">{ticket.sellerName || 'Desconhecido'}</td>
                    <td className="p-5 text-white/80">{ticket.type}</td>
                    <td className="p-5 font-bold">{ticket.price}</td>
                    <td className="p-5 text-white/60">{ticket.date}</td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                        ticket.status === 'Disponível' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        ticket.status === 'Rejeitado' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                        ticket.status === 'Em Auditoria' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="p-5 flex justify-end gap-2">
                      <button 
                        onClick={() => handleUpdateStatus(ticket.id, 'Disponível')}
                        className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg transition-colors"
                        title="Aprovar e Liberar"
                      >
                        <ShieldCheck size={18} />
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(ticket.id, 'Em Auditoria')}
                        className="p-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg transition-colors"
                        title="Marcar em Auditoria"
                      >
                        <ShieldAlert size={18} />
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(ticket.id, 'Rejeitado')}
                        className="p-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-lg transition-colors"
                        title="Rejeitar"
                      >
                        <XCircle size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(ticket.id)}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg transition-colors"
                        title="Excluir Definitivamente"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
