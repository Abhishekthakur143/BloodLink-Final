import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Droplet, HandHelping, Search, Tent, AlertCircle,
  ShieldCheck, LogIn, Activity, Heart, Users, Calendar,
  MapPin, ArrowRight, ChevronDown, Star, Phone, Clock,
  Award, TrendingUp, Zap, CheckCircle, XCircle, ChevronRight,
  Bell, Flame
} from 'lucide-react';
 
/* ═══════════════════════════════════════════════════
   GLOBAL STYLES — injected once
═══════════════════════════════════════════════════ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
 
  * { font-family: 'Inter', system-ui, sans-serif; }
 
  @keyframes dropFloat {
    0%,100% { transform: translateY(0) rotate(-4deg) scale(1); filter: drop-shadow(0 20px 40px rgba(220,38,38,0.35)); }
    50%      { transform: translateY(-22px) rotate(4deg) scale(1.03); filter: drop-shadow(0 36px 60px rgba(220,38,38,0.5)); }
  }
  @keyframes dropPulseRing {
    0%   { transform: scale(0.85); opacity: 0.7; }
    70%  { transform: scale(1.5);  opacity: 0; }
    100% { transform: scale(1.5);  opacity: 0; }
  }
  @keyframes heroFadeUp {
    from { opacity:0; transform:translateY(32px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes ticker {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes gradShift {
    0%,100% { background-position: 0% 50%; }
    50%      { background-position: 100% 50%; }
  }
  @keyframes fadeSlideIn {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes spinOnce {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes counterUp {
    from { opacity:0; transform:translateY(8px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position:  400px 0; }
  }
 
  .anim-hero-1 { animation: heroFadeUp 0.7s ease both 0.1s; }
  .anim-hero-2 { animation: heroFadeUp 0.7s ease both 0.25s; }
  .anim-hero-3 { animation: heroFadeUp 0.7s ease both 0.4s; }
  .anim-hero-4 { animation: heroFadeUp 0.7s ease both 0.55s; }
  .anim-hero-5 { animation: heroFadeUp 0.7s ease both 0.7s; }
 
  .drop-float  { animation: dropFloat 5s ease-in-out infinite; }
 
  .pulse-ring::before, .pulse-ring::after {
    content: '';
    position: absolute;
    inset: -16px;
    border-radius: 50%;
    border: 2px solid rgba(220,38,38,0.3);
    animation: dropPulseRing 2.4s ease-out infinite;
  }
  .pulse-ring::after { animation-delay: 1.2s; }
 
  .ticker-track { animation: ticker 28s linear infinite; }
  .ticker-track:hover { animation-play-state: paused; }
 
  .grad-btn {
    background: linear-gradient(135deg, #DC2626, #EF4444, #DC2626);
    background-size: 200% 200%;
    animation: gradShift 3s ease infinite;
  }
  .grad-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(220,38,38,0.4); }
 
  .card-hover {
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }
  .card-hover:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 48px rgba(0,0,0,0.1);
  }
 
  .glass-card {
    background: rgba(255,255,255,0.07);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.15);
  }
 
  .scroll-reveal {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.65s ease, transform 0.65s ease;
  }
  .scroll-reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }
 
  .compat-cell {
    transition: all 0.18s ease;
  }
  .compat-cell:hover {
    transform: scale(1.15);
    z-index: 10;
  }
 
  /* Noise texture overlay for hero */
  .noise-overlay {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
  }
