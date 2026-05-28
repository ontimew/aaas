import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
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
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

const getIcon = (type: Notification['type']) => {
  switch (type) {
    case 'success':
      return <CheckCircle size={18} className="text-green-400" />;
    case 'error':
      return <AlertCircle size={18} className="text-red-400" />;
    case 'info':
      return <Info size={18} className="text-blue-400" />;
    case 'ticket':
      return <Ticket size={18} className="text-violet-400" />;
    case 'companhia':
      return <Users size={18} className="text-pink-400" />;
    case 'project':
      return <Vote size={18} className="text-indigo-400" />;
    default:
      return <Bell size={18} className="text-white/60" />;
  }
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Agora mesmo';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}min atras`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h atras`;
  return `${Math.floor(diffInSeconds / 86400)}d atras`;
};

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, clearAll } = useNotifications();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[140]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0a0515]/95 backdrop-blur-xl border-l border-white/[0.08] z-[150] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-500/10 rounded-lg">
                  <Bell size={20} className="text-violet-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Notificacoes</h2>
                  {unreadCount > 0 && (
                    <p className="text-sm text-white/60">{unreadCount} nao lidas</p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 bg-white/[0.03] hover:bg-white/[0.06] rounded-lg text-white/60 hover:text-white transition-colors"
                aria-label="Fechar notificacoes"
              >
                <X size={20} />
              </button>
            </div>

            {/* Actions */}
            {notifications.length > 0 && (
              <div className="flex items-center gap-2 p-4 border-b border-white/[0.05]">
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
                >
                  Marcar todas como lidas
                </button>
                <span className="text-white/20">|</span>
                <button
                  onClick={clearAll}
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Limpar todas
                </button>
              </div>
            )}

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <div className="p-4 bg-white/[0.03] rounded-full mb-4">
                    <Bell size={32} className="text-white/30" />
                  </div>
                  <p className="text-white/60 font-medium">Nenhuma notificacao</p>
                  <p className="text-white/40 text-sm mt-1">Voce sera notificado sobre atualizacoes importantes</p>
                </div>
              ) : (
                <div className="divide-y divide-white/[0.05]">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      className={`p-4 hover:bg-white/[0.02] transition-colors cursor-pointer ${
                        !notification.read ? 'bg-violet-500/5' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 p-2 bg-white/[0.03] rounded-lg h-fit">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className={`font-medium text-sm ${!notification.read ? 'text-white' : 'text-white/80'}`}>
                              {notification.title}
                            </h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(notification.id);
                              }}
                              className="text-white/30 hover:text-white/60 transition-colors p-1"
                              aria-label="Remover notificacao"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <p className="text-white/60 text-sm mt-1 line-clamp-2">{notification.message}</p>
                          <p className="text-white/40 text-xs mt-2">{formatTimeAgo(notification.timestamp)}</p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-violet-500 rounded-full flex-shrink-0 mt-2" />
                        )}
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
        className="relative p-2 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] rounded-full text-white/60 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
        aria-label={`Notificacoes${unreadCount > 0 ? `, ${unreadCount} nao lidas` : ''}`}
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-violet-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>
      <NotificationPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
