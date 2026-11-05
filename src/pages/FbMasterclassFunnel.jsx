import React, { useState, useEffect } from 'react';
import { PRODUCTS } from '../data/products';
import { MetaPixel } from '../components/MetaPixel';

// Helper to support both Google Drive and YouTube video embeds seamlessly
const getVideoSource = (rawUrl) => {
  if (!rawUrl) {
    return {
      type: 'youtube',
      src: 'https://www.youtube-nocookie.com/embed/qp0X4q3VRmo?enablejsapi=1&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1'
    };
  }

  // 1. Google Drive Share Link: drive.google.com/file/d/FILE_ID/view -> /preview
  if (rawUrl.includes('drive.google.com')) {
    const match = rawUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    const fileId = match ? match[1] : '';
    if (fileId) {
      return {
        type: 'gdrive',
        src: `https://drive.google.com/file/d/${fileId}/preview`
      };
    }
  }

  // 2. YouTube Video Link (watch?v=, youtu.be/, or raw ID)
  const ytMatch = rawUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  const videoId = ytMatch ? ytMatch[1] : (rawUrl.length === 11 ? rawUrl : 'qp0X4q3VRmo');
  
  return {
    type: 'youtube',
    src: `https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1`
  };
};

export default function FbMasterclassFunnel({ onBuyProduct, onNavigate }) {
  const product = PRODUCTS['fb-masterclass'];
  const videoSource = getVideoSource(product?.demoVideoUrl || product?.demoVideoId || 'qp0X4q3VRmo');

  // 15-Minute Countdown Timer
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 52);
  const [showSticky, setShowSticky] = useState(false);
  const [activeModule, setActiveModule] = useState(null);
  const [activeFaq, setActiveFaq] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    MetaPixel.pageView('USA Facebook Earning Masterclass');
    if (product) {
      MetaPixel.viewContent(product);
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 15 * 60));
    }, 1000);

    let isTicking = false;
    const handleScroll = () => {
      if (!isTicking) {
        window.requestAnimationFrame(() => {
          setShowSticky(window.scrollY > 420);
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
  }, [product]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const faqs = [
    {
      q: 'Kya is course ke liye laptop/computer zaroori hai ya phone se bhi kar sakte hain?',
      a: 'Aap phone aur PC dono se kar sakte hain. Module 9 mein humne specially PC aur Mobile dono methods detail mein cover kiye hain taaki agar aapke paas sirf smartphone hai toh bhi aap page manage, content post aur views boost kar sakein.'
    },
    {
      q: 'Kya copyright strike ya page red/demonetize hone ka risk hai?',
      a: 'Nahi! Is course ka sabse bada USP hi TOS-Safe aur Copyright-Safe methods hain. Module 8 (Licensed Content Repurposing) aur Module 3 (Growth & Safe Limits) mein humne wahi proprietary frameworks sikhaye hain jisse pages bina kisi strike ke saalon chalte hain.'
    },
    {
      q: 'USA Dollar earning India ke bank account mein kaise aayegi?',
      a: 'Module 12 poora Payout Setup par dedicated hai. Humne step-by-step dikhaya hai ki kaise Payoneer ya Wise ke through direct Indian Bank Account (jaise Punjab National Bank, SBI, HDFC) mein dollar convert hoke direct rupee transfer hota hai.'
    },
    {
      q: 'FREE Starter Pack (2 Hours) aur Full Masterclass mein kya antar hai?',
      a: 'Free Starter Pack (jo upar video player mein hai) full course ka sirf 10% introductory preview hai. Full 10+ Hours Masterclass mein baki ke saare 13 detailed modules, AI Automation scripts, USA Active Groups matrix, private WhatsApp VIP community aur regular lifetime updates shamil hain.'
    },
    {
      q: 'Agar kahin doubt aaya toh support kaise milega?',
      a: 'Masterclass join karte hi aapko private VIP WhatsApp Support Group ka direct invite link milta hai jahan hum regularly updates, queries aur troubleshooting provide karte hain.'
    }
  ];

  return (
    <div className="fb-funnel-page">
      
      {/* Top Urgency Ticker Bar */}
      <div className="fb-top-bar">
        <div className="fb-top-bar-content">
          <span className="fb-pill-live">⚡ FLASH LAUNCH SALE</span>
          <span>USA Monetization 2026: Flat <strong>94% OFF</strong> Ends In: <strong className="fb-timer">{formattedTime}</strong></span>
          <span className="fb-sep">•</span>
          <span>Complete 10+ Hours Masterclass Sirf <strong>₹{product.price}</strong></span>
        </div>
      </div>

      {/* ========================================================
          HERO SECTION (5-Second Conversion Hook)
         ======================================================== */}
      <header className="fb-hero-section">
        <div className="container fb-hero-container">
          
          <div className="fb-hero-badges-row">
            <span className="fb-badge-pill">🔥 2026 FACEBOOK MONETIZATION BLUEPRINT</span>
            <span className="fb-badge-safe">🛡️ 100% TOS &amp; Ban-Proof System</span>
          </div>

          <h1 className="fb-hero-title">
            USA Facebook Earning Masterclass 2026
          </h1>

          <p className="fb-hero-subtitle">
            <span className="fb-gradient-text">Zero se 7-Figure tak (10+ Hours)</span> — USA Facebook Earning ka poora system: 3 proven methods, 10+ ghante, zero se automation tak.
          </p>

          <div className="fb-hero-problem-box">
            <p>
              “Facebook se earning karni hai lekin kahan se shuru karna hai, yeh nahi pata? Is 10+ ghanton ke step-by-step course mein poori strategy hai — zero se lekar full automation tak.”
            </p>
          </div>

          {/* CTA Box */}
          <div className="fb-hero-cta-box">
            <button
              type="button"
              className="fb-btn-primary pulse-btn"
              onClick={() => onBuyProduct(product)}
            >
              <span>Masterclass Unlock Karein — sirf ₹{product.price}</span>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <div className="fb-micro-trust">
              <span>⚡ 10+ Hours Instant Access</span>
              <span>•</span>
              <span>💬 VIP WhatsApp Group</span>
              <span>•</span>
              <span>🔒 100% Safe UPI</span>
              <span>•</span>
              <span>⭐ 4.9/5 Rating</span>
            </div>
          </div>

          {/* Visual Hero Mockup */}
          <div className="fb-hero-cover-wrap">
            <img 
              src="/fb-masterclass/cover-masterclass.svg" 
              alt="USA Facebook Earning Masterclass 2026" 
              className="fb-hero-cover-img"
            />
            <div className="fb-verified-payout-chip">
              <span className="chip-dot"></span>
              <span>Verified Payout: <strong>$15,353.41 (₹12,80,000+)</strong></span>
            </div>
          </div>

        </div>
      </header>

      {/* ========================================================
          5 CORE PILLARS STRATEGY (Is Course Mein Sikhoge)
         ======================================================== */}
      <section className="fb-pillars-section">
        <div className="container">
          <div className="fb-section-header text-center">
            <span className="fb-section-tag">CORE FRAMEWORK</span>
            <h2 className="fb-section-title">Is Course Mein Kya Sikhoge?</h2>
            <p className="fb-section-desc">
              Ye 5 proven pillars aapko zero experience se high-RPM USA Facebook earning tak le jayenge:
            </p>
          </div>

          <div className="fb-pillars-grid">
            
            {/* Pillar 1 */}
            <div className="fb-pillar-card">
              <div className="fb-pillar-icon-box icon-blue">📍</div>
              <div className="fb-pillar-content">
                <span className="fb-pillar-label">METHOD 1</span>
                <h3>USA Group Sharing Method</h3>
                <p>Active high-engagement USA groups mein ban-proof safe posting, group matrix rules aur organic reach multiplication.</p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="fb-pillar-card">
              <div className="fb-pillar-icon-box icon-emerald">💰</div>
              <div className="fb-pillar-content">
                <span className="fb-pillar-label">METHOD 2</span>
                <h3>Paid Method ($10-20 Budget)</h3>
                <p>Sirf $10-20 chote ad-budget se ad-based views generate karke pages ko ROI-positive aur instant monetize banane ka formula.</p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="fb-pillar-card">
              <div className="fb-pillar-icon-box icon-cyan">📄</div>
              <div className="fb-pillar-content">
                <span className="fb-pillar-label">METHOD 3</span>
                <h3>Page Sharing Method</h3>
                <p>Bade USA established pages se share requests aur cross-promotion partnerships bina high cost ke hasil karna.</p>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="fb-pillar-card">
              <div className="fb-pillar-icon-box icon-amber">📺</div>
              <div className="fb-pillar-content">
                <span className="fb-pillar-label">MONETIZATION</span>
                <h3>TV Show Repurposing</h3>
                <p>Licensed TV shows aur viral content se ad revenue generate karna — 100% copyright-safe aur fair-use compliant strategy.</p>
              </div>
            </div>

            {/* Pillar 5 */}
            <div className="fb-pillar-card fb-pillar-full">
              <div className="fb-pillar-icon-box icon-purple">🤖</div>
              <div className="fb-pillar-content">
                <span className="fb-pillar-label">SPEED &amp; SCALE</span>
                <h3>Full AI Automation</h3>
                <p>AI tools aur prompt workflows se 1 din mein 10 active pages ka high-retention video content generate aur schedule karein.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          🎁 FREE STARTER PACK (2 HOURS) VIDEO SECTION
          Guaranteed No External YouTube Redirect
         ======================================================== */}
      <section className="fb-demo-section" id="starter-pack">
        <div className="container">
          <div className="fb-demo-wrapper">
            
            <div className="fb-demo-header text-center">
              <span className="fb-starter-pill">🎁 100% FREE STARTER PACK (2 HOURS)</span>
              <h2 className="fb-demo-title">Full Course Ka 10% — Pehle Dekho, Phir Lene Ka Socho</h2>
              <p className="fb-demo-desc">
                Hum hawa mein baat nahi karte — yeh 2 ghante ka starter pack dekhkar strategy samjhein. Video isi screen par chalegi bina kisi ad ya redirect ke:
              </p>
            </div>

            {/* Protected Video Embed Container */}
            <div className="fb-video-container">
              
              {/* Top Shield Header: Intercepts clicks to prevent YouTube title navigation */}
              <div className="fb-video-shield-top">
                <div className="fb-shield-brand">
                  <span className="shield-dot-live"></span>
                  <span>ProjuktiSoft HD Player • Module 1 &amp; 2 Free Starter Pack (2 Hours)</span>
                </div>
                <span className="fb-shield-tag">Direct In-App Stream</span>
              </div>

              {/* Sandboxed Video iframe: WITHOUT allow-popups and WITHOUT allow-top-navigation */}
              <div className="fb-iframe-responsive">
                <iframe
                  src={videoSource.src}
                  title="USA Facebook Earning Masterclass Starter Pack"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                  allowFullScreen
                  sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
                  className="fb-video-iframe"
                ></iframe>
                
                {/* Bottom-right watermark shield (when playing YouTube embeds) */}
                {videoSource.type === 'youtube' && (
                  <div 
                    className="fb-video-shield-watermark" 
                    title="Watch right here on ProjuktiSoft"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <span>ProjuktiSoft HD</span>
                  </div>
                )}
              </div>

              {/* Post-Video Unlock Notice */}
              <div className="fb-demo-footer-card">
                <div className="fb-demo-footer-info">
                  <span className="fb-tag-info">YEH SIRF 10% PREVIEW HAI</span>
                  <p>
                    Baki 90% Advanced Content, TV Show Repurposing, AI Automation &amp; Payout Setup full 10+ hours masterclass mein unlock hoga:
                  </p>
                </div>
                <button
                  type="button"
                  className="fb-btn-primary fb-btn-compact"
                  onClick={() => onBuyProduct(product)}
                >
                  <span>Complete Masterclass Unlock (₹{product.price}) →</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          PAYMENT PROOF & REAL ANALYTICS SECTION
         ======================================================== */}
      <section className="fb-proof-section" id="proofs">
        <div className="container">
          
          <div className="fb-section-header text-center">
            <span className="fb-section-tag tag-emerald">VERIFIED PAYMENT PROOF</span>
            <h2 className="fb-section-title">Live Facebook In-Stream Monetization Payouts</h2>
            <p className="fb-section-desc">
              Koi photoshop ya hypothetical claims nahi — dekhiye live meta transactions aur direct Indian bank transfer receipts:
            </p>
          </div>

          {/* 3 Metric Summary Boxes */}
          <div className="fb-metrics-row">
            <div className="fb-metric-card">
              <span className="fb-metric-value text-emerald">$15,353.41</span>
              <span className="fb-metric-label">Single Month Bank Payout</span>
              <span className="fb-metric-sub">₹12,80,000+ Direct in Indian Bank</span>
            </div>

            <div className="fb-metric-card">
              <span className="fb-metric-value text-blue">13M+ Views</span>
              <span className="fb-metric-label">28-Day Video Reach</span>
              <span className="fb-metric-sub">↑ 132% Verified Organic Growth</span>
            </div>

            <div className="fb-metric-card">
              <span className="fb-metric-value text-amber">$3,131+</span>
              <span className="fb-metric-label">Per-Page Monthly Ad Earning</span>
              <span className="fb-metric-sub">Consistent In-Stream Ads Revenue</span>
            </div>
          </div>

          {/* 3 Proof Screenshots Grid */}
          <div className="fb-proofs-grid">
            
            {/* Proof 1: Analytics */}
            <div className="fb-proof-card" onClick={() => setPreviewImage('/fb-masterclass/proof-analytics-13m.webp')}>
              <div className="fb-proof-header">
                <span className="fb-proof-tag tag-blue">28 DAYS ANALYTICS</span>
                <span className="fb-proof-zoom-hint">🔍 Tap to Zoom</span>
              </div>
              <div className="fb-proof-img-wrap">
                <img 
                  src="/fb-masterclass/proof-analytics-13m.webp" 
                  alt="Facebook 13M Views Analytics Proof" 
                  className="fb-proof-img" 
                />
              </div>
              <div className="fb-proof-caption">
                <strong>13 Million Views &amp; $1,493.57</strong>
                <p>28 Days Growth: 132% views hike aur 721K+ engagement rate.</p>
              </div>
            </div>

            {/* Proof 2: Transactions */}
            <div className="fb-proof-card" onClick={() => setPreviewImage('/fb-masterclass/proof-payout-transactions.png')}>
              <div className="fb-proof-header">
                <span className="fb-proof-tag tag-emerald">META TRANSACTIONS</span>
                <span className="fb-proof-zoom-hint">🔍 Tap to Zoom</span>
              </div>
              <div className="fb-proof-img-wrap">
                <img 
                  src="/fb-masterclass/proof-payout-transactions.png" 
                  alt="Facebook In-Stream Monetization Payout Transactions" 
                  className="fb-proof-img" 
                />
              </div>
              <div className="fb-proof-caption">
                <strong>$3,131.91 &amp; $3,119.87 Multiple Pages</strong>
                <p>May 17 Payout: $15,353.41 Paid to Punjab National Bank.</p>
              </div>
            </div>

            {/* Proof 3: Detail */}
            <div className="fb-proof-card" onClick={() => setPreviewImage('/fb-masterclass/proof-payout-detail.jpg')}>
              <div className="fb-proof-header">
                <span className="fb-proof-tag tag-purple">BANK CREDITED DETAILS</span>
                <span className="fb-proof-zoom-hint">🔍 Tap to Zoom</span>
              </div>
              <div className="fb-proof-img-wrap">
                <img 
                  src="/fb-masterclass/proof-payout-detail.jpg" 
                  alt="Punjab National Bank Paid Status $15,353" 
                  className="fb-proof-img" 
                />
              </div>
              <div className="fb-proof-caption">
                <strong>Status: PAID ✓ ($15,353.41)</strong>
                <p>Direct bank transfer confirmation with verified Meta Transaction ID.</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          KYA MILEGA (WHAT’S INSIDE DELIVERABLES STACK)
         ======================================================== */}
      <section className="fb-deliverables-section">
        <div className="container">
          <div className="fb-deliverables-box">
            
            <div className="fb-deliverables-left">
              <span className="fb-section-tag">PACKAGE DELIVERABLES</span>
              <h2 className="fb-deliverables-title">Kya Milega Masterclass Ke Sath:</h2>
              
              <ul className="fb-deliverables-list">
                <li>
                  <span className="fb-check">✓</span>
                  <div>
                    <strong>13 Complete In-Depth HD Video Modules</strong>
                    <p>10+ ghante ka step-by-step training video course zero se lekar scale karne tak.</p>
                  </div>
                </li>
                <li>
                  <span className="fb-check">✓</span>
                  <div>
                    <strong>Action Checklists &amp; PDF Guides</strong>
                    <p>Har module ke end mein exact actionable checklist taaki confuse na hona pade.</p>
                  </div>
                </li>
                <li>
                  <span className="fb-check">✓</span>
                  <div>
                    <strong>Real Earning Screenshots &amp; Case Studies</strong>
                    <p>Proven high-RPM niches, viral hooks aur live analytics breakdown.</p>
                  </div>
                </li>
                <li>
                  <span className="fb-check">✓</span>
                  <div>
                    <strong>Private VIP WhatsApp Support Group</strong>
                    <p>Sirf verified buyers ke liye dedicated community — queries aur support ke liye.</p>
                  </div>
                </li>
                <li>
                  <span className="fb-check">✓</span>
                  <div>
                    <strong>Free Lifetime Updates</strong>
                    <p>Future mein jab bhi Facebook algorithm ya nayi method aayegi, course mein free add hogi.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="fb-deliverables-right">
              <div className="fb-val-stack-card">
                <span className="fb-val-pill">TOTAL VALUE STACK</span>
                <ul className="fb-val-lines">
                  <li><span>10+ Hours Video Course</span> <strong>₹2,499</strong></li>
                  <li><span>13 Action Checklists &amp; PDFs</span> <strong>₹999</strong></li>
                  <li><span>VIP WhatsApp Community</span> <strong>₹999</strong></li>
                  <li><span>Lifetime Updates &amp; Support</span> <strong>₹500</strong></li>
                </ul>
                <div className="fb-val-total">
                  <span>Total Value: <del>₹4,999</del></span>
                  <div className="fb-val-today">
                    <span>Aaj Launch Offer:</span>
                    <strong>Sirf ₹{product.price}</strong>
                  </div>
                </div>
                <button
                  type="button"
                  className="fb-btn-primary"
                  onClick={() => onBuyProduct(product)}
                >
                  <span>Abhi Access Unlock Karein →</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          13 MODULES CURRICULUM ACCORDION
         ======================================================== */}
      <section className="fb-curriculum-section" id="curriculum">
        <div className="container">
          <div className="fb-section-header text-center">
            <span className="fb-section-tag">CURRICULUM BREAKDOWN</span>
            <h2 className="fb-section-title">Complete 13 Modules (10+ Hours)</h2>
            <p className="fb-section-desc">
              Har module practical screen-recording aur clear Hindi explanation ke saath step-by-step cover kiya gaya hai:
            </p>
          </div>

          <div className="fb-modules-grid">
            {product.modules.map((mod) => (
              <div 
                key={mod.id} 
                className={`fb-module-item ${activeModule === mod.id ? 'active' : ''}`}
                onClick={() => setActiveModule(activeModule === mod.id ? null : mod.id)}
              >
                <div className="fb-module-num">MOD {mod.id}</div>
                <div className="fb-module-info">
                  <h4>{mod.title}</h4>
                  <span className="fb-module-duration">⏱️ {mod.duration}</span>
                </div>
                <div className="fb-module-toggle">
                  {activeModule === mod.id ? '−' : '+'}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================
          PRICING & FINAL CTA SECTION
         ======================================================== */}
      <section className="fb-pricing-section" id="enroll">
        <div className="container">
          
          <div className="fb-pricing-card">
            <div className="fb-pricing-ribbon">⭐ LIMITED TIME LAUNCH DEAL • 94% OFF</div>
            
            <div className="fb-pricing-header text-center">
              <span className="fb-tier-tag">FULL ACCESS PASS</span>
              <h2 className="fb-pricing-name">USA Facebook Earning Masterclass 2026</h2>
              <p className="fb-pricing-tagline">Zero se 7-Figure tak (10+ Hours Complete Step-by-Step System)</p>
            </div>

            <div className="fb-price-display text-center">
              <div className="fb-price-numbers">
                <span className="fb-currency">₹</span>
                <span className="fb-amount">{product.price}</span>
                <del className="fb-old-amount">₹{product.originalPrice}</del>
              </div>
              <span className="fb-discount-pill">Save ₹4,700 Today</span>
            </div>

            <div className="fb-checklist-box">
              <ul className="fb-checklist-grid">
                <li>✓ Full 10+ Hours Video Course (13 Modules)</li>
                <li>✓ USA Active Group Sharing Matrix (Ban-Proof)</li>
                <li>✓ $10-20 Paid Ad Setup Strategy</li>
                <li>✓ Copyright-Safe TV Show Repurposing</li>
                <li>✓ 1-Day 10 Pages AI Automation Scripts</li>
                <li>✓ Payoneer &amp; Wise Indian Bank Payout Guide</li>
                <li>✓ 13 Downloadable Action Checklists [PDF]</li>
                <li>✓ Private VIP WhatsApp Support Group</li>
                <li>✓ Free Lifetime Updates on Nayi Methods</li>
              </ul>
            </div>

            <div className="fb-pricing-action">
              <button
                type="button"
                className="fb-btn-primary pulse-btn fb-btn-big"
                onClick={() => onBuyProduct(product)}
              >
                <span>Masterclass Lijiye — Sirf ₹{product.price}</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="fb-payment-reassurance text-center">
              <div className="fb-pay-icons">
                <span>⚡ Instant Google Drive Access</span>
                <span>•</span>
                <span>🔒 UPI (GPay, PhonePe, Paytm, QR)</span>
                <span>•</span>
                <span>💳 Netbanking &amp; Cards</span>
              </div>
              <p className="fb-pay-subnote">
                Payment ke turant baad screen par access link open hoga aur backup link aapke email par bhej diya jayega.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          FREQUENTLY ASKED QUESTIONS (FAQs)
         ======================================================== */}
      <section className="fb-faq-section">
        <div className="container fb-faq-container">
          <div className="fb-section-header text-center">
            <span className="fb-section-tag">COMMON QUESTIONS</span>
            <h2 className="fb-section-title">Frequently Asked Questions</h2>
          </div>

          <div className="fb-faq-list">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className={`fb-faq-item ${activeFaq === idx ? 'active' : ''}`}
                onClick={() => setActiveFaq(activeFaq === idx ? -1 : idx)}
              >
                <div className="fb-faq-question">
                  <span>{faq.q}</span>
                  <span className="fb-faq-toggle">{activeFaq === idx ? '−' : '+'}</span>
                </div>
                {activeFaq === idx && (
                  <div className="fb-faq-answer animate-fadeIn">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="funnel-minimal-footer">
        <div className="container text-center">
          <div className="funnel-footer-brand">
            <img src="/logo.png" alt="ProjuktiSoft Logo" className="funnel-footer-logo" />
            <span>ProjuktiSoft</span>
          </div>
          <p className="funnel-footer-notice">
            Official USA Facebook Earning Masterclass 2026 by ProjuktiSoft. Billed securely in <strong>Indian Rupees (INR - ₹)</strong>. 100% Instant Digital Access.
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
            © 2026 ProjuktiSoft. All rights reserved. Meta / Facebook is a registered trademark of Meta Platforms, Inc. This site is not affiliated with Meta Platforms, Inc.
          </p>
        </div>
      </footer>

      {/* Sticky Bottom Buy Bar */}
      {showSticky && (
        <div className="fb-sticky-buy-bar animate-slideUp">
          <div className="fb-sticky-content">
            <div className="fb-sticky-info">
              <span className="fb-sticky-badge">10+ HOURS</span>
              <div className="fb-sticky-text">
                <span className="fb-sticky-title">USA Facebook Earning Masterclass 2026</span>
                <div className="fb-sticky-price-row">
                  <span className="fb-sticky-price">₹{product.price}</span>
                  <del className="fb-sticky-old">₹{product.originalPrice}</del>
                  <span className="fb-sticky-timer-pill">⏳ {formattedTime}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="fb-sticky-btn"
              onClick={() => onBuyProduct(product)}
            >
              <span>Masterclass Lijiye — sirf ₹{product.price} →</span>
            </button>
          </div>
        </div>
      )}

      {/* Lightbox Modal for Proof Images */}
      {previewImage && (
        <div className="fb-lightbox-overlay animate-fadeIn" onClick={() => setPreviewImage(null)}>
          <div className="fb-lightbox-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              className="fb-lightbox-close"
              onClick={() => setPreviewImage(null)}
            >
              ✕
            </button>
            <img src={previewImage} alt="Payment Proof Full View" className="fb-lightbox-img" />
          </div>
        </div>
      )}

    </div>
  );
}