`;
 
/* ═══════════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════════ */
function useCounter(target, duration = 2000, active) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
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
 
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.scroll-reveal');
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.15 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}
 
function useInView(threshold = 0.25) {
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
 
/* ═══════════════════════════════════════════════════
   3D BLOOD DROP SVG
═══════════════════════════════════════════════════ */
function BloodDrop3D({ size = 220 }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Pulse rings */}
      <div className="pulse-ring absolute w-36 h-36 rounded-full" style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
 
      {/* Shadow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: size * 0.55,
          height: 18,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(220,38,38,0.25) 0%, transparent 70%)',
          filter: 'blur(6px)',
          bottom: -10,
        }}
      />
 
      {/* Main drop */}
      <svg
        className="drop-float"
        width={size}
        height={size}
        viewBox="0 0 200 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 24px 48px rgba(220,38,38,0.45))' }}
      >
        <defs>
          <radialGradient id="dropGrad" cx="38%" cy="32%" r="68%">
            <stop offset="0%"  stopColor="#FF6B6B" />
            <stop offset="45%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#7F1D1D" />
          </radialGradient>
          <radialGradient id="dropShine" cx="35%" cy="28%" r="40%">
            <stop offset="0%"  stopColor="rgba(255,255,255,0.55)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <radialGradient id="dropDepth" cx="65%" cy="72%" r="50%">
            <stop offset="0%"  stopColor="rgba(0,0,0,0.3)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
          <filter id="dropBlur">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
        </defs>
 
        {/* Drop body */}
        <path
          d="M100 12 C100 12, 28 88, 28 138 a72 72 0 0 0 144 0 C172 88, 100 12, 100 12 Z"
          fill="url(#dropGrad)"
        />
        {/* Depth shadow */}
        <path
          d="M100 12 C100 12, 28 88, 28 138 a72 72 0 0 0 144 0 C172 88, 100 12, 100 12 Z"
          fill="url(#dropDepth)"
        />
        {/* Shine highlight */}
        <ellipse cx="76" cy="90" rx="22" ry="34" fill="url(#dropShine)" transform="rotate(-18,76,90)" />
        {/* Small specular */}
        <ellipse cx="68" cy="72" rx="7" ry="10" fill="rgba(255,255,255,0.4)" transform="rotate(-18,68,72)" />
 
        {/* White cross inside drop */}
        <rect x="90" y="126" width="20" height="52" rx="4" fill="rgba(255,255,255,0.92)" />
        <rect x="74" y="142" width="52" height="20" rx="4" fill="rgba(255,255,255,0.92)" />
      </svg>
    </div>
  );
}
 
/* ═══════════════════════════════════════════════════
   LIVE REQUEST TICKER
═══════════════════════════════════════════════════ */
const TICKER_ITEMS = [
  { blood: 'O−', city: 'Mumbai',    urgency: 'URGENT',  time: '2 min ago' },
  { blood: 'AB+', city: 'Delhi',     urgency: 'NEEDED',  time: '5 min ago' },
  { blood: 'B−', city: 'Indore',    urgency: 'URGENT',  time: '8 min ago' },
  { blood: 'A+', city: 'Pune',      urgency: 'NEEDED',  time: '11 min ago' },
  { blood: 'O+', city: 'Chennai',   urgency: 'CRITICAL',time: '14 min ago' },
  { blood: 'AB−', city: 'Kolkata',   urgency: 'NEEDED',  time: '17 min ago' },
  { blood: 'B+', city: 'Jaipur',    urgency: 'URGENT',  time: '20 min ago' },
  { blood: 'A−', city: 'Hyderabad', urgency: 'NEEDED',  time: '23 min ago' },
];
 
const URGENCY_STYLE = {
  CRITICAL: 'bg-red-600   text-white',
  URGENT:   'bg-orange-500 text-white',
  NEEDED:   'bg-amber-400  text-gray-900',
};
 
function LiveTicker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="w-full bg-gray-950 border-y border-gray-800 overflow-hidden py-3 relative">
      {/* Left fade */}
      <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, #030712, transparent)' }} />
      {/* Right fade */}
      <div className="absolute right-0 top-0 h-full w-20 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, #030712, transparent)' }} />
 
      <div className="flex items-center gap-4 mr-4">
        {/* Label */}
        <div className="flex-shrink-0 flex items-center gap-2 bg-red-600 text-white text-xs font-bold px-4 py-1.5 rounded-full ml-4">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse inline-block" />
          LIVE
        </div>
 
        {/* Scrolling track */}
        <div className="overflow-hidden flex-1">
          <div className="ticker-track flex items-center gap-6" style={{ width: 'max-content' }}>
            {doubled.map((item, i) => (
              <div key={i} className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${URGENCY_STYLE[item.urgency]}`}>
                  {item.urgency}
                </span>
                <span className="text-white font-bold text-sm">{item.blood}</span>
                <span className="text-gray-400 text-sm">needed in</span>
                <span className="text-gray-200 font-medium text-sm">{item.city}</span>
                <span className="text-gray-600 text-xs">{item.time}</span>
                <span className="text-gray-700 mx-2">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
 
