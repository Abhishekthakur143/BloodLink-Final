import { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import socket, { joinUserRoom, leaveUserRoom } from '../utils/socket';
import { X, Bell, CheckCircle2, Droplet, AlertCircle, Info, BellOff } from 'lucide-react';
 
// ══════════════════════════════════════════════════════════════════
// TOAST NOTIFICATION (corner popup)
// ══════════════════════════════════════════════════════════════════
function ToastNotification({ notif, onClose }) {
  const [progress, setProgress] = useState(100);
  const duration = notif.type === 'sos' ? 15000 : 6000;
 
  useEffect(() => {
    const step = 100 / (duration / 50);
    const iv = setInterval(() => {
      setProgress(p => {
        if (p <= 0) { clearInterval(iv); onClose(); return 0; }
        return p - step;
      });
    }, 50);
    return () => clearInterval(iv);
  }, [duration, onClose]);
 
  const CONFIG = {
    'new-request': {
      icon: <Droplet className="w-5 h-5 fill-current" />,
      bg: 'bg-red-600', bar: 'bg-red-300',
      title: '🩸 New Blood Request',
    },
    'fulfilled': {
      icon: <CheckCircle2 className="w-5 h-5" />,
      bg: 'bg-emerald-600', bar: 'bg-emerald-300',
      title: '✅ Request Fulfilled!',
    },
    'sos': {
      icon: <AlertCircle className="w-5 h-5" />,
      bg: 'bg-red-700', bar: 'bg-red-400',
      title: '🚨 EMERGENCY SOS',
    },
    'cancelled': {
      icon: <Info className="w-5 h-5" />,
      bg: 'bg-gray-600', bar: 'bg-gray-400',
      title: 'ℹ️ Request Cancelled',
    },
  };
 
  const cfg = CONFIG[notif.type] || CONFIG['new-request'];
 
  return (
    <div
      className={`w-80 rounded-2xl shadow-2xl overflow-hidden text-white`}
      style={{
        background: cfg.bg.replace('bg-', ''),
        animation: 'toastSlideIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
      }}
    >
      <div className="px-4 py-3 flex items-start gap-3">
        <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
          {cfg.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm">{cfg.title}</p>
          <p className="text-white/80 text-xs mt-0.5 leading-relaxed">{notif.message}</p>
          <p className="text-white/50 text-[10px] mt-1">
            {new Date(notif.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-white/50 hover:text-white transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {/* Progress bar */}
      <div className="h-1 bg-white/10">
        <div
          className={`h-full transition-all duration-50`}
          style={{ width: `${progress}%`, background: 'rgba(255,255,255,0.4)' }}
        />
      </div>
    </div>
  );
}
 
// ══════════════════════════════════════════════════════════════════
// NOTIFICATION BELL + PANEL (navbar mein use karo)
// ══════════════════════════════════════════════════════════════════
export function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const panelRef = useRef(null);
 
  const unread = notifications.filter(n => !n.read);
 
  // Outside click se close
  useEffect(() => {
    const onClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);
 
  // Socket events listen
  useEffect(() => {
    const addNotif = (data) => {
      setNotifications(prev => [data, ...prev].slice(0, 50));
      setUnreadCount(c => c + 1);
    };
 
    socket.on('new-blood-request', (data) => addNotif({ ...data, type: 'new-request', read: false, id: Date.now() }));
    socket.on('request-fulfilled', (data) => addNotif({ ...data, type: 'fulfilled', read: false, id: Date.now() }));
    socket.on('request-status-update', (data) => {
      if (data.status === 'cancelled') addNotif({ ...data, type: 'cancelled', read: false, id: Date.now(), message: `Blood request for ${data.bloodGroup} was cancelled.` });
    });
 
    return () => {
      socket.off('new-blood-request');
      socket.off('request-fulfilled');
      socket.off('request-status-update');
    };
  }, []);
 
  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };
 
  const clearAll = () => { setNotifications([]); setUnreadCount(0); };
 
  const TYPE_ICON = {
    'new-request': <Droplet className="w-4 h-4 text-red-500 fill-red-500" />,
    'fulfilled':   <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    'sos':         <AlertCircle className="w-4 h-4 text-red-600" />,
    'cancelled':   <Info className="w-4 h-4 text-gray-400" />,
  };
 
  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <button
        onClick={() => { setIsOpen(o => !o); if (!isOpen) markAllRead(); }}
        className="relative p-2 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center"
            style={{ animation: 'badgePop 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
 
      {/* Notification panel */}
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
          style={{ animation: 'dropdownIn 0.22s cubic-bezier(0.34,1.2,0.64,1)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-red-600" />
              <span className="font-bold text-gray-900 text-sm">Notifications</span>
              {notifications.length > 0 && (
                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full">
                  {notifications.length}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              {notifications.length > 0 && (
                <button onClick={clearAll} className="text-xs text-gray-400 hover:text-red-500 transition-colors font-medium">
                  Clear all
                </button>
              )}
            </div>
          </div>
 
          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-300">
                <BellOff className="w-10 h-10 mb-3" />
                <p className="text-sm font-medium text-gray-400">No notifications yet</p>
                <p className="text-xs text-gray-300 mt-1">Blood requests will appear here</p>
              </div>
            ) : (
              notifications.map((notif, i) => (
                <div
                  key={notif.id || i}
                  className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!notif.read ? 'bg-red-50/40' : ''}`}
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    {TYPE_ICON[notif.type] || TYPE_ICON['new-request']}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 leading-snug">{notif.message}</p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {new Date(notif.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {!notif.read && (
                    <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
 
// ══════════════════════════════════════════════════════════════════
// TOAST MANAGER (App.jsx mein use karo)
// ══════════════════════════════════════════════════════════════════
export function ToastManager() {
  const [toasts, setToasts] = useState([]);
  const { user } = useSelector((state) => state.auth);
 
  // User ke personal room mein join
  useEffect(() => {
    if (user?._id) joinUserRoom(user._id);
    return () => { if (user?._id) leaveUserRoom(user._id); };
  }, [user?._id]);
 
  const addToast = useCallback((data) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { ...data, id }]);
  }, []);
 
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);
 
  useEffect(() => {
    // 🔔 New blood request — sab ko dikhao
    socket.on('new-blood-request', (data) => {
      addToast({
        type: 'new-request',
        message: `${data.patientName} needs ${data.bloodGroup} at ${data.hospitalName}`,
        timestamp: data.timestamp || new Date().toISOString(),
      });
    });
 
    // 🔔 Request fulfill — sirf requester ko
    socket.on('request-fulfilled', (data) => {
      addToast({
        type: 'fulfilled',
        message: data.message || `Your ${data.bloodGroup} request has been fulfilled!`,
        timestamp: data.timestamp || new Date().toISOString(),
      });
    });
 
    // 🔔 SOS alert — sab ko
    socket.on('emergency-sos', (data) => {
      addToast({
        type: 'sos',
        message: data.message,
        timestamp: new Date().toISOString(),
      });
    });
 
    return () => {
      socket.off('new-blood-request');
      socket.off('request-fulfilled');
      socket.off('emergency-sos');
    };
  }, [addToast]);
 
  return (
    <>
      {/* Toast stack — bottom right */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 items-end">
        {toasts.map(t => (
          <ToastNotification
            key={t.id}
            notif={t}
            onClose={() => removeToast(t.id)}
          />
        ))}
      </div>
 
      <style>{`
        @keyframes toastSlideIn {
          from { transform: translateX(110%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes badgePop {
          from { transform: scale(0); }
          to   { transform: scale(1); }
        }
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </>
  );
}
 