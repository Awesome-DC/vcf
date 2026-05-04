import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

export default function Admin() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [pwErr, setPwErr] = useState('');
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [generating, setGenerating] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [storedPw, setStoredPw] = useState('');
  const [locked, setLocked] = useState(false);
  const [deadline, setDeadline] = useState('');
  const [deadlineInput, setDeadlineInput] = useState('');
  const [savingDeadline, setSavingDeadline] = useState(false);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  const login = async () => {
    setPwErr('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      });
      if (res.ok) {
        setStoredPw(pw); setAuthed(true); fetchContacts(pw); fetchStatus(pw);
      } else { setPwErr('Incorrect password. Try again.'); }
    } catch { setPwErr('Connection error. Is the server running?'); }
  };

  const fetchContacts = async (password) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/contacts', { headers: { 'X-Admin-Password': password } });
      const data = await res.json();
      setContacts(data);
    } catch { showToast('Failed to load contacts'); }
    setLoading(false);
  };

  const fetchStatus = async (password) => {
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      setLocked(data.locked);
      setDeadline(data.deadline || '');
      if (data.deadline) setDeadlineInput(data.deadline.slice(0,16));
    } catch {}
  };

  const generateVCF = async () => {
    if (contacts.length === 0) { showToast('No contacts to export'); return; }
    if (!window.confirm(`Generate VCF for ${contacts.length} contacts? This will also LOCK submissions.`)) return;
    setGenerating(true);
    try {
      const res = await fetch('/api/admin/generate-vcf', { headers: { 'X-Admin-Password': storedPw } });
      if (!res.ok) { showToast('Error generating VCF'); setGenerating(false); return; }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'contacts.vcf'; a.click();
      URL.revokeObjectURL(url);
      setLocked(true);
      showToast(`✅ Downloaded contacts.vcf — submissions are now LOCKED`);
    } catch { showToast('Download failed'); }
    setGenerating(false);
  };

  const unlockSubmissions = async () => {
    if (!window.confirm('This will allow new submissions again. Continue?')) return;
    try {
      const res = await fetch('/api/admin/unlock', {
        method: 'POST', headers: { 'X-Admin-Password': storedPw },
      });
      if (res.ok) { setLocked(false); showToast('✅ Submissions unlocked'); }
    } catch { showToast('Failed to unlock'); }
  };

  const saveDeadline = async () => {
    if (!deadlineInput) { showToast('Please pick a date and time'); return; }
    setSavingDeadline(true);
    try {
      const res = await fetch('/api/admin/set-deadline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Password': storedPw },
        body: JSON.stringify({ deadline: new Date(deadlineInput).toISOString() }),
      });
      if (res.ok) { setDeadline(new Date(deadlineInput).toISOString()); showToast('✅ Deadline saved — timer is now live'); }
    } catch { showToast('Failed to save deadline'); }
    setSavingDeadline(false);
  };

  const clearDeadline = async () => {
    try {
      await fetch('/api/admin/set-deadline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Password': storedPw },
        body: JSON.stringify({ deadline: '' }),
      });
      setDeadline(''); setDeadlineInput(''); showToast('Deadline cleared');
    } catch {}
  };

  const resetDB = async () => {
    if (!window.confirm('This will permanently delete ALL contacts and reset the lock. Are you sure?')) return;
    setResetting(true);
    try {
      const res = await fetch('/api/admin/reset', { method: 'DELETE', headers: { 'X-Admin-Password': storedPw } });
      if (res.ok) { setContacts([]); setLocked(false); setDeadline(''); setDeadlineInput(''); showToast('✅ Database reset'); }
      else showToast('Reset failed');
    } catch { showToast('Connection error'); }
    setResetting(false);
  };

  if (!authed) return (
    <div className="admin-page">
      <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
      <div className="login-card animate-fadeup">
        <div className="login-icon">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="5" y="12" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M9 12V9a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>
        <h1>Admin access</h1>
        <p className="login-sub">Enter your admin password to continue</p>
        {pwErr && <div className="error-box">{pwErr}</div>}
        <div className="field">
          <label>Password</label>
          <input type="password" placeholder="Enter admin password" value={pw}
            onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} />
        </div>
        <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={login}>Login →</button>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      {toast && <div className="toast">{toast}</div>}

      <div className="admin-nav">
        <span className="nav-logo">ContactVault <span className="admin-badge">Admin</span></span>
        <div className="admin-nav-right">
          <span className="contact-stat">{contacts.length} contact{contacts.length !== 1 ? 's' : ''}</span>
          <button className="btn-outline" onClick={() => navigate('/')}>Exit</button>
        </div>
      </div>

      <div className="admin-body">

        {/* STATUS BANNER */}
        <div className={`status-banner ${locked ? 'locked' : 'open'}`}>
          <span>{locked ? '🔒 Submissions are LOCKED — visitors see the download page' : '🟢 Submissions are OPEN — visitors can add their number'}</span>
          {locked && (
            <button className="btn-unlock" onClick={unlockSubmissions}>Unlock</button>
          )}
        </div>

        {/* DEADLINE SETTER */}
        <div className="admin-card">
          <div className="admin-card-title">⏱ Countdown Timer</div>
          <p className="admin-card-sub">Set a deadline — visitors will see a live countdown on the save page</p>
          <div className="deadline-row">
            <input type="datetime-local" value={deadlineInput}
              onChange={e => setDeadlineInput(e.target.value)}
              className="deadline-input" />
            <button className="btn-primary" onClick={saveDeadline} disabled={savingDeadline}>
              {savingDeadline ? 'Saving...' : 'Set Timer'}
            </button>
            {deadline && <button className="btn-outline" onClick={clearDeadline}>Clear</button>}
          </div>
          {deadline && (
            <div className="deadline-active">
              ✅ Timer active — ends: <strong>{new Date(deadline).toLocaleString()}</strong>
            </div>
          )}
        </div>

        {/* CONTACTS TABLE */}
        <div className="admin-toolbar">
          <div>
            <h2>Saved contacts</h2>
            <p className="toolbar-sub">Manage and export your collected WhatsApp numbers</p>
          </div>
          <div className="toolbar-actions">
            <button className="btn-primary" onClick={generateVCF} disabled={generating || contacts.length === 0}>
              {generating ? <><span className="spinner" /> Generating...</> : <><VCFIcon /> Generate VCF &amp; Lock</>}
            </button>
            <button className="btn-danger" onClick={resetDB} disabled={resetting}>
              {resetting ? 'Resetting...' : '⚠ Reset DB'}
            </button>
          </div>
        </div>

        {contacts.length > 0 && (
          <div className="vcf-note">
            <InfoIcon />
            <span>All contacts in one <strong>contacts.vcf</strong> — named e.g. <strong>John Doe vcf1</strong>, <strong>Jane Smith vcf2</strong>. Generating also locks submissions.</span>
          </div>
        )}

        {loading ? (
          <div className="loading-state"><span className="spinner large" /><span>Loading contacts...</span></div>
        ) : contacts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="15" r="6" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 36c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h3>No contacts yet</h3>
            <p>Share your page link so people can start adding their numbers.</p>
            <button className="btn-primary" onClick={() => navigate('/save')}>View save page</button>
          </div>
        ) : (
          <div className="contacts-table-wrap">
            <table className="contacts-table">
              <thead>
                <tr><th>#</th><th>Name</th><th>WhatsApp number</th><th>VCF filename</th><th>Added</th></tr>
              </thead>
              <tbody>
                {contacts.map((c, i) => (
                  <tr key={c.id} className="animate-fadeup" style={{ animationDelay: `${i * 0.03}s` }}>
                    <td className="td-num">{i + 1}</td>
                    <td className="td-name">
                      <div className="contact-avatar">{c.name[0].toUpperCase()}</div>{c.name}
                    </td>
                    <td className="td-phone">{c.phone}</td>
                    <td className="td-vcf"><span className="vcf-chip">{c.name} vcf{i + 1}.vcf</span></td>
                    <td className="td-date">{new Date(c.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function VCFIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 2H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6L9 2z"/>
      <polyline points="9 2 9 6 13 6"/>
    </svg>
  );
}
function InfoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ flexShrink: 0 }}>
      <circle cx="8" cy="8" r="6"/><path d="M8 7v4M8 5v.5" strokeLinecap="round"/>
    </svg>
  );
}
