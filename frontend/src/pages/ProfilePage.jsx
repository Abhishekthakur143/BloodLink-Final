import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../api/auth';
import { updateUser } from '../redux/slices/authSlice';
import DonorCertificate from './DonorCertificate';
 
export default function ProfilePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
 
  const [formData, setFormData] = useState({
    userId: user?._id || '',
    name: user?.name || '',
    phone: user?.phone || '',
    bloodGroup: user?.bloodGroup || 'A+'
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false); // ✅ NEW
 
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await updateProfile(formData);
      setMessage('Profile updated successfully!');
      setMessageType('success');
      dispatch(updateUser(res.data.data));
    } catch (err) {
      setMessage('Failed to update profile');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };
 
  if (!user) return <h2 className="text-center mt-10">Please login first</h2>;
 
  const initials = (formData.name || 'U').trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
 
  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes floatSlow { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-12px) scale(1.03); } }
        @keyframes pulseRing { 0% { box-shadow: 0 0 0 0 rgba(255,255,255,0.35); } 100% { box-shadow: 0 0 0 16px rgba(255,255,255,0); } }
        .fade-up { animation: fadeUp 0.6s ease-out both; }
        .float-blob { animation: floatSlow 8s ease-in-out infinite; }
        .avatar-pulse { animation: pulseRing 2.5s ease-out infinite; }
      `}</style>
 
      {/* HERO SECTION */}
      <div className="relative bg-gradient-to-br from-red-600 via-red-500 to-rose-600 overflow-hidden">
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-white/10 rounded-full blur-3xl float-blob"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-rose-400/20 rounded-full blur-3xl float-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-10 right-1/4 w-24 h-24 border border-white/20 rounded-full"></div>
 
        <div className="relative z-10 max-w-3xl mx-auto px-6 pt-16 pb-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-1.5 rounded-full text-white text-xs font-medium mb-6 fade-up">
            <i className="ti ti-droplet" style={{ fontSize: 14 }}></i>
            LifeDrop member
          </div>
 
          <div className="relative inline-block mb-4 fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="w-24 h-24 rounded-full bg-white/15 backdrop-blur flex items-center justify-center text-white text-3xl font-bold avatar-pulse">
              {initials}
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow">
              <i className="ti ti-droplet-filled" style={{ fontSize: 16, color: '#dc2626' }}></i>
            </div>
          </div>
 
          <h1 className="text-3xl font-bold text-white mb-1 fade-up" style={{ animationDelay: '0.15s' }}>
            {formData.name || 'Your Name'}
          </h1>
          <p className="text-red-50/80 text-sm fade-up" style={{ animationDelay: '0.2s' }}>
            Manage your donor profile and preferences
          </p>
 
          {/* ✅ Certificate button in hero — only for donors */}
          {user?.role === 'donor' && (
            <div className="fade-up mt-5" style={{ animationDelay: '0.25s' }}>
              <button
                onClick={() => setShowCertificate(true)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(8px)',
                  border: '1.5px solid rgba(255,255,255,0.35)',
                  borderRadius: 100, padding: '10px 24px',
                  color: '#fff', fontSize: 14, fontWeight: 700,
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
              >
                🏅 Download Donation Certificate
              </button>
            </div>
          )}
        </div>
 
        {/* wave bottom */}
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" style={{ height: 40 }}>
          <path d="M0 30 C 360 60 1080 0 1440 30 L1440 60 L0 60 Z" fill="rgb(249 250 251)" />
        </svg>
      </div>
 
      {/* STATS STRIP */}
      <div className="max-w-3xl mx-auto px-6 -mt-10 relative z-10 mb-10">
        <div className="grid grid-cols-3 gap-3 fade-up" style={{ animationDelay: '0.25s' }}>
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/60 border border-gray-100 p-4 text-center hover:-translate-y-1 transition-transform">
            <div className="w-9 h-9 mx-auto mb-2 rounded-xl bg-red-50 flex items-center justify-center">
              <i className="ti ti-droplet" style={{ fontSize: 18, color: '#dc2626' }}></i>
            </div>
            <p className="text-lg font-bold text-gray-900">{formData.bloodGroup}</p>
            <p className="text-[11px] text-gray-400">Blood group</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/60 border border-gray-100 p-4 text-center hover:-translate-y-1 transition-transform">
            <div className="w-9 h-9 mx-auto mb-2 rounded-xl bg-emerald-50 flex items-center justify-center">
              <i className="ti ti-phone" style={{ fontSize: 18, color: '#059669' }}></i>
            </div>
            <p className="text-sm font-bold text-gray-900 truncate">{formData.phone || '—'}</p>
            <p className="text-[11px] text-gray-400">Contact</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/60 border border-gray-100 p-4 text-center hover:-translate-y-1 transition-transform">
            <div className="w-9 h-9 mx-auto mb-2 rounded-xl bg-blue-50 flex items-center justify-center">
              <i className="ti ti-shield-check" style={{ fontSize: 18, color: '#2563eb' }}></i>
            </div>
            <p className="text-sm font-bold text-gray-900 capitalize">{user?.role || 'donor'}</p>
            <p className="text-[11px] text-gray-400">Role</p>
          </div>
        </div>
 
        {/* ✅ Certificate card below stats — visible for all roles but shows message for non-donors */}
        <div className="mt-4 fade-up" style={{ animationDelay: '0.3s' }}>
          <div
            onClick={() => setShowCertificate(true)}
            style={{
              background: 'linear-gradient(135deg, #FEF2F2, #FFF5F5)',
              border: '1.5px solid #FECACA',
              borderRadius: 16, padding: '16px 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(220,38,38,0.12)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'linear-gradient(135deg, #DC2626, #EF4444)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
              }}>🏅</div>
              <div>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#111827' }}>
                  Download Donation Certificate
                </p>
                <p style={{ margin: 0, fontSize: 12, color: '#9CA3AF' }}>
                  Official PDF certificate with your complete donation history
                </p>
              </div>
            </div>
            <div style={{
              background: '#DC2626', color: '#fff',
              borderRadius: 100, padding: '7px 16px',
              fontSize: 13, fontWeight: 700, flexShrink: 0,
            }}>
              ⬇️ Download
            </div>
          </div>
        </div>
      </div>
 
      {/* FORM SECTION */}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 fade-up" style={{ animationDelay: '0.3s' }}>
 
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <i className="ti ti-user-edit" style={{ fontSize: 20, color: '#dc2626' }}></i>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Edit profile</h2>
              <p className="text-xs text-gray-400">Keep your details up to date</p>
            </div>
          </div>
 
          {message && (
            <div className={`flex items-center gap-3 p-4 mb-6 rounded-2xl text-sm font-medium border fade-up ${
              messageType === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                messageType === 'success' ? 'bg-emerald-100' : 'bg-red-100'
              }`}>
                {messageType === 'success'
                  ? <i className="ti ti-check" style={{ fontSize: 16 }}></i>
                  : <i className="ti ti-x" style={{ fontSize: 16 }}></i>}
              </div>
              {message}
            </div>
          )}
 
          <form onSubmit={onSubmit} className="space-y-5">
            <input type="hidden" value={formData.userId} />
 
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
              <div className="relative">
                <i className="ti ti-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontSize: 18 }}></i>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all"
                />
              </div>
            </div>
 
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone number</label>
              <div className="relative">
                <i className="ti ti-phone absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" style={{ fontSize: 18 }}></i>
                <input
                  type="text"
                  placeholder="10-digit number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all"
                />
              </div>
            </div>
 
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Blood group</label>
              <div className="grid grid-cols-4 gap-2">
                {bloodGroups.map((bg) => {
                  const active = formData.bloodGroup === bg;
                  return (
                    <button
                      type="button"
                      key={bg}
                      onClick={() => setFormData({ ...formData, bloodGroup: bg })}
                      className={`py-2.5 rounded-xl border-2 font-semibold text-sm transition-all ${
                        active
                          ? 'bg-red-50 border-red-400 text-red-700 ring-2 ring-red-200'
                          : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {bg}
                    </button>
                  );
                })}
              </div>
            </div>
 
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white py-3.5 rounded-xl font-semibold text-base hover:from-red-700 hover:to-rose-700 active:scale-[0.99] transition-all shadow-lg shadow-red-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  Save changes
                  <i className="ti ti-check" style={{ fontSize: 18 }}></i>
                </>
              )}
            </button>
          </form>
        </div>
 
        <p className="text-center text-xs text-gray-400 mt-6">
          Your information helps us match you with nearby blood requests faster.
        </p>
      </div>
 
      {/* ✅ Certificate Modal */}
      {showCertificate && (
        <DonorCertificate onClose={() => setShowCertificate(false)} />
      )}
    </div>
  );
}