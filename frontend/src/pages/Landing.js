import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getT } from '../components/i18n';
import './Landing.css';

export default function Landing() {
  const navigate = useNavigate();
  const t = getT();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.15 }
    );
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="landing">
      <nav className="nav">
        <div className="nav-inner">
          <span className="nav-logo">ContactVault</span>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-bg-grid" />
        <div className="hero-inner">
          <div className="hero-tag reveal">{t.tagline}</div>
          <h1 className="hero-title reveal">
            {t.heroTitle1}<br />
            {t.heroTitle2}<span className="hero-accent"> {t.heroTitle3}</span><br />
            {t.heroTitle4}
          </h1>
          <p className="hero-sub reveal">{t.heroSub}</p>
          <div className="hero-cta reveal">
            <button className="btn-gold hero-btn" onClick={() => navigate('/save')}>
              {t.addNumber}
              <span className="arrow">→</span>
            </button>
          </div>
        </div>
        <div className="hero-scroll-hint">{t.scrollHint}</div>
      </section>

      <section className="stats-bar">
        <div className="stats-inner">
          {t.stats.map((s, i) => (
            <div className="stat-item reveal" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-intro">
        <div className="container">
          <div className="intro-grid reveal">
            <div className="intro-text">
              <span className="section-tag">{t.whyMatters}</span>
              <h2>{t.quietPower}</h2>
              <p>{t.quietP1}</p>
              <p>{t.quietP2}</p>
            </div>
            <div className="intro-visual">
              <div className="visual-card">
                <div className="vc-icon">✦</div>
                <div className="vc-title">{t.directLine}</div>
                <div className="vc-bars">
                  {[90, 72, 85, 60, 95, 78, 88].map((h, i) => (
                    <div key={i} className="vc-bar" style={{ height: `${h}%`, animationDelay: `${i * 0.08}s` }} />
                  ))}
                </div>
                <div className="vc-caption">{t.engagementCaption}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="reasons-section">
        <div className="container">
          <span className="section-tag reveal">{t.sixReasons}</span>
          <h2 className="section-title reveal">{t.reasonsTitle}</h2>
          <div className="reasons-grid">
            {t.reasons.map((r, i) => (
              <div className="reason-card reveal" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="reason-icon">{['◈','◉','◐','◑','◒','◓'][i]}</div>
                <h3>{r.title}</h3>
                <p>{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="quote-section">
        <div className="container">
          <blockquote className="big-quote reveal">{t.bigQuote}</blockquote>
        </div>
      </section>

      <section className="testimonials">
        <div className="container">
          <span className="section-tag reveal">{t.realResults}</span>
          <h2 className="section-title reveal">{t.testimonialsTitle}</h2>
          <div className="testi-grid">
            {t.testimonials.map((t2, i) => (
              <div className="testi-card reveal" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="testi-quote">❝</div>
                <p className="testi-text">{t2.quote}</p>
                <div className="testi-author">
                  <div className="testi-avatar">{t2.author[0]}</div>
                  <div>
                    <div className="testi-name">{t2.author}</div>
                    <div className="testi-role">{t2.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="how-section">
        <div className="container">
          <span className="section-tag reveal">{t.howItWorks}</span>
          <h2 className="section-title reveal">{t.threeSteps}</h2>
          <div className="steps-grid">
            {t.steps.map((s, i) => (
              <div className="step reveal" key={i} style={{ animationDelay: `${i * 0.12}s` }}>
                <div className="step-num">{s.n}</div>
                <h3>{s.t}</h3>
                <p>{s.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-box reveal">
            <div className="cta-accent">✦</div>
            <h2>{t.ctaTitle}</h2>
            <p>{t.ctaSub}</p>
            <button className="btn-gold" style={{ fontSize: '16px', padding: '16px 40px' }} onClick={() => navigate('/save')}>
              {t.addNumber} →
            </button>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <span className="nav-logo">ContactVault</span>
            <span style={{ color: 'var(--muted)', fontSize: '13px' }}>{t.builtTo}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
