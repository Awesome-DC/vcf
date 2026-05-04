import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import COUNTRIES from '../components/countries';
import './SaveContact.css';

const STEPS = { FORM: 'form', LOADING: 'loading', SUCCESS: 'success' };

function pad(n) { return String(n).padStart(2, '0'); }

function Countdown({ deadline }) {
  const [timeLeft, setTimeLeft] = useState({});

  useEffect(() => {
    const calc = () => {
      const diff = new Date(deadline) - new Date();
      if (diff <= 0) return setTimeLeft(null);
      setTimeLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [deadline]);

  if (!timeLeft) return <div className="timer-expired">⏰ Time is up! Submissions closed.</div>;

  return (
    <div className="timer-wrap">
      <p className="timer-label">Submissions close in</p>
      <div className="timer-blocks">
        {[['d','Days'],['h','Hrs'],['m','Min'],['s','Sec']].map(([k,lbl]) => (
          <div className="timer-block" key={k}>
            <span className="timer-num">{pad(timeLeft[k])}</span>
            <span className="timer-unit">{lbl}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClosedPage() {
  const downloadVcf = () => {
    window.open('/api/admin/public-vcf', '_blank');
  };

  return (
    <div className="save-page">
      <div className="save-card closed-card animate-fadeup">
        <div className="closed-icon">🔒</div>
        <h2>Submissions are closed</h2>
        <p className="closed-sub">
          The contact collection period has ended. You can now download the contact file below and import it into your phone.
        </p>

        <a className="btn-primary download-btn" href="/api/public-vcf" download="contacts.vcf">
          ⬇ Download Contacts File
        </a>

        <div className="instructions">
          <h3>How to import contacts into your phone</h3>

          <div className="instr-section">
            <div className="instr-os">📱 Android</div>
            <ol>
              <li>Download the <strong>contacts.vcf</strong> file above</li>
              <li>Open your <strong>Contacts</strong> app</li>
              <li>Tap the <strong>menu (⋮)</strong> → <strong>Import</strong></li>
              <li>Select <strong>Import from file (.vcf)</strong></li>
              <li>Choose the downloaded file — done!</li>
            </ol>
          </div>

          <div className="instr-section">
            <div className="instr-os">🍎 iPhone</div>
            <ol>
              <li>Download the <strong>contacts.vcf</strong> file above</li>
              <li>Tap the file in your <strong>Downloads</strong> or <strong>Files</strong> app</li>
              <li>iOS will ask <strong>"Would you like to add these contacts?"</strong></li>
              <li>Tap <strong>Add All Contacts</strong> — done!</li>
            </ol>
          </div>

          <div className="instr-section">
            <div className="instr-os">💬 WhatsApp tip</div>
            <p>After importing, open WhatsApp. Go to <strong>New Chat</strong> and you will see all the contacts listed. You can also create a <strong>Broadcast List</strong> to message everyone at once.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SaveContact() {
  const navigate = useNavigate();
  const [step, setStep] = useState(STEPS.FORM);
  const [name, setName] = useState('');
  const [dial, setDial] = useState('+234');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [loadMsg, setLoadMsg] = useState('Saving your contact...');
  const [envelopeClose, setEnvelopeClose] = useState(false);
  const [locked, setLocked] = useState(false);
  const [deadline, setDeadline] = useState('');
  const [statusLoaded, setStatusLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/status')
      .then(r => r.json())
      .then(d => {
        setLocked(d.locked);
        setDeadline(d.deadline || '');
        setStatusLoaded(true);
      })
      .catch(() => setStatusLoaded(true));
  }, []);

  // ✏️ CHANGE THIS to your actual WhatsApp group invite link
  const WHATSAPP_GROUP_LINK = 'https://chat.whatsapp.com/YOUR_GROUP_INVITE_LINK';

  const PHONE_LENGTHS = {
    '+234':10,'+233':9,'+254':9,'+27':9,'+251':9,'+255':9,'+256':9,
    '+221':9,'+225':10,'+237':9,'+20':10,'+212':9,'+216':8,'+213':9,
    '+218':9,'+249':9,'+244':9,'+258':9,'+260':9,'+263':9,'+250':9,
    '+229':8,'+228':8,'+223':8,'+226':8,'+227':8,'+235':8,'+252':8,
    '+261':9,'+242':9,'+243':9,'+241':8,'+266':8,'+267':8,'+264':9,
    '+268':8,'+44':10,'+1':10,'+91':10,'+92':10,'+880':10,'+94':9,
    '+63':10,'+62':10,'+60':9,'+65':8,'+66':9,'+84':9,'+86':11,
    '+81':10,'+82':10,'+61':9,'+64':9,'+33':9,'+49':10,'+39':10,
    '+34':9,'+351':9,'+31':9,'+32':9,'+46':9,'+47':8,'+45':8,
    '+358':9,'+48':9,'+380':9,'+7':10,'+90':10,'+966':9,'+971':9,
    '+974':8,'+965':8,'+973':8,'+968':8,'+964':10,'+98':10,'+972':9,
    '+962':9,'+961':8,'+55':11,'+54':10,'+57':10,'+56':9,'+51':9,
    '+58':10,'+52':10,'+502':8,'+53':8,
  };

  const handleSubmit = async () => {
    setError('');
    if (!name.trim()) { setError('Please enter your full name'); return; }
    const digitsOnly = phone.replace(/\D/g, '');
    if (!digitsOnly) { setError('Phone number must contain digits only'); return; }
    const expectedLen = PHONE_LENGTHS[dial];
    if (expectedLen && digitsOnly.length !== expectedLen) {
      setError(`Phone number for ${dial} must be exactly ${expectedLen} digits (you entered ${digitsOnly.length})`);
      return;
    }
    if (!expectedLen && (digitsOnly.length < 6 || digitsOnly.length > 12)) {
      setError('Please enter a valid phone number (6-12 digits)');
      return;
    }
    setStep(STEPS.LOADING);
    setProgress(0);
    setEnvelopeClose(false);

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim(), country_code: dial }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed'); }
    } catch (e) {
      setStep(STEPS.FORM);
      setError(e.message);
      return;
    }

    setTimeout(() => { setEnvelopeClose(true); setProgress(30); }, 400);
    setTimeout(() => { setProgress(60); setLoadMsg('Almost done...'); }, 1800);
    setTimeout(() => { setProgress(90); }, 3000);
    setTimeout(() => { setProgress(100); setLoadMsg('Done!'); }, 4200);
    setTimeout(() => setStep(STEPS.SUCCESS), 5000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.origin).catch(() => {});
    alert('Link copied! Share it with others.');
  };

  if (!statusLoaded) return (
    <div className="save-page">
      <div className="save-card" style={{ textAlign: 'center', padding: '60px 40px' }}>
        <span className="spinner large" />
      </div>
    </div>
  );

  if (locked) return <ClosedPage />;

  if (step === STEPS.LOADING) return (
    <div className="save-page">
      <div className="save-card loading-card">
        <div className={`envelope ${envelopeClose ? 'close' : ''}`}>
          <div className="env-body" />
          <div className="env-flap" />
          <div className="env-left" />
          <div className="env-right" />
          <div className="env-bottom" />
        </div>
        <h2 className="load-title">{loadMsg}</h2>
        <p className="load-sub">Please wait a moment</p>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );

  if (step === STEPS.SUCCESS) return (
    <div className="save-page">
      <div className="save-card success-card animate-fadeup">
        <div className="success-icon">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <polyline points="6 16 13 23 26 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h2>You're in!</h2>
        <p className="success-msg">
          Your contact has been added. We will notify you when everything is ready.
        </p>

        {/* WhatsApp Group CTA */}
        <div className="group-cta">
          <div className="group-cta-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#25D366">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
          <div className="group-cta-text">
            <strong>Join our WhatsApp group</strong>
            <span>Stay updated and connect with others</span>
          </div>
          <a className="group-join-btn" href={WHATSAPP_GROUP_LINK} target="_blank" rel="noreferrer">
            Join Group
          </a>
        </div>

        <div className="share-box">
          <span>{window.location.origin}</span>
          <button className="btn-outline" onClick={copyLink}>Copy link</button>
        </div>
        <p className="share-hint">Share with your friends so they can also add their numbers</p>
        <div className="success-actions">
          <button className="btn-primary" onClick={() => { setStep(STEPS.FORM); setName(''); setPhone(''); setProgress(0); setLoadMsg('Saving your contact...'); }}>
            Add another contact
          </button>
          <button className="btn-outline" onClick={() => navigate('/')}>Back to home</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="save-page">
      <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
      <div className="save-card animate-fadeup">
        <div className="save-header">
          <div className="save-avatar">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="10" r="5" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M4 24c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <h1>Save your contact</h1>
            <p>Join our WhatsApp network</p>
          </div>
        </div>

        {deadline && <Countdown deadline={deadline} />}
        {error && <div className="error-box">{error}</div>}

        <div className="field">
          <label>Full name</label>
          <input type="text" placeholder="e.g. John Doe" value={name} onChange={e => setName(e.target.value)} />
        </div>

        <div className="field">
          <label>WhatsApp number</label>
          <div className="phone-row">
            <select value={dial} onChange={e => setDial(e.target.value)} className="country-select">
              {COUNTRIES.map(c => (
                <option key={`${c.code}-${c.dial}`} value={c.dial}>{c.code} {c.dial} — {c.name}</option>
              ))}
            </select>
            <input
              type="tel" placeholder="8012345678" value={phone}
              onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              maxLength={12} inputMode="numeric" pattern="[0-9]*"
              className="phone-input"
            />
          </div>
        </div>

        <button className="btn-primary submit-btn" onClick={handleSubmit}>
          Save my contact <span>→</span>
        </button>
        <p className="privacy-note">Your number is only used to stay in touch.</p>
      </div>
    </div>
  );
}
