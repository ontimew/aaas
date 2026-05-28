import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle, Ticket, Users, Calendar, CreditCard, Shield, MessageCircle, Search } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    category: 'Evento',
    question: 'Quando e onde sera o evento BARMY360?',
    answer: 'O evento BARMY360 acontecera em outubro de 2026 em Sao Paulo. As datas confirmadas sao 28, 30 e 31 de outubro no Estadio Morumbi.'
  },
  {
    category: 'Evento',
    question: 'O evento e oficial da BIGHIT/HYBE?',
    answer: 'Nao, o BARMY360 e um projeto independente feito por fas para fas. Nao temos vinculo oficial com a BIGHIT MUSIC, HYBE ou a marca BTS.'
  },
  {
    category: 'Ingressos',
    question: 'Como funciona a intermediacao de ingressos?',
    answer: 'Oferecemos um sistema seguro de intermediacao fa-para-fa. Todos os ingressos passam por auditoria antes de serem disponibilizados, garantindo autenticidade e preco justo.'
  },
  {
    category: 'Ingressos',
    question: 'Quando poderei comprar ingressos?',
    answer: 'A funcao de compra sera liberada 1 mes antes de cada show. Ate la, voce pode explorar os ingressos disponiveis e criar alertas.'
  },
  {
    category: 'Companhia',
    question: 'O que e a secao Companhia?',
    answer: 'E um sistema de matchmaking para ARMYs que buscam companhia para o evento. Crie seu perfil, encontre pessoas com interesses similares e va ao show acompanhado.'
  },
  {
    category: 'Companhia',
    question: 'A funcao de Companhia e segura?',
    answer: 'Todos os usuarios precisam estar verificados. Recomendamos encontros em locais publicos e temos sistema de denuncia para usuarios suspeitos.'
  },
  {
    category: 'Projetos',
    question: 'O que sao os Projetos e Votacoes?',
    answer: 'Iniciativas da comunidade para criar experiencias especiais no evento, como oceanos de cores, banners coordenados e acoes especiais durante o show.'
  },
  {
    category: 'Conta',
    question: 'Como crio uma conta?',
    answer: 'Clique em "Entrar" no menu e crie sua conta com email. Apos verificacao, voce tera acesso a todas as funcionalidades da plataforma.'
  }
];

const categories = ['Todos', 'Evento', 'Ingressos', 'Companhia', 'Projetos', 'Conta'];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFAQ = faqData.filter(item => {
    const matchesCategory = activeCategory === 'Todos' || item.category === activeCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="pt-32 pb-24 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-xs font-semibold text-white/60 mb-6">
            <HelpCircle size={14} className="text-purple-400" />
            CENTRAL DE AJUDA
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-gradient mb-4">
            Perguntas Frequentes
          </h1>
          <p className="text-white/40 max-w-lg mx-auto">
            Encontre respostas rapidas sobre o BARMY360, ingressos e projetos.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Buscar pergunta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 glass-card rounded-2xl text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
            />
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'text-white/50 hover:text-white hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-3"
        >
          {filteredFAQ.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/40">Nenhuma pergunta encontrada.</p>
            </div>
          ) : (
            filteredFAQ.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="glass-card rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left group"
                >
                  <div className="flex-1 pr-4">
                    <span className="text-[10px] text-purple-400/80 font-semibold uppercase tracking-widest">{item.category}</span>
                    <h3 className="text-white font-medium mt-1 group-hover:text-white/80 transition-colors">{item.question}</h3>
                  </div>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-white/40 flex-shrink-0"
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-5">
                        <p className="text-white/50 leading-relaxed text-sm">{item.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="glass-card rounded-3xl p-10 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="relative z-10">
              <h3 className="font-display text-2xl font-bold text-white mb-3">Ainda tem duvidas?</h3>
              <p className="text-white/40 mb-6 max-w-md mx-auto text-sm">
                Nossa equipe esta pronta para ajudar voce.
              </p>
              <a 
                href="mailto:suporte@barmy360.com"
                className="inline-flex items-center gap-2 px-6 py-3 btn-glow rounded-full text-sm font-semibold text-white"
              >
                <MessageCircle size={16} />
                Falar com Suporte
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
