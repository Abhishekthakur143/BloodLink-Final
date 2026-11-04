import { useState, useRef } from 'react';
import { createCamp } from '../api/camp';
 
const STEPS = [
  { id: 1, icon: '🏕️', label: 'Camp Info' },
  { id: 2, icon: '📍', label: 'Location & Date' },
  { id: 3, icon: '✅', label: 'Confirm' },
];
 
const WHY_CARDS = [
  { icon: '💉', title: 'Direct Impact', desc: 'Each camp can collect 50–200 units of blood in a single day.' },
  { icon: '🤝', title: 'Community Connect', desc: 'Bring donors and patients together in your neighbourhood.' },
  { icon: '🏅', title: 'Recognition', desc: 'Your camp appears on our live map — seen by thousands of donors.' },
  { icon: '⚡', title: 'Quick Setup', desc: 'Takes less than 2 minutes to register your blood drive.' },
];
 
function ProgressBar({ step }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 36, gap: 0 }}>
      {STEPS.map((s, i) => {
        const done = step > s.id;
        const active = step === s.id;
        return (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: done ? '#059669' : active ? '#0D9488' : '#E5E7EB',
                color: done || active ? '#fff' : '#9CA3AF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: done ? 18 : 16,
                fontWeight: 700,
                transition: 'all 0.3s',
                boxShadow: active ? '0 0 0 4px rgba(13,148,136,0.2)' : 'none',
              }}>
                {done ? '✓' : s.icon}
              </div>
              <span style={{
                fontSize: 11, fontWeight: 600,
                color: active ? '#0D9488' : done ? '#059669' : '#9CA3AF',
                letterSpacing: 0.3,
              }}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{
                width: 80, height: 2,
                background: done ? '#059669' : '#E5E7EB',
                margin: '0 4px', marginBottom: 22,
                transition: 'background 0.3s',
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
 
function Toast({ message, type, onClose }) {
  return (
    <div style={{
      position: 'fixed', top: 24, right: 24, zIndex: 9999,
      background: type === 'success' ? '#059669' : '#DC2626',
      color: '#fff', padding: '14px 20px', borderRadius: 12,
      fontWeight: 600, fontSize: 15,
      boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      display: 'flex', alignItems: 'center', gap: 10,
      animation: 'slideInRight 0.3s ease',
      maxWidth: 360,
    }}>
      <span>{type === 'success' ? '✅' : '❌'}</span>
      <span style={{ flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 20, padding: 0 }}>×</button>
    </div>
  );
}
 
const inputStyle = (focused) => ({
  width: '100%', padding: '12px 16px', borderRadius: 12,
  border: `1.5px solid ${focused ? '#0D9488' : '#E5E7EB'}`,
  fontSize: 14, color: '#111827', outline: 'none',
  background: '#F9FAFB', transition: 'border-color 0.2s, box-shadow 0.2s',
  boxSizing: 'border-box',
  boxShadow: focused ? '0 0 0 3px rgba(13,148,136,0.12)' : 'none',
});
 
export default function CreateCampPage() {
  const [formData, setFormData] = useState({
    title: '', description: '', organizer: '', date: '', address: '', totalSlots: 50,
  });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [focused, setFocused] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef(null);
  const heroRef = useRef(null);
 
  const set = (field, val) => setFormData(p => ({ ...p, [field]: val }));
 
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createCamp(formData);
      setToast({ message: 'Blood camp organized successfully! 🎉', type: 'success' });
      setFormData({ title: '', description: '', organizer: '', date: '', address: '', totalSlots: 50 });
      setStep(1);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 6000);
    } catch (err) {
      setToast({ message: 'Failed to create camp. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };
 
  const canNext = () => {
    if (step === 1) return formData.title.trim() && formData.description.trim() && formData.organizer.trim();
    if (step === 2) return formData.date && formData.address.trim() && formData.totalSlots >= 1;
    return true;
  };
 
  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: '#F0FDF9', minHeight: '100vh' }}>
 
      {/* ───── HERO ───── */}
      <div ref={heroRef} style={{
        background: 'linear-gradient(135deg, #042F2E 0%, #065F46 30%, #0D9488 65%, #14B8A6 100%)',
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        padding: '60px 20px',
        position: 'relative', overflow: 'hidden',
      }}>
 
        {/* Decorative grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }} />
 
        {/* Floating circles */}
        {[
          { size: 320, top: '5%', left: '-8%', delay: '0s' },
          { size: 200, bottom: '8%', right: '-4%', delay: '2s' },
          { size: 140, top: '50%', right: '12%', delay: '1s' },
        ].map((c, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: c.size, height: c.size, borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.07)',
            top: c.top, left: c.left, bottom: c.bottom, right: c.right,
            animation: `float ${6 + i}s ease-in-out infinite ${c.delay}`,
            pointerEvents: 'none',
          }} />
        ))}
 
        {/* Tent watermark */}
        <svg style={{ position: 'absolute', left: '5%', top: '15%', opacity: 0.05, pointerEvents: 'none' }}
          width="200" height="160" viewBox="0 0 200 160">
          <polygon points="100,10 10,150 190,150" fill="white" />
          <rect x="80" y="100" width="40" height="50" fill="white" />
        </svg>
 
        {/* Badge */}
        <div style={{
          background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)',
          borderRadius: 100, padding: '7px 22px', fontSize: 13,
          color: 'rgba(255,255,255,0.9)', marginBottom: 24, fontWeight: 600,
          backdropFilter: 'blur(8px)', letterSpacing: 0.8,
        }}>
          🏕️ Blood Camp Organizer Portal
        </div>
 
        <h1 style={{
          fontSize: 'clamp(32px, 5vw, 62px)',
          fontWeight: 800, color: '#fff', textAlign: 'center',
          lineHeight: 1.1, letterSpacing: '-1.5px',
          marginBottom: 18, maxWidth: 720,
        }}>
          Organize a Blood Drive.<br />
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>Create Ripples of Life.</span>
        </h1>
 
        <p style={{
          fontSize: 17, color: 'rgba(255,255,255,0.68)',
          textAlign: 'center', maxWidth: 480, lineHeight: 1.7, marginBottom: 44,
        }}>
          Set up a donation camp in your community — schools, offices, societies. Every camp you create connects donors with patients who need help now.
        </p>
 
        {/* Why organize cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 14, width: '100%', maxWidth: 780, marginBottom: 50,
        }}>
          {WHY_CARDS.map((c, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: 16, padding: '20px 18px',
              transition: 'transform 0.2s, background 0.2s',
              animation: `fadeInUp 0.4s ease ${i * 0.1}s both`,
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.background = 'rgba(255,255,255,0.16)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
            >
              <div style={{ fontSize: 28, marginBottom: 10 }}>{c.icon}</div>
              <p style={{ margin: '0 0 6px', fontWeight: 700, color: '#fff', fontSize: 14 }}>{c.title}</p>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.62)', fontSize: 12, lineHeight: 1.6 }}>{c.desc}</p>
            </div>
          ))}
        </div>
 
        {/* CTA */}
        <button
          onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}
          style={{
            background: '#fff', color: '#0D9488', border: 'none',
            borderRadius: 100, padding: '15px 36px', fontSize: 16, fontWeight: 700,
            cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 10,
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.25)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)'; }}
        >
          🏕️ Start Creating Your Camp
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M5 10h10M11 6l4 4-4 4" stroke="#0D9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
 
        {/* Scroll arrow */}
        <div onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })} style={{
          position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          color: 'rgba(255,255,255,0.4)', fontSize: 11, letterSpacing: 1.5,
          textTransform: 'uppercase', cursor: 'pointer',
          animation: 'bounce 2s ease-in-out infinite',
        }}>
          <span>Scroll</span>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M5 8L10 13L15 8" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
 
      {/* ───── FORM SECTION ───── */}
      <div ref={formRef} style={{ maxWidth: 640, margin: '0 auto', padding: '70px 20px 90px' }}>
 
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#CCFBF1', color: '#0F766E',
            borderRadius: 100, padding: '6px 18px', fontSize: 13, fontWeight: 600, marginBottom: 14,
          }}>
            🏕️ Camp Registration
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.5px' }}>
            Create Your Blood Camp
          </h2>
          <p style={{ color: '#6B7280', marginTop: 8, fontSize: 15 }}>
            Fill in the details below — takes less than 2 minutes
          </p>
        </div>
 
        {/* Success state */}
        {submitted && (
          <div style={{
            background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)',
            border: '1.5px solid #6EE7B7',
            borderRadius: 16, padding: '28px 24px',
            textAlign: 'center', marginBottom: 32,
            animation: 'scaleIn 0.3s ease',
          }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>🎉</div>
            <h3 style={{ margin: '0 0 8px', color: '#065F46', fontSize: 20, fontWeight: 800 }}>
              Camp Created Successfully!
            </h3>
            <p style={{ margin: 0, color: '#047857', fontSize: 14 }}>
              Your blood drive has been added to our live map. Donors in your area will be notified.
            </p>
          </div>
        )}
 
        {/* Form card */}
        <div style={{
          background: '#fff',
          borderRadius: 24,
          boxShadow: '0 4px 32px rgba(0,0,0,0.08)',
          border: '1px solid #F0FDF9',
          overflow: 'hidden',
        }}>
          {/* Card header */}
          <div style={{
            background: 'linear-gradient(135deg, #065F46, #0D9488)',
            padding: '24px 32px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                background: 'rgba(255,255,255,0.2)', borderRadius: 12,
                width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
              }}>
                {step === 1 ? '📝' : step === 2 ? '📍' : '✅'}
              </div>
              <div>
                <h3 style={{ margin: 0, color: '#fff', fontSize: 18, fontWeight: 700 }}>
                  {step === 1 ? 'Camp Details' : step === 2 ? 'Location & Schedule' : 'Review & Submit'}
                </h3>
                <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                  Step {step} of {STEPS.length}
                </p>
              </div>
            </div>
            {/* Mini progress pill */}
            <div style={{
              background: 'rgba(255,255,255,0.15)', borderRadius: 100,
              padding: '4px 14px', color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: 600,
            }}>
              {Math.round((step / STEPS.length) * 100)}% done
            </div>
          </div>
 
          <div style={{ padding: '32px' }}>
            <ProgressBar step={step} />
 
            <form onSubmit={onSubmit}>
              {/* Step 1 */}
              {step === 1 && (
                <div style={{ animation: 'fadeInUp 0.3s ease' }}>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 7 }}>
                      🏕️ Camp Title <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Red Cross Blood Drive 2025"
                      value={formData.title}
                      onChange={e => set('title', e.target.value)}
                      required
                      style={inputStyle(focused === 'title')}
                      onFocus={() => setFocused('title')}
                      onBlur={() => setFocused('')}
                    />
                  </div>
 
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 7 }}>
                      📋 Description <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <textarea
                      placeholder="Tell donors what this camp is about, who can participate, what to expect..."
                      value={formData.description}
                      onChange={e => set('description', e.target.value)}
                      required
                      rows={4}
                      style={{ ...inputStyle(focused === 'desc'), resize: 'vertical', minHeight: 100 }}
                      onFocus={() => setFocused('desc')}
                      onBlur={() => setFocused('')}
                    />
                  </div>
 
                  <div style={{ marginBottom: 28 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 7 }}>
                      👤 Organizer Name <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Your name or organization"
                      value={formData.organizer}
                      onChange={e => set('organizer', e.target.value)}
                      required
                      style={inputStyle(focused === 'organizer')}
                      onFocus={() => setFocused('organizer')}
                      onBlur={() => setFocused('')}
                    />
                  </div>
                </div>
              )}
 
              {/* Step 2 */}
              {step === 2 && (
                <div style={{ animation: 'fadeInUp 0.3s ease' }}>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 7 }}>
                      📅 Camp Date <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={e => set('date', e.target.value)}
                      required
                      style={inputStyle(focused === 'date')}
                      onFocus={() => setFocused('date')}
                      onBlur={() => setFocused('')}
                    />
                  </div>
 
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 7 }}>
                      📍 Full Address <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Street, Area, City, Pincode"
                      value={formData.address}
                      onChange={e => set('address', e.target.value)}
                      required
                      style={inputStyle(focused === 'address')}
                      onFocus={() => setFocused('address')}
                      onBlur={() => setFocused('')}
                    />
                  </div>
 
                  <div style={{ marginBottom: 28 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 7 }}>
                      🪑 Total Donor Slots <span style={{ color: '#DC2626' }}>*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="e.g., 50"
                      min="1"
                      value={formData.totalSlots}
                      onChange={e => set('totalSlots', e.target.value)}
                      required
                      style={inputStyle(focused === 'slots')}
                      onFocus={() => setFocused('slots')}
                      onBlur={() => setFocused('')}
                    />
                    <p style={{ margin: '6px 0 0', fontSize: 12, color: '#9CA3AF' }}>
                      Recommended: 50 slots minimum for a meaningful impact
                    </p>
                  </div>
                </div>
              )}
 
              {/* Step 3 — Review */}
              {step === 3 && (
                <div style={{ animation: 'fadeInUp 0.3s ease' }}>
                  <div style={{
                    background: '#F0FDF9', borderRadius: 14,
                    border: '1.5px solid #CCFBF1', padding: '20px 22px', marginBottom: 28,
                  }}>
                    <h4 style={{ margin: '0 0 16px', color: '#065F46', fontSize: 15, fontWeight: 700 }}>
                      📋 Camp Summary
                    </h4>
                    {[
                      { label: '🏕️ Title', val: formData.title },
                      { label: '👤 Organizer', val: formData.organizer },
                      { label: '📅 Date', val: formData.date ? new Date(formData.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—' },
                      { label: '📍 Address', val: formData.address },
                      { label: '🪑 Slots', val: `${formData.totalSlots} donors` },
                    ].map((row, i) => (
                      <div key={i} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                        padding: '8px 0', borderBottom: i < 4 ? '1px solid #CCFBF1' : 'none',
                        gap: 12,
                      }}>
                        <span style={{ fontSize: 13, color: '#6B7280', fontWeight: 500, flexShrink: 0 }}>{row.label}</span>
                        <span style={{ fontSize: 13, color: '#111827', fontWeight: 600, textAlign: 'right' }}>{row.val || '—'}</span>
                      </div>
                    ))}
                  </div>
 
                  {/* Description preview */}
                  <div style={{ background: '#F9FAFB', borderRadius: 12, padding: '14px 16px', marginBottom: 28 }}>
                    <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                      Description
                    </p>
                    <p style={{ margin: 0, fontSize: 14, color: '#374151', lineHeight: 1.6 }}>
                      {formData.description}
                    </p>
                  </div>
 
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%',
                      background: loading
                        ? '#6EE7B7'
                        : 'linear-gradient(135deg, #065F46, #0D9488)',
                      color: '#fff', border: 'none', borderRadius: 14,
                      padding: '15px', fontSize: 16, fontWeight: 700,
                      cursor: loading ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                      transition: 'all 0.2s',
                      boxShadow: loading ? 'none' : '0 4px 18px rgba(13,148,136,0.35)',
                    }}
                    onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    {loading
                      ? <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span> Creating Camp...</>
                      : '🏕️ Create Blood Camp'}
                  </button>
                </div>
              )}
 
              {/* Navigation buttons */}
              {step < 3 && (
                <div style={{ display: 'flex', justifyContent: step > 1 ? 'space-between' : 'flex-end', marginTop: 8 }}>
                  {step > 1 && (
                    <button type="button" onClick={() => setStep(s => s - 1)} style={{
                      padding: '11px 24px', borderRadius: 12,
                      border: '1.5px solid #E5E7EB', background: '#fff',
                      color: '#374151', fontSize: 14, fontWeight: 600,
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                      onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                    >
                      ← Back
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={!canNext()}
                    onClick={() => setStep(s => s + 1)}
                    style={{
                      padding: '11px 28px', borderRadius: 12, border: 'none',
                      background: canNext()
                        ? 'linear-gradient(135deg, #065F46, #0D9488)'
                        : '#D1D5DB',
                      color: canNext() ? '#fff' : '#9CA3AF',
                      fontSize: 14, fontWeight: 700,
                      cursor: canNext() ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s',
                      boxShadow: canNext() ? '0 4px 14px rgba(13,148,136,0.3)' : 'none',
                    }}
                    onMouseEnter={e => { if (canNext()) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    Next Step →
                  </button>
                </div>
              )}
              {step === 3 && (
                <div style={{ marginTop: 12, textAlign: 'center' }}>
                  <button type="button" onClick={() => setStep(2)} style={{
                    background: 'none', border: 'none', color: '#0D9488',
                    fontSize: 14, fontWeight: 600, cursor: 'pointer',
                    textDecoration: 'underline',
                  }}>
                    ← Edit details
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
 
        {/* Trust note */}
        <div style={{
          marginTop: 28, textAlign: 'center',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, flexWrap: 'wrap',
        }}>
          {['🔒 Secure & Verified', '📧 Instant Confirmation', '🗺️ Listed on Live Map'].map((t, i) => (
            <span key={i} style={{ fontSize: 13, color: '#6B7280', fontWeight: 500 }}>{t}</span>
          ))}
        </div>
      </div>
 
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
 
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(3deg); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        * { box-sizing: border-box; }
        input::placeholder, textarea::placeholder { color: #9CA3AF; }
      `}</style>
    </div>
  );
}