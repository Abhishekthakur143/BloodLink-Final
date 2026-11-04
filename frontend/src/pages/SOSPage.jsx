import { useState, useEffect } from 'react';
import { triggerSOS } from '../api/sos';
import { useSelector } from 'react-redux';
 
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
 
export default function SOSPage() {
  const { user } = useSelector((state) => state.auth);
  const [currentPos, setCurrentPos] = useState(null);
  const [alertSent, setAlertSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState(user?.bloodGroup && user.bloodGroup !== 'Unknown' ? user.bloodGroup : 'A+');
 
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPos({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        () => alert("Please enable location for accurate SOS alerts.")
      );
    }
  }, []);
 
  const handleSOS = async () => {
    if (!user) return alert("You must be logged in to send SOS.");
    if (sending) return;
 
    setSending(true);
    try {
      const payload = {
        userName: user.name || 'Unknown',
        bloodGroup: selectedBloodGroup,
        message: 'EMERGENCY: ' + (user.name || 'Unknown') + ' urgently needs ' + selectedBloodGroup + ' blood!',
        lat: currentPos ? currentPos.lat : null,
        lng: currentPos ? currentPos.lng : null
      };
 
      await triggerSOS(payload);
      setAlertSent(true);
      setTimeout(() => { setAlertSent(false); setSending(false); }, 10000);
    } catch (err) {
      alert("Failed to send SOS");
      setSending(false);
    }
  };
 
  return (
    <div className={`min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4 py-10 transition-colors duration-700 ${alertSent ? 'bg-red-50' : 'bg-gray-50'}`}>
      <style>{`
        @keyframes ringPulse { 0% { box-shadow: 0 0 0 0 rgba(220,38,38,0.35); } 70% { box-shadow: 0 0 0 32px rgba(220,38,38,0); } 100% { box-shadow: 0 0 0 0 rgba(220,38,38,0); } }
        @keyframes ringPulseSlow { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.8); opacity: 0; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes alertPop { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes floatSlow { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-14px) scale(1.04); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        .ring-pulse { animation: ringPulse 2s infinite; }
        .ring-slow { animation: ringPulseSlow 2.4s infinite ease-out; }
        .ring-slow-2 { animation: ringPulseSlow 2.4s infinite ease-out; animation-delay: 0.8s; }
        .fade-up { animation: fadeUp 0.5s ease-out both; }
        .alert-pop { animation: alertPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
        .float-blob { animation: floatSlow 9s ease-in-out infinite; }
        .blink-dot { animation: blink 1.4s ease-in-out infinite; }
      `}</style>
 
      {/* Decorative background blobs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-red-100/60 rounded-full blur-3xl float-blob"></div>
      <div className="absolute bottom-0 -right-16 w-80 h-80 bg-rose-100/60 rounded-full blur-3xl float-blob" style={{ animationDelay: '3s' }}></div>
 
      {alertSent ? (
        <div className="relative z-10 text-center alert-pop max-w-md">
          <div className="relative w-28 h-28 mx-auto mb-6 flex items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-red-200 ring-slow"></span>
            <span className="absolute inset-0 rounded-full bg-red-200 ring-slow-2"></span>
            <div className="relative w-24 h-24 rounded-full bg-red-100 flex items-center justify-center">
              <i className="ti ti-alert-triangle-filled" style={{ fontSize: 44, color: '#dc2626' }}></i>
            </div>
          </div>
 
          <h2 className="text-3xl font-bold text-red-600 mb-2">SOS activated!</h2>
          <p className="text-gray-600">
            Requesting <span className="font-bold text-red-600">{selectedBloodGroup}</span> blood. Help is on the way — stay calm.
          </p>
 
          {/* Status timeline */}
          <div className="mt-6 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm text-left space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                <i className="ti ti-check" style={{ fontSize: 16, color: '#059669' }}></i>
              </div>
              <p className="text-sm text-gray-700">Alert broadcast to nearby <span className="font-semibold">{selectedBloodGroup}</span> donors</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                <i className="ti ti-map-pin-check" style={{ fontSize: 16, color: '#059669' }}></i>
              </div>
              <p className="text-sm text-gray-700">Live location shared</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                <span className="w-2 h-2 bg-amber-500 rounded-full blink-dot"></span>
              </div>
              <p className="text-sm text-gray-700">Waiting for responders to confirm</p>
            </div>
          </div>
 
          <a href="tel:112" className="mt-6 inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3.5 rounded-xl text-base font-semibold hover:bg-black transition-colors">
            <i className="ti ti-phone-call" style={{ fontSize: 18 }}></i>
            Call 112 (Emergency)
          </a>
        </div>
      ) : (
        <div className="relative z-10 w-full flex flex-col items-center fade-up">
 
          <div className="text-center mb-8 max-w-md">
            <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
              <i className="ti ti-bolt" style={{ fontSize: 14 }}></i>
              Emergency assistance
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 tracking-tight">Emergency SOS</h2>
            <p className="text-gray-500 text-sm leading-relaxed">Press the button if you or someone nearby urgently needs blood. Your details and live location will be broadcast instantly to nearby donors.</p>
 
            {/* Status pills */}
            <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                currentPos ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-600'
              }`}>
                <i className={`ti ${currentPos ? 'ti-map-pin-check' : 'ti-map-pin'}`} style={{ fontSize: 14 }}></i>
                {currentPos ? 'Location ready' : 'Locating you...'}
              </span>
            </div>
          </div>
 
          {/* Blood group selector */}
          <div className="w-full max-w-md mb-8">
            <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              Which blood group is needed?
            </p>
            <div className="grid grid-cols-4 gap-2">
              {bloodGroups.map((bg) => {
                const active = selectedBloodGroup === bg;
                return (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => setSelectedBloodGroup(bg)}
                    disabled={sending}
                    className={`relative py-2.5 rounded-xl border-2 font-bold text-sm transition-all ${
                      active
                        ? 'bg-red-600 border-red-600 text-white shadow-md shadow-red-200 scale-105'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-600'
                    } disabled:opacity-60 disabled:cursor-not-allowed`}
                  >
                    {bg}
                    {user?.bloodGroup === bg && (
                      <span className={`absolute -top-1.5 -right-1.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                        active ? 'bg-white text-red-600' : 'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}>
                        you
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-center text-xs text-gray-400 mt-2">
              Defaults to your own group — change it if someone else nearby needs a different type
            </p>
          </div>
 
          {/* THE BIG PANIC BUTTON */}
          <div className="relative flex items-center justify-center">
            <span className="absolute w-64 h-64 rounded-full border-2 border-red-200 ring-slow"></span>
            <span className="absolute w-64 h-64 rounded-full border-2 border-red-200 ring-slow-2"></span>
 
            <button
              onClick={handleSOS}
              disabled={sending}
              className={`relative w-56 h-56 rounded-full text-white text-3xl font-bold flex flex-col items-center justify-center gap-1 transition-all z-10 ${
                sending
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-br from-red-600 to-rose-700 hover:scale-105 active:scale-95 ring-pulse'
              }`}
            >
              {sending ? (
                <>
                  <svg className="animate-spin h-8 w-8" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span className="text-sm font-semibold tracking-wide">Sending...</span>
                </>
              ) : (
                <>
                  <i className="ti ti-emergency-bed" style={{ fontSize: 48 }}></i>
                  <span>SOS</span>
                  <span className="text-sm font-semibold opacity-90">{selectedBloodGroup}</span>
                </>
              )}
            </button>
          </div>
 
          <p className="text-xs text-gray-400 mt-8 flex items-center gap-1.5">
            <i className="ti ti-hand-click" style={{ fontSize: 14 }}></i>
            One tap is enough — no need to hold
          </p>
 
          {/* What happens next */}
          <div className="mt-10 w-full max-w-md grid grid-cols-3 gap-3">
            <div className="bg-white border border-gray-100 rounded-2xl p-3 text-center">
              <div className="w-9 h-9 mx-auto mb-2 rounded-xl bg-red-50 flex items-center justify-center">
                <i className="ti ti-broadcast" style={{ fontSize: 18, color: '#dc2626' }}></i>
              </div>
              <p className="text-[11px] font-medium text-gray-600 leading-tight">Instant donor alert</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-3 text-center">
              <div className="w-9 h-9 mx-auto mb-2 rounded-xl bg-blue-50 flex items-center justify-center">
                <i className="ti ti-map-pin" style={{ fontSize: 18, color: '#2563eb' }}></i>
              </div>
              <p className="text-[11px] font-medium text-gray-600 leading-tight">Location shared live</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-3 text-center">
              <div className="w-9 h-9 mx-auto mb-2 rounded-xl bg-emerald-50 flex items-center justify-center">
                <i className="ti ti-clock" style={{ fontSize: 18, color: '#059669' }}></i>
              </div>
              <p className="text-[11px] font-medium text-gray-600 leading-tight">Active for 10 minutes</p>
            </div>
          </div>
 
          {/* Emergency Contacts Section */}
          <div className="mt-10 w-full max-w-md">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest text-center mb-4">Emergency helplines</h3>
            <div className="grid grid-cols-2 gap-3">
              <a href="tel:112" className="bg-white border border-gray-100 p-4 rounded-2xl text-center hover:border-red-200 hover:shadow-md transition-all">
                <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-blue-50 flex items-center justify-center">
                  <i className="ti ti-shield-check" style={{ fontSize: 20, color: '#2563eb' }}></i>
                </div>
                <p className="font-semibold text-sm text-gray-900">Police</p>
                <p className="text-red-600 font-bold text-lg">112</p>
              </a>
              <a href="tel:108" className="bg-white border border-gray-100 p-4 rounded-2xl text-center hover:border-red-200 hover:shadow-md transition-all">
                <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <i className="ti ti-ambulance" style={{ fontSize: 20, color: '#059669' }}></i>
                </div>
                <p className="font-semibold text-sm text-gray-900">Ambulance</p>
                <p className="text-red-600 font-bold text-lg">108</p>
              </a>
              <a href="tel:104" className="col-span-2 bg-white border border-gray-100 p-4 rounded-2xl text-center hover:border-red-200 hover:shadow-md transition-all flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                  <i className="ti ti-droplet" style={{ fontSize: 20, color: '#dc2626' }}></i>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-sm text-gray-900">Blood bank helpline</p>
                  <p className="text-red-600 font-bold text-lg leading-none">104</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}