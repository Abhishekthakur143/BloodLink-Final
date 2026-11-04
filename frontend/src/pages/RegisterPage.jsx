import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { register, clearError } from '../redux/slices/authSlice';
 
// Medical & UI Icons
import { UserPlus, User, Mail, Lock, Phone, Briefcase, Droplet, AlertCircle, ShieldCheck, ChevronDown, CheckCircle2, Eye, EyeOff, Heart, Activity, Stethoscope } from 'lucide-react';
 
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
 
export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', role: 'donor', bloodGroup: 'Unknown' });
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
    dispatch(register(formData));
  };
 
  const inputClass = "w-full pl-11 pr-10 py-3.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-500/20 focus:border-secondary-500 transition-all text-neutral-800 placeholder:text-neutral-400 appearance-none bg-white shadow-soft";
  const iconClass = "w-5 h-5 text-neutral-400";
 
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
 
      {/* LEFT PANE - Why Join Us? */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-secondary-700 via-secondary-800 to-primary-900 text-white p-12 flex-col justify-between relative overflow-hidden">
 
        {/* Decorative Background Elements */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl float-blob"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl float-blob" style={{ animationDelay: '3s' }}></div>
 
        {/* Floating decorative icons */}
        <Heart className="absolute top-28 left-16 w-8 h-8 text-white/15 float-icon" style={{ animationDelay: '0.5s' }} />
        <Activity className="absolute bottom-32 right-16 w-10 h-10 text-white/10 float-icon" style={{ animationDelay: '1.5s' }} />
        <Stethoscope className="absolute top-1/2 left-10 w-9 h-9 text-white/10 float-icon" style={{ animationDelay: '2.5s' }} />
 
        <div className="relative z-10 fade-up">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
            <Droplet className="w-8 h-8 heartbeat" /> BloodLink
          </Link>
        </div>
 
        <div className="relative z-10 space-y-8">
          <h2 className="text-4xl font-bold fade-up" style={{ animationDelay: '0.1s' }}>Why donate blood?</h2>
 
          {/* Value Propositions */}
          <div className="space-y-5">
            <div className="flex items-start gap-4 fade-up" style={{ animationDelay: '0.15s' }}>
              <CheckCircle2 className="w-6 h-6 text-secondary-300 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-lg">Save up to 3 lives</p>
                <p className="text-sm text-white/70">One pint of blood can save multiple lives.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 fade-up" style={{ animationDelay: '0.2s' }}>
              <CheckCircle2 className="w-6 h-6 text-secondary-300 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-lg">Free health checkup</p>
                <p className="text-sm text-white/70">Get a mini-physical and infectious disease testing.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 fade-up" style={{ animationDelay: '0.25s' }}>
              <CheckCircle2 className="w-6 h-6 text-secondary-300 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-lg">Earn recognition badges</p>
                <p className="text-sm text-white/70">Get bronze, silver, and gold badges for your donations.</p>
              </div>
            </div>
          </div>
 
          {/* Live pulse indicator */}
          <div className="flex items-center gap-2 pt-2 fade-up" style={{ animationDelay: '0.3s' }}>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
            <p className="text-xs text-white/60">Donor network active right now</p>
          </div>
        </div>
 
        <div className="relative z-10 text-sm text-white/50 flex items-center gap-2 fade-up" style={{ animationDelay: '0.35s' }}>
          <ShieldCheck className="w-4 h-4" /> Data privacy guaranteed
        </div>
      </div>
 
      {/* RIGHT PANE - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-start justify-center p-6 sm:p-12 bg-neutral-50 overflow-y-auto">
        <div className="w-full max-w-md my-10 fade-up">
 
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 text-2xl font-bold text-primary-600 mb-8 justify-center">
            <Droplet className="w-8 h-8 heartbeat" /> BloodLink
          </div>
 
          <h2 className="text-3xl font-bold text-neutral-800 mb-2">Create account</h2>
          <p className="text-neutral-500 mb-8">Fill in the details to join the community.</p>
 
          {error && (
            <div className="flex items-start gap-3 bg-red-50 text-red-700 p-4 mb-6 rounded-xl border border-red-100 shake-once">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Registration failed</p>
                <p className="text-xs mt-0.5 text-red-600">{error}</p>
              </div>
            </div>
          )}
 
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Full name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><User className={iconClass} /></div>
                <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required placeholder="John Doe" className={inputClass} />
              </div>
            </div>
 
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail className={iconClass} /></div>
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required placeholder="you@example.com" className={inputClass} />
              </div>
            </div>
 
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Lock className={iconClass} /></div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  placeholder="••••••••"
                  className={inputClass}
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
 
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Phone</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Phone className={iconClass} /></div>
                <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required placeholder="+91 9876..." className={inputClass} />
              </div>
            </div>
 
            {/* Blood group — tappable grid instead of dropdown */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5 flex items-center gap-1.5">
                <Droplet className="w-4 h-4 text-primary-400" /> Blood group
              </label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {bloodGroups.map((bg) => {
                  const active = formData.bloodGroup === bg;
                  return (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => setFormData({ ...formData, bloodGroup: bg })}
                      className={`py-2.5 rounded-xl border-2 font-bold text-sm transition-all ${
                        active
                          ? 'bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-200 scale-105'
                          : 'bg-white border-neutral-200 text-neutral-600 hover:border-primary-300 hover:text-primary-600'
                      }`}
                    >
                      {bg}
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, bloodGroup: 'Unknown' })}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                  formData.bloodGroup === 'Unknown'
                    ? 'bg-neutral-700 border-neutral-700 text-white'
                    : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300'
                }`}
              >
                I don't know my blood group
              </button>
            </div>
 
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">I am a...</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Briefcase className={iconClass} /></div>
                <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className={inputClass}>
                  <option value="donor">Donor (I want to donate)</option>
                  <option value="recipient">Recipient (I need blood)</option>
                  <option value="hospital">Hospital / Blood bank</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"><ChevronDown className="w-4 h-4 text-neutral-400" /></div>
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
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" /> Create account
                </>
              )}
            </button>
          </form>
 
          <div className="mt-8 text-center">
            <p className="text-neutral-600 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold hover:underline">Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
 