import { useState, createContext, useContext, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Bell, CheckCircle, AlertCircle, Info, Ticket, Users, Vote } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'ticket' | 'companhia' | 'project';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => setNotifications([]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead, removeNotification, clearAll }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

const getIcon = (type: Notification['type']) => {
  const icons = {
    success: <CheckCircle size={16} className="text-emerald-400" />,
    error: <AlertCircle size={16} className="text-red-400" />,
    info: <Info size={16} className="text-cyan-400" />,
    ticket: <Ticket size={16} className="text-purple-400" />,
    companhia: <Users size={16} className="text-pink-400" />,
    project: <Vote size={16} className="text-indigo-400" />
  };
  return icons[type] || <Bell size={16} className="text-white/60" />;
};

const formatTimeAgo = (date: Date) => {
  const diffInSeconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffInSeconds < 60) return 'Agora';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}min`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  return `${Math.floor(diffInSeconds / 86400)}d`;
};

function NotificationPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, clearAll } = useNotifications();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[140]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0a0a0f] border-l border-white/[0.04] z-[150] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/[0.04]">
              <div className="flex items-center gap-3">
                <div className="p-2 glass-card rounded-xl">
                  <Bell size={18} className="text-purple-400" />
                </div>
                <div>
                  <h2 className="font-display font-semibold text-white">Notificacoes</h2>
                  {unreadCount > 0 && <p className="text-xs text-white/40">{unreadCount} nao lidas</p>}
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/[0.04] transition-all">
                <X size={18} />
              </button>
            </div>

            {/* Actions */}
            {notifications.length > 0 && (
              <div className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.04]">
                <button onClick={markAllAsRead} className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                  Marcar como lidas
                </button>
                <span className="text-white/10">|</span>
                <button onClick={clearAll} className="text-xs text-white/40 hover:text-white transition-colors">
                  Limpar
                </button>
              </div>
            )}

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-6">
                  <div className="p-4 glass-card rounded-2xl mb-4">
                    <Bell size={28} className="text-white/20" />
                  </div>
                  <p className="text-white/50 font-medium text-sm">Nenhuma notificacao</p>
                  <p className="text-white/30 text-xs mt-1">Atualizacoes aparecerao aqui</p>
                </div>
              ) : (
                <div className="divide-y divide-white/[0.04]">
                  {notifications.map((n) => (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 hover:bg-white/[0.02] transition-colors cursor-pointer ${!n.read ? 'bg-purple-500/5' : ''}`}
                      onClick={() => markAsRead(n.id)}
                    >
                      <div className="flex gap-3">
                        <div className="p-2 glass-card rounded-lg h-fit">{getIcon(n.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className={`text-sm font-medium ${!n.read ? 'text-white' : 'text-white/70'}`}>{n.title}</h4>
                            <button
                              onClick={(e) => { e.stopPropagation(); removeNotification(n.id); }}
                              className="text-white/20 hover:text-white/50 transition-colors p-1"
                            >
                              <X size={12} />
                            </button>
                          </div>
                          <p className="text-white/40 text-xs mt-1 line-clamp-2">{n.message}</p>
                          <p className="text-white/20 text-[10px] mt-2">{formatTimeAgo(n.timestamp)}</p>
                        </div>
                        {!n.read && <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2" />}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount } = useNotifications();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2.5 glass-card rounded-full text-white/50 hover:text-white transition-all"
        aria-label={`Notificacoes${unreadCount > 0 ? `, ${unreadCount} nao lidas` : ''}`}
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-purple-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>
      <NotificationPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
