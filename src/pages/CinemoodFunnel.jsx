import React, { useState, useEffect } from 'react';
import { PRODUCTS } from '../data/products';
import { MetaPixel } from '../components/MetaPixel';

export default function CinemoodFunnel({ onBuyProduct, onNavigate }) {
  const product = PRODUCTS['cinemood-presets'] || PRODUCTS['english-bundle'];
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 52);
  const [showSticky, setShowSticky] = useState(false);
  const [selectedBump, setSelectedBump] = useState(false);
  const [activeFaq, setActiveFaq] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    MetaPixel.pageView('CineMood Lightroom Presets Funnel');
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
          setShowSticky(window.scrollY > 400);
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

  const demoPresets = [
    {
      id: 1,
      num: '1',
      title: 'Moody Brown',
      subtitle: 'Warm Depth & Balanced Contrast',
      img: '/presets/preset-moody-brown.jpg',
      tag: 'PORTRAIT & INDOOR',
      desc: 'Crafted to enhance your photos with balanced warm tones, rich shadow depth, and clean contrast. Transforms ordinary daily shots into moody, high-end film frames.'
    },
    {
      id: 2,
      num: '2',
      title: 'Teal & Orange',
      subtitle: 'Classic Hollywood Film Grade',
      img: '/presets/preset-teal-orange.jpg',
      tag: 'OUTDOOR & STREET',
      desc: 'The timeless cinematic color grade that makes natural skin tones pop with radiant warmth while grading background skies and shadows with cool moody teal.'
    },
    {
      id: 3,
      num: '3',
      title: 'Moody Mirage',
      subtitle: 'Urban Film & Muted Highlights',
      img: '/presets/preset-moody-mirage.jpg',
      tag: 'URBAN & ARCHITECTURE',
      desc: 'Tailored for moody urban aesthetics, street photography, and cloudy days. Gently mutes harsh highlights while rendering rich, velvety blacks and elegant architectural tones.'
    },
    {
      id: 4,
      num: '4',
      title: 'Blue Mirage',
      subtitle: 'Clean Coastal & Sky Tones',
      img: '/presets/preset-blue-mirage.jpg',
      tag: 'BEACH & TRAVEL',
      desc: 'Designed for coastal landscapes, vacation photos, and open skies. Delivers serene sea blues, clean whites, and subtle skin warmth with perfect highlight balance.'
    },
    {
      id: 5,
      num: '5',
      title: 'City Portrait',
      subtitle: 'Crisp Urban Fashion & Street Depth',
      img: '/presets/preset-city-portrait.jpg',
      tag: 'FASHION & LIFESTYLE',
      desc: 'Optimized for street fashion and city portraits. Brings out rich denim textures, punchy contrast, and creamy background bokeh that makes your subject stand out.'
    },
    {
      id: 6,
      num: '6',
      title: 'Dreamy Mirage',
      subtitle: 'Pastoral Green & Soft Film Glow',
      img: '/presets/preset-dreamy-mirage.jpg',
      tag: 'NATURE & LANDSCAPE',
      desc: 'Perfect for outdoor green fields, village views, and sunlight. Softens contrast while giving lush greens and earthy tones a nostalgic, dreamy cinematic atmosphere.'
    },
    {
      id: 7,
      num: '7',
      title: 'Sunset Mirage',
      subtitle: 'Golden Hour Warmth & Creamy Highlights',
      img: '/presets/preset-sunset-mirage.jpg',
      tag: 'GOLDEN HOUR & CLOSEUP',
      desc: 'Captures the magic of the golden hour. Infuses portraits with rich amber warmth, radiant skin glows, and film-like highlight rolloff for breathtaking evening shots.'
    },
    {
      id: 8,
      num: '8',
      title: 'Faded Green',
      subtitle: 'Moody Urban Foliage & Deep Contrast',
      img: '/presets/preset-faded-green.jpg',
      tag: 'STREET & URBAN',
      desc: 'Infuses lush green foliage and city pavements with deep, moody contrast and muted shadows, creating a timeless European film atmosphere.'
    },
    {
      id: 9,
      num: '9',
      title: 'Faded Sea',
      subtitle: 'Atmospheric Ocean & Muted Water Tones',
      img: '/presets/preset-faded-sea.jpg',
      tag: 'RIVER & ARCHITECTURE',
      desc: 'Tailored for water bodies, waterfronts, and coastal cities. Delivers subtle desaturation, cinematic clarity, and calm editorial tones.'
    },
    {
      id: 10,
      num: '10',
      title: 'Dreamy Girl',
      subtitle: 'Vibrant Cultural Reds & Radiant Skin',
      img: '/presets/preset-dreamy-girl.jpg',
      tag: 'TRADITIONAL & PORTRAIT',
      desc: 'Masterfully preserves vibrant traditional outfits and rich ethnic colors while rendering flattering skin tones and soft, dreamy contrast.'
    }
  ];

  const featuresList = [
    { icon: '🎨', title: '50+ Curated Cinematic Presets', desc: 'Moody Brown, Teal & Orange, Film Mirage, Golden Hour, Dark Fade, Vintage Cinematic & 44+ more looks.' },
    { icon: '📱', title: '100% Free Lightroom Mobile Compatible', desc: 'Works effortlessly on the FREE Adobe Lightroom Mobile app (iOS & Android). No monthly Adobe subscription required!' },
    { icon: '💻', title: 'Desktop Lightroom (.XMP) Included', desc: 'Full support for Lightroom Classic, Lightroom CC, and Adobe Camera RAW on Windows PC & Mac.' },
    { icon: '⚡', title: '1-Click Instant Magic', desc: 'Simply copy settings and paste onto any mobile photo to get an aesthetic, Instagram-ready cinematic look in seconds.' },
    { icon: '📸', title: 'Works on All Camera & Phone Photos', desc: 'Specially calibrated for iPhone, Samsung, OnePlus, Xiaomi, and DSLR/Mirrorless RAW & JPEG photos.' },
    { icon: '📖', title: 'Step-by-Step Installation Video & PDF', desc: 'Complete beginner-friendly instructions included so you can import and apply presets in less than 2 minutes.' }
  ];

  const faqs = [
    {
      q: 'Do I need a paid Adobe Lightroom subscription?',
      a: 'No! These presets work 100% with the completely FREE Adobe Lightroom Mobile app available on Apple App Store (iPhone/iPad) and Google Play Store (Android). You do not need to pay Adobe anything.'
    },
    {
      q: 'How do I receive the presets after payment?',
      a: 'Immediately after your payment is confirmed, you will be redirected to the instant download page with a direct Google Drive link. We also automatically email the download backup link to your registered email address via Hostinger.'
    },
    {
      q: 'Are these compatible with both iPhone and Android?',
      a: 'Yes, absolutely! The pack includes .DNG files which are universal mobile preset files supported across all iOS and Android versions.'
    },
    {
      q: 'What if I am a complete beginner at photo editing?',
      a: 'No prior editing skills required! The pack includes an easy-to-follow PDF and video tutorial showing you exactly how to import the files and apply them to your photos in just 1 click.'
    },
    {
      q: 'Is there a money-back guarantee?',
      a: 'Yes! We offer a 7-day satisfaction guarantee. If the presets do not work for your photos, simply reach out to our dedicated support team at support@projuktisoft.shop.'
    }
  ];

  return (
    <div className="cinemood-funnel-page">
      {/* Urgency Top Bar */}
      <div className="lr-top-bar">
        <div className="lr-banner-content">
          <span className="lr-pill-live">⚡ FLASH LAUNCH SALE</span>
          <span>Flat 90% OFF Ends In: <strong className="lr-timer">{formattedTime}</strong></span>
          <span className="lr-sep">•</span>
          <span>Special Offer: <strong>₹99 INR Only!</strong> (Original <del>₹999</del>)</span>
        </div>
      </div>

      {/* Hero Section */}
      <header className="lr-hero-section">
        <div className="container text-center">
          
          <div className="lr-badge-header">
            <span className="lr-app-icon">Lr</span>
            <span>CINEMOOD COLLECTION • 50+ CINEMATIC PRESETS</span>
          </div>

          <h1 className="lr-hero-title">
            Turn Ordinary Photos Into <span className="lr-gradient-text">Cinematic Masterpieces</span> in 1-Click
          </h1>

          <p className="lr-hero-subtitle">
            Curated specifically for creators, photographers, and Instagram aesthetic feeds. Transform raw mobile shots into rich, moody cinematic film frames with 50+ professionally graded presets.
          </p>

          {/* Social Proof Stats */}
          <div className="lr-trust-row">
            <div className="lr-trust-item">
              <span className="lr-stars">★★★★★</span>
              <span><strong>4.9/5</strong> (3,840+ Creators)</span>
            </div>
            <span className="lr-dot">•</span>
            <div className="lr-trust-item">
              <span>📱 100% Free Lightroom Mobile Compatible</span>
            </div>
            <span className="lr-dot">•</span>
            <div className="lr-trust-item">
              <span>⚡ Instant Download</span>
            </div>
          </div>

          {/* Main Hero Product Banner */}
          <div className="lr-banner-showcase">
            <img 
              src="/presets/cinemood-banner.jpg" 
              alt="CineMood Lightroom Presets 50+ Cinematic Pack"
              className="lr-banner-img"
            />
            <div className="lr-banner-overlay-tag">
              <span>🔥 50+ READY-TO-USE PRESETS (.DNG + .XMP)</span>
            </div>
          </div>

          {/* Wedding & Prewedding Order Bump Offer */}
          {product?.orderBump && (
            <div className={`lr-bump-card ${selectedBump ? 'is-selected' : ''}`} onClick={() => setSelectedBump(!selectedBump)}>
              <div className="lr-bump-header">
                <label className="lr-bump-checkbox-label" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedBump}
                    onChange={(e) => setSelectedBump(e.target.checked)}
                    className="lr-bump-input"
                  />
                  <span>
                    <strong>⚡ ONE-TIME OFFER: Add {product.orderBump.name}</strong> for just <span className="lr-bump-highlight">₹{product.orderBump.price}</span> <del className="lr-bump-del">₹{product.orderBump.originalPrice}</del>
                  </span>
                </label>
                <span className="lr-bump-badge">90% OFF</span>
              </div>

              <div className="lr-bump-content">
                <p>{product.orderBump.pitch}</p>
                
                <div className="lr-bump-bullets">
                  <strong>What’s Included:</strong>
                  <ul>
                    {product.orderBump.features.map((feat, fIdx) => (
                      <li key={fIdx}>✓ {feat}</li>
                    ))}
                  </ul>
                </div>

                <div className="lr-bump-tagline">
                  💍 <em>Perfect For: Wedding photography, pre-wedding shoots, engagement portraits, couple photography, and bridal portraits.</em>
                </div>
              </div>
            </div>
          )}

          {/* Hero CTA Block */}
          <div className="lr-cta-box">
            <button
              type="button"
              className="lr-btn-primary"
              onClick={() => onBuyProduct(product, selectedBump)}
            >
              <span>
                {selectedBump 
                  ? `GET 50+ PRESETS + WEDDING PACK (₹${product.price + product.orderBump.price})`
                  : `GET 50+ CINEMATIC PRESETS NOW — ₹${product.price}`}
              </span>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>

            <div className="lr-price-meta">
              <span className="lr-old-price">
                Regular Price: <del>₹{selectedBump ? (product.originalPrice + product.orderBump.originalPrice) : product.originalPrice}</del>
              </span>
              <span className="lr-save-tag">SAVE 90% TODAY</span>
              <span className="lr-ssl-tag">🔒 100% Safe & Instant Delivery</span>
            </div>
          </div>

        </div>
      </header>

      {/* Demo Presets Preview Showcase Section */}
      <section className="lr-demo-section">
        <div className="container">
          <div className="lr-section-header text-center">
            <span className="lr-section-tag">LOOK AT THE RESULTS</span>
            <h2 className="lr-section-title">Demo Preset Preview (Before / After Showcase)</h2>
            <p className="lr-section-desc">
              Here is a glimpse of the color tones included in the CineMood Pack. Each preset is precisely balanced to protect natural skin tones while adding rich shadows and cinematic grain.
            </p>
          </div>

          <div className="lr-presets-grid">
            {demoPresets.map((preset) => (
              <div key={preset.id} className="lr-preset-card">
                <div className="lr-preset-img-wrapper">
                  <img 
                    src={preset.img} 
                    alt={`CineMood Preset ${preset.title}`} 
                    className="lr-preset-card-img"
                  />
                  <div className="lr-preset-badge-top">
                    <span>PRESET #{preset.num}</span>
                  </div>
                </div>

                <div className="lr-preset-info">
                  <div className="lr-preset-header-row">
                    <div>
                      <h3 className="lr-preset-title">{preset.title}</h3>
                      <span className="lr-preset-sub">{preset.subtitle}</span>
                    </div>
                    <span className="lr-category-pill">{preset.tag}</span>
                  </div>

                  <p className="lr-preset-text">{preset.desc}</p>

                  <div className="lr-preset-card-footer">
                    <span className="lr-verified-tick">✓ Included in ₹99 Pack</span>
                    <button 
                      type="button" 
                      className="lr-card-buy-btn"
                      onClick={() => onBuyProduct(product)}
                    >
                      Unlock Preset →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lr-more-presets-callout text-center">
            <div className="lr-callout-inner">
              <span className="lr-callout-icon">✨</span>
              <div>
                <h4>+ Plus 40 More Exclusive Cinematic Styles Included in Your 50+ Pack!</h4>
                <p>Including Vintage Film, Moody Dark Forest, Cyberpunk Night, Desaturated Urban, Warm Sunset Glow, and Black & White Film Grain.</p>
              </div>
            </div>
          </div>

          <div className="text-center" style={{ marginTop: '36px' }}>
            <button
              type="button"
              className="lr-btn-primary"
              onClick={() => onBuyProduct(product, selectedBump)}
            >
              <span>
                {selectedBump 
                  ? `DOWNLOAD ALL 50+ PRESETS + WEDDING PACK (₹${product.price + product.orderBump.price})`
                  : `DOWNLOAD ALL 50+ PRESETS (₹${product.price})`}
              </span>
            </button>
          </div>

        </div>
      </section>

      {/* Triple Guarantee Badges Banner */}
      <section className="lr-guarantee-section">
        <div className="container text-center">
          <div className="lr-badge-container">
            <img 
              src="/presets/presets-badges.png" 
              alt="100% Quality, Money Back & Premium Edition Guarantee" 
              className="lr-guarantee-badges-img"
            />
          </div>
          <div className="lr-guarantee-subtext">
            <span>🛡️ 100% Risk-Free Guarantee • 7 Days Hassle-Free Support • Verified Adobe Lightroom Files</span>
          </div>
        </div>
      </section>

      {/* What You Get Inside Section */}
      <section className="lr-features-section">
        <div className="container">
          <div className="lr-section-header text-center">
            <span className="lr-section-tag">PREMIUM CURATION</span>
            <h2 className="lr-section-title">Everything Included in The CineMood Pack</h2>
            <p className="lr-section-desc">Designed to work right out of the box with zero complex setup.</p>
          </div>

          <div className="lr-features-grid">
            {featuresList.map((feat, idx) => (
              <div key={idx} className="lr-feature-card">
                <div className="lr-feat-icon">{feat.icon}</div>
                <h3>{feat.title}</h3>
                <p>{feat.desc}</p>
              </div>
            ))}
          </div>

          {/* 3 Step Quick Guide */}
          <div className="lr-steps-box">
            <h3 className="lr-steps-heading text-center">How It Works in 3 Simple Steps</h3>
            <div className="lr-steps-row">
              <div className="lr-step-item">
                <div className="lr-step-num">1</div>
                <h4>Download Files</h4>
                <p>Complete the ₹99 payment and get instant Google Drive access to all 50+ presets.</p>
              </div>
              <div className="lr-step-arrow">→</div>
              <div className="lr-step-item">
                <div className="lr-step-num">2</div>
                <h4>Import to Lightroom</h4>
                <p>Open the free Lightroom app on your phone and import the .DNG files in 1 click.</p>
              </div>
              <div className="lr-step-arrow">→</div>
              <div className="lr-step-item">
                <div className="lr-step-num">3</div>
                <h4>Apply & Amaze</h4>
                <p>Copy settings onto any photo and watch it transform into cinematic art!</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="lr-faq-section">
        <div className="container">
          <div className="lr-section-header text-center">
            <span className="lr-section-tag">HAVE QUESTIONS?</span>
            <h2 className="lr-section-title">Frequently Asked Questions</h2>
          </div>

          <div className="lr-faq-wrapper">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className={`lr-faq-item ${activeFaq === idx ? 'is-active' : ''}`}
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
              >
                <div className="lr-faq-question">
                  <span>{faq.q}</span>
                  <span className="lr-faq-toggle">{activeFaq === idx ? '−' : '+'}</span>
                </div>
                {activeFaq === idx && (
                  <div className="lr-faq-answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Final Call To Action */}
          <div className="lr-final-cta-card text-center">
            <h2>Ready to Elevate Your Photos with Cinematic Color Grading?</h2>
            <p>Join 3,840+ creators using CineMood to transform their Instagram feeds and portfolio.</p>
            
            <div className="lr-cta-box" style={{ marginTop: '20px' }}>
              <button
                type="button"
                className="lr-btn-primary"
                onClick={() => onBuyProduct(product, selectedBump)}
              >
                <span>
                  {selectedBump 
                    ? `GET 50+ PRESETS + WEDDING PACK (₹${product.price + product.orderBump.price})`
                    : `GET INSTANT ACCESS NOW (₹${product.price})`}
                </span>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div style={{ marginTop: '16px', fontSize: '0.85rem', color: '#94a3b8' }}>
              ⚡ Instant Download Link on Screen + Backup Sent to Your Email
            </div>
          </div>

        </div>
      </section>

      {/* Sticky Bottom Bar for Mobile & Desktop */}
      {showSticky && (
        <div className="lr-sticky-bottom-bar">
          <div className="lr-sticky-content">
            <div className="lr-sticky-info">
              <span className="lr-sticky-app-badge">Lr</span>
              <div>
                <strong>{selectedBump ? 'CineMood + Wedding Pack' : 'CineMood 50+ Presets'}</strong>
                <span className="lr-sticky-price">
                  ₹{selectedBump ? (product.price + product.orderBump.price) : product.price} 
                  <del>₹{selectedBump ? (product.originalPrice + product.orderBump.originalPrice) : product.originalPrice}</del>
                </span>
              </div>
            </div>
            <button
              type="button"
              className="lr-sticky-btn"
              onClick={() => onBuyProduct(product, selectedBump)}
            >
              <span>{selectedBump ? `BUY BUNDLE (₹${product.price + product.orderBump.price}) →` : `BUY NOW (₹${product.price}) →`}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

