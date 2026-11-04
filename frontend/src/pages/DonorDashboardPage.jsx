import { useState, useEffect, useRef } from 'react';
import { checkEligibility, getMyDonations } from '../api/donation';
import { Link } from 'react-router-dom';
import {
  Droplet, Search, Tent, AlertCircle, Heart, Award,
  TrendingUp, Calendar, Clock, ChevronDown, ArrowRight,
  CheckCircle, XCircle, Flame, Activity, Star,
  ChevronRight, Zap, Shield, Users, MapPin
} from 'lucide-react';
 
/* ═══════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
  .donor-root * { font-family:'Inter',system-ui,sans-serif; }
 
  @keyframes ddFloat {
    0%,100% { transform:translateY(0) rotate(-3deg); filter:drop-shadow(0 20px 40px rgba(220,38,38,0.4)); }
    50%      { transform:translateY(-20px) rotate(3deg); filter:drop-shadow(0 36px 60px rgba(220,38,38,0.55)); }
  }
  @keyframes ddRing {
    0%  { transform:scale(0.8); opacity:0.6; }
    70% { transform:scale(1.6); opacity:0; }
    100%{ transform:scale(1.6); opacity:0; }
  }
  @keyframes ddFadeUp {
    from { opacity:0; transform:translateY(28px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes ddGrad {
    0%,100%{ background-position:0% 50%; }
    50%    { background-position:100% 50%; }
  }
  @keyframes ddTicker {
    0%   { transform:translateX(0); }
    100% { transform:translateX(-50%); }
  }
  @keyframes ddBeat {
    0%,100%{ transform:scale(1); }
    14%   { transform:scale(1.15); }
    28%   { transform:scale(1); }
    42%   { transform:scale(1.1); }
    70%   { transform:scale(1); }
  }
  @keyframes ddShimmer {
    0%  { background-position:-600px 0; }
    100%{ background-position: 600px 0; }
  }
  @keyframes ddSlideIn {
    from { opacity:0; transform:translateX(-12px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes ddCountUp {
    from { opacity:0; transform:translateY(6px); }
    to   { opacity:1; transform:translateY(0); }
  }
 
  .dd-float   { animation:ddFloat 5s ease-in-out infinite; }
  .dd-beat    { animation:ddBeat 1.8s ease-in-out infinite; }
  .dd-fadein1 { animation:ddFadeUp 0.65s ease both 0.05s; }
  .dd-fadein2 { animation:ddFadeUp 0.65s ease both 0.18s; }
  .dd-fadein3 { animation:ddFadeUp 0.65s ease both 0.31s; }
  .dd-fadein4 { animation:ddFadeUp 0.65s ease both 0.44s; }
  .dd-fadein5 { animation:ddFadeUp 0.65s ease both 0.57s; }
 
  .dd-ring::before,.dd-ring::after {
    content:'';position:absolute;inset:-18px;border-radius:50%;
    border:2px solid rgba(220,38,38,0.25);
    animation:ddRing 2.6s ease-out infinite;
  }
  .dd-ring::after { animation-delay:1.3s; }
 
  .dd-ticker  { animation:ddTicker 30s linear infinite; }
  .dd-ticker:hover { animation-play-state:paused; }
 
  .dd-grad-btn {
    background:linear-gradient(135deg,#DC2626,#EF4444,#DC2626);
    background-size:200% 200%;
    animation:ddGrad 3s ease infinite;
    transition:transform 0.25s ease,box-shadow 0.25s ease;
  }
  .dd-grad-btn:hover { transform:translateY(-2px); box-shadow:0 12px 32px rgba(220,38,38,0.38); }
 
  .dd-card {
    transition:transform 0.22s ease,box-shadow 0.22s ease;
  }
  .dd-card:hover {
    transform:translateY(-6px);
    box-shadow:0 20px 48px rgba(0,0,0,0.09);
  }
 
  .dd-glass {
    background:rgba(255,255,255,0.08);
    backdrop-filter:blur(14px);
    border:1px solid rgba(255,255,255,0.14);
  }
 
  .dd-reveal {
    opacity:0;
    transform:translateY(24px);
    transition:opacity 0.6s ease,transform 0.6s ease;
  }
  .dd-reveal.dd-visible {
    opacity:1;
    transform:translateY(0);
  }
 
  .dd-skeleton {
    background:linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%);
    background-size:600px 100%;
    animation:ddShimmer 1.4s infinite;
    border-radius:8px;
  }
 
  .dd-status-completed { background:#d1fae5; color:#065f46; }
  .dd-status-pending   { background:#fef3c7; color:#92400e; }
  .dd-status-cancelled { background:#fee2e2; color:#991b1b; }
 
  .dd-noise {
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
    pointer-events:none;
  }
`;
 
/* ═══════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════ */
function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}
 
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.dd-reveal');
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('dd-visible'); }),
      { threshold: 0.12 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}
 
