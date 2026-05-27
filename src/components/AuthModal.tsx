import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, X, Loader2, Mail, Lock, User, ArrowRight, KeyRound } from 'lucide-react';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'login' | 'register' | 'forgot_password'>('login');
  const [resetMessage, setResetMessage] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setError('');
      setResetMessage('');
      setEmail('');
      setPassword('');
      setName('');
      setMode('login');
    }
  }, [isOpen]);

  const handleEmailAuth = async (e: any) => {
    e.preventDefault();
    setError('');
    setResetMessage('');
    setIsSubmitting(true);
    
    try {
      if (mode === 'forgot_password') {
        if (!email) {
          setError('Digite seu e-mail para recuperar a senha.');
          setIsSubmitting(false);
          return;
        }
        await sendPasswordResetEmail(auth, email);
        setResetMessage('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
        setIsSubmitting(false);
        return;
      }

      if (mode === 'register') {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCred.user, { displayName: name || 'Anônimo' });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onSuccess();
    } catch (err: any) {
      console.error("Auth failed", err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está em uso.');
      } else if (err.code === 'auth/weak-password') {
        setError('A senha deve ter pelo menos 6 caracteres.');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('E-mail ou senha incorretos.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Autenticação por e-mail não habilitada neste projeto. Use o login do Google.');
      } else {
        setError('Ocorreu um erro. Tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      await signInWithPopup(auth, googleProvider);
      onSuccess();
    } catch (err: any) {
      console.error("Login failed", err);
      if (err.code === 'auth/popup-closed-by-user') {
        // User closed the popup, don't show an error
        setError('');
      } else {
        setError('Falha ao autenticar com Google. Tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-3xl z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30, rotateX: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30, rotateX: -10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-[320px] bg-white/[0.03] backdrop-blur-[120px] border border-white/[0.08] rounded-[1.5rem] p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_4px_16px_rgba(255,255,255,0.05),0_8px_40px_rgba(0,0,0,0.6)] ring-1 ring-white/[0.05] relative overflow-hidden"
              style={{ transformPerspective: 1000 }}
            >
              {/* Liquid Glass Highlights */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-transparent opacity-50 pointer-events-none" />
              <div className="absolute -top-32 -left-32 w-64 h-64 bg-violet-500/20 rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-[80px] pointer-events-none" />

              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/[0.03] hover:bg-white/[0.1] border border-white/[0.08] text-white/50 hover:text-white transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_4px_16px_rgba(255,255,255,0.05),0_4px_16px_rgba(0,0,0,0.4)] ring-1 ring-white/[0.05] z-20 backdrop-blur-[120px]"
              >
                <X size={16} />
              </button>

              <div className="relative z-10 flex flex-col items-center">
                
                <AnimatePresence mode="wait">
                    <motion.div 
                      key={mode}
                      initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}
                      transition={{ duration: 0.2 }}
                      className="w-full flex flex-col items-center text-center mt-2"
                    >
                      <div className="w-12 h-12 rounded-[1rem] bg-white/[0.03] border border-white/[0.15] flex items-center justify-center mb-5 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_4px_16px_rgba(255,255,255,0.05),0_8px_32px_rgba(0,0,0,0.5)] ring-1 ring-white/[0.05] backdrop-blur-[120px] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/30 to-fuchsia-500/30 opacity-100" />
                        <ShieldCheck size={24} className="text-white relative z-10" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {mode === 'login' ? 'Bem-vindo de volta' : mode === 'register' ? 'Criar nova conta' : 'Recuperar Senha'}
                      </h3>
                      <p className="text-white/50 text-sm mb-6 leading-relaxed">
                        {mode === 'login' || mode === 'register' 
                          ? 'Acesse ingressos auditados e vote nos projetos da fan base.'
                          : 'Enviaremos um link de recuperação para o seu e-mail.'}
                      </p>

                      <form onSubmit={handleEmailAuth} className="w-full flex flex-col gap-3">
                        {mode === 'register' && (
                          <div className="relative">
                            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                            <input 
                              type="text" 
                              required
                              placeholder="Seu Nome" 
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="w-full bg-white/[0.01] border border-white/[0.05] rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-violet-500/50 focus:bg-[#050505]/50 transition-all font-medium text-xs md:text-sm shadow-[inset_0_2px_10px_rgba(0,0,0,0.6)]"
                            />
                          </div>
                        )}
                        <div className="relative">
                          <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                          <input 
                            type="email" 
                            required
                            placeholder="E-mail" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/[0.01] border border-white/[0.05] rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-violet-500/50 focus:bg-[#050505]/50 transition-all font-medium text-xs md:text-sm shadow-[inset_0_2px_10px_rgba(0,0,0,0.6)]"
                          />
                        </div>
                        {mode !== 'forgot_password' && (
                          <div className="relative">
                            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                            <input 
                              type="password" 
                              required
                              placeholder="Senha" 
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full bg-white/[0.01] border border-white/[0.05] rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-violet-500/50 focus:bg-[#050505]/50 transition-all font-medium text-xs md:text-sm shadow-[inset_0_2px_10px_rgba(0,0,0,0.6)]"
                            />
                          </div>
                        )}

                        {error && <p className="text-red-400 text-sm my-2 font-medium">{error}</p>}
                        {resetMessage && <p className="text-emerald-400 text-sm my-2 font-medium">{resetMessage}</p>}

                        {mode === 'login' && (
                          <button 
                            type="button"
                            onClick={() => setMode('forgot_password')}
                            className="text-white/50 hover:text-white text-xs font-medium transition-colors text-right mb-1"
                          >
                            Esqueci minha senha
                          </button>
                        )}

                        <button 
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full mt-2 py-3 bg-violet-600/80 hover:bg-violet-500 border border-violet-400/30 text-slate-50 rounded-xl font-bold transition-all text-sm flex items-center justify-center gap-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_8px_32px_rgba(139,92,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : (mode === 'login' ? 'Entrar' : mode === 'register' ? 'Registrar' : 'Enviar Link de Recuperação')}
                        </button>
                      </form>

                      {mode !== 'forgot_password' && (
                        <>
                          <div className="w-full flex items-center gap-4 my-6">
                            <div className="h-px bg-white/[0.01] flex-1"></div>
                            <span className="text-white/30 text-sm font-medium">Ou continuar com</span>
                            <div className="h-px bg-white/[0.01] flex-1"></div>
                          </div>

                          <button 
                            type="button"
                            onClick={handleGoogleLogin} 
                            disabled={isSubmitting}
                            className="w-full py-2.5 bg-white/[0.01] hover:bg-white/[0.04] border border-white/[0.05] text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-[inset_0_2px_10px_rgba(0,0,0,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google
                          </button>
                        </>
                      )}

                      <button 
                        onClick={() => {
                          setError('');
                          setResetMessage('');
                          setMode(mode === 'login' ? 'register' : 'login')
                        }}
                        className="mt-4 text-white/50 hover:text-white text-xs font-medium transition-colors"
                      >
                        {mode === 'login' ? 'Não tem uma conta? Crie agora' : 'Já tem uma conta? Faça login'}
                      </button>

                    </motion.div>
                </AnimatePresence>

              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
