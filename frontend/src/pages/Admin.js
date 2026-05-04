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

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const login = async () => {
    setPwErr('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw }),
      });
      if (res.ok) {
        setStoredPw(pw);
        setAuthed(true);
        fetchContacts(pw);
      } else {
        setPwErr('Incorrect password. Try again.');
      }
    } catch {
      setPwErr('Connection error. Is the server running?');
    }
  };

  const fetchContacts = async (password) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/contacts', {
        headers: { 'X-Admin-Password': password },
      });
      const data = await res.json();
      setContacts(data);
    } catch {
      showToast('Failed to load contacts');
    }
    setLoading(false);
  };

  const generateVCF = async () => {
    if (contacts.length === 0) { showToast('No contacts to export'); return; }
    setGenerating(true);
    try {
      const res = await fetch('/api/admin/generate-vcf', {
        headers: { 'X-Admin-Password': storedPw },
      });
      if (!res.ok) { showToast('Error generating VCF'); setGenerating(false); return; }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'contacts.vcf'; a.click();
      URL.revokeObjectURL(url);
      showToast(`Downloaded contacts.vcf with ${contacts.length} contacts`);
    } catch {
      showToast('Download failed');
    }
    setGenerating(false);
  };

  const resetDB = async () => {
    if (!window.confirm('This will permanently delete ALL contacts. Are you sure?')) return;
    setResetting(true);
    try {
      const res = await fetch('/api/admin/reset', {
        method: 'DELETE',
        headers: { 'X-Admin-Password': storedPw },
      });
      if (res.ok) {
        setContacts([]);
        showToast('Database has been reset');
      } else {
        showToast('Reset failed');
      }
    } catch {
      showToast('Connection error');
    }
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
          <input
            type="password"
            placeholder="Enter admin password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
          />
        </div>
        <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={login}>
          Login →
        </button>
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
        <div className="admin-toolbar">
          <div>
            <h2>Saved contacts</h2>
            <p className="toolbar-sub">Manage and export your collected WhatsApp numbers</p>
          </div>
          <div className="toolbar-actions">
            <button
              className="btn-primary"
              onClick={generateVCF}
              disabled={generating || contacts.length === 0}
            >
              {generating ? (
                <><span className="spinner" /> Generating...</>
              ) : (
                <><VCFIcon /> Generate VCF files</>
              )}
            </button>
            <button
              className="btn-danger"
              onClick={resetDB}
              disabled={resetting}
            >
              {resetting ? 'Resetting...' : '⚠ Reset database'}
            </button>
          </div>
        </div>

        {contacts.length > 0 && (
          <div className="vcf-note">
            <InfoIcon />
            <span>All contacts are saved in a single <strong>contacts.vcf</strong> file. Each contact is named e.g. <strong>John Doe vcf1</strong>, <strong>Jane Smith vcf2</strong> — ready to import into your phone.</span>
          </div>
        )}

        {loading ? (
          <div className="loading-state">
            <span className="spinner large" />
            <span>Loading contacts...</span>
          </div>
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
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>WhatsApp number</th>
                  <th>VCF filename</th>
                  <th>Added</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((c, i) => (
                  <tr key={c.id} className="animate-fadeup" style={{ animationDelay: `${i * 0.03}s` }}>
                    <td className="td-num">{i + 1}</td>
                    <td className="td-name">
                      <div className="contact-avatar">{c.name[0].toUpperCase()}</div>
                      {c.name}
                    </td>
                    <td className="td-phone">{c.phone}</td>
                    <td className="td-vcf">
                      <span className="vcf-chip">{c.name} vcf{i + 1}.vcf</span>
                    </td>
                    <td className="td-date">
                      {new Date(c.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
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
      <circle cx="8" cy="8" r="6"/>
      <path d="M8 7v4M8 5v.5" strokeLinecap="round"/>
    </svg>
  );
}
