import { useState, useEffect } from 'react';
import { getAdminStats, getAdminUsers, getBloodStats } from '../api/admin';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  Users, Droplet, Clock, Tent, Package, TrendingUp,
  ShieldAlert, ChevronRight, Trash2, RefreshCw, AlertTriangle
} from 'lucide-react';
 
// ─── TOKEN HELPER ──────────────────────────────────────────────────────────────
const token = () => localStorage.getItem('token');
const authHeader = () => ({ Authorization: `Bearer ${token()}` });
 
// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3800);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div style={{
      position: 'fixed', top: 24, right: 24, zIndex: 9999,
      background: type === 'success' ? '#059669' : '#DC2626',
      color: '#fff', padding: '13px 20px', borderRadius: 12,
      fontWeight: 600, fontSize: 14,
      boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      display: 'flex', alignItems: 'center', gap: 10,
      animation: 'slideInRight 0.3s ease', maxWidth: 360,
    }}>
      <span>{type === 'success' ? '✅' : '❌'}</span>
      <span style={{ flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 20, padding: 0 }}>×</button>
    </div>
  );
}
 
// ─── CONFIRM MODAL ─────────────────────────────────────────────────────────────
function ConfirmModal({ data, onConfirm, onCancel }) {
  if (!data) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 10000, animation: 'fadeIn 0.2s ease',
    }}>
      <div style={{
        background: '#fff', borderRadius: 20, padding: '32px 28px',
        maxWidth: 400, width: '90%', textAlign: 'center',
        boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
        animation: 'scaleIn 0.25s ease',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: '#FEE2E2', display: 'flex', alignItems: 'center',
          justifyContent: 'center', margin: '0 auto 16px',
        }}>
          <AlertTriangle size={24} color="#DC2626" />
        </div>
        <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 800, color: '#111827' }}>
          {data.type === 'all' ? 'Delete All Ended Camps?' : 'Delete This Camp?'}
        </h3>
        <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.6, margin: '0 0 6px' }}>
          {data.type === 'all'
            ? `This will permanently remove all ${data.count} ended camp(s) and their registration records.`
            : `"${data.camp?.title}" will be permanently deleted along with all registrations.`}
        </p>
        <p style={{ color: '#DC2626', fontSize: 13, fontWeight: 600, marginBottom: 24 }}>
          This action cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: '11px', borderRadius: 12,
            border: '1.5px solid #E5E7EB', background: '#fff',
            color: '#374151', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            transition: 'background 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
          >Cancel</button>
          <button onClick={onConfirm} style={{
            flex: 1, padding: '11px', borderRadius: 12, border: 'none',
            background: 'linear-gradient(135deg, #DC2626, #EF4444)',
            color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(220,38,38,0.3)',
          }}>Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}
 
// ─── CAMP ROW ──────────────────────────────────────────────────────────────────
function CampRow({ camp, isEnded, isDeleting, onDelete }) {
  const slotsLeft = camp.totalSlots - (camp.bookedSlots || 0);
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      flexWrap: 'wrap', gap: 10,
      padding: '14px 16px',
      background: isEnded ? '#FFFBFB' : '#FAFFFE',
      border: `1px solid ${isEnded ? '#FEE2E2' : '#D1FAE5'}`,
      borderLeft: `3px solid ${isEnded ? '#DC2626' : '#059669'}`,
      borderRadius: 10, marginBottom: 8,
      transition: 'all 0.2s',
      opacity: isEnded ? 0.88 : 1,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: isEnded ? '#9CA3AF' : '#111827' }}>
            {camp.title}
          </span>
          <span style={{
            background: isEnded ? '#FEE2E2' : '#DCFCE7',
            color: isEnded ? '#991B1B' : '#166534',
            borderRadius: 100, padding: '1px 9px',
            fontSize: 10, fontWeight: 700, letterSpacing: 0.4,
          }}>
            {isEnded ? 'ENDED' : 'UPCOMING'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {[
            { icon: '📅', text: new Date(camp.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
            { icon: '📍', text: camp.address },
            { icon: '🪑', text: `${slotsLeft}/${camp.totalSlots} slots left` },
          ].map((item, i) => (
            <span key={i} style={{ fontSize: 12, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 3 }}>
              {item.icon} {item.text}
            </span>
          ))}
        </div>
      </div>
      {isEnded && onDelete && (
        <button onClick={onDelete} disabled={isDeleting} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '7px 14px', borderRadius: 9, border: 'none',
          background: isDeleting ? '#FCA5A5' : '#FEE2E2',
          color: isDeleting ? '#9CA3AF' : '#DC2626',
          fontSize: 13, fontWeight: 700,
          cursor: isDeleting ? 'not-allowed' : 'pointer',
          transition: 'all 0.15s', flexShrink: 0,
        }}
          onMouseEnter={e => { if (!isDeleting) { e.currentTarget.style.background = '#DC2626'; e.currentTarget.style.color = '#fff'; } }}
          onMouseLeave={e => { e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.color = '#DC2626'; }}
        >
          <Trash2 size={13} />
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      )}
    </div>
  );
}
 
