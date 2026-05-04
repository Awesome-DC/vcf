import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import COUNTRIES from '../components/countries';
import './SaveContact.css';

const STEPS = { FORM: 'form', LOADING: 'loading', SUCCESS: 'success' };

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
          Share this page with others so they can save their contact too.
        </p>
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

        {error && <div className="error-box">{error}</div>}

        <div className="field">
          <label>Full name</label>
          <input
            type="text"
            placeholder="e.g. John Doe"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div className="field">
          <label>WhatsApp number</label>
          <div className="phone-row">
            <select value={dial} onChange={e => setDial(e.target.value)} className="country-select">
              {COUNTRIES.map(c => (
                <option key={`${c.code}-${c.dial}`} value={c.dial}>
                  {c.code} {c.dial} — {c.name}
                </option>
              ))}
            </select>
            <input
              type="tel"
              placeholder="8012345678"
              value={phone}
              onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              maxLength={12}
              inputMode="numeric"
              pattern="[0-9]*" 
              className="phone-input"
            />
          </div>
        </div>

        <button className="btn-primary submit-btn" onClick={handleSubmit}>
          Save my contact
          <span>→</span>
        </button>
        <p className="privacy-note">Your number is only used to stay in touch.</p>
      </div>
    </div>
  );
}
