import React, { useState, useEffect } from 'react';
import { funnelManager } from '../data/funnelManager';
import { MetaPixel } from '../components/MetaPixel';

// Helper to support both Google Drive and YouTube video embeds seamlessly
export const getVideoSource = (rawUrl) => {
  if (!rawUrl) {
    return {
      type: 'gdrive',
      src: 'https://drive.google.com/file/d/1zxeZfgmfTwdZkHMOMIoJpb9A6Qh4EJvJ/preview'
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
  if (ytMatch) {
    return {
      type: 'youtube',
      src: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?enablejsapi=1&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1`
    };
  }

  return {
    type: 'generic',
    src: rawUrl
  };
};

export default function FbMasterclassFunnel({ 
  slug = 'fb-masterclass', 
  product: propProduct, 
  config: propConfig, 
  onBuyProduct, 
  onNavigate,
  isPreview = false 
}) {
  // Resolve product & funnel configuration
  const product = propProduct || funnelManager.getProduct(slug) || funnelManager.getProduct('fb-masterclass');
  const funnelConfig = propConfig || funnelManager.getFunnelConfig(product?.id || slug);
  const sections = funnelConfig?.sections || [];

  // Countdown Timer
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 52);
  const [showSticky, setShowSticky] = useState(false);
  const [activeModule, setActiveModule] = useState(null);
  const [activeFaq, setActiveFaq] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (!isPreview) {
      window.scrollTo(0, 0);
      MetaPixel.pageView(product?.name || 'Funnel Page');
      if (product) {
        MetaPixel.viewContent(product);
      }
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
  }, [product, isPreview]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleBuy = () => {
    if (onBuyProduct && product) {
      onBuyProduct(product);
    } else if (onNavigate) {
      onNavigate('checkout', { product });
    }
  };

  // Render Individual Section Blocks
  const renderSection = (section, idx) => {
    if (!section || section.enabled === false) return null;
    const { type, data = {} } = section;

    switch (type) {
      // 1. Urgency Bar
      case 'urgency_bar':
        return (
          <div key={section.id || idx} className="fb-top-bar">
            <div className="fb-top-bar-content">
              <span className="fb-pill-live">{data.badgeText || '⚡ FLASH LAUNCH SALE'}</span>
              <span>{data.offerText || 'Special Offer: Flat 94% OFF Ends In:'} <strong className="fb-timer">{formattedTime}</strong></span>
              <span className="fb-sep">•</span>
              <span>{data.priceText || `Complete Masterclass Sirf ₹${product?.price || 299}`}</span>
            </div>
          </div>
        );

      // 2. Hero Section
      case 'hero':
        return (
          <header key={section.id || idx} className="fb-hero-section">
            <div className="container fb-hero-container">
              <div className="fb-hero-badges-row">
                {data.badge1 && <span className="fb-badge-pill">{data.badge1}</span>}
                {data.badge2 && <span className="fb-badge-safe">{data.badge2}</span>}
              </div>

              <h1 className="fb-hero-title">
                {data.title || product?.name || 'USA Facebook Earning Masterclass 2026'}
              </h1>

              <p className="fb-hero-subtitle">
                {data.gradientHighlight && <span className="fb-gradient-text">{data.gradientHighlight} </span>}
                {data.subtitle || product?.tagline || 'USA Facebook Earning ka poora system — 3 proven methods, 10+ ghante, zero se automation tak.'}
              </p>

              {data.problemQuote && (
                <div className="fb-hero-problem-box">
                  <p>{data.problemQuote}</p>
                </div>
              )}

              {/* CTA Box */}
              <div className="fb-hero-cta-box">
                <button
                  type="button"
                  className="fb-btn-primary pulse-btn"
                  onClick={handleBuy}
                >
                  <span>{data.ctaButtonText || `Masterclass Unlock Karein — sirf ₹${product?.price || 299}`}</span>
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
                {data.payoutBadgeText && (
                  <div className="fb-verified-payout-badge-hero">
                    <span className="chip-dot"></span>
                    <span>{data.payoutBadgeText}</span>
                  </div>
                )}
              </div>
            </div>
          </header>
        );

      // 3. Core Pillars / Framework
      case 'pillars': {
        const items = data.items || [];
        return (
          <section key={section.id || idx} className="fb-pillars-section">
            <div className="container">
              <div className="fb-section-header text-center">
                {data.sectionTag && <span className="fb-section-tag">{data.sectionTag}</span>}
                <h2 className="fb-section-title">{data.sectionTitle || 'Is Course Mein Kya Sikhoge?'}</h2>
                {data.sectionDesc && <p className="fb-section-desc">{data.sectionDesc}</p>}
              </div>

              <div className="fb-pillars-grid">
                {items.map((item, pIdx) => (
                  <div key={pIdx} className={`fb-pillar-card ${item.isFull ? 'fb-pillar-full' : ''}`}>
                    <div className={`fb-pillar-icon-box icon-${item.color || 'blue'}`}>{item.icon || '📍'}</div>
                    <div className="fb-pillar-content">
                      <span className="fb-pillar-label">{item.label || `METHOD ${pIdx + 1}`}</span>
                      <h3>{item.title}</h3>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      }

      // 4. Video Player (Google Drive / YouTube)
      case 'video_demo': {
        const vUrl = data.videoUrl || product?.demoVideoUrl || 'https://drive.google.com/file/d/1zxeZfgmfTwdZkHMOMIoJpb9A6Qh4EJvJ/preview';
        const vSource = getVideoSource(vUrl);
        return (
          <section key={section.id || idx} className="fb-demo-section" id="starter-pack">
            <div className="container">
              <div className="fb-demo-wrapper">
                <div className="fb-demo-header text-center">
                  <span className="fb-starter-pill">{data.badge || '🎁 100% FREE STARTER PACK (2 HOURS)'}</span>
                  <h2 className="fb-demo-title">{data.title || 'Full Course Ka 10% — Pehle Dekho, Phir Lene Ka Socho'}</h2>
                  <p className="fb-demo-desc">{data.desc || 'Hum hawa mein baat nahi karte — yeh 2 ghante ka starter pack dekhkar strategy samjhein. Video isi screen par chalegi bina kisi ad ya redirect ke:'}</p>
                </div>

                <div className="fb-video-container">
                  <div className="fb-video-shield-top">
                    <div className="fb-shield-brand">
                      <span className="shield-dot-live"></span>
                      <span>{data.shieldTitle || 'ProjuktiSoft HD Player • Module 1 & 2 Free Starter Pack (2 Hours)'}</span>
                    </div>
                    <span className="fb-shield-tag">Direct In-App Stream</span>
                  </div>

                  <div className="fb-iframe-responsive">
                    <iframe
                      src={vSource.src}
                      title="Starter Pack Video Preview"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                      allowFullScreen
                      sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
                      className="fb-video-iframe"
                    ></iframe>

                    {vSource.type === 'youtube' && (
                      <div 
                        className="fb-video-shield-watermark" 
                        title="Watch right here on ProjuktiSoft"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      >
                        <span>ProjuktiSoft HD</span>
                      </div>
                    )}
                  </div>

                  <div className="fb-demo-footer-card">
                    <div className="fb-demo-footer-info">
                      <span className="fb-tag-info">{data.footerTag || 'YEH SIRF 10% PREVIEW HAI'}</span>
                      <p>{data.footerText || 'Baki 90% Advanced Content, TV Show Repurposing, AI Automation & Payout Setup full 10+ hours masterclass mein unlock hoga:'}</p>
                    </div>
                    <button
                      type="button"
                      className="fb-btn-primary fb-btn-compact"
                      onClick={handleBuy}
                    >
                      <span>{data.ctaText || `Complete Masterclass Unlock (₹${product?.price || 299}) →`}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      }

      // 5. Payment Proofs Showcase
      case 'proofs': {
        const metrics = data.metrics || [];
        const proofs = data.proofImages || [];
        return (
          <section key={section.id || idx} className="fb-proof-section" id="proofs">
            <div className="container">
              <div className="fb-section-header text-center">
                <span className="fb-section-tag tag-emerald">{data.sectionTag || 'VERIFIED PAYMENT PROOF'}</span>
                <h2 className="fb-section-title">{data.sectionTitle || 'Live Facebook In-Stream Monetization Payouts'}</h2>
                <p className="fb-section-desc">{data.sectionDesc || 'Koi photoshop ya hypothetical claims nahi — dekhiye live meta transactions aur direct Indian bank transfer receipts:'}</p>
              </div>

              {/* Metrics */}
              {metrics.length > 0 && (
                <div className="fb-metrics-row">
                  {metrics.map((m, mIdx) => (
                    <div key={mIdx} className="fb-metric-card">
                      <span className={`fb-metric-value text-${m.color || 'emerald'}`}>{m.value}</span>
                      <span className="fb-metric-label">{m.label}</span>
                      {m.sub && <span className="fb-metric-sub">{m.sub}</span>}
                    </div>
                  ))}
                </div>
              )}

              {/* Screenshots Grid */}
              {proofs.length > 0 && (
                <div className="fb-proofs-grid">
                  {proofs.map((proof, pfIdx) => (
                    <div key={pfIdx} className="fb-proof-card" onClick={() => setPreviewImage(proof.url)}>
                      <div className="fb-proof-header">
                        <span className={`fb-proof-tag tag-${proof.tagColor || 'blue'}`}>{proof.tag}</span>
                        <span className="fb-proof-zoom-hint">🔍 Tap to Zoom</span>
                      </div>
                      <div className="fb-proof-img-wrap">
                        <img src={proof.url} alt={proof.title} className="fb-proof-img" />
                      </div>
                      <div className="fb-proof-caption">
                        <strong>{proof.title}</strong>
                        {proof.desc && <p>{proof.desc}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        );
      }

      // 6. Deliverables & Value Stack
      case 'deliverables': {
        const items = data.items || [];
        const valueItems = data.valueItems || [];
        return (
          <section key={section.id || idx} className="fb-deliverables-section">
            <div className="container">
              <div className="fb-deliverables-box">
                <div className="fb-deliverables-left">
                  <span className="fb-section-tag">{data.sectionTag || 'PACKAGE DELIVERABLES'}</span>
                  <h2 className="fb-deliverables-title">{data.title || 'Kya Milega Masterclass Ke Sath:'}</h2>
                  <ul className="fb-deliverables-list">
                    {items.map((item, itIdx) => (
                      <li key={itIdx}>
                        <span className="fb-check">✓</span>
                        <div>
                          <strong>{item.title}</strong>
                          {item.desc && <p>{item.desc}</p>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="fb-deliverables-right">
                  <div className="fb-val-stack-card">
                    <span className="fb-val-pill">TOTAL VALUE STACK</span>
                    <ul className="fb-val-lines">
                      {valueItems.map((v, vIdx) => (
                        <li key={vIdx}><span>{v.label}</span> <strong>{v.val}</strong></li>
                      ))}
                    </ul>
                    <div className="fb-val-total">
                      <span>Total Value: <del>{data.totalOriginalValue || `₹${product?.originalPrice || 4999}`}</del></span>
                      <div className="fb-val-today">
                        <span>Aaj Launch Offer:</span>
                        <strong>Sirf ₹{product?.price || 299}</strong>
                      </div>
                    </div>
                    <button type="button" className="fb-btn-primary" onClick={handleBuy}>
                      <span>{data.ctaText || 'Abhi Access Unlock Karein →'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      }

      // 7. Curriculum Modules Accordion
      case 'curriculum': {
        const modules = data.modules || [];
        return (
          <section key={section.id || idx} className="fb-curriculum-section" id="curriculum">
            <div className="container">
              <div className="fb-section-header text-center">
                <span className="fb-section-tag">{data.sectionTag || 'CURRICULUM BREAKDOWN'}</span>
                <h2 className="fb-section-title">{data.sectionTitle || `Complete ${modules.length} Modules (10+ Hours)`}</h2>
                <p className="fb-section-desc">{data.sectionDesc || 'Har module practical screen-recording aur clear Hindi explanation ke saath step-by-step cover kiya gaya hai:'}</p>
              </div>

              <div className="fb-modules-grid">
                {modules.map((mod) => (
                  <div 
                    key={mod.id} 
                    className={`fb-module-item ${activeModule === mod.id ? 'active' : ''}`}
                    onClick={() => setActiveModule(activeModule === mod.id ? null : mod.id)}
                  >
                    <div className="fb-module-num">MOD {mod.id}</div>
                    <div className="fb-module-info">
                      <h4>{mod.title}</h4>
                      {mod.duration && <span className="fb-module-duration">⏱️ {mod.duration}</span>}
                    </div>
                    <div className="fb-module-toggle">
                      {activeModule === mod.id ? '−' : '+'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      }

      // 8. Pricing & Final CTA Box
      case 'pricing': {
        const checklist = data.checklist || [];
        return (
          <section key={section.id || idx} className="fb-pricing-section" id="enroll">
            <div className="container">
              <div className="fb-pricing-card">
                {data.ribbonText && <div className="fb-pricing-ribbon">{data.ribbonText}</div>}

                <div className="fb-pricing-header text-center">
                  <span className="fb-tier-tag">{data.tierTag || 'FULL ACCESS PASS'}</span>
                  <h2 className="fb-pricing-name">{data.title || product?.name || 'USA Facebook Earning Masterclass 2026'}</h2>
                  <p className="fb-pricing-tagline">{data.tagline || product?.tagline || 'Zero se 7-Figure tak (10+ Hours Complete Step-by-Step System)'}</p>
                </div>

                <div className="fb-price-display text-center">
                  <div className="fb-price-numbers">
                    <span className="fb-currency">₹</span>
                    <span className="fb-amount">{product?.price || 299}</span>
                    <del className="fb-old-amount">₹{product?.originalPrice || 4999}</del>
                  </div>
                  <span className="fb-discount-pill">
                    Save ₹{(product?.originalPrice || 4999) - (product?.price || 299)} Today
                  </span>
                </div>

                {checklist.length > 0 && (
                  <div className="fb-checklist-box">
                    <ul className="fb-checklist-grid">
                      {checklist.map((c, cIdx) => (
                        <li key={cIdx}>✓ {c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="fb-pricing-action">
                  <button
                    type="button"
                    className="fb-btn-primary pulse-btn fb-btn-big"
                    onClick={handleBuy}
                  >
                    <span>{data.ctaButtonText || `Masterclass Lijiye — Sirf ₹${product?.price || 299}`}</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                <div className="fb-payment-reassurance text-center">
                  <div className="fb-pay-icons">
                    <span>⚡ Instant Access</span>
                    <span>•</span>
                    <span>🔒 UPI (GPay, PhonePe, Paytm, QR)</span>
                    <span>•</span>
                    <span>💳 Netbanking &amp; Cards</span>
                  </div>
                  <p className="fb-pay-subnote">
                    {data.paymentNote || 'Payment ke turant baad screen par access link open hoga aur backup link aapke email par bhej diya jayega.'}
                  </p>
                </div>
              </div>
            </div>
          </section>
        );
      }

      // 9. FAQ Section
      case 'faq': {
        const faqs = data.faqs || [];
        return (
          <section key={section.id || idx} className="fb-faq-section">
            <div className="container fb-faq-container">
              <div className="fb-section-header text-center">
                <span className="fb-section-tag">{data.sectionTag || 'COMMON QUESTIONS'}</span>
                <h2 className="fb-section-title">{data.sectionTitle || 'Frequently Asked Questions'}</h2>
              </div>

              <div className="fb-faq-list">
                {faqs.map((faq, fIdx) => (
                  <div 
                    key={fIdx} 
                    className={`fb-faq-item ${activeFaq === fIdx ? 'active' : ''}`}
                    onClick={() => setActiveFaq(activeFaq === fIdx ? -1 : fIdx)}
                  >
                    <div className="fb-faq-question">
                      <span>{faq.q}</span>
                      <span className="fb-faq-toggle">{activeFaq === fIdx ? '−' : '+'}</span>
                    </div>
                    {activeFaq === fIdx && (
                      <div className="fb-faq-answer animate-fadeIn">
                        <p>{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      }

      // 10. Sticky Bottom Bar
      case 'sticky_bar':
        if (!showSticky && !isPreview) return null;
        return (
          <div key={section.id || idx} className="fb-sticky-buy-bar animate-slideUp">
            <div className="fb-sticky-content">
              <div className="fb-sticky-info">
                <span className="fb-sticky-badge">{data.badgeText || '10+ HOURS'}</span>
                <div className="fb-sticky-text">
                  <span className="fb-sticky-title">{product?.name || 'USA Facebook Earning Masterclass 2026'}</span>
                  <div className="fb-sticky-price-row">
                    <span className="fb-sticky-price">₹{product?.price || 299}</span>
                    <del className="fb-sticky-old">₹{product?.originalPrice || 4999}</del>
                    <span className="fb-sticky-timer-pill">⏳ {formattedTime}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="fb-sticky-btn"
                onClick={handleBuy}
              >
                <span>{data.buttonText || `Masterclass Lijiye — sirf ₹${product?.price || 299} →`}</span>
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`fb-funnel-page ${isPreview ? 'is-preview-embed' : ''}`}>
      {/* Dynamically Render All Configured Sections in Order */}
      {sections.map((section, idx) => renderSection(section, idx))}

      {/* Sleek Minimal Compliant Footer */}
      {!isPreview && (
        <footer className="funnel-minimal-footer">
          <div className="container text-center">
            <div className="funnel-footer-brand">
              <img src="/logo.png" alt="ProjuktiSoft Logo" className="funnel-footer-logo" />
              <span>ProjuktiSoft</span>
            </div>
            <p className="funnel-footer-notice">
              Official {product?.name || 'Product'} by ProjuktiSoft. Billed securely in <strong>Indian Rupees (INR - ₹)</strong>. 100% Instant Digital Access.
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
