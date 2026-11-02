import React, { useState, useEffect } from 'react';
import { PRODUCTS } from '../data/products';
import { MetaPixel } from '../components/MetaPixel';

export default function EnglishFunnel({ onBuyProduct, onNavigate }) {
  const product = PRODUCTS['english-bundle'];
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 48);
  const [activeFaq, setActiveFaq] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    MetaPixel.pageView('English Mega Bundle Funnel');
    MetaPixel.viewContent(product);

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 15 * 60));
    }, 1000);

    return () => clearInterval(timer);
  }, [product]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const ebooks = [
    { num: '01', icon: '💬', title: '1500 Idioms & Phrases', desc: 'Sound like a native speaker with contextual Hindi meanings and real-life usage.' },
    { num: '02', icon: '📖', title: '1000 Antonyms & Synonyms', desc: 'Expand your word power for exams, essay writing, and workplace discussions.' },
    { num: '03', icon: '🗣', title: '3000 Everyday Sentences', desc: 'Morning to night ready-made spoken sentences for office, travel, and conversations.' },
    { num: '04', icon: '📝', title: 'English Grammar Simplified', desc: 'Crystal-clear practical grammar rules without confusing theoretical jargon.' },
    { num: '05', icon: '💼', title: 'Job Interview Blueprint', desc: 'Top HR questions, winning answers, body language, and salary negotiation tactics.' },
    { num: '06', icon: '🎯', title: 'One Word Substitution', desc: 'High-scoring shortcut for competitive exams (SSC, Banking, UPSC, State PCS).' },
    { num: '07', icon: '🚀', title: 'Spoken English Mastery', desc: 'Techniques to think directly in English and eliminate public speaking anxiety.' },
    { num: '08', icon: '⏰', title: 'English Tenses Made Crystal Clear', desc: 'All 12 tenses with timeline diagrams and practical daily sentence examples.' },
    { num: '09', icon: '⚡', title: '1000 Verb Forms (V1, V2, V3)', desc: 'Regular and irregular verb forms with Hindi meanings and pronunciation.' },
    { num: '10', icon: '🌟', title: '5000 Everyday Vocabulary', desc: 'High-frequency words categorized by professional, social, and emotional contexts.' }
  ];

  return (
    <div className="funnel-container">
      {/* Urgency Top Bar */}
      <div className="top-banner" style={{ background: 'linear-gradient(90deg, #d97706, #f59e0b, #d97706)' }}>
        <div className="banner-content">
          <span className="live-badge" style={{ background: '#000', color: '#fbbf24' }}>⚡ FLASH SALE</span>
          <span>Flat 93% OFF Ends In: <span className="timer-box-banner">{formattedTime}</span></span>
          <span>•</span>
          <span>Special Offer: <strong>₹199 INR Only!</strong></span>
        </div>
      </div>

      {/* Hero Section */}
      <header className="hero section-padding">
        <div className="container text-center">
          <div className="hero-pill-badge" style={{ borderColor: 'rgba(245, 158, 11, 0.4)', color: '#fbbf24' }}>
            <span>⭐ OVER 14,850+ LEARNERS ACROSS INDIA</span>
          </div>

          <h1 className="hero-title">
            Improve Your English, <span className="text-gradient">Speak Confidently</span> & Build Better Communication Skills!
          </h1>
          <p className="hero-subtitle">
            Get everything you need to speak fluently and crack job interviews in one affordable package. 10 Comprehensive Ebooks + 3 High-Value Bonuses with Hindi & English bilingual explanations.
          </p>

          <div className="rating-box">
            <span className="stars" style={{ color: '#fbbf24' }}>★★★★★</span>
            <span style={{ fontWeight: 700, color: '#fff' }}>4.9/5 Rating</span>
            <span>•</span>
            <span>Verified Digital Access</span>
          </div>

          {/* CTA Button */}
          <div className="cta-wrapper">
            <button
              type="button"
              className="btn-primary-cta"
              onClick={() => onBuyProduct(product)}
            >
              <span>GET COMPLETE MEGA BUNDLE (₹199)</span>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>

            <div className="price-subtext" style={{ marginTop: '8px' }}>
              <span>Regular Price: <del>₹2,999</del></span>
              <span className="today-deal" style={{ color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.4)' }}>
                ⚡ Today Just ₹199 (Save 93%)
              </span>
              <span>• Instant Digital Access</span>
            </div>
          </div>
        </div>
      </header>

      {/* 10 Ebooks Breakdown */}
      <section className="section-padding" style={{ background: 'rgba(10, 18, 24, 0.6)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag" style={{ color: '#fbbf24' }}>Complete Curriculum</span>
            <h2 className="section-title">What You Get Inside 10 Premium Ebooks</h2>
          </div>

          <div className="ebooks-grid">
            {ebooks.map((item, idx) => (
              <div key={idx} className="glass-card ebook-card">
                <div className="ebook-number">{item.num}</div>
                <div className="ebook-icon-badge" style={{ color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
                  {item.icon}
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 Free Bonuses */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-tag" style={{ color: '#fbbf24' }}>Fast-Action Gifts</span>
            <h2 className="section-title">3 FREE Fast-Action Bonuses Included</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Worth ₹3,497 — Included at ZERO extra cost when you order today!</p>
          </div>

          <div className="bonuses-grid">
            <div className="bonus-box">
              <span className="bonus-number">BONUS #1</span>
              <h3>Animated Spoken English Video Course</h3>
              <p>Visual animated video lessons that teach daily conversations, body language, and native pronunciation.</p>
              <span className="free-claim-badge">FREE (Worth ₹1,499)</span>
            </div>

            <div className="bonus-box">
              <span className="bonus-number">BONUS #2</span>
              <h3>Time Management Mastery Video Course</h3>
              <p>Proven productivity techniques to balance daily study schedules, beat procrastination, and stay consistent.</p>
              <span className="free-claim-badge">FREE (Worth ₹999)</span>
            </div>

            <div className="bonus-box">
              <span className="bonus-number">BONUS #3</span>
              <h3>Self-Improvement Ebook Pack (10+ Ebooks)</h3>
              <p>Essential personal development guides covering leadership, public speaking, and confidence building.</p>
              <span className="free-claim-badge">FREE (Worth ₹999)</span>
            </div>
          </div>

          <div className="cta-wrapper" style={{ marginTop: '35px' }}>
            <button
              type="button"
              className="btn-primary-cta"
              onClick={() => onBuyProduct(product)}
            >
              <span>CLAIM 10 EBOOKS + 3 BONUSES (₹199)</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

