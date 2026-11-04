import { useState, useEffect, useRef } from 'react';
import { addStock, getInventory } from '../api/inventory';
 
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
 
const bloodGroupColors = {
  'A+': { bg: '#FEE2E2', text: '#991B1B', border: '#FCA5A5' },
  'A-': { bg: '#FFE4E6', text: '#9F1239', border: '#FDA4AF' },
  'B+': { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
  'B-': { bg: '#FEF9C3', text: '#854D0E', border: '#FDE047' },
  'AB+': { bg: '#EDE9FE', text: '#5B21B6', border: '#C4B5FD' },
  'AB-': { bg: '#F5F3FF', text: '#4C1D95', border: '#DDD6FE' },
  'O+':  { bg: '#DCFCE7', text: '#166534', border: '#86EFAC' },
  'O-':  { bg: '#F0FDF4', text: '#14532D', border: '#4ADE80' },
};
 
const STATS = [
  { icon: '🏥', value: '240+', label: 'Hospitals Connected' },
  { icon: '🩸', value: '18,500', label: 'Units Stocked' },
  { icon: '💉', value: '3,200', label: 'Lives Saved' },
  { icon: '⚡', value: '< 2 hrs', label: 'Avg Response Time' },
];
 
function useCountUp(target, duration = 1500, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const numeric = parseInt(target.toString().replace(/[^0-9]/g, '')) || 0;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setVal(Math.floor(progress * numeric));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  const str = target.toString();
  const suffix = str.replace(/[0-9,]/g, '').replace(/^[0-9]/, '');
  return val.toLocaleString() + suffix;
}
 
function StatCard({ icon, value, label, animate }) {
  const displayed = useCountUp(value, 1400, animate);
  return (
    <div style={{
      background: 'rgba(255,255,255,0.13)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.25)',
      borderRadius: 16,
      padding: '22px 20px',
      textAlign: 'center',
      transition: 'transform 0.2s, background 0.2s',
      cursor: 'default',
    }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ fontSize: 32, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px' }}>{displayed}</div>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>{label}</div>
    </div>
  );
}
 
export default function HospitalDashboardPage() {
  const [inventory, setInventory] = useState([]);
  const [formData, setFormData] = useState({ organization: '', bloodGroup: 'A+', units: 1, expiryDate: '' });
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [inventoryLoading, setInventoryLoading] = useState(true);
  const [statsVisible, setStatsVisible] = useState(false);
  const [filterGroup, setFilterGroup] = useState('All');
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const dashRef = useRef(null);
 
  useEffect(() => {
    fetchInventory();
  }, []);
 
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);
 
  const fetchInventory = async () => {
    setInventoryLoading(true);
    try {
      const res = await getInventory();
      setInventory(res.data.data);
    } catch (err) {
      console.error('Failed to fetch inventory');
    } finally {
      setInventoryLoading(false);
    }
  };
 
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus(null);
    try {
      await addStock(formData);
      setFormData({ organization: '', bloodGroup: 'A+', units: 1, expiryDate: '' });
      setSubmitStatus('success');
      fetchInventory();
      setTimeout(() => setSubmitStatus(null), 3500);
    } catch (err) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 3500);
    } finally {
      setLoading(false);
    }
  };
 
  const scrollToDashboard = () => {
    dashRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
 
  const filtered = filterGroup === 'All' ? inventory : inventory.filter(i => i.bloodGroup === filterGroup);
 
  const totalUnits = inventory.reduce((s, i) => s + (Number(i.units) || 0), 0);
  const criticalCount = inventory.filter(i => Number(i.units) < 5).length;
 
  const getExpirySeverity = (dateStr) => {
    const days = Math.ceil((new Date(dateStr) - new Date()) / 86400000);
    if (days <= 7) return { color: '#DC2626', label: 'Critical' };
    if (days <= 30) return { color: '#D97706', label: 'Soon' };
    return { color: '#059669', label: 'Good' };
  };
 
  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: '#F9FAFB', minHeight: '100vh' }}>
 
      {/* ───── HERO / HOME SECTION ───── */}
      <div ref={heroRef} style={{
        background: 'linear-gradient(135deg, #7F1D1D 0%, #DC2626 40%, #EF4444 70%, #B91C1C 100%)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background pulse rings */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 600, height: 600,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.06)',
          animation: 'pulse-ring 4s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 900, height: 900,
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.04)',
          animation: 'pulse-ring 4s ease-in-out infinite 1.5s',
          pointerEvents: 'none',
        }} />
 
        {/* Blood drop SVG watermark */}
        <svg style={{ position: 'absolute', right: '8%', top: '10%', opacity: 0.07, pointerEvents: 'none' }}
          width="260" height="340" viewBox="0 0 260 340">
          <path d="M130 10 C130 10 10 160 10 220 C10 283 65 330 130 330 C195 330 250 283 250 220 C250 160 130 10 130 10Z" fill="white" />
        </svg>
 
        {/* Hospital badge */}
        <div style={{
          background: 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: 100,
          padding: '6px 20px',
          fontSize: 13,
          color: 'rgba(255,255,255,0.9)',
          marginBottom: 28,
          letterSpacing: 1,
          textTransform: 'uppercase',
          fontWeight: 600,
          backdropFilter: 'blur(8px)',
        }}>
          🏥 Hospital Blood Bank Management
        </div>
 
        {/* Main heading */}
        <h1 style={{
          fontSize: 'clamp(36px, 6vw, 68px)',
          fontWeight: 800,
          color: '#fff',
          textAlign: 'center',
          lineHeight: 1.1,
          marginBottom: 20,
          letterSpacing: '-1.5px',
          maxWidth: 780,
        }}>
          Manage Blood Inventory<br />
          <span style={{ color: 'rgba(255,255,255,0.6)' }}>Save Lives, Every Day</span>
        </h1>
 
        <p style={{
          fontSize: 18,
          color: 'rgba(255,255,255,0.75)',
          textAlign: 'center',
          maxWidth: 520,
          lineHeight: 1.7,
          marginBottom: 40,
        }}>
          Real-time blood stock tracking, expiry monitoring, and instant availability — all in one powerful hospital dashboard.
        </p>
 
        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 60 }}>
          <button onClick={scrollToDashboard} style={{
            background: '#fff',
            color: '#DC2626',
            border: 'none',
            borderRadius: 100,
            padding: '14px 32px',
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.25)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)'; }}
          >
            🩸 Manage Inventory
          </button>
          <button onClick={scrollToDashboard} style={{
            background: 'transparent',
            color: '#fff',
            border: '2px solid rgba(255,255,255,0.5)',
            borderRadius: 100,
            padding: '14px 32px',
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.8)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; }}
          >
            ➕ Add New Stock
          </button>
        </div>
 
        {/* Stats row */}
        <div ref={statsRef} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 16,
          width: '100%',
          maxWidth: 860,
        }}>
          {STATS.map((s, i) => (
            <StatCard key={i} icon={s.icon} value={s.value} label={s.label} animate={statsVisible} />
          ))}
        </div>
 
        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          color: 'rgba(255,255,255,0.5)', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase',
          animation: 'bounce 2s ease-in-out infinite',
          cursor: 'pointer',
        }} onClick={scrollToDashboard}>
          <span>Scroll</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 8L10 13L15 8" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
 
      {/* ───── DASHBOARD SECTION ───── */}
      <div ref={dashRef} style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 20px 80px' }}>
 
        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#FEE2E2', color: '#991B1B', borderRadius: 100, padding: '6px 18px', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
            🏥 Hospital Dashboard
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.5px' }}>
            Blood Stock Control Center
          </h2>
          <p style={{ color: '#6B7280', marginTop: 10, fontSize: 16 }}>
            Monitor, manage and update your hospital's blood inventory in real-time
          </p>
        </div>
 
        {/* Quick stat chips */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 40 }}>
          {[
            { label: 'Total Stock', val: `${totalUnits} units`, color: '#DC2626', bg: '#FEE2E2' },
            { label: 'Blood Types', val: `${new Set(inventory.map(i => i.bloodGroup)).size} types`, color: '#7C3AED', bg: '#EDE9FE' },
            { label: 'Critical Low', val: `${criticalCount} items`, color: criticalCount > 0 ? '#D97706' : '#059669', bg: criticalCount > 0 ? '#FEF3C7' : '#DCFCE7' },
          ].map((chip, i) => (
            <div key={i} style={{
              background: chip.bg, color: chip.color,
              borderRadius: 100, padding: '8px 20px',
              fontSize: 14, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ opacity: 0.7, fontSize: 12 }}>{chip.label}</span>
              <span>{chip.val}</span>
            </div>
          ))}
        </div>
 
        {/* Toast notifications */}
        {submitStatus && (
          <div style={{
            position: 'fixed', top: 24, right: 24, zIndex: 9999,
            background: submitStatus === 'success' ? '#059669' : '#DC2626',
            color: '#fff',
            padding: '14px 24px',
            borderRadius: 12,
            fontWeight: 600,
            fontSize: 15,
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            display: 'flex', alignItems: 'center', gap: 10,
            animation: 'slideInRight 0.35s ease',
          }}>
            <span>{submitStatus === 'success' ? '✅' : '❌'}</span>
            {submitStatus === 'success' ? 'Blood stock added successfully!' : 'Failed to add stock. Please try again.'}
          </div>
        )}
 
        {/* Main layout */}
        <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap' }}>
 
          {/* ── ADD STOCK FORM ── */}
          <div style={{
            flex: '0 0 340px',
            background: '#fff',
            borderRadius: 20,
            boxShadow: '0 2px 24px rgba(0,0,0,0.07)',
            border: '1px solid #F3F4F6',
            overflow: 'hidden',
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #DC2626, #EF4444)',
              padding: '24px 28px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 10, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                  ➕
                </div>
                <div>
                  <h3 style={{ margin: 0, color: '#fff', fontSize: 18, fontWeight: 700 }}>Add Blood Stock</h3>
                  <p style={{ margin: 0, color: 'rgba(255,255,255,0.75)', fontSize: 13 }}>Update inventory records</p>
                </div>
              </div>
            </div>
 
            <form onSubmit={onSubmit} style={{ padding: '28px' }}>
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  🏥 Hospital Name
                </label>
                <input
                  type="text"
                  placeholder="Enter hospital name"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  required
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: 10,
                    border: '1.5px solid #E5E7EB', fontSize: 14, color: '#111827',
                    outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
                    background: '#F9FAFB',
                  }}
                  onFocus={e => e.target.style.borderColor = '#DC2626'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>
 
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  🩸 Blood Group
                </label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: 10,
                    border: '1.5px solid #E5E7EB', fontSize: 14, color: '#111827',
                    outline: 'none', background: '#F9FAFB', cursor: 'pointer',
                    transition: 'border-color 0.2s', boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = '#DC2626'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                >
                  {BLOOD_GROUPS.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
 
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  📦 Units Available
                </label>
                <input
                  type="number"
                  placeholder="Enter units"
                  min="1"
                  value={formData.units}
                  onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                  required
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: 10,
                    border: '1.5px solid #E5E7EB', fontSize: 14, color: '#111827',
                    outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
                    background: '#F9FAFB',
                  }}
                  onFocus={e => e.target.style.borderColor = '#DC2626'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>
 
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  📅 Expiry Date
                </label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  required
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: 10,
                    border: '1.5px solid #E5E7EB', fontSize: 14, color: '#111827',
                    outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
                    background: '#F9FAFB',
                  }}
                  onFocus={e => e.target.style.borderColor = '#DC2626'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>
 
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  background: loading ? '#FCA5A5' : 'linear-gradient(135deg, #DC2626, #EF4444)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 12,
                  padding: '13px',
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'all 0.2s',
                  boxShadow: loading ? 'none' : '0 4px 14px rgba(220,38,38,0.35)',
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                {loading ? (
                  <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span> Adding...</>
                ) : '➕ Add Stock'}
              </button>
            </form>
          </div>
 
          {/* ── INVENTORY LIST ── */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              background: '#fff',
              borderRadius: 20,
              boxShadow: '0 2px 24px rgba(0,0,0,0.07)',
              border: '1px solid #F3F4F6',
              overflow: 'hidden',
            }}>
              <div style={{ padding: '24px 28px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ background: '#FEE2E2', borderRadius: 10, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                    🩸
                  </div>
                  <div>
                    <h3 style={{ margin: 0, color: '#111827', fontSize: 18, fontWeight: 700 }}>Available Blood Stock</h3>
                    <p style={{ margin: 0, color: '#9CA3AF', fontSize: 13 }}>{inventory.length} entries found</p>
                  </div>
                </div>
 
                {/* Blood group filter */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {['All', ...BLOOD_GROUPS].map(g => (
                    <button key={g} onClick={() => setFilterGroup(g)} style={{
                      padding: '5px 12px', borderRadius: 100, fontSize: 12, fontWeight: 600,
                      border: '1.5px solid',
                      borderColor: filterGroup === g ? '#DC2626' : '#E5E7EB',
                      background: filterGroup === g ? '#DC2626' : '#fff',
                      color: filterGroup === g ? '#fff' : '#6B7280',
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
 
              <div style={{ padding: '20px 28px' }}>
                {inventoryLoading ? (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: '#9CA3AF' }}>
                    <div style={{ fontSize: 40, animation: 'pulse 1.5s ease-in-out infinite', marginBottom: 16 }}>🩸</div>
                    <p style={{ fontWeight: 500 }}>Loading blood inventory...</p>
                  </div>
                ) : filtered.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 0' }}>
                    <div style={{ fontSize: 56, marginBottom: 16 }}>🏥</div>
                    <p style={{ fontWeight: 700, fontSize: 17, color: '#374151', margin: 0 }}>No stock available</p>
                    <p style={{ color: '#9CA3AF', fontSize: 14, marginTop: 6 }}>
                      {filterGroup !== 'All' ? `No ${filterGroup} blood type found.` : 'Add your first blood stock entry using the form.'}
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
                    {filtered.map((item, idx) => {
                      const colors = bloodGroupColors[item.bloodGroup] || { bg: '#F3F4F6', text: '#374151', border: '#D1D5DB' };
                      const expiry = getExpirySeverity(item.expiryDate);
                      const isLow = Number(item.units) < 5;
                      return (
                        <div key={item._id} style={{
                          background: '#FAFAFA',
                          border: '1px solid #F3F4F6',
                          borderRadius: 14,
                          padding: '18px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          transition: 'all 0.2s',
                          animation: `fadeInUp 0.35s ease ${idx * 0.04}s both`,
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.09)'; e.currentTarget.style.borderColor = colors.border; }}
                          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#F3F4F6'; }}
                        >
                          {/* Left accent */}
                          <div style={{
                            position: 'absolute', left: 0, top: 0, bottom: 0,
                            width: 4, background: colors.text, borderRadius: '14px 0 0 14px',
                          }} />
 
                          <div style={{ paddingLeft: 8 }}>
                            <div style={{
                              display: 'inline-block',
                              background: colors.bg, color: colors.text,
                              borderRadius: 10, padding: '4px 12px',
                              fontSize: 22, fontWeight: 800,
                              marginBottom: 6,
                              border: `1px solid ${colors.border}`,
                            }}>
                              {item.bloodGroup}
                            </div>
                            <p style={{ margin: 0, fontSize: 13, color: '#6B7280', fontWeight: 500 }}>
                              🏥 {item.organization || 'N/A'}
                            </p>
                          </div>
 
                          <div style={{ textAlign: 'right' }}>
                            <p style={{
                              margin: 0, fontSize: 22, fontWeight: 800,
                              color: isLow ? '#DC2626' : '#111827',
                            }}>
                              {item.units}
                              <span style={{ fontSize: 12, fontWeight: 500, color: '#9CA3AF', marginLeft: 3 }}>units</span>
                            </p>
                            {isLow && (
                              <span style={{ background: '#FEF3C7', color: '#92400E', fontSize: 11, fontWeight: 700, borderRadius: 100, padding: '2px 8px', display: 'inline-block', marginBottom: 4 }}>
                                ⚠ Low Stock
                              </span>
                            )}
                            <p style={{ margin: 0, fontSize: 11, color: expiry.color, fontWeight: 600 }}>
                              ● {expiry.label} · {new Date(item.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
 
      {/* ───── CSS ANIMATIONS ───── */}
      <style>{`
        @keyframes pulse-ring {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          50% { transform: translate(-50%, -50%) scale(1.08); opacity: 1; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(8px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.95); }
        }
        * { box-sizing: border-box; }
        input::placeholder { color: #9CA3AF; }
        input:focus, select:focus { border-color: #DC2626 !important; }
        @media (max-width: 768px) {
          .main-layout { flex-direction: column !important; }
        }
      `}</style>
    </div>
  );
}