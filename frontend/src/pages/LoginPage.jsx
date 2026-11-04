import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login, clearError } from '../redux/slices/authSlice';
 
// Medical Icons
import { Droplet, Mail, Lock, AlertCircle, ShieldCheck, LogIn, Heart, Activity, Eye, EyeOff, HeartPulse, Stethoscope } from 'lucide-react';
 
export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, error, loading } = useSelector((state) => state.auth);
 
  useEffect(() => {
    if (isAuthenticated) navigate('/');
    return () => dispatch(clearError());
  }, [isAuthenticated, navigate, dispatch]);
 
  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };
 
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes floatSlow { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-16px) scale(1.04); } }
        @keyframes floatSlower { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-10px) rotate(6deg); } }
        @keyframes heartbeat { 0%, 100% { transform: scale(1); } 10% { transform: scale(1.15); } 20% { transform: scale(0.98); } 30% { transform: scale(1.1); } 40% { transform: scale(1); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
        .fade-up { animation: fadeUp 0.6s ease-out both; }
        .float-blob { animation: floatSlow 10s ease-in-out infinite; }
        .float-icon { animation: floatSlower 6s ease-in-out infinite; }
        .heartbeat { animation: heartbeat 2.4s ease-in-out infinite; }
        .shake-once { animation: shake 0.4s ease-in-out; }
      `}</style>
 
      {/* LEFT PANE - Branding & Emotion */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-800 text-white p-12 flex-col justify-between relative overflow-hidden">
 
        {/* Decorative Background Circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl float-blob"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-500/20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl float-blob" style={{ animationDelay: '3s' }}></div>
 
        {/* Floating decorative icons */}
        <Heart className="absolute top-24 right-16 w-8 h-8 text-white/15 float-icon" style={{ animationDelay: '0.5s' }} />
        <Activity className="absolute bottom-40 left-10 w-10 h-10 text-white/10 float-icon" style={{ animationDelay: '1.5s' }} />
        <Stethoscope className="absolute top-1/2 right-10 w-9 h-9 text-white/10 float-icon" style={{ animationDelay: '2.5s' }} />
 
        <div className="relative z-10 fade-up">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
            <Droplet className="w-8 h-8 heartbeat" /> BloodLink
          </Link>
        </div>
 
        <div className="relative z-10 space-y-6">
          <h1 className="text-5xl font-bold leading-tight fade-up" style={{ animationDelay: '0.1s' }}>
            Every Drop <br /> Counts.
          </h1>
          <p className="text-lg text-white/80 max-w-md fade-up" style={{ animationDelay: '0.2s' }}>
            Join our life-saving community. Your small step can give someone a second chance at life.
          </p>
 
          {/* Trust Stats */}
          <div className="flex gap-8 pt-4 fade-up" style={{ animationDelay: '0.3s' }}>
            <div>
              <p className="text-3xl font-bold">50K+</p>
              <p className="text-sm text-white/60">Lives Saved</p>
            </div>
            <div>
              <p className="text-3xl font-bold">10K+</p>
              <p className="text-sm text-white/60">Active Donors</p>
            </div>
            <div>
              <p className="text-3xl font-bold">100+</p>
              <p className="text-sm text-white/60">Hospitals</p>
            </div>
          </div>
 
          {/* Live pulse indicator */}
          <div className="flex items-center gap-2 pt-2 fade-up" style={{ animationDelay: '0.35s' }}>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
            <p className="text-xs text-white/60">Donor network active right now</p>
          </div>
        </div>
 
        <div className="relative z-10 text-sm text-white/50 flex items-center gap-2 fade-up" style={{ animationDelay: '0.4s' }}>
          <ShieldCheck className="w-4 h-4" /> 256-bit SSL Secure Connection
        </div>
      </div>
 
      {/* RIGHT PANE - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-neutral-50">
        <div className="w-full max-w-md fade-up">
 
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 text-2xl font-bold text-primary-600 mb-10 justify-center">
            <Droplet className="w-8 h-8 heartbeat" /> BloodLink
          </div>
 
          <h2 className="text-3xl font-bold text-neutral-800 mb-2">Welcome back</h2>
          <p className="text-neutral-500 mb-8">Login to your account to continue.</p>
 
          {error && (
            <div className="flex items-start gap-3 bg-red-50 text-red-700 p-4 mb-6 rounded-xl border border-red-100 shake-once">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Login failed</p>
                <p className="text-xs mt-0.5 text-red-600">{error}</p>
              </div>
            </div>
          )}
 
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-neutral-400" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full pl-11 pr-4 py-3.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500/20 focus:border-secondary-500 transition-all text-neutral-800 placeholder:text-neutral-400 bg-white shadow-soft"
                  placeholder="you@example.com"
                />
              </div>
            </div>
 
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-neutral-700">Password</label>
                <Link to="/forgot-password" className="text-xs font-medium text-primary-600 hover:text-primary-700 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-neutral-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="w-full pl-11 pr-11 py-3.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500/20 focus:border-secondary-500 transition-all text-neutral-800 placeholder:text-neutral-400 bg-white shadow-soft"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
 
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-secondary-600 text-white py-3.5 rounded-xl font-semibold hover:bg-secondary-700 shadow-soft transition-all flex items-center justify-center gap-2 mt-2 hover:shadow-trust active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" /> Secure login
                </>
              )}
            </button>
          </form>
 
          {/* Trust badges */}
          <div className="flex items-center justify-center gap-5 mt-6 text-neutral-400">
            <div className="flex items-center gap-1.5 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Encrypted
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <HeartPulse className="w-4 h-4 text-red-400" /> Verified network
            </div>
          </div>
 
          <div className="mt-8 text-center">
            <p className="text-neutral-600 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold hover:underline">Create account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}