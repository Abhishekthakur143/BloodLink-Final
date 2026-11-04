import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './redux/slices/authSlice';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RequestBloodPage from './pages/RequestBloodPage';
import SearchRequestsPage from './pages/SearchRequestsPage';
import DonorDashboardPage from './pages/DonorDashboardPage';
import CreateCampPage from './pages/CreateCampPage';
import CampsPage from './pages/CampsPage';
import HospitalDashboardPage from './pages/HospitalDashboardPage';
import { useState, useEffect, useRef, useCallback } from 'react';
import socket from './utils/socket';
import AIChatPage from './pages/AIChatPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/ProfilePage';
import SOSPage from './pages/SOSPage';
import DashboardPage from './pages/DashboardPage';
import MapPage from './pages/MapPage';
import Footer from './components/Footer';
import { Navigate } from 'react-router-dom';
import { ToastManager, NotificationBell } from './components/NotificationSystem';
// ✅ NEW: Dark mode hook
import useDarkMode from './hooks/useDarkMode';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
 
import {
  Droplet, LogOut, User, Search, HandHelping, LayoutDashboard,
  Tent, PlusCircle, Building2, MapPin, Bot, ShieldAlert,
  Menu, X, AlertCircle, Bell, Heart, Activity,
  ChevronDown, Stethoscope, Users, Calendar,
  Sun, Moon  // ✅ NEW: Sun & Moon icons for toggle
} from 'lucide-react';
 
/* ═══════════════════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════════════════ */
const GlobalStyles = () => (
  <style>{`
    @keyframes slideInRight {
      from { transform: translateX(110%); opacity: 0; }
      to   { transform: translateX(0);    opacity: 1; }
    }
    @keyframes slideInDown {
      from { transform: translateY(-100%); opacity: 0; }
      to   { transform: translateY(0);     opacity: 1; }
    }
    @keyframes slideOutUp {
      from { transform: translateY(0);     opacity: 1; }
      to   { transform: translateY(-100%); opacity: 0; }
    }
    @keyframes fadeSlideUp {
      from { transform: translateY(16px); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
    @keyframes fadeSlideLeft {
      from { transform: translateX(24px); opacity: 0; }
      to   { transform: translateX(0);    opacity: 1; }
    }
    @keyframes fadeSlideRight {
      from { transform: translateX(-24px); opacity: 0; }
      to   { transform: translateX(0);     opacity: 1; }
    }
    @keyframes heartbeat {
      0%,100% { transform: scale(1);    }
      14%      { transform: scale(1.18); }
      28%      { transform: scale(1);    }
      42%      { transform: scale(1.12); }
      70%      { transform: scale(1);    }
    }
    @keyframes sosFlash {
      0%,100% { background:#dc2626; box-shadow:0 0 0 rgba(220,38,38,0); }
      50%      { background:#991b1b; box-shadow:0 0 32px rgba(220,38,38,0.6); }
    }
    @keyframes ripple {
      to { transform: scale(4); opacity: 0; }
    }
    @keyframes staggerIn {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes progressPulse {
      0%,100% { opacity: 1; }
      50%      { opacity: 0.7; }
    }
    @keyframes dropdownIn {
      from { opacity: 0; transform: translateY(-8px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0)   scale(1);    }
    }
    @keyframes darkToggle {
      0%   { transform: rotate(0deg) scale(1); }
      50%  { transform: rotate(180deg) scale(0.8); }
      100% { transform: rotate(360deg) scale(1); }
    }
    .ripple-btn { position: relative; overflow: hidden; }
    .ripple-btn .ripple-circle {
      position: absolute;
      border-radius: 50%;
      background: rgba(255,255,255,0.35);
      transform: scale(0);
      animation: ripple 0.55s linear;
      pointer-events: none;
    }
    .glass-nav {
      background: rgba(255,255,255,0.82) !important;
      backdrop-filter: blur(18px) saturate(180%);
      -webkit-backdrop-filter: blur(18px) saturate(180%);
      border-bottom: 1px solid rgba(255,255,255,0.4);
    }
    html.dark .glass-nav {
      background: rgba(15,23,42,0.88) !important;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    html.dark nav {
      background: #0F172A !important;
      border-bottom-color: #1E293B !important;
    }
    html.dark .mega-menu {
      background: #1E293B !important;
      border-color: #334155 !important;
    }
    html.dark .mega-menu .border-b { border-color: #334155 !important; }
    html.dark .mega-menu a { color: #CBD5E1 !important; }
    html.dark .mega-menu a:hover { background: #334155 !important; color: #F87171 !important; }
    html.dark .mega-menu .bg-gray-50 { background: #0F172A !important; }
    html.dark .mega-menu a:hover .bg-gray-50 { background: #334155 !important; }
    .mega-menu {
      animation: dropdownIn 0.22s cubic-bezier(0.34,1.2,0.64,1);
    }
    #scroll-progress {
      position: fixed;
      top: 0; left: 0;
      height: 3px;
      background: linear-gradient(90deg, #dc2626, #f87171, #dc2626);
      background-size: 200% 100%;
      z-index: 9999;
      transition: width 0.1s linear;
      animation: progressPulse 2s ease-in-out infinite;
    }
    .page-enter-right { animation: fadeSlideLeft 0.3s cubic-bezier(0.4,0,0.2,1); }
    .page-enter-left  { animation: fadeSlideRight 0.3s cubic-bezier(0.4,0,0.2,1); }
    .stagger-children > * { opacity: 0; animation: staggerIn 0.3s ease forwards; }
    .stagger-children > *:nth-child(1)  { animation-delay: 0.03s; }
    .stagger-children > *:nth-child(2)  { animation-delay: 0.06s; }
    .stagger-children > *:nth-child(3)  { animation-delay: 0.09s; }
    .stagger-children > *:nth-child(4)  { animation-delay: 0.12s; }
    .stagger-children > *:nth-child(5)  { animation-delay: 0.15s; }
    .stagger-children > *:nth-child(6)  { animation-delay: 0.18s; }
    .stagger-children > *:nth-child(7)  { animation-delay: 0.21s; }
    .stagger-children > *:nth-child(8)  { animation-delay: 0.24s; }
    .stagger-children > *:nth-child(9)  { animation-delay: 0.27s; }
    .stagger-children > *:nth-child(10) { animation-delay: 0.30s; }
    .stagger-children > *:nth-child(11) { animation-delay: 0.33s; }
    .stagger-children > *:nth-child(12) { animation-delay: 0.36s; }
  `}</style>
);
 
