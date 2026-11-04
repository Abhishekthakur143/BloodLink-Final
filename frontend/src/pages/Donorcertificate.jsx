import { useState } from 'react';
import { getCertificateData } from '../api/donation';
 
// ─── Pure frontend PDF via canvas → window.print trick ────────────────────────
// No jsPDF install needed — browser print to PDF kaam karta hai
 
export default function DonorCertificate({ onClose }) {
  const [loading, setLoading] = useState(false);
  const [certData, setCertData] = useState(null);
  const [error, setError] = useState('');
 
  const fetchAndShow = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getCertificateData();
      setCertData(res.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load certificate');
    } finally {
      setLoading(false);
    }
  };
 
  const handleDownload = () => {
    const printWindow = window.open('', '_blank');
    const html = generateCertificateHTML(certData);
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
 
  // ── If no data yet, show trigger button
  if (!certData) {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 10000,
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}>
        <div style={{
          background: '#fff', borderRadius: 20, padding: '36px 32px',
          maxWidth: 420, width: '90%', textAlign: 'center',
          boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
          animation: 'scaleIn 0.25s ease',
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'linear-gradient(135deg, #DC2626, #EF4444)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, margin: '0 auto 20px',
          }}>🏅</div>
 
          <h3 style={{ margin: '0 0 10px', fontSize: 20, fontWeight: 800, color: '#111827' }}>
            Donation Certificate
          </h3>
          <p style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.6, margin: '0 0 24px' }}>
            Download your official blood donation certificate with your complete donation history.
          </p>
 
          {error && (
            <div style={{
              background: '#FEF2F2', border: '1px solid #FECACA',
              borderRadius: 10, padding: '12px 16px',
              color: '#DC2626', fontSize: 13, fontWeight: 500,
              marginBottom: 20,
            }}>
              ❌ {error}
            </div>
          )}
 
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={onClose} style={{
              flex: 1, padding: '12px', borderRadius: 12,
              border: '1.5px solid #E5E7EB', background: '#fff',
              color: '#374151', fontSize: 14, fontWeight: 600,
              cursor: 'pointer',
            }}>
              Cancel
            </button>
            <button onClick={fetchAndShow} disabled={loading} style={{
              flex: 1, padding: '12px', borderRadius: 12, border: 'none',
              background: loading ? '#FCA5A5' : 'linear-gradient(135deg, #DC2626, #EF4444)',
              color: '#fff', fontSize: 14, fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(220,38,38,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              {loading
                ? <><span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span> Loading...</>
                : '📄 Generate Certificate'}
            </button>
          </div>
        </div>
        <style>{`
          @keyframes scaleIn { from { opacity: 0; transform: scale(0.93); } to { opacity: 1; transform: scale(1); } }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }
 
  // ── Preview + Download
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 10000, padding: '20px',
      fontFamily: "'Inter', -apple-system, sans-serif",
      overflowY: 'auto',
    }}>
      <div style={{
        background: '#fff', borderRadius: 20,
        maxWidth: 700, width: '100%',
        boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
        overflow: 'hidden',
      }}>
        {/* Header bar */}
        <div style={{
          background: 'linear-gradient(135deg, #DC2626, #EF4444)',
          padding: '20px 28px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{ color: '#fff' }}>
            <p style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>🏅 Your Certificate is Ready!</p>
            <p style={{ margin: 0, fontSize: 13, opacity: 0.8 }}>Click Download to save as PDF</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleDownload} style={{
              padding: '10px 20px', borderRadius: 10, border: 'none',
              background: '#fff', color: '#DC2626',
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              ⬇️ Download PDF
            </button>
            <button onClick={onClose} style={{
              padding: '10px 16px', borderRadius: 10,
              border: '1.5px solid rgba(255,255,255,0.4)',
              background: 'transparent', color: '#fff',
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}>
              ✕ Close
            </button>
          </div>
        </div>
 
        {/* Certificate Preview */}
        <div style={{ padding: '28px', background: '#F9FAFB' }}>
          <div style={{
            background: '#fff',
            border: '2px solid #E5E7EB',
            borderRadius: 16,
            padding: '36px',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Decorative corner */}
            <div style={{
              position: 'absolute', top: 0, right: 0,
              width: 120, height: 120,
              background: 'linear-gradient(135deg, transparent 60%, #FEF2F2)',
              borderBottomLeftRadius: 120,
            }} />
            <div style={{
              position: 'absolute', bottom: 0, left: 0,
              width: 80, height: 80,
              background: 'linear-gradient(315deg, transparent 60%, #FEF2F2)',
              borderTopRightRadius: 80,
            }} />
 
            {/* Top */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🩸</div>
              <h2 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 900, color: '#DC2626', letterSpacing: '-0.5px' }}>
                BloodLink
              </h2>
              <p style={{ margin: 0, fontSize: 11, color: '#9CA3AF', letterSpacing: 2, textTransform: 'uppercase' }}>
                Blood Donation Network
              </p>
              <div style={{ width: 60, height: 2, background: '#DC2626', margin: '14px auto' }} />
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#111827', letterSpacing: 1 }}>
                CERTIFICATE OF APPRECIATION
              </h3>
              <p style={{ margin: '6px 0 0', fontSize: 13, color: '#6B7280' }}>
                This is to certify that
              </p>
            </div>
 
            {/* Donor name */}
            <div style={{
              textAlign: 'center',
              background: 'linear-gradient(135deg, #FEF2F2, #FFF5F5)',
              border: '1px solid #FECACA',
              borderRadius: 12, padding: '16px 24px',
              marginBottom: 20,
            }}>
              <p style={{ margin: '0 0 4px', fontSize: 26, fontWeight: 900, color: '#DC2626', letterSpacing: '-0.5px' }}>
                {certData.donorName}
              </p>
              <p style={{ margin: 0, fontSize: 13, color: '#6B7280' }}>
                Blood Group: <strong style={{ color: '#DC2626' }}>{certData.bloodGroup}</strong>
              </p>
            </div>
 
            <p style={{ textAlign: 'center', fontSize: 14, color: '#374151', lineHeight: 1.7, marginBottom: 20 }}>
              has voluntarily donated blood <strong style={{ color: '#DC2626' }}>{certData.totalDonations} time{certData.totalDonations !== 1 ? 's' : ''}</strong> through
              the BloodLink platform, contributing to saving precious lives in our community.
            </p>
 
            {/* Donation list */}
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                Donation History
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {certData.donations.slice(0, 5).map((d, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between',
                    background: '#F9FAFB', borderRadius: 8, padding: '10px 14px',
                    border: '1px solid #F3F4F6',
                    fontSize: 13,
                  }}>
                    <span style={{ color: '#374151', fontWeight: 500 }}>
                      🩸 {d.patientName} — {d.hospital}
                    </span>
                    <span style={{ color: '#6B7280' }}>
                      {new Date(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                ))}
                {certData.donations.length > 5 && (
                  <p style={{ textAlign: 'center', fontSize: 12, color: '#9CA3AF', margin: 0 }}>
                    + {certData.donations.length - 5} more donations
                  </p>
                )}
              </div>
            </div>
 
            {/* Footer */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'flex-end', paddingTop: 16,
              borderTop: '1px dashed #E5E7EB',
            }}>
              <div>
                <p style={{ margin: 0, fontSize: 11, color: '#9CA3AF' }}>Issue Date</p>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#374151' }}>
                  {new Date(certData.issuedOn).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: 50, height: 50,
                  background: 'linear-gradient(135deg, #DC2626, #EF4444)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, margin: '0 auto 4px',
                }}>
                  🩸
                </div>
                <p style={{ margin: 0, fontSize: 10, color: '#9CA3AF' }}>BloodLink Official</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontSize: 11, color: '#9CA3AF' }}>Certificate ID</p>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: '#374151', fontFamily: 'monospace' }}>
                  BL-{certData.donations[0]?.id?.toString().slice(-8).toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 
// ─── HTML for print/PDF ────────────────────────────────────────────────────────
function generateCertificateHTML(data) {
  const donationRows = data.donations.map((d, i) => `
    <tr style="background: ${i % 2 === 0 ? '#fff' : '#fafafa'}">
      <td style="padding: 8px 12px; font-size: 13px; color: #374151; border-bottom: 1px solid #f3f4f6;">${i + 1}</td>
      <td style="padding: 8px 12px; font-size: 13px; color: #374151; border-bottom: 1px solid #f3f4f6;">${d.patientName}</td>
      <td style="padding: 8px 12px; font-size: 13px; color: #374151; border-bottom: 1px solid #f3f4f6;">${d.hospital}</td>
      <td style="padding: 8px 12px; font-size: 13px; font-weight: 700; color: #dc2626; border-bottom: 1px solid #f3f4f6;">${d.bloodGroup}</td>
      <td style="padding: 8px 12px; font-size: 13px; color: #6b7280; border-bottom: 1px solid #f3f4f6;">${new Date(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
    </tr>
  `).join('');
 
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Blood Donation Certificate — ${data.donorName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; color: #111; }
    @page { size: A4; margin: 20mm; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
    .page { max-width: 750px; margin: 0 auto; padding: 40px; }
    .header { text-align: center; margin-bottom: 30px; }
    .logo { font-size: 48px; margin-bottom: 8px; }
    .brand { font-size: 28px; font-weight: 900; color: #dc2626; letter-spacing: -0.5px; }
    .brand-sub { font-size: 11px; color: #9ca3af; letter-spacing: 2px; text-transform: uppercase; margin-top: 2px; }
    .divider { width: 60px; height: 3px; background: #dc2626; margin: 14px auto; border-radius: 2px; }
    .cert-title { font-size: 20px; font-weight: 800; color: #111827; letter-spacing: 1px; margin-bottom: 6px; }
    .cert-sub { font-size: 14px; color: #6b7280; }
    .name-box { background: linear-gradient(135deg, #fef2f2, #fff5f5); border: 1.5px solid #fecaca; border-radius: 14px; padding: 18px 28px; text-align: center; margin: 20px 0; }
    .donor-name { font-size: 30px; font-weight: 900; color: #dc2626; letter-spacing: -0.5px; }
    .donor-bg { font-size: 14px; color: #6b7280; margin-top: 4px; }
    .body-text { text-align: center; font-size: 15px; color: #374151; line-height: 1.8; margin-bottom: 24px; }
    .body-text strong { color: #dc2626; }
    .section-title { font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 28px; }
    thead tr { background: #fef2f2; }
    thead th { padding: 10px 12px; font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; text-align: left; border-bottom: 2px solid #fecaca; }
    .footer { display: flex; justify-content: space-between; align-items: flex-end; padding-top: 20px; border-top: 1.5px dashed #e5e7eb; }
    .footer-left p, .footer-right p { font-size: 11px; color: #9ca3af; margin-bottom: 3px; }
    .footer-left strong, .footer-right strong { font-size: 13px; color: #374151; display: block; }
    .seal { text-align: center; }
    .seal-circle { width: 60px; height: 60px; background: linear-gradient(135deg, #dc2626, #ef4444); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 26px; margin: 0 auto 4px; }
    .seal-text { font-size: 10px; color: #9ca3af; }
    .border-outer { border: 3px solid #dc2626; border-radius: 16px; padding: 4px; }
    .border-inner { border: 1px solid #fecaca; border-radius: 13px; padding: 36px; }
    .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-30deg); font-size: 80px; color: rgba(220,38,38,0.04); font-weight: 900; pointer-events: none; z-index: 0; white-space: nowrap; }
  </style>
</head>
<body>
  <div class="page">
    <div class="watermark">BloodLink</div>
    <div class="border-outer">
      <div class="border-inner">
 
        <div class="header">
          <div class="logo">🩸</div>
          <div class="brand">BloodLink</div>
          <div class="brand-sub">Blood Donation Network</div>
          <div class="divider"></div>
          <div class="cert-title">CERTIFICATE OF APPRECIATION</div>
          <div class="cert-sub">This is to certify that</div>
        </div>
 
        <div class="name-box">
          <div class="donor-name">${data.donorName}</div>
          <div class="donor-bg">Blood Group: <strong style="color:#dc2626">${data.bloodGroup}</strong> &nbsp;|&nbsp; ${data.email}</div>
        </div>
 
        <p class="body-text">
          has voluntarily donated blood <strong>${data.totalDonations} time${data.totalDonations !== 1 ? 's' : ''}</strong> through the
          BloodLink platform, demonstrating exceptional commitment to saving lives in our community.
          We are deeply grateful for this selfless act of humanity.
        </p>
 
        <div class="section-title">Donation History</div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Patient Name</th>
              <th>Hospital</th>
              <th>Blood Group</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>${donationRows}</tbody>
        </table>
 
        <div class="footer">
          <div class="footer-left">
            <p>Issue Date</p>
            <strong>${new Date(data.issuedOn).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
          </div>
          <div class="seal">
            <div class="seal-circle">🩸</div>
            <div class="seal-text">BloodLink Official</div>
          </div>
          <div class="footer-right" style="text-align:right">
            <p>Certificate ID</p>
            <strong style="font-family:monospace">BL-${data.donations[0]?.id?.toString().slice(-8).toUpperCase()}</strong>
          </div>
        </div>
 
      </div>
    </div>
  </div>
</body>
</html>`;
}
 