import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getT } from '../components/i18n';
import './Landing.css';

function DonutChart({ value, max, color, label }) {
  const pct = Math.min(value / max, 1);
  const r = 38, cx = 44, cy = 44;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;
  return (
    <div className="donut-wrap">
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--donut-bg)" strokeWidth="8"/>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ * 0.25}
          strokeLinecap="round" style={{ transition: 'stroke-dasharray 1s ease' }}/>
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="13" fontWeight="800" fill="var(--text-primary)" fontFamily="Syne,sans-serif">{value}</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="8" fill="var(--text-muted)" fontFamily="DM Sans,sans-serif" letterSpacing="1">{label}</text>
      </svg>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const t = getT();
  const [dark, setDark] = useState(() => localStorage.getItem('cv_theme') === 'dark');
  const [contactCount, setContactCount] = useState(0);
  const TARGET = 100;

  useEffect(() => {
    fetch('/api/status').then(r => r.json()).then(d => {
      // We'll get count from a separate endpoint or just show contacts count
    }).catch(() => {});

    // Fetch contact count for the dashboard display
    fetch('/api/public-count').then(r => r.json()).then(d => {
      setContactCount(d.count || 0);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('cv_theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const remaining = Math.max(TARGET - contactCount, 0);

  return (
    <div className="landing">
      {/* NAV */}
      <nav className="nav">
        <div className="nav-inner">
          <div className="nav-brand">
            <div className="nav-logo-icon">CV</div>
            <div>
              <div className="nav-title">ContactVault</div>
              <div className="nav-sub">WhatsApp Network</div>
            </div>
          </div>
          <div className="nav-right">
            <button className="theme-btn" onClick={() => setDark(d => !d)} title="Toggle theme">
              {dark ? '☀' : '🌙'}
            </button>
          </div>
        </div>
      </nav>

      {/* HERO DASHBOARD CARD */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-card reveal">
            <div className="hero-card-header">
              <div className="hero-card-title">
                <div className="hero-icon-wrap">CV</div>
                <div>
                  <h1>ContactVault Session</h1>
                  <p>Public contact collection</p>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="stats-row">
              <div className="stat-donut-card">
                <DonutChart value={TARGET} max={TARGET} color="#16a34a" label="TARGET" />
                <div className="stat-donut-label">Target</div>
              </div>
              <div className="stat-donut-card">
                <DonutChart value={contactCount} max={TARGET} color="#2563eb" label="CURRENT" />
                <div className="stat-donut-label">Current</div>
              </div>
              <div className="stat-donut-card">
                <DonutChart value={remaining} max={TARGET} color="#ea580c" label="LEFT" />
                <div className="stat-donut-label">Remaining</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="progress-section">
              <div className="progress-label">
                <span>{contactCount} of {TARGET} contacts collected</span>
                <span>{Math.round((contactCount / TARGET) * 100)}%</span>
              </div>
              <div className="progress-track-full">
                <div className="progress-fill-full" style={{ width: `${Math.min((contactCount / TARGET) * 100, 100)}%` }} />
              </div>
            </div>

            <button className="add-btn" onClick={() => navigate('/save')}>
              + Add Your Number
            </button>
          </div>
        </div>
      </section>

      {/* WHY SECTION */}
      <section className="why-section">
        <div className="container">
          <div className="why-tag reveal">Why it matters</div>
          <h2 className="why-title reveal">{t.quietPower}</h2>
          <p className="why-body reveal">{t.quietP1}</p>
          <p className="why-body reveal">{t.quietP2}</p>
        </div>
      </section>

      {/* REASONS GRID */}
      <section className="reasons-section">
        <div className="container">
          <div className="section-label reveal">{t.sixReasons}</div>
          <h2 className="section-title reveal">{t.reasonsTitle}</h2>
          <div className="reasons-grid">
            {t.reasons.map((r, i) => (
              <div className="reason-card reveal" key={i}>
                <div className="reason-num">0{i + 1}</div>
                <h3>{r.title}</h3>
                <p>{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="quote-section">
        <div className="container">
          <blockquote className="big-quote reveal">{t.bigQuote}</blockquote>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section">
        <div className="container">
          <div className="section-label reveal">{t.howItWorks}</div>
          <h2 className="section-title reveal">{t.threeSteps}</h2>
          <div className="steps-row">
            {t.steps.map((s, i) => (
              <div className="step-card reveal" key={i}>
                <div className="step-num">{s.n}</div>
                <h3>{s.t}</h3>
                <p>{s.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card reveal">
            <h2>{t.ctaTitle}</h2>
            <p>{t.ctaSub}</p>
            <button className="add-btn" onClick={() => navigate('/save')}>
              {t.addNumber} →
            </button>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <span className="nav-title" style={{ fontSize: 14 }}>ContactVault</span>
          <span className="footer-sub">{t.builtTo}</span>
        </div>
      </footer>
    </div>
  );
}