function useCounter(target, duration = 2000, active) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active || !target) return;
    let cur = 0;
    const step = target / (duration / 16);
    const t = setInterval(() => {
      cur += step;
      if (cur >= target) { setVal(target); clearInterval(t); }
      else setVal(Math.floor(cur));
    }, 16);
    return () => clearInterval(t);
  }, [active, target, duration]);
  return val;
}
 
/* ═══════════════════════════════════════════
   3D BLOOD DROP
═══════════════════════════════════════════ */
function BloodDrop3D({ size = 200 }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <div className="dd-ring absolute rounded-full"
        style={{ width: size * 0.55, height: size * 0.55, top: '50%', left: '50%', transform: 'translate(-50%,-55%)' }} />
      {/* ground shadow */}
      <div className="absolute" style={{
        width: size * 0.5, height: 14, borderRadius: '50%', bottom: -8, left: '50%',
        transform: 'translateX(-50%)',
        background: 'radial-gradient(ellipse,rgba(220,38,38,0.22) 0%,transparent 70%)',
        filter: 'blur(5px)'
      }} />
      <svg className="dd-float" width={size} height={size} viewBox="0 0 200 220" fill="none"
        style={{ filter: 'drop-shadow(0 22px 44px rgba(220,38,38,0.42))' }}>
        <defs>
          <radialGradient id="dg1" cx="38%" cy="30%" r="68%">
            <stop offset="0%"   stopColor="#FF7B7B" />
            <stop offset="45%"  stopColor="#DC2626" />
            <stop offset="100%" stopColor="#7F1D1D" />
          </radialGradient>
          <radialGradient id="dg2" cx="34%" cy="27%" r="38%">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.52)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <radialGradient id="dg3" cx="66%" cy="74%" r="48%">
            <stop offset="0%"   stopColor="rgba(0,0,0,0.28)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        </defs>
        <path d="M100 12C100 12,28 88,28 138a72 72 0 0 0 144 0C172 88,100 12,100 12Z" fill="url(#dg1)" />
        <path d="M100 12C100 12,28 88,28 138a72 72 0 0 0 144 0C172 88,100 12,100 12Z" fill="url(#dg3)" />
        <ellipse cx="76" cy="90" rx="21" ry="33" fill="url(#dg2)" transform="rotate(-18,76,90)" />
        <ellipse cx="68" cy="72" rx="7" ry="9"   fill="rgba(255,255,255,0.38)" transform="rotate(-18,68,72)" />
        {/* cross */}
        <rect x="90" y="126" width="20" height="50" rx="4" fill="rgba(255,255,255,0.9)" />
        <rect x="75" y="141" width="50" height="20" rx="4" fill="rgba(255,255,255,0.9)" />
      </svg>
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   LIVE TICKER
═══════════════════════════════════════════ */
const TICKER = [
  { blood:'O−', city:'Mumbai',    urg:'CRITICAL', time:'1 min ago' },
  { blood:'AB+', city:'Delhi',    urg:'URGENT',   time:'4 min ago' },
  { blood:'B−', city:'Indore',    urg:'URGENT',   time:'7 min ago' },
  { blood:'A+', city:'Pune',      urg:'NEEDED',   time:'12 min ago' },
  { blood:'O+', city:'Chennai',   urg:'CRITICAL', time:'15 min ago' },
  { blood:'AB−', city:'Kolkata',  urg:'NEEDED',   time:'19 min ago' },
  { blood:'B+', city:'Jaipur',    urg:'URGENT',   time:'22 min ago' },
];
const URG_CLS = { CRITICAL:'bg-red-600 text-white', URGENT:'bg-orange-500 text-white', NEEDED:'bg-amber-400 text-gray-900' };
 