/* ═══════════════════════════════════════════════════════════════════
   SCROLL PROGRESS BAR
═══════════════════════════════════════════════════════════════════ */
function ScrollProgressBar() {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const max = el.scrollHeight - el.clientHeight;
      setWidth(max > 0 ? (scrolled / max) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return <div id="scroll-progress" style={{ width: `${width}%` }} />;
}
 
/* ═══════════════════════════════════════════════════════════════════
   ADMIN ROUTE GUARD
═══════════════════════════════════════════════════════════════════ */
function AdminRoute({ children }) {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}
 
/* ═══════════════════════════════════════════════════════════════════
   RIPPLE EFFECT HOOK
═══════════════════════════════════════════════════════════════════ */
function useRipple() {
  const createRipple = useCallback((e) => {
    const btn = e.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(btn.clientWidth, btn.clientHeight);
    const radius = diameter / 2;
    const rect = btn.getBoundingClientRect();
    circle.className = 'ripple-circle';
    circle.style.cssText = `
      width:${diameter}px; height:${diameter}px;
      left:${e.clientX - rect.left - radius}px;
      top:${e.clientY - rect.top - radius}px;
    `;
    btn.querySelector('.ripple-circle')?.remove();
    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
  }, []);
  return createRipple;
}
 
/* ═══════════════════════════════════════════════════════════════════
   PAGE TRANSITION WRAPPER
═══════════════════════════════════════════════════════════════════ */
const ROUTE_ORDER = [
  '/', '/search-requests', '/request-blood', '/donor-dashboard',
  '/camps', '/create-camp', '/hospital-dashboard', '/maps',
  '/ai-chat', '/profile', '/admin', '/sos', '/login', '/register',
];
 
function PageWrapper({ children }) {
  const location = useLocation();
  const [animClass, setAnimClass] = useState('page-enter-right');
  const prevPath = useRef(location.pathname);
  useEffect(() => {
    const prevIdx = ROUTE_ORDER.indexOf(prevPath.current);
    const currIdx = ROUTE_ORDER.indexOf(location.pathname);
    setAnimClass(currIdx >= prevIdx ? 'page-enter-right' : 'page-enter-left');
    prevPath.current = location.pathname;
  }, [location.pathname]);
  return (
    <div key={location.pathname} className={animClass}>
      {children}
    </div>
  );
}
 
/* ═══════════════════════════════════════════════════════════════════
   ACTIVE NAV LINK
═══════════════════════════════════════════════════════════════════ */
function NavLink({ to, icon, label, onClick, delay = 0 }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  const ripple = useRipple();
  return (
    <Link
      to={to}
      onClick={(e) => { ripple(e); onClick?.(); }}
      className={`ripple-btn flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative group select-none
        ${isActive ? 'bg-red-600 text-white shadow-sm' : 'text-gray-600 hover:bg-red-50 hover:text-red-600'}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {isActive && (
        <span className="absolute inset-0 rounded-lg bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
      )}
      <span className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-white' : ''}`}>
        {icon}
      </span>
      {label}
    </Link>
  );
}
 
/* ═══════════════════════════════════════════════════════════════════
   DARK MODE TOGGLE BUTTON
═══════════════════════════════════════════════════════════════════ */
function DarkModeToggle({ isDark, toggle }) {
  return (
    <button
      onClick={toggle}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      style={{
        width: 38, height: 38,
        borderRadius: 10,
        border: isDark ? '1.5px solid #334155' : '1.5px solid #E5E7EB',
        background: isDark ? '#1E293B' : '#F9FAFB',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = isDark ? '#334155' : '#F3F4F6';
        e.currentTarget.style.transform = 'scale(1.08)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = isDark ? '#1E293B' : '#F9FAFB';
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {isDark
        ? <Sun className="w-4 h-4" style={{ color: '#FCD34D', animation: 'darkToggle 0.4s ease' }} />
        : <Moon className="w-4 h-4" style={{ color: '#6B7280', animation: 'darkToggle 0.4s ease' }} />
      }
    </button>
  );
}
 
/* ═══════════════════════════════════════════════════════════════════
   MEGA MENU DROPDOWN
═══════════════════════════════════════════════════════════════════ */
const MENU_GROUPS = [
  {
    title: 'Donors',
    icon: <Heart className="w-4 h-4 text-red-500" />,
    items: [
      { to: '/search-requests', icon: <Search className="w-4 h-4" />,          label: 'Find Blood' },
      { to: '/request-blood',   icon: <HandHelping className="w-4 h-4" />,     label: 'Request Blood' },
      { to: '/donor-dashboard', icon: <LayoutDashboard className="w-4 h-4" />, label: 'My Dashboard' },
    ],
  },
  {
    title: 'Camps & Hospitals',
    icon: <Activity className="w-4 h-4 text-blue-500" />,
    items: [
      { to: '/camps',              icon: <Tent className="w-4 h-4" />,       label: 'View Camps' },
      { to: '/create-camp',        icon: <PlusCircle className="w-4 h-4" />, label: 'Organize Camp' },
      { to: '/hospital-dashboard', icon: <Building2 className="w-4 h-4" />,  label: 'Inventory' },
    ],
  },
  {
    title: 'Tools',
    icon: <Stethoscope className="w-4 h-4 text-emerald-500" />,
    items: [
      { to: '/maps',    icon: <MapPin className="w-4 h-4" />,       label: 'Maps' },
      { to: '/ai-chat', icon: <Bot className="w-4 h-4" />,          label: 'AI Chat' },
      { to: '/profile', icon: <User className="w-4 h-4" />,         label: 'Profile' },
      { to: '/admin',   icon: <ShieldAlert className="w-4 h-4" />,  label: 'Admin' },
    ],
  },
];
 
function MegaMenu({ onClose }) {
  const ripple = useRipple();
  return (
    <div
      className="mega-menu absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 grid grid-cols-3 gap-6 w-[680px] z-50"
      style={{ backdropFilter: 'blur(20px)' }}
    >
      {MENU_GROUPS.map(group => (
        <div key={group.title}>
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
            {group.icon}
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{group.title}</span>
          </div>
          <div className="space-y-0.5">
            {group.items.map(item => (
              <Link
                key={item.to}
                to={item.to}
                onClick={(e) => { ripple(e); onClose(); }}
                className="ripple-btn flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-150 group"
              >
                <span className="w-7 h-7 bg-gray-50 group-hover:bg-red-100 rounded-lg flex items-center justify-center transition-colors">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
 
/* ═══════════════════════════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════════════════════════ */
function Navbar({ isDark, toggleDark }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);
  const ripple = useRipple();
 
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
 
  useEffect(() => {
    const onClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setIsMenuOpen(false);
        setIsMegaOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);
 
  const handleLogout = (e) => {
    ripple(e);
    dispatch(logout());
    navigate('/login');
    setIsMenuOpen(false);
  };
 
  const allMobileItems = MENU_GROUPS.flatMap(g => g.items);
 
  return (
    <nav
      ref={navRef}
      className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'glass-nav' : 'bg-white border-b border-gray-100'}`}
      style={{ boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.08)' : 'none' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
 
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group select-none">
            <div className="relative">
              <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-red-200 transition-shadow duration-300">
                <Droplet className="w-5 h-5 text-white fill-white" style={{ animation: 'heartbeat 2.5s ease-in-out infinite' }} />
              </div>
              <span className="absolute inset-0 rounded-xl border-2 border-red-400 opacity-0 group-hover:opacity-40 scale-100 group-hover:scale-125 transition-all duration-500" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">
              <span className="text-red-600">Blood</span>
              <span className="text-gray-900">Link</span>
            </span>
          </Link>
 
          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {isAuthenticated ? (
              <>
                {/* Mega menu trigger */}
                <div className="relative">
                  <button
                    onClick={() => setIsMegaOpen(o => !o)}
                    className={`ripple-btn flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${isMegaOpen ? 'bg-red-600 text-white' : 'text-gray-600 hover:bg-red-50 hover:text-red-600'}`}
                    onMouseDown={ripple}
                  >
                    <Activity className="w-4 h-4" />
                    Menu
                    <ChevronDown
                      className="w-3.5 h-3.5 transition-transform duration-200"
                      style={{ transform: isMegaOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    />
                  </button>
                  {isMegaOpen && <MegaMenu onClose={() => setIsMegaOpen(false)} />}
                </div>
 
                {/* SOS */}
                <Link
                  to="/sos"
                  className="ripple-btn relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-extrabold text-white ml-1"
                  style={{ background: '#dc2626', animation: 'sosFlash 2s ease-in-out infinite' }}
                  onMouseDown={ripple}
                >
                  <AlertCircle className="w-4 h-4" style={{ animation: 'heartbeat 1.5s ease-in-out infinite' }} />
                  SOS
                </Link>
 
                {/* NotificationBell */}
                <NotificationBell />
 
                {/* ✅ Dark Mode Toggle — desktop */}
                <DarkModeToggle isDark={isDark} toggle={toggleDark} />
 
                {/* User pill */}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100 ml-1">
                  <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white text-xs font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{user?.name}</span>
                </div>
 
                <button
                  onClick={handleLogout}
                  className="ripple-btn flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all ml-1"
                  onMouseDown={ripple}
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                {/* ✅ Dark Mode Toggle — even when logged out */}
                <DarkModeToggle isDark={isDark} toggle={toggleDark} />
 
                <Link to="/login" className="ripple-btn px-5 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors" onMouseDown={ripple}>
                  Login
                </Link>
                <Link
                  to="/register"
                  className="ripple-btn px-5 py-2 text-sm font-bold text-white rounded-lg shadow-md transition-all duration-200"
                  style={{ background: '#dc2626' }}
                  onMouseDown={ripple}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(220,38,38,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'; }}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
 
          {/* Mobile hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            {/* ✅ Dark Mode Toggle — mobile */}
            <DarkModeToggle isDark={isDark} toggle={toggleDark} />
 
            <button
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(o => !o)}
              aria-label="Toggle menu"
            >
              <span style={{ display: 'block', transition: 'transform 0.25s ease', transform: isMenuOpen ? 'rotate(90deg)' : 'rotate(0)' }}>
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </span>
            </button>
          </div>
        </div>
      </div>
 
      {/* Mobile dropdown */}
      <div
        className="lg:hidden overflow-hidden"
        style={{
          maxHeight: isMenuOpen ? '700px' : '0',
          opacity: isMenuOpen ? 1 : 0,
          transition: 'max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <div className="px-4 pt-3 pb-5">
          {isAuthenticated ? (
            <div className="stagger-children space-y-1">
              <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl border border-red-100" style={{ background: 'linear-gradient(135deg, #fff1f2, #fef2f2)' }}>
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block" /> Active donor
                  </p>
                </div>
              </div>
 
              {allMobileItems.map(({ to, icon, label }) => (
                <NavLink key={to} to={to} icon={icon} label={label} onClick={() => setIsMenuOpen(false)} />
              ))}
 
              <Link
                to="/sos"
                onClick={() => setIsMenuOpen(false)}
                className="ripple-btn flex items-center justify-center gap-2 w-full px-3 py-3 rounded-xl text-sm font-extrabold text-white mt-2 shadow-lg"
                style={{ background: '#dc2626', animation: 'sosFlash 2s ease-in-out infinite' }}
                onMouseDown={ripple}
              >
                <AlertCircle className="w-4 h-4" style={{ animation: 'heartbeat 1.5s infinite' }} /> EMERGENCY SOS
              </Link>
 
              <button
                onClick={handleLogout}
                className="ripple-btn flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors mt-1"
                onMouseDown={ripple}
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          ) : (
            <div className="stagger-children flex flex-col gap-2 pt-2">
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="ripple-btn w-full text-center px-5 py-2.5 text-sm font-medium text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors" onMouseDown={ripple}>Login</Link>
              <Link to="/register" onClick={() => setIsMenuOpen(false)} className="ripple-btn w-full text-center px-5 py-2.5 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors shadow-md" onMouseDown={ripple}>Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
 
/* ═══════════════════════════════════════════════════════════════════
   APP ROOT
═══════════════════════════════════════════════════════════════════ */
export default function App() {
  const [sosAlert, setSosAlert] = useState(null);
  // ✅ NEW: Dark mode state — App level pe rakha taaki Navbar ko pass kar sakein
  const { isDark, toggle: toggleDark } = useDarkMode();
 
  useEffect(() => {
    socket.on('emergency-sos', (data) => {
      const mapInfo = data.mapLink ? ` 📍 ${data.mapLink}` : '';
      setSosAlert(data.message + mapInfo);
      setTimeout(() => setSosAlert(null), 15000);
    });
    return () => { socket.off('emergency-sos'); };
  }, []);
 
  return (
    <Router>
      <GlobalStyles />
      <ScrollProgressBar />
 
      <div className="min-h-screen bg-gray-50 flex flex-col">
 
        {/* ToastManager */}
        <ToastManager />
 
        {/* SOS full-width banner */}
        {sosAlert && (
          <div
            className="fixed top-0 left-0 w-full text-white py-3 px-4 z-50 flex items-center justify-center gap-3"
            style={{ animation: 'slideInDown 0.4s cubic-bezier(0.34,1.56,0.64,1), sosFlash 1.5s ease-in-out infinite', boxShadow: '0 4px 24px rgba(220,38,38,0.6)' }}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ animation: 'heartbeat 1s infinite' }} />
            <span className="text-sm font-bold">{sosAlert}</span>
            <button onClick={() => setSosAlert(null)} className="ml-auto text-red-200 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
 
        {/* ✅ isDark & toggleDark pass kiya Navbar ko */}
        <Navbar isDark={isDark} toggleDark={toggleDark} />
 
        <div className="flex-grow">
          <Routes>
            <Route path="/login"              element={<PageWrapper><LoginPage /></PageWrapper>} />
            <Route path="/register"           element={<PageWrapper><RegisterPage /></PageWrapper>} />
            <Route path="/request-blood"      element={<PageWrapper><RequestBloodPage /></PageWrapper>} />
            <Route path="/search-requests"    element={<PageWrapper><SearchRequestsPage /></PageWrapper>} />
            <Route path="/donor-dashboard"    element={<PageWrapper><DonorDashboardPage /></PageWrapper>} />
            <Route path="/create-camp"        element={<PageWrapper><CreateCampPage /></PageWrapper>} />
            <Route path="/camps"              element={<PageWrapper><CampsPage /></PageWrapper>} />
            <Route path="/hospital-dashboard" element={<PageWrapper><HospitalDashboardPage /></PageWrapper>} />
            <Route path="/ai-chat"            element={<PageWrapper><AIChatPage /></PageWrapper>} />
            <Route path="/admin"              element={<AdminRoute><PageWrapper><AdminDashboardPage /></PageWrapper></AdminRoute>} />
            <Route path="/profile"            element={<PageWrapper><ProfilePage /></PageWrapper>} />
            <Route path="/sos"                element={<PageWrapper><SOSPage /></PageWrapper>} />
            <Route path="/maps"               element={<PageWrapper><MapPage /></PageWrapper>} />
            <Route path="/forgot-password" element={<PageWrapper><ForgotPasswordPage /></PageWrapper>} />
            <Route path="/reset-password/:token" element={<PageWrapper><ResetPasswordPage /></PageWrapper>} />
            <Route path="/"                   element={<PageWrapper><DashboardPage /></PageWrapper>} />
            <Route path="*"                   element={<PageWrapper><NotFoundPage /></PageWrapper>} />
          </Routes>
        </div>
 
        <Footer />
      </div>
    </Router>
  );
}