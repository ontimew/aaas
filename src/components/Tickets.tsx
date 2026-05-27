import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Ticket as TicketIcon, ShieldCheck, ArrowRightLeft, Lock, CheckCircle2, TicketCheck, Search, Loader2, X, Star } from 'lucide-react';
import { collection, query, onSnapshot, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Tooltip } from './Tooltip';

const MOCK_TICKETS = [
  { id: "mock-1", type: 'Pista Premium', date: '28/10/2026', price: 'R$ 990,00', sellerName: 'Camila R.', verified: true, status: 'Disponível' },
  { id: "mock-2", type: 'Cadeira Inferior', date: '30/10/2026', price: 'R$ 650,00', sellerName: 'Julia M.', verified: true, status: 'Em negociação' },
  { id: "mock-3", type: 'Pista Comum', date: '31/10/2026', price: 'R$ 550,00', sellerName: 'Amanda.', verified: true, status: 'Disponível' },
];

interface TicketsProps {
  isAuthenticated: boolean;
  onRequireAuth: () => void;
}

export default function Tickets({ isAuthenticated, onRequireAuth }: TicketsProps) {
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [purchasedIds, setPurchasedIds] = useState<string[]>([]);
  const [tickets, setTickets] = useState<any[]>(MOCK_TICKETS);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [sellForm, setSellForm] = useState({ type: '', price: '', date: '' });
  const [isPublishing, setIsPublishing] = useState(false);
  
  const [reviewingTicket, setReviewingTicket] = useState<any>(null);
  const [reviewedTickets, setReviewedTickets] = useState<Record<string, number>>({});
  const [reviewScore, setReviewScore] = useState(0);

  useEffect(() => {
    const q = query(collection(db, 'tickets'));
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const fetchedTickets = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          verified: true // implicit trust for platform tickets
        })).filter((t: any) => t.status !== 'Rejeitado' && t.status !== 'Em Auditoria');
        setTickets(fetchedTickets);
      }
    }, (error) => {
      console.error("Error fetching tickets: ", error);
    });
    return () => unsub();
  }, []);

  const isPurchaseAllowed = (ticketDate: string) => {
    try {
      const [day, month, year] = ticketDate.split('/');
      const showDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const oneMonthBefore = new Date(showDate);
      oneMonthBefore.setMonth(showDate.getMonth() - 1);
      return new Date() >= oneMonthBefore;
    } catch(e) {
      return false; // Fallback if format is wrong
    }
  };

  const handlePurchase = async (id: string, ticketDate: string) => {
    if (!auth.currentUser) return;
    
    if (!isPurchaseAllowed(ticketDate)) {
      alert("A função de compras só estará disponível 1 mês antes da data do show.");
      return;
    }

    setPurchasingId(id);
    
    try {
      if (id.startsWith('mock-')) {
        // mock logic for default UI display
        setTimeout(() => {
          setPurchasedIds((prev) => [...prev, id]);
          setPurchasingId(null);
        }, 1500);
        return;
      }
      
      const ticketRef = doc(db, 'tickets', id);
      await updateDoc(ticketRef, {
        status: 'Em Negociação',
        buyerId: auth.currentUser.uid
      });
      setPurchasedIds((prev) => [...prev, id]);
    } catch(err) {
       console.error("Purchase failed", err);
    } finally {
      if (!id.startsWith('mock-')) {
        setPurchasingId(null);
      }
    }
  };

  const handleSellSubmit = async (e: any) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setIsPublishing(true);
    try {
      await addDoc(collection(db, 'tickets'), {
        type: sellForm.type,
        price: 'R$ ' + sellForm.price.replace(/[^\d.,]/g, ''),
        date: sellForm.date,
        sellerId: auth.currentUser.uid,
        sellerName: auth.currentUser.displayName || 'Anônimo',
        status: 'Em Auditoria',
        createdAt: serverTimestamp()
      });
      setIsSellModalOpen(false);
      setSellForm({ type: '', price: '', date: '' });
    } catch(err) {
      console.error(err);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleReviewSubmit = async (e: any) => {
    e.preventDefault();
    if (!reviewingTicket || reviewScore === 0) return;
    
    setReviewedTickets(prev => ({...prev, [reviewingTicket.id]: reviewScore}));
    
    try {
      if (!reviewingTicket.id.startsWith('mock-')) {
         const ticketRef = doc(db, 'tickets', reviewingTicket.id);
         await updateDoc(ticketRef, {
            reviewScore: reviewScore
         });
      }
    } catch(err) {
      console.error("Failed to submit review", err);
    }
    setReviewingTicket(null);
    setReviewScore(0);
  };

  return (
    <section className="py-24 px-4 max-w-7xl mx-auto relative z-10" id="ingressos">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 text-white/90">Intermediação Fã para Fã</h2>
        <p className="text-white/50 font-medium max-w-2xl mx-auto leading-relaxed md:text-lg">
          Hub seguro para repasse de ingressos com segurança e preço justo. <br className="hidden md:block" /> <span className="text-amber-400/80 bg-amber-400/10 px-2 py-0.5 rounded text-sm whitespace-nowrap mt-2 inline-block">A função de comprar estará disponível apenas 1 mês antes do show.</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
        <div className="bg-[#100A1A]/30 border border-white/[0.08] rounded-[1.5rem] p-6 backdrop-blur-[120px] ring-1 ring-white/[0.05] relative overflow-hidden group shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_4px_16px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.5)]">
          <div className="w-10 h-10 bg-white/[0.01] rounded-xl flex items-center justify-center mb-5 border border-white/[0.05]">
             <TicketIcon className="text-violet-300" size={18} />
          </div>
          <h3 className="font-bold text-white/90 text-lg mb-2">1. Anúncio</h3>
          <p className="text-white/50 text-xs leading-relaxed font-medium">O vendedor disponibiliza o ingresso na plataforma mantendo o preço original de compra.</p>
        </div>

        <div className="bg-[#100A1A]/30 border border-white/[0.08] rounded-[1.5rem] p-6 backdrop-blur-[120px] ring-1 ring-white/[0.05] relative overflow-hidden group shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_4px_16px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.5)]">
          <div className="w-10 h-10 bg-white/[0.01] rounded-xl flex items-center justify-center mb-5 border border-white/[0.05]">
             <ShieldCheck className="text-emerald-400" size={18} />
          </div>
          <h3 className="font-bold text-white/90 text-lg mb-2">2. Auditoria</h3>
          <p className="text-white/50 text-xs leading-relaxed font-medium">A plataforma retém o ingresso e verifica a autenticidade e validade do PDF/QR Code diretamente com o sistema.</p>
        </div>

        <div className="bg-[#100A1A]/30 border border-white/[0.08] rounded-[1.5rem] p-6 backdrop-blur-[120px] ring-1 ring-white/[0.05] relative overflow-hidden group shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_4px_16px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.5)]">
          <div className="w-10 h-10 bg-white/[0.01] rounded-xl flex items-center justify-center mb-5 border border-white/[0.05]">
             <ArrowRightLeft className="text-violet-300" size={18} />
          </div>
          <h3 className="font-bold text-white/90 text-lg mb-2">3. Repasse</h3>
          <p className="text-white/50 text-xs leading-relaxed font-medium">O comprador efetua o pagamento segurado. O ingresso é transferido e o dinheiro liberado ao vendedor.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between mb-8 pb-8 border-b border-white/[0.05]">
        <h3 className="text-2xl font-bold text-white/90 tracking-tight flex items-center gap-3 mb-6 md:mb-0">
            <TicketCheck className="text-violet-400" /> Ingressos
        </h3>
        
        <div className="flex gap-4 w-full md:w-auto">
            <Tooltip content="Anuncie seu ingresso extra com segurança">
              <button 
                onClick={() => isAuthenticated ? setIsSellModalOpen(true) : onRequireAuth()}
                className="flex-1 md:flex-none px-6 py-3.5 bg-white/[0.01] hover:bg-white/[0.04] border border-white/[0.05] text-white/80 font-semibold rounded-full transition-all text-sm"
              >
                Quero Vender
              </button>
            </Tooltip>
            <Tooltip content="Busque ingressos disponíveis e auditados">
              <button 
                onClick={() => isAuthenticated ? null : onRequireAuth()}
                className="flex-1 md:flex-none px-6 py-3.5 bg-violet-600/80 hover:bg-violet-600 border border-violet-400/30 text-slate-50 font-semibold rounded-full transition-all text-sm flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(139,92,246,0.2)]"
              >
                <Search size={16} /> Buscar Ingresso
              </button>
            </Tooltip>
        </div>
      </div>

      <div className="mb-10 bg-white/[0.03] border border-white/[0.08] rounded-[2rem] p-8 backdrop-blur-[120px] ring-1 ring-white/[0.05] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_4px_16px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.4)]">
        <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2 tracking-tight">
          <TicketCheck size={18} className="text-violet-400" /> Disponibilidade por Setor (Estimativa)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {[
            { label: 'Pista Premium', available: 12, total: 100, color: 'bg-fuchsia-500' },
            { label: 'Pista Comum', available: 45, total: 150, color: 'bg-violet-500' },
            { label: 'Cadeira Inferior', available: 8, total: 80, color: 'bg-blue-500' },
            { label: 'Cadeira Superior', available: 60, total: 120, color: 'bg-emerald-500' },
          ].map((sector) => {
            const percentage = Math.round((sector.available / sector.total) * 100);
            return (
              <div key={sector.label} className="w-full">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-semibold text-white/80">{sector.label}</span>
                  <span className="text-xs font-bold text-white/50">{sector.available} restantes</span>
                </div>
                <div className="w-full h-3 bg-white/[0.01] rounded-full overflow-hidden border border-white/[0.05] relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${percentage}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full ${sector.color} shadow-[0_0_10px_rgba(139,92,246,0.5)]`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tickets.map((ticket, i) => (
          <motion.div
            key={ticket.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.1] rounded-[2rem] p-6 transition-all duration-500 relative group backdrop-blur-[120px] ring-1 ring-white/[0.05] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_4px_16px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.4)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
              <div>
                <div className="flex items-center gap-3 mb-3">
                    <span className="bg-violet-500/10 border border-violet-500/20 text-violet-300 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg">
                      Show: {ticket.date}
                    </span>
                    {ticket.status === 'Disponível' ? (
                      <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                        <CheckCircle2 size={12} /> Disponível
                      </span>
                    ) : (
                      <span className="bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg">
                        Em Negociação
                      </span>
                    )}
                    {typeof ticket.reviewScore === 'number' && (
                        <span className="flex items-center gap-1 text-xs font-bold text-amber-400">
                           <Star size={12} fill="currentColor" /> {ticket.reviewScore.toFixed(1)}
                        </span>
                    )}
                </div>
                <h4 className="text-xl font-bold text-white/90 mb-1">{ticket.type}</h4>
                <p className="text-white/40 text-sm font-medium flex items-center gap-2">
                    Vendedor: {ticket.sellerName} <ShieldCheck size={14} className="text-emerald-400" />
                </p>
              </div>
              
              <div className="flex flex-col items-start md:items-end w-full md:w-auto mt-4 md:mt-0">
                <span className="text-2xl font-bold text-white mb-4 md:mb-1 tracking-tight">{ticket.price}</span>
                {purchasedIds.includes(ticket.id) ? (
                   <div className="flex items-center gap-3 w-full md:w-auto">
                     <div className="px-6 py-3 rounded-full font-semibold text-sm transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center gap-2 flex-1 md:flex-none">
                       <CheckCircle2 size={16} /> Comprado
                     </div>
                     {!reviewedTickets[ticket.id] && !ticket.reviewScore && (
                        <Tooltip content="Avaliar este vendedor">
                          <button 
                            onClick={() => setReviewingTicket(ticket)}
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-all hover:scale-105"
                          >
                           <Star size={18} />
                          </button>
                        </Tooltip>
                     )}
                   </div>
                ) : (
                  <button 
                    onClick={() => isAuthenticated ? handlePurchase(ticket.id, ticket.date) : onRequireAuth()}
                    disabled={(ticket.status !== 'Disponível' && !purchasedIds.includes(ticket.id)) || purchasingId === ticket.id || (ticket.status === 'Disponível' && !isPurchaseAllowed(ticket.date))}
                    className={`w-full md:w-auto px-6 py-3 rounded-full font-semibold text-sm transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] ${
                      ticket.status === 'Disponível' 
                      ? isPurchaseAllowed(ticket.date) ? 'bg-violet-600/80 hover:bg-violet-500 border border-violet-400/30 text-slate-50 hover:shadow-[0_4px_16px_rgba(139,92,246,0.3)]' : 'bg-white/[0.01] border border-white/[0.05] text-white/50 cursor-not-allowed'
                      : 'bg-white/[0.01] border border-white/[0.05] text-white/30 cursor-not-allowed'
                    }`}
                  >
                    {purchasingId === ticket.id ? (
                        <span className="flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> Processando...</span>
                    ) : ticket.status === 'Disponível' ? (!isPurchaseAllowed(ticket.date) ? 'Bloqueado (Aguarde)' : 'Comprar Seguro') : 'Indisponível'}
                  </button>
                )}
              </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isSellModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-3xl z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30, rotateX: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30, rotateX: -10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white/[0.01] border border-white/[0.05] w-full max-w-md rounded-[2rem] p-8 md:p-10 relative overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_80px_rgba(139,92,246,0.1)] ring-1 ring-white/[0.05]"
              style={{ transformPerspective: 1000 }}
            >
              {/* Liquid Glass Highlights */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-transparent opacity-50 pointer-events-none" />
              <div className="absolute -top-32 -left-32 w-64 h-64 bg-violet-500/20 rounded-full blur-[80px] pointer-events-none" />

              <button 
                onClick={() => setIsSellModalOpen(false)}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors bg-white/[0.01] hover:bg-white/[0.1] p-2 rounded-full z-20 backdrop-blur-md border border-white/[0.05]"
              >
                <X size={20} />
              </button>
              
              <div className="flex flex-col text-center items-center mb-8 relative z-10">
                <div className="w-16 h-16 rounded-[1.5rem] bg-white/[0.01] border border-white/[0.1] flex items-center justify-center mb-4 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/30 to-fuchsia-500/30 opacity-100" />
                  <TicketIcon size={24} className="relative z-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Anunciar Ingresso</h3>
                <p className="text-white/50 text-sm">O BARMY360 faz apenas a intermediação segura.</p>
              </div>

              <form onSubmit={handleSellSubmit} className="flex flex-col gap-4 relative z-10">
                <select 
                  required
                  value={sellForm.type}
                  onChange={(e) => setSellForm({...sellForm, type: e.target.value})}
                  className="w-full bg-white/[0.01] border border-white/[0.05] rounded-full px-5 py-4 text-white outline-none focus:border-violet-500/50 focus:bg-white/[0.01] transition-all font-medium text-sm appearance-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
                >
                  <option value="" disabled>Setor do Ingresso</option>
                  <option value="Pista Premium" className="bg-black text-white">Pista Premium</option>
                  <option value="Pista Comum" className="bg-black text-white">Pista Comum</option>
                  <option value="Cadeira Inferior" className="bg-black text-white">Cadeira Inferior</option>
                  <option value="Cadeira Superior" className="bg-black text-white">Cadeira Superior</option>
                </select>

                <select 
                  required
                  value={sellForm.date}
                  onChange={(e) => setSellForm({...sellForm, date: e.target.value})}
                  className="w-full bg-white/[0.01] border border-white/[0.05] rounded-full px-5 py-4 text-white outline-none focus:border-violet-500/50 focus:bg-white/[0.01] transition-all font-medium text-sm appearance-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
                >
                  <option value="" disabled>Data do Show</option>
                  <option value="28/10/2026" className="bg-black text-white">28/10/2026</option>
                  <option value="30/10/2026" className="bg-black text-white">30/10/2026</option>
                  <option value="31/10/2026" className="bg-black text-white">31/10/2026</option>
                </select>

                <input 
                  required
                  type="text"
                  placeholder="Preço (Ex: R$ 550,00)"
                  value={sellForm.price}
                  onChange={(e) => setSellForm({...sellForm, price: e.target.value})}
                  className="w-full bg-white/[0.01] border border-white/[0.05] rounded-full px-5 py-4 text-white placeholder:text-white/30 outline-none focus:border-violet-500/50 focus:bg-white/[0.01] transition-all font-medium text-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
                />

                <button 
                  type="submit"
                  disabled={isPublishing}
                  className="w-full mt-4 py-4 bg-violet-600/80 hover:bg-violet-500 border border-violet-400/30 text-slate-50 rounded-full font-bold transition-all flex items-center justify-center gap-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_8px_32px_rgba(139,92,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isPublishing ? <Loader2 size={18} className="animate-spin" /> : 'Publicar Anúncio'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {reviewingTicket && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-3xl z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30, rotateX: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30, rotateX: -10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white/[0.01] border border-white/[0.05] w-full max-w-md rounded-[2rem] p-8 md:p-10 relative overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_80px_rgba(139,92,246,0.1)] ring-1 ring-white/[0.05]"
              style={{ transformPerspective: 1000 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-transparent opacity-50 pointer-events-none" />
              
              <button 
                onClick={() => setReviewingTicket(null)}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors bg-white/[0.01] hover:bg-white/[0.1] p-2 rounded-full z-20 backdrop-blur-md border border-white/[0.05]"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col text-center items-center mb-8 relative z-10">
                <div className="w-16 h-16 rounded-[1.5rem] bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4 text-amber-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
                  <Star size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Avaliar Vendedor</h3>
                <p className="text-white/50 text-sm">Como foi sua experiência com {reviewingTicket.sellerName}?</p>
              </div>
              
              <form onSubmit={handleReviewSubmit} className="flex flex-col gap-6 relative z-10">
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewScore(star)}
                      className={`p-2 transition-all ${reviewScore >= star ? 'text-amber-400 scale-110 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 'text-white/20 hover:text-white/40'}`}
                    >
                      <Star size={40} fill={reviewScore >= star ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
                
                <button 
                  type="submit"
                  disabled={reviewScore === 0}
                  className="w-full mt-2 py-4 bg-amber-500/80 hover:bg-amber-500 border border-amber-400/30 text-white rounded-full font-bold transition-all flex items-center justify-center gap-3 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_8px_32px_rgba(245,158,11,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirmar Avaliação
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