function LiveTicker() {
  const doubled = [...TICKER, ...TICKER];
  return (
    <div className="w-full bg-gray-950 border-y border-gray-800 overflow-hidden py-2.5 relative">
      <div className="absolute left-0 top-0 h-full w-16 z-10 pointer-events-none"
        style={{ background:'linear-gradient(to right,#030712,transparent)' }} />
      <div className="absolute right-0 top-0 h-full w-16 z-10 pointer-events-none"
        style={{ background:'linear-gradient(to left,#030712,transparent)' }} />
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full ml-3">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse inline-block" />LIVE
        </div>
        <div className="overflow-hidden flex-1">
          <div className="dd-ticker flex items-center gap-5" style={{ width:'max-content' }}>
            {doubled.map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 flex-shrink-0">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${URG_CLS[item.urg]}`}>{item.urg}</span>
                <span className="text-white font-bold text-sm">{item.blood}</span>
                <span className="text-gray-400 text-xs">in</span>
                <span className="text-gray-200 text-sm font-medium">{item.city}</span>
                <span className="text-gray-600 text-xs">{item.time}</span>
                <span className="text-gray-700 mx-1">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   STAT PILL (hero)
═══════════════════════════════════════════ */
function StatPill({ val, label, color }) {
  return (
    <div className="flex items-center gap-2 bg-white border border-gray-100 shadow-md px-4 py-2.5 rounded-2xl">
      <span className={`w-2 h-2 rounded-full ${color} inline-block`} />
      <span className="font-black text-gray-800 text-sm">{val}</span>
      <span className="text-xs text-gray-400">{label}</span>
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   ANIMATED STAT CARD
═══════════════════════════════════════════ */
function AnimStat({ icon: Icon, value, suffix = '', label, accent, active }) {
  const count = useCounter(value, 2000, active);
  return (
    <div className="dd-reveal dd-card bg-white rounded-2xl border border-gray-100 p-5 flex flex-col items-center text-center">
      <div className={`p-3 rounded-xl mb-3 ${accent}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-3xl font-black text-gray-900 tracking-tight">{count.toLocaleString()}{suffix}</p>
      <p className="text-xs text-gray-400 mt-1 font-medium">{label}</p>
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   QUICK ACTION CARD
═══════════════════════════════════════════ */
function ActionCard({ to, icon: Icon, label, desc, accent, pulse = false }) {
  return (
    <Link to={to}
      className="group dd-card bg-white rounded-2xl border border-gray-100 p-5 flex flex-col items-center text-center block">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${accent}
        transition-transform duration-300 group-hover:scale-110 ${pulse ? 'dd-beat' : ''}`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h4 className="font-bold text-gray-800 text-sm">{label}</h4>
      <p className="text-xs text-gray-400 mt-1">{desc}</p>
      <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs font-semibold text-red-400">
        Open <ArrowRight className="w-3 h-3" />
      </div>
    </Link>
  );
}
 
/* ═══════════════════════════════════════════
   DONATION HISTORY ROW
═══════════════════════════════════════════ */
function DonationRow({ don, idx }) {
  const status = don.status?.toLowerCase() || 'pending';
  const statusClass = status === 'completed' ? 'dd-status-completed'
    : status === 'cancelled' ? 'dd-status-cancelled'
    : 'dd-status-pending';
 
  return (
    <div className="dd-reveal dd-card bg-white rounded-2xl border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      style={{ transitionDelay: `${idx * 60}ms` }}>
      <div className="flex items-center gap-4">
        {/* Blood badge */}
        <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
          <Droplet className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <p className="font-bold text-gray-800">Blood Donated</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Patient: <span className="font-semibold text-gray-600">{don.request?.patientName || 'N/A'}</span>
            <span className="mx-1.5 text-gray-300">·</span>
            <span className="font-bold text-red-500">{don.request?.bloodGroup || 'N/A'}</span>
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 sm:flex-col sm:items-end">
        <p className="text-xs text-gray-400">
          {new Date(don.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
        </p>
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusClass}`}>
          {don.status?.toUpperCase() || 'PENDING'}
        </span>
      </div>
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   MILESTONE BADGE
═══════════════════════════════════════════ */
function MilestoneBadge({ count }) {
  if (count >= 10) return (
    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
      <Award className="w-4 h-4 text-amber-500" />
      <span className="text-xs font-bold text-amber-700">Gold Donor 🏆</span>
    </div>
  );
  if (count >= 5) return (
    <div className="flex items-center gap-2 bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full">
      <Star className="w-4 h-4 text-gray-500" />
      <span className="text-xs font-bold text-gray-600">Silver Donor ⭐</span>
    </div>
  );
  if (count >= 1) return (
    <div className="flex items-center gap-2 bg-red-50 border border-red-100 px-3 py-1.5 rounded-full">
      <Heart className="w-4 h-4 text-red-400" />
      <span className="text-xs font-bold text-red-500">Active Donor ❤️</span>
    </div>
  );
  return null;
}
 
/* ═══════════════════════════════════════════
   HOW IT WORKS STEP
═══════════════════════════════════════════ */
function HowStep({ icon: Icon, num, title, desc, delay }) {
  return (
    <div className="dd-reveal flex flex-col items-center text-center" style={{ transitionDelay: delay }}>
      <div className="relative mb-4">
        <div className="w-16 h-16 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center">
          <Icon className="w-7 h-7 text-red-400" />
        </div>
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center">
          {num}
        </span>
      </div>
      <h4 className="font-bold text-white text-sm mb-1">{title}</h4>
      <p className="text-gray-500 text-xs max-w-[150px]">{desc}</p>
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════ */
export default function DonorDashboardPage() {
  const [eligibility, setEligibility]     = useState(null);
  const [donations,   setDonations]       = useState([]);
  const [loading,     setLoading]         = useState(true);
  const [activeTab,   setActiveTab]       = useState('all');
 
  const [statsRef, statsInView] = useInView(0.3);
  useScrollReveal();
 
  /* original fetch — untouched */
  useEffect(() => {
    const fetchDonorData = async () => {
      try {
        const eligRes = await checkEligibility();
        setEligibility(eligRes.data);
        const donRes  = await getMyDonations();
        setDonations(donRes.data.data);
      } catch (err) {
        console.error("Failed to fetch donor data");
      } finally {
        setLoading(false);
      }
    };
    fetchDonorData();
  }, []);
 
  const filtered = activeTab === 'all'
    ? donations
    : donations.filter(d => d.status?.toLowerCase() === activeTab);
 
  const isEligible = eligibility?.eligible;
 
  /* ─── RENDER ─────────────────────────────────── */
  return (
    <>
      <style>{CSS}</style>
      <div className="donor-root w-full overflow-x-hidden bg-gray-50">
 
        {/* ══ HERO ════════════════════════════════════ */}
        <section className="relative min-h-screen flex items-center overflow-hidden"
          style={{ background:'linear-gradient(135deg,#fff 0%,#fef2f2 50%,#fff 100%)' }}>
 
          {/* noise */}
          <div className="dd-noise absolute inset-0" />
          {/* subtle grid */}
          <div className="absolute inset-0 opacity-[0.022]" style={{
            backgroundImage:'linear-gradient(#dc2626 1px,transparent 1px),linear-gradient(90deg,#dc2626 1px,transparent 1px)',
            backgroundSize:'64px 64px'
          }} />
 
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
 
            {/* LEFT */}
            <div>
              {/* eyebrow */}
              <div className="dd-fadein1 inline-flex items-center gap-2 bg-red-50 border border-red-100 text-red-500 text-xs font-bold px-4 py-2 rounded-full mb-7 uppercase tracking-wide">
                <Flame className="w-3.5 h-3.5" /> Donor Dashboard
              </div>
 
              <h1 className="dd-fadein2 text-5xl md:text-6xl font-black text-gray-900 leading-[1.05] tracking-tight mb-6">
                Your Blood.
                <br />
                <span className="relative inline-block mt-1">
                  <span className="text-transparent bg-clip-text"
                    style={{ backgroundImage:'linear-gradient(135deg,#DC2626,#EF4444)' }}>
                    Their Life.
                  </span>
                  <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 220 10" fill="none">
                    <path d="M4 7 Q55 2 110 6 Q165 10 216 4" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  </svg>
                </span>
                <br />
                <span className="text-gray-600">Your Legacy.</span>
              </h1>
 
              <p className="dd-fadein3 text-gray-400 text-lg leading-relaxed mb-10 max-w-md">
                Track your donations, check your eligibility, and keep saving lives — all from one place.
              </p>
 
              <div className="dd-fadein4 flex flex-col sm:flex-row gap-3 mb-10">
                <Link to="/search-requests"
                  className="dd-grad-btn flex items-center justify-center gap-2 text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg">
                  <Search className="w-4 h-4" /> Find Requests
                </Link>
                <Link to="/camps"
                  className="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 hover:border-red-200 text-gray-700 hover:text-red-500 px-8 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 hover:-translate-y-0.5">
                  <Tent className="w-4 h-4" /> Join a Camp
                </Link>
              </div>
 
              {/* trust chips */}
              <div className="dd-fadein5 flex flex-wrap gap-2">
                {['🩸 Hero Donor','🏥 Verified','⚡ 24/7 Ready','❤️ Lives Saved'].map(t => (
                  <span key={t} className="text-xs text-gray-500 bg-white border border-gray-200 px-3 py-1.5 rounded-full font-medium shadow-sm">{t}</span>
                ))}
              </div>
            </div>
 
            {/* RIGHT */}
            <div className="flex flex-col items-center gap-8">
              <BloodDrop3D size={240} />
 
              {/* eligibility pill — real data */}
              <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl border shadow-md
                ${loading         ? 'bg-gray-50 border-gray-200'
                : isEligible      ? 'bg-teal-50 border-teal-200'
                :                   'bg-amber-50 border-amber-200'}`}>
                {loading ? (
                  <><div className="dd-skeleton w-4 h-4 rounded-full" /><span className="text-sm text-gray-400">Checking eligibility…</span></>
                ) : isEligible ? (
                  <><CheckCircle className="w-5 h-5 text-teal-500" /><span className="font-bold text-teal-700 text-sm">You're eligible to donate today!</span></>
                ) : (
                  <><Clock className="w-5 h-5 text-amber-500" /><span className="font-bold text-amber-700 text-sm">Next donation window approaching</span></>
                )}
              </div>
 
              {/* stat pills */}
              <div className="flex gap-3 flex-wrap justify-center">
                <StatPill val={loading ? '…' : donations.length} label="Donations" color="bg-red-500" />
                <StatPill val="3+"  label="Lives / Donation"  color="bg-teal-500" />
                <StatPill val="24/7" label="Emergency Ready"  color="bg-blue-500" />
              </div>
            </div>
          </div>
 
          {/* scroll cue */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-300">
            <span className="text-xs tracking-widest uppercase font-medium">Scroll</span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </div>
        </section>
 
        {/* ══ LIVE TICKER ═════════════════════════════ */}
        <LiveTicker />
 
        {/* ══ DONOR STATS ═════════════════════════════ */}
        <section className="py-14 px-6 bg-white" ref={statsRef}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <p className="dd-reveal text-xs font-bold text-red-400 uppercase tracking-widest mb-1">Your Impact</p>
              <h2 className="dd-reveal text-3xl font-black text-gray-900">See What You've Achieved</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <AnimStat icon={Droplet}    value={loading ? 0 : donations.length}             label="Total Donations"    accent="bg-red-500"    active={statsInView && !loading} />
              <AnimStat icon={Heart}      value={loading ? 0 : donations.length * 3}          label="Lives Impacted"     accent="bg-teal-500"   active={statsInView && !loading} />
              <AnimStat icon={Activity}   value={loading ? 0 : (isEligible ? 100 : 0)} suffix="%" label="Eligibility"  accent="bg-blue-500"   active={statsInView && !loading} />
              <AnimStat icon={Award}      value={loading ? 0 : Math.min(donations.length * 10, 100)} suffix="%" label="Impact Score" accent="bg-purple-500" active={statsInView && !loading} />
            </div>
 
            {/* Milestone badge */}
            {!loading && donations.length > 0 && (
              <div className="dd-reveal mt-6 flex justify-center">
                <MilestoneBadge count={donations.length} />
              </div>
            )}
          </div>
        </section>
 
        {/* ══ QUICK ACTIONS ═══════════════════════════ */}
        <section className="py-10 px-6 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h3 className="dd-reveal text-sm font-bold text-gray-400 uppercase tracking-widest mb-5 flex items-center gap-2">
              <Zap className="w-4 h-4 text-red-400" /> Quick Actions
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <ActionCard to="/search-requests" icon={Search}      label="Find Blood"     desc="Help someone in need"  accent="bg-blue-500" />
              <ActionCard to="/camps"           icon={Tent}        label="Join Camp"      desc="Donate at a camp"      accent="bg-teal-500" />
              <ActionCard to="/sos"             icon={AlertCircle} label="Emergency SOS"  desc="Need blood urgently?"  accent="bg-red-600" pulse />
            </div>
          </div>
        </section>
 
        {/* ══ DONATION HISTORY ════════════════════════ */}
        <section className="py-10 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
 
            {/* Header + tabs */}
            <div className="dd-reveal flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-black text-gray-900">Donation History</h2>
                <p className="text-xs text-gray-400 mt-0.5">{donations.length} total donations</p>
              </div>
              <div className="flex gap-2">
                {['all','completed','pending','cancelled'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-150
                      ${activeTab === tab
                        ? 'bg-red-500 border-red-500 text-white'
                        : 'bg-white border-gray-200 text-gray-500 hover:border-red-200'}`}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>
 
            {/* Loading skeletons */}
            {loading && (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="dd-skeleton h-20 w-full rounded-2xl" />
                ))}
              </div>
            )}
 
            {/* Empty state */}
            {!loading && filtered.length === 0 && (
              <div className="dd-reveal text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-red-300" />
                </div>
                <p className="text-lg font-bold text-gray-700 mb-1">
                  {activeTab === 'all' ? 'No donations yet' : `No ${activeTab} donations`}
                </p>
                <p className="text-sm text-gray-400 mb-6">
                  {activeTab === 'all'
                    ? 'Start your life-saving journey today!'
                    : 'Try switching to a different filter above.'}
                </p>
                {activeTab === 'all' && (
                  <Link to="/search-requests"
                    className="dd-grad-btn inline-flex items-center gap-2 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md">
                    Find Blood Requests <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            )}
 
            {/* Donation list */}
            {!loading && filtered.length > 0 && (
              <div className="space-y-3">
                {filtered.map((don, i) => (
                  <DonationRow key={don._id} don={don} idx={i} />
                ))}
              </div>
            )}
          </div>
        </section>
 
        {/* ══ HOW IT WORKS (dark) ══════════════════════ */}
        <section className="py-16 px-6 bg-gray-950">
          <div className="max-w-4xl mx-auto text-center">
            <p className="dd-reveal text-xs font-bold text-red-400 uppercase tracking-widest mb-2">Process</p>
            <h2 className="dd-reveal text-3xl font-black text-white mb-12">How to Donate via BloodLink</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <HowStep icon={Shield}   num={1} title="Check Eligibility" desc="Quick 60-sec health check"  delay="0ms" />
              <HowStep icon={Search}   num={2} title="Find a Request"    desc="Search by blood group & city" delay="100ms" />
              <HowStep icon={MapPin}   num={3} title="Reach the Venue"   desc="Hospital, camp, or home visit" delay="200ms" />
              <HowStep icon={Heart}    num={4} title="Donate & Save"     desc="30 mins that save 3 lives"  delay="300ms" />
            </div>
          </div>
        </section>
 
        {/* ══ SOS BANNER ══════════════════════════════ */}
        <section className="py-10 px-6"
          style={{ background:'linear-gradient(135deg,#DC2626,#B91C1C)' }}>
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5 text-center md:text-left">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center border border-white/20 flex-shrink-0">
                <AlertCircle className="w-7 h-7 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-white font-black text-xl">Emergency Blood Needed?</h3>
                <p className="text-red-200 text-sm mt-0.5">SOS connects you with donors in under 5 minutes, 24/7.</p>
              </div>
            </div>
            <Link to="/sos"
              className="flex-shrink-0 bg-white text-red-600 font-black px-7 py-3 rounded-xl hover:bg-red-50 transition-colors shadow-xl flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4" /> Trigger SOS
            </Link>
          </div>
        </section>
 
        {/* ══ BOTTOM SPACER ═══════════════════════════ */}
        <div className="h-12 bg-gray-50" />
 
      </div>
    </>
  );
}