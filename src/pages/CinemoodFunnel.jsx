import React, { useState, useEffect } from 'react';
import { PRODUCTS } from '../data/products';
import { MetaPixel } from '../components/MetaPixel';

export default function CinemoodFunnel({ onBuyProduct, onNavigate }) {
  const product = PRODUCTS['cinemood-presets'] || PRODUCTS['english-bundle'];
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 52);
  const [showSticky, setShowSticky] = useState(false);
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
    { icon: '🎨', title: '50+ Curated Cinematic DNG Presets', desc: 'Moody Brown, Teal & Orange, Film Mirage, Golden Hour, Dark Fade, Vintage Cinematic & 44+ more looks.' },
    { icon: '📱', title: '100% Free Lightroom Mobile (.DNG)', desc: 'Works effortlessly on the FREE Adobe Lightroom Mobile app (iOS & Android). No monthly Adobe subscription required!' },
    { icon: '💎', title: 'Universal High-Fidelity DNG Format', desc: 'Pre-calibrated RAW DNG profiles compatible across Mobile, Tablets, and Desktop Lightroom.' },
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
          <span>Flat {product.discountPercent} Ends In: <strong className="lr-timer">{formattedTime}</strong></span>
          <span className="lr-sep">•</span>
          <span>Special Offer: <strong>₹{product.price} INR Only!</strong> (Original <del>₹{product.originalPrice}</del>)</span>
        </div>
      </div>

      {/* Hero Section */}
      <header className="lr-hero-section">
        <div className="container text-center">
          
          <div className="lr-badge-header">
            <span className="lr-app-icon">Lr</span>
            <span>CINEMOOD COLLECTION • 50+ CINEMATIC DNG PRESETS</span>
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
              <span>🔥 50+ READY-TO-USE CINEMATIC DNG PRESETS</span>
            </div>
          </div>

          {/* Main Product Breakdown & Highlight Card */}
          <div className="lr-product-deep-dive-card">
            <div className="lr-dive-header text-center">
              <span className="lr-dive-badge">💎 100% UNLOCKED • INSTANT ACCESS</span>
              <h3 className="lr-dive-title">Everything Included in The CineMood 50+ DNG Pack</h3>
              <p className="lr-dive-desc">
                Everything you need to turn raw, ordinary smartphone and camera pictures into high-end cinematic edits with just 1-tap in the FREE Lightroom app.
              </p>
            </div>

            <div className="lr-dive-grid">
              <div className="lr-dive-item">
                <span className="lr-dive-icon">🎨</span>
                <div>
                  <strong>50+ Curated Cinematic Tones (.DNG)</strong>
                  <p>Includes Moody Brown, Teal & Orange, Golden Mirage, Dark Forest, Urban Street, City Portrait, Cyber Night & 43+ more aesthetic looks.</p>
                </div>
              </div>

              <div className="lr-dive-item">
                <span className="lr-dive-icon">📱</span>
                <div>
                  <strong>100% Free Lightroom Mobile Compatible</strong>
                  <p>Works right away inside the completely FREE Adobe Lightroom app (iOS & Android). Zero monthly Adobe subscriptions required.</p>
                </div>
              </div>

              <div className="lr-dive-item">
                <span className="lr-dive-icon">⚡</span>
                <div>
                  <strong>1-Click Copy & Paste Workflow</strong>
                  <p>No prior editing skills required. Simply copy settings and paste them onto any photo for instant Instagram-ready color harmony.</p>
                </div>
              </div>

              <div className="lr-dive-item">
                <span className="lr-dive-icon">📸</span>
                <div>
                  <strong>Calibrated For All Devices & Cameras</strong>
                  <p>Optimized for iPhone (all models), Samsung, OnePlus, Xiaomi, Vivo, DSLR/Mirrorless RAW & JPEG files.</p>
                </div>
              </div>

              <div className="lr-dive-item">
                <span className="lr-dive-icon">💎</span>
                <div>
                  <strong>Skin-Tone Protection Engine</strong>
                  <p>Guarantees natural, radiant skin tones without awkward color cast, while enriching shadows and highlights.</p>
                </div>
              </div>

              <div className="lr-dive-item">
                <span className="lr-dive-icon">📖</span>
                <div>
                  <strong>Step-by-Step Video & PDF Guide</strong>
                  <p>Easy 2-minute visual tutorial showing you how to import the .DNG files into Lightroom and organize your presets.</p>
                </div>
              </div>
            </div>

            {/* Quick Specs Pill Row */}
            <div className="lr-specs-row">
              <div className="lr-spec-pill">
                <span className="lr-spec-label">Format:</span>
                <span className="lr-spec-val">Universal .DNG High-Res</span>
              </div>
              <div className="lr-spec-pill">
                <span className="lr-spec-label">Platform:</span>
                <span className="lr-spec-val">Lightroom Mobile, iPad & Desktop</span>
              </div>
              <div className="lr-spec-pill">
                <span className="lr-spec-label">Delivery:</span>
                <span className="lr-spec-val">Instant Google Drive Access</span>
              </div>
              <div className="lr-spec-pill">
                <span className="lr-spec-label">License:</span>
                <span className="lr-spec-val">Lifetime Personal & Commercial</span>
              </div>
            </div>
          </div>

          {/* Hero CTA Block */}
          <div className="lr-cta-box">
            <button
              type="button"
              className="lr-btn-primary"
              onClick={() => onBuyProduct(product)}
            >
              <span>GET 50+ CINEMATIC DNG PRESETS NOW — ₹{product.price}</span>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>

            <div className="lr-price-meta">
              <span className="lr-old-price">
                Regular Price: <del>₹{product.originalPrice}</del>
              </span>
              <span className="lr-save-tag">SAVE 90% TODAY</span>
              <span className="lr-ssl-tag">🔒 100% Safe & Instant Delivery</span>
            </div>
          </div>

        </div>
      </header>

      {/* Demo Presets Preview Showcase Section */}
      <section className="lr-demo-section">
        <div className="container lr-demo-container">
          <div className="lr-section-header text-center">
            <span className="lr-section-tag">LOOK AT THE RESULTS</span>
            <h2 className="lr-section-title">Demo Preset Preview (Before / After Showcase)</h2>
            <p className="lr-section-desc">
              Here is a glimpse of the color tones included in the CineMood Pack. Each preset is precisely balanced to protect natural skin tones while adding rich shadows and cinematic grain.
            </p>
          </div>

          <div className="lr-presets-grid">
            {demoPresets.map((preset) => (
              <div 
                key={preset.id} 
                className="lr-preset-card"
                onClick={() => onBuyProduct(product)}
                role="button"
                tabIndex={0}
                title={`Get ${preset.title} Preset - ₹99 CineMood Pack`}
              >
                <div className="lr-preset-img-wrapper">
                  <img 
                    src={preset.img} 
                    alt={`CineMood Preset ${preset.title}`} 
                    className="lr-preset-card-img"
                    loading="lazy"
                  />
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
              onClick={() => onBuyProduct(product)}
            >
              <span>DOWNLOAD ALL 50+ DNG PRESETS (₹{product.price})</span>
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
                <p>Complete the ₹{product.price} payment and get instant Google Drive access to all 50+ presets.</p>
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
                onClick={() => onBuyProduct(product)}
              >
                <span>GET INSTANT ACCESS NOW (₹{product.price})</span>
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
                <strong>CineMood 50+ DNG Presets</strong>
                <span className="lr-sticky-price">
                  ₹{product.price} <del>₹{product.originalPrice}</del>
                </span>
              </div>
            </div>
            <button
              type="button"
              className="lr-sticky-btn"
              onClick={() => onBuyProduct(product)}
            >
              <span>BUY NOW (₹{product.price}) →</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

