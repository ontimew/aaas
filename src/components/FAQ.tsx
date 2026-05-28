import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle, Ticket, Users, Calendar, CreditCard, Shield, MessageCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
  icon: React.ReactNode;
}

const faqData: FAQItem[] = [
  {
    category: 'Evento',
    icon: <Calendar size={18} />,
    question: 'Quando e onde sera o evento BARMY360?',
    answer: 'O evento BARMY360 acontecera em outubro de 2026 no Brasil. A data e local exatos serao anunciados em breve. Fique atento as nossas redes sociais e ao contador regressivo na pagina inicial.'
  },
  {
    category: 'Evento',
    icon: <Calendar size={18} />,
    question: 'O evento e oficial da BIGHIT/HYBE?',
    answer: 'Nao, o BARMY360 e um evento independente feito por fas para fas. Nao temos nenhum vinculo oficial com a BIGHIT MUSIC, HYBE ou a marca BTS. Somos uma comunidade apaixonada que deseja criar experiencias memoraveis para ARMYs brasileiros.'
  },
  {
    category: 'Ingressos',
    icon: <Ticket size={18} />,
    question: 'Como posso comprar ingressos?',
    answer: 'Os ingressos estao disponiveis na secao "Ingressos" do site. Oferecemos diferentes categorias: Pista, Cadeira Superior e Cadeira Inferior, cada uma com precos e beneficios diferentes. O pagamento pode ser feito via PIX ou cartao de credito.'
  },
  {
    category: 'Ingressos',
    icon: <CreditCard size={18} />,
    question: 'Quais formas de pagamento sao aceitas?',
    answer: 'Aceitamos pagamento via PIX (com desconto) e cartao de credito. O PIX oferece a melhor taxa e o valor e confirmado instantaneamente. Para cartao de credito, aceitamos as principais bandeiras.'
  },
  {
    category: 'Ingressos',
    icon: <Ticket size={18} />,
    question: 'Posso transferir meu ingresso para outra pessoa?',
    answer: 'Sim, e possivel transferir seu ingresso para outra pessoa ate 7 dias antes do evento. Para isso, entre em contato conosco pelo email ou atraves da secao "Meu Perfil" no site.'
  },
  {
    category: 'Companhia',
    icon: <Users size={18} />,
    question: 'O que e a secao "Companhia"?',
    answer: 'A secao Companhia e um sistema de matchmaking para ARMYs que estao procurando companhia para o evento. Voce pode criar um perfil com suas preferencias, cidade e bias favorito, e encontrar outros fas para ir junto ao evento.'
  },
  {
    category: 'Companhia',
    icon: <Shield size={18} />,
    question: 'A funcao de Companhia e segura?',
    answer: 'Priorizamos a seguranca de todos. Todos os usuarios precisam estar logados e verificados para usar a funcao. Recomendamos sempre marcar encontros em locais publicos e informar amigos ou familiares. Tambem temos um sistema de denuncia para usuarios suspeitos.'
  },
  {
    category: 'Projetos',
    icon: <HelpCircle size={18} />,
    question: 'O que sao os Projetos e Votacoes?',
    answer: 'Sao iniciativas da comunidade ARMY para criar experiencias especiais no evento. Podem incluir projetos de lightstick, banners, oceanos de cores e outras acoes coordenadas. Voce pode votar nos projetos que mais gosta e contribuir para sua realizacao.'
  },
  {
    category: 'Projetos',
    icon: <Users size={18} />,
    question: 'Como posso propor um novo projeto?',
    answer: 'Para propor um novo projeto, voce precisa estar logado e ter uma conta verificada. Acesse a secao "Projetos e Votacoes" e clique em "Propor Projeto". Sua proposta sera avaliada pela nossa equipe antes de ser disponibilizada para votacao.'
  },
  {
    category: 'Conta',
    icon: <Shield size={18} />,
    question: 'Como crio uma conta no site?',
    answer: 'Clique no botao "Login" no canto superior direito e selecione "Criar Conta". Voce pode se cadastrar usando seu email. Apos o cadastro, voce tera acesso a todas as funcionalidades do site.'
  },
  {
    category: 'Conta',
    icon: <MessageCircle size={18} />,
    question: 'Esqueci minha senha, o que faco?',
    answer: 'Na tela de login, clique em "Esqueci minha senha". Voce recebera um email com instrucoes para redefinir sua senha. Certifique-se de verificar a caixa de spam caso nao encontre o email.'
  },
  {
    category: 'Suporte',
    icon: <MessageCircle size={18} />,
    question: 'Como entro em contato com o suporte?',
    answer: 'Voce pode entrar em contato conosco atraves do email suporte@barmy360.com ou pelas nossas redes sociais oficiais. Respondemos em ate 48 horas uteis.'
  }
];

const categories = ['Todos', 'Evento', 'Ingressos', 'Companhia', 'Projetos', 'Conta', 'Suporte'];

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
    <section className="py-24 px-6" aria-labelledby="faq-heading">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full mb-6">
            <HelpCircle size={16} className="text-violet-400" />
            <span className="text-violet-300 text-sm font-medium">Central de Ajuda</span>
          </div>
          <h1 id="faq-heading" className="text-4xl md:text-5xl font-bold text-white mb-4 text-balance">
            Perguntas Frequentes
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto text-pretty">
            Encontre respostas para as duvidas mais comuns sobre o BARMY360, ingressos, projetos e muito mais.
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
            <input
              type="text"
              placeholder="Buscar pergunta..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
              aria-label="Buscar perguntas frequentes"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
          role="tablist"
          aria-label="Filtrar por categoria"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              role="tab"
              aria-selected={activeCategory === category}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 ${
                activeCategory === category
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                  : 'bg-white/[0.03] text-white/60 border border-white/[0.08] hover:text-white hover:bg-white/[0.06]'
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
          className="space-y-4"
          role="tabpanel"
        >
          {filteredFAQ.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/60">Nenhuma pergunta encontrada para sua busca.</p>
            </div>
          ) : (
            filteredFAQ.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/[0.1] transition-all"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-500"
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-violet-500/10 rounded-lg text-violet-400">
                      {item.icon}
                    </div>
                    <div>
                      <span className="text-xs text-violet-400 font-medium uppercase tracking-wider">{item.category}</span>
                      <h3 className="text-white font-medium mt-1">{item.question}</h3>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-white/60 flex-shrink-0 ml-4"
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-6 pb-5 pt-0">
                        <div className="pl-14 border-l-2 border-violet-500/20 ml-2">
                          <p className="text-white/70 leading-relaxed pl-4">{item.answer}</p>
                        </div>
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
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20 rounded-3xl p-8 md:p-12">
            <h3 className="text-2xl font-bold text-white mb-3">Ainda tem duvidas?</h3>
            <p className="text-white/60 mb-6 max-w-md mx-auto">
              Nossa equipe esta pronta para ajudar. Entre em contato e responderemos o mais rapido possivel.
            </p>
            <a 
              href="mailto:suporte@barmy360.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-full font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <MessageCircle size={18} />
              Falar com Suporte
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