/* ═══════════════════════════════════════════════════
   STAT COUNTER CARD
═══════════════════════════════════════════════════ */
function StatCard({ icon: Icon, value, suffix = '+', label, from, active }) {
  const count = useCounter(value, 2200, active);
  return (
    <div className="scroll-reveal flex flex-col items-center p-6 bg-white rounded-2xl border border-gray-100 card-hover text-center">
      <div className={`p-3 rounded-xl mb-3 ${from}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-3xl font-black text-gray-900 tracking-tight">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="text-xs text-gray-500 mt-1 font-medium">{label}</p>
    </div>
  );
}
 
/* ═══════════════════════════════════════════════════
   BLOOD GROUP COMPATIBILITY CHART
═══════════════════════════════════════════════════ */
const BLOOD_GROUPS = ['A+','A−','B+','B−','AB+','AB−','O+','O−'];
 
const CAN_DONATE_TO = {
  'A+':  ['A+','AB+'],
  'A−':  ['A+','A−','AB+','AB−'],
  'B+':  ['B+','AB+'],
  'B−':  ['B+','B−','AB+','AB−'],
  'AB+': ['AB+'],
  'AB−': ['AB+','AB−'],
  'O+':  ['A+','B+','O+','AB+'],
  'O−':  BLOOD_GROUPS,
};
 
function CompatibilityChart() {
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState('O+');
 
  const compatible = selected ? CAN_DONATE_TO[selected] : [];
 
  return (
    <div className="scroll-reveal bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 bg-red-50 rounded-xl flex items-center justify-center">
          <Droplet className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-lg">Blood Compatibility</h3>
          <p className="text-xs text-gray-400">Select your blood group to see who you can donate to</p>
        </div>
      </div>
 
      {/* Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {BLOOD_GROUPS.map(bg => (
          <button
            key={bg}
            onClick={() => setSelected(bg)}
            className={`px-3 py-1.5 rounded-lg text-sm font-bold border-2 transition-all duration-200
              ${selected === bg
                ? 'bg-red-500 border-red-500 text-white scale-105 shadow-md'
                : 'bg-white border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-500'
              }`}
          >
            {bg}
          </button>
        ))}
      </div>
 
      {/* Result Grid */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
        {BLOOD_GROUPS.map(bg => {
          const canDonate = compatible.includes(bg);
          return (
            <div
              key={bg}
              onMouseEnter={() => setHovered(bg)}
              onMouseLeave={() => setHovered(null)}
              className={`compat-cell relative flex flex-col items-center justify-center p-3 rounded-xl cursor-default
                ${canDonate
                  ? 'bg-teal-50 border-2 border-teal-300'
                  : 'bg-gray-50 border-2 border-gray-100'
                }
                ${hovered === bg ? 'shadow-lg' : ''}
              `}
            >
              <span className={`text-sm font-extrabold ${canDonate ? 'text-teal-700' : 'text-gray-400'}`}>{bg}</span>
              <div className="mt-1">
                {canDonate
                  ? <CheckCircle className="w-3.5 h-3.5 text-teal-500" />
                  : <XCircle    className="w-3.5 h-3.5 text-gray-300" />
                }
              </div>
              {hovered === bg && canDonate && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-20">
                  ✓ Can receive
                </div>
              )}
            </div>
          );
        })}
      </div>
 
      {selected && (
        <p className="mt-4 text-sm text-gray-500">
          <span className="font-bold text-red-500">{selected}</span> donors can give to:{' '}
          <span className="font-semibold text-teal-600">{CAN_DONATE_TO[selected].join(', ')}</span>
        </p>
      )}
    </div>
  );
}
 
/* ═══════════════════════════════════════════════════
   DONATION ELIGIBILITY CHECKER
═══════════════════════════════════════════════════ */
const ELIGIBILITY_QUESTIONS = [
  { id: 'age',    label: 'Age between 18 – 65 years?',             yes: true },
  { id: 'weight', label: 'Weight more than 50 kg?',                 yes: true },
  { id: 'health', label: 'Feeling healthy today?',                  yes: true },
  { id: 'last',   label: 'Last donation more than 3 months ago?',   yes: true },
  { id: 'meds',   label: 'Currently on medication / antibiotics?',  yes: false },
  { id: 'tattoo', label: 'Tattoo or piercing in last 6 months?',    yes: false },
];
 
function EligibilityChecker() {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
 
  const toggle = (id, val) => {
    setAnswers(prev => ({ ...prev, [id]: val }));
    setResult(null);
  };
 
  const check = () => {
    const eligible = ELIGIBILITY_QUESTIONS.every(q => answers[q.id] === q.yes);
    const answered = Object.keys(answers).length === ELIGIBILITY_QUESTIONS.length;
    if (!answered) { setResult('incomplete'); return; }
    setResult(eligible ? 'yes' : 'no');
  };
 
  const reset = () => { setAnswers({}); setResult(null); };
 
  return (
    <div className="scroll-reveal bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 bg-teal-50 rounded-xl flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-teal-500" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-lg">Eligibility Checker</h3>
          <p className="text-xs text-gray-400">Quick 60-second check — am I eligible to donate today?</p>
        </div>
      </div>
 
      <div className="space-y-3 mb-6">
        {ELIGIBILITY_QUESTIONS.map(q => (
          <div key={q.id} className="flex items-center justify-between gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-sm text-gray-700 font-medium flex-1">{q.label}</p>
            <div className="flex gap-2">
              <button
                onClick={() => toggle(q.id, true)}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all duration-150
                  ${answers[q.id] === true
                    ? 'bg-teal-500 border-teal-500 text-white'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-teal-300'
                  }`}
              >Yes</button>
              <button
                onClick={() => toggle(q.id, false)}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all duration-150
                  ${answers[q.id] === false
                    ? 'bg-red-500 border-red-500 text-white'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-red-300'
                  }`}
              >No</button>
            </div>
          </div>
        ))}
      </div>
 
      {/* Result */}
      {result === 'yes' && (
        <div className="mb-4 p-4 bg-teal-50 border border-teal-200 rounded-xl flex items-center gap-3 animate-fadeSlideIn">
          <CheckCircle className="w-6 h-6 text-teal-500 flex-shrink-0" />
          <div>
            <p className="font-bold text-teal-700">You're eligible to donate! 🎉</p>
            <p className="text-xs text-teal-500 mt-0.5">Find a camp or donor drive near you.</p>
          </div>
        </div>
      )}
      {result === 'no' && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
          <div>
            <p className="font-bold text-red-600">Not eligible right now.</p>
            <p className="text-xs text-red-400 mt-0.5">Some conditions may disqualify temporarily. Try again later.</p>
          </div>
        </div>
      )}
      {result === 'incomplete' && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 font-medium">
          ⚠️ Please answer all questions first.
        </div>
      )}
 
      <div className="flex gap-3">
        <button
          onClick={check}
          className="flex-1 grad-btn text-white py-3 rounded-xl font-bold text-sm transition-all duration-300"
        >
          Check Eligibility
        </button>
        <button
          onClick={reset}
          className="px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-500 text-sm font-semibold hover:border-gray-300 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
 
/* ═══════════════════════════════════════════════════
   MAP SECTION (nearby camps placeholder)
═══════════════════════════════════════════════════ */
const CAMPS = [
  { name: 'City Civil Hospital',   addr: 'MG Road, Indore',       date: 'Tomorrow, 9 AM',    slots: 34, type: 'Hospital' },
  { name: 'Lions Club Drive',      addr: 'Vijay Nagar, Indore',   date: 'Sun 15 Jun, 10 AM', slots: 18, type: 'Community' },
  { name: 'Bombay Hospital Camp',  addr: 'South Tukoganj, Indore',date: 'Mon 16 Jun, 8 AM',  slots: 42, type: 'Hospital' },
];
 
function CampsSection() {
  return (
    <div className="scroll-reveal">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-gray-900 text-xl">Nearby Donation Camps</h3>
          <p className="text-sm text-gray-400 mt-0.5">Showing camps close to Indore, MP</p>
        </div>
        <Link to="/camps" className="text-sm font-semibold text-red-500 flex items-center gap-1 hover:gap-2 transition-all">
          View all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
 
      {/* Map placeholder */}
      <div className="relative h-44 rounded-2xl mb-5 overflow-hidden border border-gray-200"
        style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 40%, #d1fae5 100%)'
        }}
      >
        {/* Fake map grid */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#6b7280" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        {/* Roads */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#d1d5db" strokeWidth="2" />
          <line x1="30%" y1="0" x2="30%" y2="100%" stroke="#d1d5db" strokeWidth="2" />
          <line x1="70%" y1="0" x2="70%" y2="100%" stroke="#d1d5db" strokeWidth="1.5" />
          <line x1="0" y1="25%" x2="100%" y2="75%" stroke="#e5e7eb" strokeWidth="1" />
        </svg>
        {/* Pins */}
        {[{x:'28%',y:'42%'},{x:'68%',y:'55%'},{x:'52%',y:'28%'}].map((pos, i) => (
          <div key={i} className="absolute flex flex-col items-center" style={{ left: pos.x, top: pos.y, transform:'translate(-50%,-100%)' }}>
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div className="w-2 h-2 bg-red-500 rounded-full mt-0" />
          </div>
        ))}
        <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 border border-gray-200">
          📍 Indore, MP
        </div>
      </div>
 
      {/* Camp cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CAMPS.map((camp, i) => (
          <Link key={i} to="/camps"
            className="group p-4 bg-white rounded-2xl border border-gray-100 card-hover cursor-pointer block">
            <div className="flex items-start justify-between mb-3">
              <span className={`text-xs font-bold px-2 py-1 rounded-lg
                ${camp.type === 'Hospital' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                {camp.type}
              </span>
              <span className="text-xs text-gray-400 font-medium">{camp.slots} slots left</span>
            </div>
            <h4 className="font-bold text-gray-800 text-sm mb-1">{camp.name}</h4>
            <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {camp.addr}
            </p>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {camp.date}
            </p>
            <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
              Register <ChevronRight className="w-3 h-3" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
 
/* ═══════════════════════════════════════════════════
   QUICK ACTION CARD
═══════════════════════════════════════════════════ */
function ActionCard({ to, icon: Icon, label, desc, accent, pulse = false }) {
  return (
    <Link to={to}
      className={`group bg-white p-5 rounded-2xl border border-gray-100 card-hover flex flex-col items-center text-center block`}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${accent} ${pulse ? 'animate-pulse' : ''} transition-transform duration-300 group-hover:scale-110`}>
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
 
/* ═══════════════════════════════════════════════════
   TESTIMONIAL
═══════════════════════════════════════════════════ */
function Testimonial({ name, blood, text, delay }) {
  return (
    <div className="scroll-reveal bg-white p-6 rounded-2xl border border-gray-100 card-hover"
      style={{ transitionDelay: delay }}>
      <div className="flex items-center gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
        ))}
      </div>
      <p className="text-gray-600 text-sm leading-relaxed mb-5">"{text}"</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center flex-shrink-0">
          <span className="text-red-600 font-black text-xs">{blood}</span>
        </div>
        <div>
          <p className="text-sm font-bold text-gray-800">{name}</p>
          <p className="text-xs text-gray-400">Verified Donor</p>
        </div>
      </div>
    </div>
  );
}
 
/* ═══════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════ */
export default function DashboardPage() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [statsRef, statsInView] = useInView(0.3);
  useScrollReveal();
 
  /* ── NOT LOGGED IN ───────────────────────────────── */
  if (!isAuthenticated || !user) {
    return (
      <>
        <style>{GLOBAL_CSS}</style>
        <div className="w-full overflow-x-hidden bg-white">
 
          {/* ── HERO ─────────────────────────────────────── */}
          <section className="relative min-h-screen flex items-center overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #fff 0%, #fef2f2 45%, #fff 100%)' }}>
 
            {/* Noise overlay */}
            <div className="noise-overlay absolute inset-0" />
 
            {/* Subtle grid */}
            <div className="absolute inset-0 opacity-[0.025]"
              style={{
                backgroundImage: 'linear-gradient(#dc2626 1px, transparent 1px), linear-gradient(90deg, #dc2626 1px, transparent 1px)',
                backgroundSize: '60px 60px'
              }} />
 
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
 
              {/* LEFT — TEXT */}
              <div>
                {/* Eyebrow */}
                <div className="anim-hero-1 inline-flex items-center gap-2 text-xs font-bold text-red-500 bg-red-50 border border-red-100 px-4 py-2 rounded-full mb-7 tracking-wide uppercase">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse inline-block" />
                  India's #1 Blood Donation Network
                </div>
 
                {/* Headline */}
                <h1 className="anim-hero-2 text-5xl md:text-6xl font-black text-gray-900 leading-[1.05] tracking-tight mb-6">
                  One Donation.
                  <br />
                  <span className="relative inline-block mt-1">
                    <span className="relative z-10 text-transparent bg-clip-text"
                      style={{ backgroundImage: 'linear-gradient(135deg, #DC2626, #EF4444)' }}>
                      Three Lives.
                    </span>
                    {/* Underline */}
                    <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 280 10" fill="none">
                      <path d="M4 7 Q70 2 140 6 Q210 10 276 4" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" fill="none" />
                    </svg>
                  </span>
                  <br />
                  <span className="text-gray-700">Saved.</span>
                </h1>
 
                <p className="anim-hero-3 text-gray-500 text-lg leading-relaxed mb-10 max-w-md">
                  Connect with verified blood donors, post urgent requests, and join life-saving camps — all in under a minute.
                </p>
 
                {/* CTA row */}
                <div className="anim-hero-4 flex flex-col sm:flex-row gap-3 mb-10">
                  <Link to="/login"
                    className="grad-btn flex items-center justify-center gap-2 text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all duration-300">
                    <LogIn className="w-4 h-4" /> Login to Donate
                  </Link>
                  <Link to="/search-requests"
                    className="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 hover:border-red-200 text-gray-700 hover:text-red-500 px-8 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 hover:-translate-y-0.5">
                    <Search className="w-4 h-4" /> Find Blood Now
                  </Link>
                </div>
 
                {/* Trust row */}
                <div className="anim-hero-5 flex flex-wrap gap-2">
                  {[
                    { icon: '✅', text: 'Free Forever' },
                    { icon: '🏥', text: 'Verified Donors' },
                    { icon: '🔒', text: 'Private & Secure' },
                    { icon: '⚡', text: '24/7 Emergency' },
                  ].map(t => (
                    <span key={t.text}
                      className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-white border border-gray-200 px-3 py-1.5 rounded-full font-medium shadow-sm">
                      {t.icon} {t.text}
                    </span>
                  ))}
                </div>
              </div>
 
              {/* RIGHT — 3D DROP */}
              <div className="flex flex-col items-center justify-center gap-8">
                <BloodDrop3D size={260} />
 
                {/* Floating stat pills */}
                <div className="flex gap-4 flex-wrap justify-center">
                  {[
                    { val: '12K+', label: 'Donors', color: 'bg-red-500' },
                    { val: '8.9K', label: 'Lives Saved', color: 'bg-teal-500' },
                    { val: '340+', label: 'Camps', color: 'bg-blue-500' },
                  ].map(s => (
                    <div key={s.label}
                      className="flex items-center gap-2 bg-white border border-gray-100 shadow-md px-4 py-2.5 rounded-2xl">
                      <span className={`w-2 h-2 rounded-full ${s.color} inline-block`} />
                      <span className="font-black text-gray-800 text-sm">{s.val}</span>
                      <span className="text-xs text-gray-400">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
 
            {/* Scroll cue */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-300">
              <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
              <ChevronDown className="w-5 h-5 animate-bounce" />
            </div>
          </section>
 
          {/* ── LIVE TICKER ──────────────────────────────── */}
          <LiveTicker />
 
          {/* ── STATS ────────────────────────────────────── */}
          <section className="py-20 px-6 bg-white" ref={statsRef}>
            <div className="max-w-5xl mx-auto text-center mb-12">
              <p className="scroll-reveal text-xs font-bold text-red-400 uppercase tracking-widest mb-2">Our Impact</p>
              <h2 className="scroll-reveal text-4xl font-black text-gray-900">Lives Changed, Together</h2>
            </div>
            <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5">
              <StatCard icon={Users}  value={12400} label="Registered Donors"   from="bg-red-500"    active={statsInView} />
              <StatCard icon={Heart}  value={8900}  label="Lives Saved"         from="bg-teal-500"   active={statsInView} />
              <StatCard icon={Tent}   value={340}   label="Camps Organized"     from="bg-blue-500"   active={statsInView} />
              <StatCard icon={Award}  value={980}   label="Hospital Partners"   from="bg-purple-500" active={statsInView} />
            </div>
          </section>
 
          {/* ── COMPATIBILITY + ELIGIBILITY ──────────────── */}
          <section className="py-16 px-6 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <p className="scroll-reveal text-xs font-bold text-teal-500 uppercase tracking-widest mb-2">Tools</p>
                <h2 className="scroll-reveal text-4xl font-black text-gray-900">Know Before You Go</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CompatibilityChart />
                <EligibilityChecker />
              </div>
            </div>
          </section>
 
          {/* ── NEARBY CAMPS ─────────────────────────────── */}
          <section className="py-16 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
              <p className="scroll-reveal text-xs font-bold text-blue-500 uppercase tracking-widest mb-2 text-center">Nearby</p>
              <CampsSection />
            </div>
          </section>
 
          {/* ── HOW IT WORKS ─────────────────────────────── */}
          <section className="py-16 px-6 bg-gray-950">
            <div className="max-w-4xl mx-auto text-center">
              <p className="scroll-reveal text-xs font-bold text-red-400 uppercase tracking-widest mb-2">Process</p>
              <h2 className="scroll-reveal text-4xl font-black text-white mb-14">How BloodLink Works</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { icon: Users,    step: '01', title: 'Register Free',  desc: 'Profile in 2 minutes' },
                  { icon: Search,   step: '02', title: 'Post or Search', desc: 'Request or find donors' },
                  { icon: MapPin,   step: '03', title: 'Connect Nearby', desc: 'Matched by location' },
                  { icon: Heart,    step: '04', title: 'Save a Life',    desc: 'Donate, repeat, impact' },
                ].map((s, i) => (
                  <div key={i} className="scroll-reveal flex flex-col items-center"
                    style={{ transitionDelay: `${i * 100}ms` }}>
                    <div className="relative mb-5">
                      <div className="w-16 h-16 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center">
                        <s.icon className="w-7 h-7 text-red-400" />
                      </div>
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center">
                        {s.step.slice(-1)}
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-sm mb-1">{s.title}</h4>
                    <p className="text-gray-500 text-xs">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
 
          {/* ── TESTIMONIALS ─────────────────────────────── */}
          <section className="py-16 px-6 bg-white">
            <div className="max-w-5xl mx-auto">
              <p className="scroll-reveal text-xs font-bold text-red-400 uppercase tracking-widest mb-2 text-center">Stories</p>
              <h2 className="scroll-reveal text-4xl font-black text-gray-900 text-center mb-12">Real People. Real Impact.</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Testimonial name="Priya Sharma" blood="O+" delay="0ms"
                  text="BloodLink found me a donor in 28 minutes during my father's emergency. I owe them everything." />
                <Testimonial name="Rahul Verma" blood="B+" delay="120ms"
                  text="I've donated 6 times through BloodLink. The process is effortless and the impact is real." />
                <Testimonial name="Anjali Patel" blood="A−" delay="240ms"
                  text="Found a rare A− donor in Indore within an hour. This platform is genuinely life-saving." />
              </div>
            </div>
          </section>
 
          {/* ── SOS BANNER ───────────────────────────────── */}
          <section className="py-12 px-6"
            style={{ background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)' }}>
            <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center flex-shrink-0 border border-white/20">
                  <AlertCircle className="w-7 h-7 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="text-white font-black text-2xl">Need Blood Right Now?</h3>
                  <p className="text-red-200 text-sm mt-1">SOS connects you with nearby donors in under 5 minutes.</p>
                </div>
              </div>
              <Link to="/sos"
                className="flex-shrink-0 bg-white text-red-600 font-black px-8 py-3.5 rounded-xl hover:bg-red-50 transition-colors shadow-xl flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4" /> Trigger SOS
              </Link>
            </div>
          </section>
 
          {/* ── FINAL CTA ────────────────────────────────── */}
          <section className="py-24 px-6 bg-white text-center">
            <div className="max-w-xl mx-auto">
              <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-red-100">
                <Droplet className="w-9 h-9 text-red-500" />
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-4">Join 12,000+ Donors</h2>
              <p className="text-gray-400 mb-8 text-lg">Be part of India's fastest-growing blood donation network.</p>
              <Link to="/register"
                className="inline-flex items-center gap-2 grad-btn text-white px-12 py-4 rounded-xl font-black text-base shadow-xl transition-all duration-300">
                Register Free <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </section>
 
        </div>
      </>
    );
  }
 
  /* ── LOGGED IN DASHBOARD ─────────────────────────── */
  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div className="w-full overflow-x-hidden bg-gray-50">
 
        {/* ── HERO BANNER ──────────────────────────────── */}
        <section className="relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%)' }}>
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, #DC2626 0%, transparent 50%), radial-gradient(circle at 80% 20%, #DC2626 0%, transparent 40%)'
            }} />
          {/* Grid */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} />
 
          <div className="relative z-10 max-w-7xl mx-auto px-6 py-14 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-gray-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                <Activity className="w-3 h-3 text-red-400" /> Dashboard
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
                Welcome back, <span className="text-red-400">{user.name}</span>! 👋
              </h2>
              <p className="text-gray-400">Every action you take today could save a life.</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <div className="glass-card px-5 py-3.5 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                  <Droplet className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Blood Group</p>
                  <p className="text-2xl font-black text-white">{user.bloodGroup}</p>
                </div>
              </div>
              <div className="glass-card px-5 py-3.5 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-500/20 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Role</p>
                  <p className="text-2xl font-black text-white capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
 
        {/* ── LIVE TICKER ──────────────────────────────── */}
        <LiveTicker />
 
        {/* ── QUICK ACTIONS ────────────────────────────── */}
        <section className="py-10 px-6">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-5 flex items-center gap-2">
              <Zap className="w-4 h-4 text-red-400" /> Quick Actions
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <ActionCard to="/request-blood" icon={HandHelping} label="Request Blood"
                desc="Post a new request" accent="bg-red-500" />
              <ActionCard to="/search-requests" icon={Search} label="Find Blood"
                desc="Help save lives" accent="bg-blue-500" />
              <ActionCard to="/camps" icon={Tent} label="Blood Camps"
                desc="Join upcoming camps" accent="bg-teal-500" />
              <ActionCard to="/sos" icon={AlertCircle} label="Emergency SOS"
                desc="Urgent help needed" accent="bg-red-600" pulse />
            </div>
          </div>
        </section>
 
        {/* ── STATS ────────────────────────────────────── */}
        <section className="py-6 px-6" ref={statsRef}>
          <div className="max-w-7xl mx-auto">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-5 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-400" /> Platform Impact
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={Users}  value={12400} label="Registered Donors"   from="bg-red-500"    active={statsInView} />
              <StatCard icon={Heart}  value={8900}  label="Lives Saved"         from="bg-teal-500"   active={statsInView} />
              <StatCard icon={Tent}   value={340}   label="Camps Organized"     from="bg-blue-500"   active={statsInView} />
              <StatCard icon={Clock}  value={98}    label="Requests Fulfilled %" suffix="%" from="bg-orange-500" active={statsInView} />
            </div>
          </div>
        </section>
 
        {/* ── COMPATIBILITY + ELIGIBILITY ──────────────── */}
        <section className="py-6 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5">
            <CompatibilityChart />
            <EligibilityChecker />
          </div>
        </section>
 
        {/* ── NEARBY CAMPS ─────────────────────────────── */}
        <section className="py-6 px-6 pb-16">
          <div className="max-w-7xl mx-auto bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
            <CampsSection />
          </div>
        </section>
 
      </div>
    </>
  );
}