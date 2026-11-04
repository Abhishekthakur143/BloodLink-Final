import { useState } from 'react';
import { createBloodRequest } from '../api/bloodRequest';
 
export default function RequestBloodPage() {
  const [formData, setFormData] = useState({ patientName: '', bloodGroup: 'A+', units: 1, urgency: 'normal', hospitalName: '', city: '', contactNumber: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' | 'error'
  const [loading, setLoading] = useState(false);
 
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await createBloodRequest(formData);
      setMessage('Blood Request Created Successfully!');
      setMessageType('success');
      setFormData({ patientName: '', bloodGroup: 'A+', units: 1, urgency: 'normal', hospitalName: '', city: '', contactNumber: '' });
    } catch (err) {
      setMessage('Failed to create request. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };
 
  const urgencyOptions = [
    { value: 'normal', label: 'Normal', desc: 'Within a few days', color: 'emerald' },
    { value: 'urgent', label: 'Urgent', desc: 'Within 24 hours', color: 'amber' },
    { value: 'critical', label: 'Critical', desc: 'Immediate need', color: 'red' },
  ];
 
  const urgencyColorMap = {
    emerald: { ring: 'ring-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    amber: { ring: 'ring-amber-500', bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-700', dot: 'bg-amber-500' },
    red: { ring: 'ring-red-500', bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700', dot: 'bg-red-500' },
  };
 
  return (
    <div className="min-h-screen bg-gray-50 flex items-stretch">
 
      {/* LEFT — Visual / Brand panel */}
      <div className="hidden lg:flex lg:w-2/5 relative bg-gradient-to-br from-red-600 via-red-500 to-rose-600 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-10 w-40 h-40 border border-white/20 rounded-full"></div>
 
        <div className="relative z-10 flex flex-col justify-between p-10 text-white w-full">
          <div>
            <div className="flex items-center gap-2 mb-12">
              <div className="w-10 h-10 bg-white/15 backdrop-blur rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2C7 6 4 9.5 4 12.5a6 6 0 0012 0C16 9.5 13 6 10 2z" />
                </svg>
              </div>
              <span className="font-bold text-lg tracking-tight">LifeDrop</span>
            </div>
 
            <h1 className="text-4xl font-bold leading-tight mb-4">
              Every drop counts.<br/>Every second matters.
            </h1>
            <p className="text-red-50/90 text-base leading-relaxed max-w-sm">
              Submit your blood requirement and our network of verified donors and blood banks will be alerted instantly.
            </p>
          </div>
 
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-2xl p-4">
              <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-sm">Instant Alerts</p>
                <p className="text-xs text-red-50/80">Nearby donors notified within seconds</p>
              </div>
            </div>
 
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-2xl p-4">
              <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-sm">Verified Network</p>
                <p className="text-xs text-red-50/80">Trusted hospitals & blood banks only</p>
              </div>
            </div>
          </div>
        </div>
      </div>
 
      {/* RIGHT — Form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-xl">
 
          {/* Mobile header (shown only on small screens) */}
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2C7 6 4 9.5 4 12.5a6 6 0 0012 0C16 9.5 13 6 10 2z" />
              </svg>
            </div>
            <span className="font-bold text-lg text-gray-900">LifeDrop</span>
          </div>
 
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Request Blood</h2>
            <p className="text-gray-500 mt-2 text-sm">Fill in the details below to raise a blood request</p>
          </div>
 
          {/* Status Message */}
          {message && (
            <div className={`flex items-center gap-3 p-4 mb-6 rounded-2xl text-sm font-medium border ${
              messageType === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                messageType === 'success' ? 'bg-emerald-100' : 'bg-red-100'
              }`}>
                {messageType === 'success' ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              {message}
            </div>
          )}
 
          <form onSubmit={onSubmit} className="space-y-7">
 
            {/* Section: Patient Info */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Patient Information</h3>
              <div className="space-y-4">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Patient Name</label>
                  <input
                    type="text"
                    placeholder="Enter patient's full name"
                    value={formData.patientName}
                    onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all"
                  />
                </div>
 
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Blood Group</label>
                    <div className="relative">
                      <select
                        value={formData.bloodGroup}
                        onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all appearance-none font-semibold pr-10"
                      >
                        <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                        <option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
                      </select>
                      <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
 
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Units Required</label>
                    <input
                      type="number"
                      placeholder="e.g. 2"
                      min="1"
                      value={formData.units}
                      onChange={(e) => setFormData({...formData, units: e.target.value})}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all"
                    />
                  </div>
                </div>
 
                {/* Urgency — Segmented control */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Urgency Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {urgencyOptions.map((opt) => {
                      const c = urgencyColorMap[opt.color];
                      const active = formData.urgency === opt.value;
                      return (
                        <button
                          type="button"
                          key={opt.value}
                          onClick={() => setFormData({...formData, urgency: opt.value})}
                          className={`text-left px-3 py-2.5 rounded-xl border-2 transition-all ${
                            active ? `${c.bg} ${c.border} ring-2 ${c.ring}/20` : 'bg-white border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className={`w-2 h-2 rounded-full ${c.dot}`}></span>
                            <span className={`text-sm font-semibold ${active ? c.text : 'text-gray-700'}`}>{opt.label}</span>
                          </div>
                          <p className="text-[11px] text-gray-400 leading-tight">{opt.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
 
            {/* Section: Hospital & Contact */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Hospital &amp; Contact Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Hospital Name</label>
                  <input
                    type="text"
                    placeholder="Enter hospital name"
                    value={formData.hospitalName}
                    onChange={(e) => setFormData({...formData, hospitalName: e.target.value})}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all"
                  />
                </div>
 
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                    <input
                      type="text"
                      placeholder="Enter city"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all"
                    />
                  </div>
 
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Number</label>
                    <input
                      type="text"
                      placeholder="10-digit number"
                      value={formData.contactNumber}
                      onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                      required
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
 
            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white py-3.5 rounded-xl font-semibold text-base hover:from-red-700 hover:to-rose-700 active:scale-[0.99] transition-all shadow-lg shadow-red-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Request
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>
 
          <p className="text-center text-xs text-gray-400 mt-6">
            Your request will be matched with nearby verified donors and blood banks.
          </p>
        </div>
      </div>
    </div>
  );
}
 