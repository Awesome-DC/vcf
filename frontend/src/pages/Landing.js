import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const stats = [
  { num: '2.7B+', label: 'WhatsApp active users worldwide' },
  { num: '100B+', label: 'Messages sent daily on WhatsApp' },
  { num: '68%', label: 'Users prefer WhatsApp for business' },
  { num: '98%', label: 'Open rate for WhatsApp messages' },
];

const reasons = [
  {
    icon: '◈',
    title: 'Instant, direct reach',
    body: 'WhatsApp messages land directly in the pocket of your audience. No algorithm deciding who sees your message, no email spam folder to dodge. When you send, they receive — instantly. A contact list is your shortcut to zero-friction communication.',
  },
  {
    icon: '◉',
    title: 'Build real relationships',
    body: 'Names and numbers are more than data — they are relationships waiting to happen. Every contact you save is a door you can knock on tomorrow, next month, or next year. The wider your network, the more doors you have.',
  },
  {
    icon: '◐',
    title: 'Business grows through people',
    body: 'Whether you run a shop, offer a service, or build a brand — growth happens through people. Your contact list is your most valuable business asset. It cannot be taken by a platform shutdown, an algorithm change, or a competitor.',
  },
  {
    icon: '◑',
    title: 'WhatsApp Broadcast power',
    body: "With WhatsApp Broadcast, you can send one message to hundreds of contacts simultaneously — and it feels personal to each recipient. But only contacts who have your number can receive broadcasts. This is why collecting numbers matters.",
  },
  {
    icon: '◒',
    title: 'Community and belonging',
    body: 'Groups and communities on WhatsApp foster a sense of belonging that other platforms cannot replicate. When people share numbers, they signal trust. Your saved contacts are people who trust you enough to stay connected.',
  },
  {
    icon: '◓',
    title: 'Crisis communication',
    body: 'In moments that matter — urgent announcements, time-sensitive deals, important updates — WhatsApp is the fastest path to your audience. Every contact saved today is someone you can reach in seconds when it truly counts.',
  },
];

const testimonials = [
  {
    quote: 'I saved over 400 contacts in one event. My WhatsApp broadcasts now convert at 34%. This single contact list made more sales than my last three Instagram campaigns combined.',
    author: 'Chidi O.', role: 'Event promoter, Lagos',
  },
  {
    quote: "Before I started collecting numbers, I had to rely on hoping people would see my posts. Now I message 600 people directly. It's a completely different level of business.",
    author: 'Amara K.', role: 'Fashion entrepreneur, Accra',
  },
  {
    quote: 'We used this to collect numbers at our church conference. In one afternoon we had 300+ contacts. Our follow-up messages now actually reach people.',
    author: 'Pastor Emmanuel', role: 'Community leader, Nairobi',
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const heroRef = useRef(null);

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
          <div className="hero-tag reveal">Your network is your net worth</div>
          <h1 className="hero-title reveal">
            Every number saved<br />
            is a<span className="hero-accent"> relationship</span><br />
            preserved
          </h1>
          <p className="hero-sub reveal">
            In an era of fleeting social media connections, your WhatsApp contact list
            is the most durable, personal, and powerful communication asset you can build.
            Start collecting today.
          </p>
          <div className="hero-cta reveal">
            <button className="btn-gold hero-btn" onClick={() => navigate('/save')}>
              Add your number
              <span className="arrow">→</span>
            </button>
          </div>
        </div>
        <div className="hero-scroll-hint">scroll to learn why ↓</div>
      </section>

      <section className="stats-bar">
        <div className="stats-inner">
          {stats.map((s, i) => (
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
              <span className="section-tag">Why it matters</span>
              <h2>The quiet power of a growing contact list</h2>
              <p>
                Social media followers can vanish overnight — platforms change algorithms,
                accounts get restricted, posts get buried. But a WhatsApp contact list is
                yours forever. It lives in your phone, not on a server you don't control.
              </p>
              <p>
                The most successful entrepreneurs, event organizers, pastors, teachers,
                and community leaders all share one habit: they obsessively collect and
                save contact numbers. Not because they are data hoarders — but because
                they understand that connection is leverage.
              </p>
            </div>
            <div className="intro-visual">
              <div className="visual-card">
                <div className="vc-icon">✦</div>
                <div className="vc-title">Direct line to your people</div>
                <div className="vc-bars">
                  {[90, 72, 85, 60, 95, 78, 88].map((h, i) => (
                    <div key={i} className="vc-bar" style={{ height: `${h}%`, animationDelay: `${i * 0.08}s` }} />
                  ))}
                </div>
                <div className="vc-caption">WhatsApp engagement vs other channels</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="reasons-section">
        <div className="container">
          <span className="section-tag reveal">6 powerful reasons</span>
          <h2 className="section-title reveal">Why building your WhatsApp<br />contact list changes everything</h2>
          <div className="reasons-grid">
            {reasons.map((r, i) => (
              <div className="reason-card reveal" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="reason-icon">{r.icon}</div>
                <h3>{r.title}</h3>
                <p>{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="quote-section">
        <div className="container">
          <blockquote className="big-quote reveal">
            "Your WhatsApp contact list is the only social network where you own 100% of
            the audience, 100% of the time."
          </blockquote>
        </div>
      </section>

      <section className="testimonials">
        <div className="container">
          <span className="section-tag reveal">Real results</span>
          <h2 className="section-title reveal">People who started collecting numbers</h2>
          <div className="testi-grid">
            {testimonials.map((t, i) => (
              <div className="testi-card reveal" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="testi-quote">❝</div>
                <p className="testi-text">{t.quote}</p>
                <div className="testi-author">
                  <div className="testi-avatar">{t.author[0]}</div>
                  <div>
                    <div className="testi-name">{t.author}</div>
                    <div className="testi-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="how-section">
        <div className="container">
          <span className="section-tag reveal">How it works</span>
          <h2 className="section-title reveal">Three steps to a growing list</h2>
          <div className="steps-grid">
            {[
              { n: '01', t: 'Share the link', b: 'Send this page link to your contacts, post it on your story, or display it at your event.' },
              { n: '02', t: 'They save their number', b: 'Visitors enter their name and WhatsApp number in under 30 seconds. No account required.' },
              { n: '03', t: 'You download the VCF', b: 'From the admin panel, generate individual VCF files and import directly into your phone.' },
            ].map((s, i) => (
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
            <h2>Start building your network today</h2>
            <p>It takes less than 30 seconds to add your number. Share this page with everyone you want to stay connected with.</p>
            <button className="btn-gold" style={{ fontSize: '16px', padding: '16px 40px' }} onClick={() => navigate('/save')}>
              Add your number →
            </button>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <span className="nav-logo">ContactVault</span>
            <span style={{ color: 'var(--muted)', fontSize: '13px' }}>Built to keep people connected</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