// ─── MAIN DASHBOARD ────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'camps' | 'users'
 
  // Camp manager state
  const [camps, setCamps] = useState([]);
  const [campsLoading, setCampsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deletingAll, setDeletingAll] = useState(false);
  const [marking, setMarking] = useState(false);
  const [confirmData, setConfirmData] = useState(null);
  const [toast, setToast] = useState(null);
 
  useEffect(() => {
    fetchDashboardData();
  }, []);
 
  useEffect(() => {
    if (activeTab === 'camps') fetchAllCamps();
  }, [activeTab]);
 
  const fetchDashboardData = async () => {
    try {
      const [statsRes, usersRes, chartRes] = await Promise.all([
        getAdminStats(),
        getAdminUsers(),
        getBloodStats(),
      ]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data);
      setChartData(chartRes.data.data.map(item => ({ name: item._id, requests: item.count })));
    } catch (err) {
      console.error('Failed to fetch admin data');
    }
  };
 
  const fetchAllCamps = async () => {
    setCampsLoading(true);
    try {
      const res = await axios.get('/api/camps/admin/all', { headers: authHeader() });
      setCamps(res.data.data);
    } catch (err) {
      showToast('Failed to load camps', 'error');
    } finally {
      setCampsLoading(false);
    }
  };
 
  const markEndedCamps = async () => {
    setMarking(true);
    try {
      const res = await axios.post('/api/camps/mark-ended', {}, { headers: authHeader() });
      showToast(res.data.message, 'success');
      fetchAllCamps();
    } catch (err) {
      showToast('Failed to mark ended camps', 'error');
    } finally {
      setMarking(false);
    }
  };
 
  const deleteCamp = async (campId) => {
    setDeletingId(campId);
    try {
      await axios.delete(`/api/camps/admin/delete-ended/${campId}`, { headers: authHeader() });
      showToast('Camp deleted successfully', 'success');
      fetchAllCamps();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to delete camp', 'error');
    } finally {
      setDeletingId(null);
      setConfirmData(null);
    }
  };
 
  const deleteAllEnded = async () => {
    setDeletingAll(true);
    try {
      const res = await axios.delete('/api/camps/admin/delete-all-ended', { headers: authHeader() });
      showToast(res.data.message, 'success');
      fetchAllCamps();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to delete ended camps', 'error');
    } finally {
      setDeletingAll(false);
      setConfirmData(null);
    }
  };
 
  const showToast = (message, type) => {
    setToast({ message, type });
  };
 
  const endedCamps = camps.filter(c => c.status === 'ended');
  const upcomingCamps = camps.filter(c => c.status === 'upcoming');
 
  // ── Loading state
  if (!stats) return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      minHeight: '70vh', gap: 16,
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        border: '3px solid #FEE2E2', borderTopColor: '#DC2626',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ color: '#6B7280', fontSize: 14, fontWeight: 500 }}>Loading Admin Dashboard...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
 
  const STAT_CARDS = [
    { to: '/admin', label: 'Total Users', value: stats.totalUsers, icon: <Users size={16} />, color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
    { to: '/search-requests', label: 'Total Requests', value: stats.totalRequests, icon: <Droplet size={16} />, color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
    { to: '/search-requests', label: 'Pending', value: stats.pendingRequests, icon: <Clock size={16} />, color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
    { to: '/camps', label: 'Total Camps', value: stats.totalCamps, icon: <Tent size={16} />, color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
    { to: '/hospital-dashboard', label: 'Blood Stock', value: stats.totalStock, icon: <Package size={16} />, color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
  ];
 
  const TABS = [
    { id: 'overview', label: 'Overview', icon: <TrendingUp size={15} /> },
    { id: 'camps', label: 'Manage Camps', icon: <Tent size={15} /> },
    { id: 'users', label: 'Users', icon: <Users size={15} /> },
  ];
 
  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, sans-serif",
      background: '#F8FAFC',
      minHeight: '100vh',
    }}>
      {/* ── Top header bar ── */}
      <div style={{
        background: '#fff',
        borderBottom: '1px solid #F1F5F9',
        padding: '0 32px',
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          height: 64,
        }}>
          {/* Logo / title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #DC2626, #EF4444)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ShieldAlert size={18} color="#fff" />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.3px' }}>
                BloodLink Admin
              </p>
              <p style={{ margin: 0, fontSize: 11, color: '#94A3B8' }}>Control Panel</p>
            </div>
          </div>
 
          {/* Tab nav */}
          <div style={{ display: 'flex', gap: 4 }}>
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', borderRadius: 9, border: 'none',
                background: activeTab === tab.id ? '#FEF2F2' : 'transparent',
                color: activeTab === tab.id ? '#DC2626' : '#64748B',
                fontSize: 13, fontWeight: activeTab === tab.id ? 700 : 500,
                cursor: 'pointer', transition: 'all 0.15s',
              }}>
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
 
          {/* Date badge */}
          <div style={{
            background: '#F8FAFC', border: '1px solid #E2E8F0',
            borderRadius: 8, padding: '6px 14px',
            fontSize: 12, color: '#64748B', fontWeight: 500,
          }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </div>
      </div>
 
      {/* ── Page content ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 60px' }}>
 
        {/* ── Stat cards (always visible) ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: 14, marginBottom: 28,
        }}>
          {STAT_CARDS.map((card, i) => (
            <Link key={i} to={card.to} style={{
              textDecoration: 'none',
              background: '#fff',
              border: `1px solid ${card.border}`,
              borderRadius: 14, padding: '18px',
              display: 'flex', flexDirection: 'column', gap: 14,
              transition: 'all 0.2s',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: card.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: card.color,
                }}>
                  {card.icon}
                </div>
                <ChevronRight size={14} color={card.color} style={{ opacity: 0.5 }} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color: card.color, letterSpacing: '-0.5px' }}>
                  {card.value}
                </p>
                <p style={{ margin: '3px 0 0', fontSize: 12, fontWeight: 500, color: '#94A3B8' }}>
                  {card.label}
                </p>
              </div>
            </Link>
          ))}
        </div>
 
        {/* ══════════════ TAB: OVERVIEW ══════════════ */}
        {activeTab === 'overview' && (
          <div style={{ animation: 'fadeInUp 0.3s ease' }}>
 
            {/* Chart */}
            <div style={{
              background: '#fff', borderRadius: 16,
              border: '1px solid #F1F5F9',
              padding: '24px', marginBottom: 24,
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 9,
                  background: '#FEF2F2', display: 'flex', alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <TrendingUp size={16} color="#DC2626" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Blood Request Analytics</p>
                  <p style={{ margin: 0, fontSize: 12, color: '#94A3B8' }}>Requests by blood group</p>
                </div>
              </div>
              <div style={{ width: '100%', height: 280 }}>
                <ResponsiveContainer>
                  <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: '1px solid #F1F5F9', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', fontSize: 13 }}
                      cursor={{ fill: '#FEF2F2' }}
                    />
                    <Bar dataKey="requests" fill="#DC2626" radius={[6, 6, 0, 0]} maxBarSize={44} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
 
            {/* Quick stats strip */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 14,
            }}>
              {[
                { label: 'Upcoming Camps', value: stats.totalCamps, icon: '🏕️', note: 'Active registrations open' },
                { label: 'Blood Stock Units', value: stats.totalStock, icon: '🩸', note: 'Across all hospitals' },
                { label: 'Pending Requests', value: stats.pendingRequests, icon: '⏳', note: 'Awaiting donor match' },
              ].map((item, i) => (
                <div key={i} style={{
                  background: '#fff', borderRadius: 14,
                  border: '1px solid #F1F5F9',
                  padding: '18px 20px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  display: 'flex', alignItems: 'center', gap: 14,
                }}>
                  <span style={{ fontSize: 28 }}>{item.icon}</span>
                  <div>
                    <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#0F172A' }}>{item.value}</p>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#374151' }}>{item.label}</p>
                    <p style={{ margin: 0, fontSize: 11, color: '#94A3B8' }}>{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
 
        {/* ══════════════ TAB: CAMPS ══════════════ */}
        {activeTab === 'camps' && (
          <div style={{ animation: 'fadeInUp 0.3s ease' }}>
 
            {/* Camp toolbar */}
            <div style={{
              background: '#fff', borderRadius: 14,
              border: '1px solid #F1F5F9',
              padding: '18px 20px', marginBottom: 20,
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', flexWrap: 'wrap', gap: 12,
            }}>
              <div>
                <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0F172A' }}>🏕️ Camp Management</p>
                <p style={{ margin: '3px 0 0', fontSize: 12, color: '#94A3B8' }}>
                  {upcomingCamps.length} upcoming · {endedCamps.length} ended
                </p>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button onClick={markEndedCamps} disabled={marking} style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '9px 16px', borderRadius: 10,
                  border: '1.5px solid #E2E8F0', background: '#fff',
                  color: '#374151', fontSize: 13, fontWeight: 600,
                  cursor: marking ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s',
                }}
                  onMouseEnter={e => { if (!marking) e.currentTarget.style.background = '#F8FAFC'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
                >
                  <RefreshCw size={14} style={{ animation: marking ? 'spin 1s linear infinite' : 'none' }} />
                  {marking ? 'Marking...' : 'Mark Ended Camps'}
                </button>
 
                {endedCamps.length > 0 && (
                  <button
                    onClick={() => setConfirmData({ type: 'all', count: endedCamps.length })}
                    disabled={deletingAll}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 7,
                      padding: '9px 16px', borderRadius: 10, border: 'none',
                      background: deletingAll ? '#FCA5A5' : '#DC2626',
                      color: '#fff', fontSize: 13, fontWeight: 700,
                      cursor: deletingAll ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 12px rgba(220,38,38,0.25)',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { if (!deletingAll) e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <Trash2 size={14} />
                    Delete All Ended ({endedCamps.length})
                  </button>
                )}
              </div>
            </div>
 
            {/* Camp list */}
            {campsLoading ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#94A3B8' }}>
                <div style={{ fontSize: 36, marginBottom: 12, animation: 'pulse 1.5s ease-in-out infinite' }}>🏕️</div>
                <p style={{ fontWeight: 500 }}>Loading camps...</p>
              </div>
            ) : camps.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '60px 20px',
                background: '#fff', borderRadius: 14,
                border: '1px solid #F1F5F9',
              }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>🏕️</div>
                <p style={{ fontWeight: 700, color: '#374151', margin: 0 }}>No camps found</p>
                <p style={{ color: '#94A3B8', fontSize: 13, marginTop: 6 }}>
                  No camps have been created yet.
                </p>
              </div>
            ) : (
              <div>
                {/* Ended section */}
                {endedCamps.length > 0 && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <span style={{
                        background: '#FEE2E2', color: '#991B1B',
                        borderRadius: 100, padding: '3px 12px',
                        fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
                      }}>
                        ENDED · {endedCamps.length}
                      </span>
                      <div style={{ flex: 1, height: 1, background: '#FEE2E2' }} />
                    </div>
                    {endedCamps.map(camp => (
                      <CampRow
                        key={camp._id}
                        camp={camp}
                        isEnded
                        isDeleting={deletingId === camp._id}
                        onDelete={() => setConfirmData({ type: 'single', camp })}
                      />
                    ))}
                  </div>
                )}
 
                {/* Upcoming section */}
                {upcomingCamps.length > 0 && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <span style={{
                        background: '#DCFCE7', color: '#166534',
                        borderRadius: 100, padding: '3px 12px',
                        fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
                      }}>
                        UPCOMING · {upcomingCamps.length}
                      </span>
                      <div style={{ flex: 1, height: 1, background: '#DCFCE7' }} />
                    </div>
                    {upcomingCamps.map(camp => (
                      <CampRow
                        key={camp._id}
                        camp={camp}
                        isEnded={false}
                        isDeleting={false}
                        onDelete={null}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
 
        {/* ══════════════ TAB: USERS ══════════════ */}
        {activeTab === 'users' && (
          <div style={{ animation: 'fadeInUp 0.3s ease' }}>
            <div style={{
              background: '#fff', borderRadius: 16,
              border: '1px solid #F1F5F9',
              overflow: 'hidden',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}>
              <div style={{
                padding: '18px 24px',
                borderBottom: '1px solid #F8FAFC',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 9,
                  background: '#EFF6FF', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Users size={16} color="#2563EB" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0F172A' }}>Registered Users</p>
                  <p style={{ margin: 0, fontSize: 12, color: '#94A3B8' }}>{users.length} total users</p>
                </div>
              </div>
 
              {users.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94A3B8' }}>
                  <Users size={40} style={{ opacity: 0.2, marginBottom: 12 }} />
                  <p style={{ fontWeight: 600, margin: 0 }}>No users found</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC' }}>
                        {['Name', 'Email', 'Role', 'Blood Group'].map(h => (
                          <th key={h} style={{
                            padding: '11px 20px', textAlign: 'left',
                            fontSize: 11, fontWeight: 700, color: '#94A3B8',
                            textTransform: 'uppercase', letterSpacing: 0.6,
                            borderBottom: '1px solid #F1F5F9',
                          }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, idx) => (
                        <tr key={user._id} style={{
                          borderBottom: '1px solid #F8FAFC',
                          transition: 'background 0.15s',
                          animation: `fadeInUp 0.3s ease ${idx * 0.03}s both`,
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <td style={{ padding: '12px 20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{
                                width: 32, height: 32, borderRadius: '50%',
                                background: '#FEF2F2', flexShrink: 0,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                              }}>
                                <span style={{ fontSize: 12, fontWeight: 800, color: '#DC2626' }}>
                                  {user.name?.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <span style={{ fontWeight: 600, color: '#0F172A' }}>{user.name}</span>
                            </div>
                          </td>
                          <td style={{ padding: '12px 20px', color: '#64748B' }}>{user.email}</td>
                          <td style={{ padding: '12px 20px' }}>
                            <span style={{
                              display: 'inline-flex', alignItems: 'center',
                              padding: '3px 10px', borderRadius: 8,
                              fontSize: 12, fontWeight: 700,
                              background: user.role === 'admin' ? '#FEF2F2' : user.role === 'donor' ? '#ECFDF5' : '#EFF6FF',
                              color: user.role === 'admin' ? '#DC2626' : user.role === 'donor' ? '#059669' : '#2563EB',
                            }}>
                              {user.role}
                            </span>
                          </td>
                          <td style={{ padding: '12px 20px' }}>
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', gap: 4,
                              padding: '3px 10px', borderRadius: 8,
                              background: '#FEF2F2', color: '#DC2626',
                              fontSize: 12, fontWeight: 800,
                              border: '1px solid #FECACA',
                            }}>
                              <Droplet size={11} />
                              {user.bloodGroup}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
 
      {/* Modals & Toasts */}
      <ConfirmModal
        data={confirmData}
        onConfirm={() => confirmData?.type === 'all' ? deleteAllEnded() : deleteCamp(confirmData.camp._id)}
        onCancel={() => setConfirmData(null)}
      />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
 
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.93); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; } 50% { opacity: 0.5; }
        }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}