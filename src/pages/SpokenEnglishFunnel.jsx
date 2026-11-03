import React, { useState, useEffect } from 'react';
import { PRODUCTS } from '../data/products';
import { MetaPixel } from '../components/MetaPixel';

export default function SpokenEnglishFunnel({ onBuyProduct, onNavigate }) {
  const mainProduct = PRODUCTS['spoken-english'];
  const singleProduct = PRODUCTS['spoken-english-single'];
  const vipProduct = PRODUCTS['spoken-english-vip'];

  // 15-Minute Urgency Countdown Timer
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 52);
  const [showSticky, setShowSticky] = useState(false);
  const [activeFaq, setActiveFaq] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    MetaPixel.pageView('Spoken English Funnel');
    if (mainProduct) {
      MetaPixel.viewContent(mainProduct);
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 15 * 60));
    }, 1000);

    let isTicking = false;
    const handleScroll = () => {
      if (!isTicking) {
        window.requestAnimationFrame(() => {
          setShowSticky(window.scrollY > 350);
          isTicking = false;
        });
        isTicking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [mainProduct]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const faqs = [
    {
      q: 'Kya format hai? (PDF ya koi App?)',
      a: 'Ye universal, crystal-clear digital PDF format mein hai. Download ke baad aap ise apne mobile, tablet, ya laptop par bina kisi internet connection ke offline padh aur practice kar sakte hain.'
    },
    {
      q: 'Kya meri English bilkul zero level / Hindi medium ki hai, toh bhi samajh aayega?',
      a: 'Haan, bilkul! Ye bundle khas Hindi-speaking aur state-board aspirants ke liye hi likha gaya hai. Har situation aur dialog ke saath aasan Hindi explanation aur bolne ka practical tareeka diya gaya hai.'
    },
    {
      q: 'Payment ke baad bundle kaise milega?',
      a: 'Payment confirm hote hi screen par direct Google Drive download link open hoga. Sath hi ek backup download link aapke registered email address par bhi turant bhej diya jayega.'
    },
    {
      q: 'Agar pasand nahi aaya toh refund kaise milega?',
      a: '30 din ki 100% money-back guarantee hai. Agar 30 din practice ke baad bhi aapko apne speaking confidence mein farq na lage, toh support@projuktisoft.shop par WhatsApp ya email karein — bina kisi sawaal ke poore paise wapas.'
    }
  ];

  return (
    <div className="se-funnel-page">
      
      {/* Top Urgency Ticker Bar */}
      <div className="se-top-bar">
        <div className="se-top-bar-content">
          <span className="se-pill-live">⚡ FLASH LAUNCH SALE</span>
          <span>Interview &amp; Career Special: Flat <strong>86% OFF</strong> Ends In: <strong className="se-timer">{formattedTime}</strong></span>
          <span className="se-sep">•</span>
          <span>Complete 4-in-1 Bundle Sirf <strong>₹{mainProduct.price}</strong></span>
        </div>
      </div>

      {/* ========================================================
          SECTION 1: HERO (Screen pe aate hi dikhega — 5-sec rule)
         ======================================================== */}
      <header className="se-hero-section">
        <div className="container se-hero-container">
          
          <div className="se-hero-badges-row">
            <span className="se-badge-pill">🗣️ 30-DAY SPOKEN ENGLISH BLUEPRINT</span>
            <span className="se-badge-guarantee">🛡️ 30 Din Money-Back Guarantee</span>
          </div>

          {/* Headline: Ek line mein transformation */}
          <h1 className="se-hero-headline">
            Interview ke waqt English mein ghabrahat khatam — <span className="se-text-amber">30 din mein</span>, bina kisi course ke
          </h1>

          {/* Subline */}
          <p className="se-hero-subline">
            Spoken English Bundle — <strong>4 practical ebooks</strong> jo aapko real situations mein bolna sikhayengi: interview, office meetings, phone calls, aur banking.
          </p>

          {/* Hero CTA Button (Price button mein dikhe) */}
          <div className="se-hero-cta-box">
            <button
              type="button"
              className="se-btn-primary pulse-btn"
              onClick={() => onBuyProduct(mainProduct)}
            >
              <span>Bundle Lijiye — sirf ₹{mainProduct.price}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <div className="se-micro-trust">
              <span>⚡ 100% Instant PDF Download</span>
              <span>•</span>
              <span>🔒 Bank-Grade Secure UPI</span>
              <span>•</span>
              <span>⭐ 4.9/5 Rating</span>
            </div>
          </div>

          {/* Floating Ebook Covers Visual Preview */}
          <div className="se-hero-mockup-wrap">
            <div className="se-mockup-center">
              <img 
                src="/spoken-english/cover-bundle.svg" 
                alt="Spoke English 4-in-1 Mastery Bundle" 
                className="se-cover-img cover-main"
              />
              <span className="se-cover-tag">4 EBOOKS IN 1</span>
            </div>
            <div className="se-mockup-left">
              <img 
                src="/spoken-english/cover-interview.svg" 
                alt="Job Interview English Mastery" 
                className="se-cover-img cover-sub"
              />
            </div>
            <div className="se-mockup-right">
              <img 
                src="/spoken-english/cover-office.svg" 
                alt="Corporate & Office Meeting Talk" 
                className="se-cover-img cover-sub"
              />
            </div>
          </div>

        </div>
      </header>

      {/* ========================================================
          SECTION 2: PAIN AGITATION (3 lines se zyada nahi)
         ======================================================== */}
      <section className="se-pain-section">
        <div className="container se-pain-container">
          <div className="se-pain-header">
            <span className="se-tag-danger">KYA AAPKE SAATH BHI YE HOTA HAI?</span>
            <h2 className="se-pain-title">3 Relatable Moments Jo Har Aspirant Feel Karta Hai:</h2>
          </div>

          <div className="se-pain-cards-grid">
            <div className="se-pain-card">
              <div className="se-pain-icon">😰</div>
              <p className="se-pain-quote">
                “Interview mein sawal aaya... aur aapka dimaag <strong>blank</strong> ho gaya.”
              </p>
            </div>

            <div className="se-pain-card">
              <div className="se-pain-icon">🤐</div>
              <p className="se-pain-quote">
                “Office mein meeting hui... aapne bas <strong>‘yes sir’</strong> bola.”
              </p>
            </div>

            <div className="se-pain-card">
              <div className="se-pain-icon">⏳</div>
              <p className="se-pain-quote">
                “WhatsApp pe English reply type karte waqt <strong>10 minute</strong> lag gaye.”
              </p>
            </div>
          </div>

          <div className="se-pain-punchline">
            <span>Problem aapki intelligence mein nahi hai — problem ye hai ki school ne grammar padhayi, <strong>real situation mein bolna nahi sikhaya.</strong></span>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 3: KYA MILEGA (What’s Inside & Value Anchor)
         ======================================================== */}
      <section className="se-inside-section" id="what-you-get">
        <div className="container">
          <div className="se-section-header text-center">
            <span className="se-section-tag">WHAT'S INSIDE THE BUNDLE</span>
            <h2 className="se-section-title">Ye Bundle Isliye Banaya: Real Situations Ke Ready-to-Speak Dialogs</h2>
            <p className="se-section-desc">
              Har ebook mein situation-by-situation templates aur practice dialogs hain taaki aapko dimag mein Hindi se translate na karna pade.
            </p>
          </div>

          {/* 4 Ebooks Breakdown */}
          <div className="se-books-grid">
            
            {/* Book 1 */}
            <div className="se-book-card">
              <div className="se-book-badge badge-amber">BOOK 1</div>
              <h3 className="se-book-name">Job Interview English Mastery</h3>
              <p className="se-book-desc">
                50+ most asked HR interview questions, winning answers, salary negotiation scripts, and self-introduction templates.
              </p>
              <div className="se-book-meta">
                <span>📄 85 Pages</span>
                <span>•</span>
                <span>🎯 50+ Real Scenarios</span>
                <span>•</span>
                <span className="se-val-strike">Worth ₹199</span>
              </div>
            </div>

            {/* Book 2 */}
            <div className="se-book-card">
              <div className="se-book-badge badge-coral">BOOK 2</div>
              <h3 className="se-book-name">Corporate &amp; Office Conversation Guide</h3>
              <p className="se-book-desc">
                Daily team meetings, presentation openers, polite email templates, client calls, and leave application scripts.
              </p>
              <div className="se-book-meta">
                <span>📄 92 Pages</span>
                <span>•</span>
                <span>🎯 60+ Scenarios</span>
                <span>•</span>
                <span className="se-val-strike">Worth ₹199</span>
              </div>
            </div>

            {/* Book 3 */}
            <div className="se-book-card">
              <div className="se-book-badge badge-cyan">BOOK 3</div>
              <h3 className="se-book-name">Daily Real-Life Situations Handbook</h3>
              <p className="se-book-desc">
                Banking, shopping malls, doctor visits, airport check-in, hotel booking, and confident telephonic conversations.
              </p>
              <div className="se-book-meta">
                <span>📄 78 Pages</span>
                <span>•</span>
                <span>🎯 45+ Scenarios</span>
                <span>•</span>
                <span className="se-val-strike">Worth ₹149</span>
              </div>
            </div>

            {/* Book 4 */}
            <div className="se-book-card">
              <div className="se-book-badge badge-green">BOOK 4</div>
              <h3 className="se-book-name">1000+ Must-Know Daily Phrases &amp; Idioms</h3>
              <p className="se-book-desc">
                Natural fluent phrases jo native speakers bolte hain. Dimag mein Hindi se translate kiye bina direct natural English bolne ke liye.
              </p>
              <div className="se-book-meta">
                <span>📄 65 Pages</span>
                <span>•</span>
                <span>🎯 1000+ Ready Phrases</span>
                <span>•</span>
                <span className="se-val-strike">Worth ₹149</span>
              </div>
            </div>

          </div>

          {/* Total Value Anchor Box */}
          <div className="se-value-anchor-card text-center">
            <div className="se-anchor-math">
              <span>Agar alag se lete: Book 1 (₹199) + Book 2 (₹199) + Book 3 (₹149) + Book 4 (₹149) = <del>₹696 Total Value</del></span>
            </div>
            <div className="se-anchor-deal">
              <span>Aaj Complete 4-in-1 Bundle: </span>
              <strong className="se-deal-price">Sirf ₹{mainProduct.price}</strong>
              <span className="se-deal-save">(Save ₹597 • 86% OFF)</span>
            </div>
            <div style={{ marginTop: '16px' }}>
              <button
                type="button"
                className="se-btn-primary"
                onClick={() => onBuyProduct(mainProduct)}
              >
                <span>Bundle Lijiye — sirf ₹{mainProduct.price} →</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          SECTION 4: RESULT PROOF (Authentic Beta Test)
         ======================================================== */}
      <section className="se-proof-section">
        <div className="container">
          <div className="se-section-header text-center">
            <span className="se-section-tag">EARLY LEARNER FEEDBACK</span>
            <h2 className="se-section-title">1-Week Beta Test Feedback: Unke Apne Words Mein</h2>
            <p className="se-section-desc">
              Koi fake 50,000 downloads ka claim nahi — dekhiye un early learners ke real experiences jinhone interview se pehle is bundle ko practice kiya:
            </p>
          </div>

          <div className="se-testimonials-grid">
            <div className="se-testi-card">
              <div className="se-testi-stars">★★★★★</div>
              <p className="se-testi-text">
                “Bhai main hamesha ‘Tell me about yourself’ par atakta tha. Book 1 ka ready template yaad kiya aur do mock interviews diye — bina kisi translation gap ke confident bol paya!”
              </p>
              <div className="se-testi-user">
                <span className="se-user-avatar">R</span>
                <div>
                  <strong>Rahul Verma</strong>
                  <span>Selected in MNC Back-Office • Guwahati</span>
                </div>
              </div>
            </div>

            <div className="se-testi-card">
              <div className="se-testi-stars">★★★★★</div>
              <p className="se-testi-text">
                “Office daily standup mein main bas ‘Yes, working on it’ bolke chup ho jati thi. Book 2 ke meeting openers use kiye, team lead ne khud notice kiya ki meri communication better ho rahi hai.”
              </p>
              <div className="se-testi-user">
                <span className="se-user-avatar">S</span>
                <div>
                  <strong>Sneha Patil</strong>
                  <span>Operations Executive • Pune</span>
                </div>
              </div>
            </div>

            <div className="se-testi-card">
              <div className="se-testi-stars">★★★★★</div>
              <p className="se-testi-text">
                “WhatsApp aur email draft karne mein pehle 10-15 minute lagte the. Book 4 ke 1000 phrases itne practical hain ki typing aur bolne mein natural feel aane laga hai.”
              </p>
              <div className="se-testi-user">
                <span className="se-user-avatar">A</span>
                <div>
                  <strong>Amit Das</strong>
                  <span>Banking &amp; ADRE Aspirant • Silchar</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 5: GUARANTEE + OBJECTION KILLER (1 Box)
         ======================================================== */}
      <section className="se-guarantee-section">
        <div className="container">
          <div className="se-guarantee-box text-center">
            <div className="se-shield-icon">🛡️</div>
            <h2 className="se-guarantee-title">30 Din Mein English Bolna Nahi Aaya Toh Poore Paise Wapas</h2>
            <p className="se-guarantee-desc">
              Ye sirf padhne wali normal theory ebook nahi hai — <strong>ye ek real practice bundle hai</strong>. Har section ke end mein daily speaking practice exercises aur dialog scripts hain jise aapko zor se bolkar practice karna hai.
            </p>
            <div className="se-guarantee-terms">
              <span>Bina kisi sawaal ke 100% refund direct aapke bank ya UPI me wapas. Zero risk.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 6: PRICE + CTA (3-Tier Pricing Stack)
         ======================================================== */}
      <section className="se-pricing-section" id="pricing-tiers">
        <div className="container">
          <div className="se-section-header text-center">
            <span className="se-section-tag">CHOOSE YOUR ACCESS TIER</span>
            <h2 className="se-section-title">Simple Transparent Pricing in Indian Rupees (INR)</h2>
            <p className="se-section-desc">
              Aap apni requirement ke mutabiq starter single ebook le sakte hain ya complete 4-in-1 bundle unlock kar sakte hain.
            </p>
          </div>

          <div className="se-pricing-grid">
            
            {/* Tier 1: Single Book Starter */}
            <div className="se-pricing-card">
              <div className="tier-header">
                <span className="tier-tag">TIER 1 • STARTER</span>
                <h3 className="tier-name">1 Ebook (Interview Only)</h3>
                <p className="tier-desc">Job Interview English Mastery Book</p>
              </div>

              <div className="tier-price-box">
                <span className="tier-price">₹{singleProduct.price}</span>
                <del className="tier-old">₹{singleProduct.originalPrice}</del>
              </div>

              <ul className="tier-checklist">
                <li>✓ Book 1: Job Interview English Mastery</li>
                <li>✓ 50+ Real Interview Questions &amp; Answers</li>
                <li>✓ Self-Introduction &amp; HR Templates</li>
                <li>✓ Instant Offline PDF Download</li>
              </ul>

              <button
                type="button"
                className="se-btn-tier btn-tier-secondary"
                onClick={() => onBuyProduct(singleProduct)}
              >
                <span>Get Starter (₹{singleProduct.price}) →</span>
              </button>
            </div>

            {/* Tier 2: Complete 4-in-1 Bundle (Featured / Best Value) */}
            <div className="se-pricing-card tier-featured">
              <div className="tier-ribbon">⭐ MOST POPULAR • BEST VALUE</div>
              
              <div className="tier-header">
                <span className="tier-tag" style={{ color: '#fbbf24' }}>TIER 2 • COMPLETE BUNDLE</span>
                <h3 className="tier-name">Complete 4-in-1 Spoken English Bundle</h3>
                <p className="tier-desc">Interview + Office + Daily Talk + 1000 Phrases</p>
              </div>

              <div className="tier-price-box">
                <span className="tier-price text-amber">₹{mainProduct.price}</span>
                <del className="tier-old">₹{mainProduct.originalPrice}</del>
                <span className="tier-save-badge">Save 86%</span>
              </div>

              <ul className="tier-checklist">
                <li>✓ <strong>Book 1:</strong> Job Interview English Mastery</li>
                <li>✓ <strong>Book 2:</strong> Corporate &amp; Office Conversation Guide</li>
                <li>✓ <strong>Book 3:</strong> Daily Real-Life Situations Handbook</li>
                <li>✓ <strong>Book 4:</strong> 1000+ Must-Know Daily Phrases &amp; Idioms</li>
                <li>✓ Speaking practice exercises at end of every chapter</li>
                <li>✓ <strong>30-Day 100% Money-Back Guarantee</strong></li>
                <li>✓ Lifetime free access &amp; future version updates</li>
              </ul>

              <button
                type="button"
                className="se-btn-tier btn-tier-primary"
                onClick={() => onBuyProduct(mainProduct)}
              >
                <span>Bundle Lijiye — sirf ₹{mainProduct.price} →</span>
              </button>
            </div>

            {/* Tier 3: VIP Creator Stack (Cross-sell with Creative Themes) */}
            <div className="se-pricing-card">
              <div className="tier-header">
                <span className="tier-tag" style={{ color: '#38bdf8' }}>TIER 3 • VIP STACK</span>
                <h3 className="tier-name">Bundle + 50+ CineMood Presets</h3>
                <p className="tier-desc">English Bundle + Lightroom Color Grading Pack</p>
              </div>

              <div className="tier-price-box">
                <span className="tier-price text-cyan">₹{vipProduct.price}</span>
                <del className="tier-old">₹{vipProduct.originalPrice}</del>
              </div>

              <ul className="tier-checklist">
                <li>✓ <strong>All 4 Spoken English Ebooks</strong></li>
                <li>✓ <strong>BONUS:</strong> CineMood 50+ Cinematic Lightroom Presets</li>
                <li>✓ 1-Click Mobile DNG Photo Grading Profiles</li>
                <li>✓ Career &amp; Instagram creator assets combined</li>
                <li>✓ 30-Day Money-Back Guarantee</li>
              </ul>

              <button
                type="button"
                className="se-btn-tier btn-tier-secondary"
                onClick={() => onBuyProduct(vipProduct)}
              >
                <span>Get Bundle + Themes (₹{vipProduct.price}) →</span>
              </button>
            </div>

          </div>

          <div className="se-upi-note text-center">
            <span>🔒 UPI (Google Pay, PhonePe, Paytm, QR), Cards, Netbanking — <strong>Turant Instant Download Milega</strong></span>
          </div>

        </div>
      </section>

      {/* ========================================================
          SECTION 7: FAQ (Sirf 4, no more)
         ======================================================== */}
      <section className="se-faq-section">
        <div className="container se-faq-container">
          <div className="se-section-header text-center">
            <span className="se-section-tag">COMMON QUESTIONS</span>
            <h2 className="se-section-title">Frequently Asked Questions</h2>
          </div>

          <div className="se-faq-list">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className={`se-faq-item ${activeFaq === idx ? 'active' : ''}`}
                onClick={() => setActiveFaq(activeFaq === idx ? -1 : idx)}
              >
                <div className="se-faq-question">
                  <span>{faq.q}</span>
                  <span className="se-faq-toggle">{activeFaq === idx ? '−' : '+'}</span>
                </div>
                {activeFaq === idx && (
                  <div className="se-faq-answer animate-fadeIn">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Sleek Minimal Compliant Footer */}
      <footer className="funnel-minimal-footer">
        <div className="container text-center">
          <div className="funnel-footer-brand">
            <img src="/logo.png" alt="ProjuktiSoft Logo" className="funnel-footer-logo" />
            <span>ProjuktiSoft</span>
          </div>
          <p className="funnel-footer-notice">
            Official Spoken English Mastery Practice Bundle by ProjuktiSoft. Billed securely in <strong>Indian Rupees (INR - ₹)</strong>. 100% Instant Digital PDF Delivery.
          </p>
          <div className="funnel-footer-links">
            <a href="/my-downloads" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('my-downloads'); }} className="highlight">
              📥 Access My Downloads
            </a>
            <span>•</span>
            <a href="/contact" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('contact'); }}>
              Contact Us
            </a>
            <span>•</span>
            <a href="/terms" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('terms'); }}>
              Terms &amp; Conditions
            </a>
            <span>•</span>
            <a href="/refund-policy" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('refund'); }}>
              Refund Policy
            </a>
            <span>•</span>
            <a href="/privacy-policy" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('privacy'); }}>
              Privacy Policy
            </a>
          </div>
          <p className="funnel-footer-copy">
            © 2026 ProjuktiSoft. All rights reserved. Self-study practice material for competitive job aspirants.
          </p>
        </div>
      </footer>

      {/* Sticky Bottom Buy Bar on Phone & Desktop */}
      {showSticky && (
        <div className="se-sticky-buy-bar animate-slideUp">
          <div className="se-sticky-content">
            <div className="se-sticky-info">
              <span className="se-sticky-badge">4 EBOOKS</span>
              <div className="se-sticky-text">
                <span className="se-sticky-title">Spoken English 4-in-1 Bundle</span>
                <div className="se-sticky-price-row">
                  <span className="se-sticky-price">₹{mainProduct.price}</span>
                  <del className="se-sticky-old">₹{mainProduct.originalPrice}</del>
                  <span className="se-sticky-timer-pill">⏳ {formattedTime}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="se-sticky-btn"
              onClick={() => onBuyProduct(mainProduct)}
            >
              <span>Bundle Lijiye — sirf ₹{mainProduct.price} →</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
