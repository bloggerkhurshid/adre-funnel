import React, { useEffect } from 'react';
import { PRODUCTS } from '../data/products';
import { MetaPixel } from '../components/MetaPixel';

export default function Home({ onNavigate, onBuyProduct }) {
  useEffect(() => {
    window.scrollTo(0, 0);
    MetaPixel.pageView('Storefront Home');
  }, []);

  const adreProduct = PRODUCTS['adre-combo'];
  const cinemoodProduct = PRODUCTS['cinemood-presets'];
  const spokenProduct = PRODUCTS['spoken-english'];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <header className="hero-section">
        <div className="container">
          <div className="hero-pill">
            <span>⚡ 100% INSTANT DIGITAL DOWNLOAD IN INR (₹)</span>
          </div>
          <h1 className="hero-heading">
            Premium Study Materials & <span className="text-gradient">Skill-Building Bundles</span>
          </h1>
          <p className="hero-desc">
            Handcrafted exam-cracking practice books and language mastery bundles designed for competitive aspirants. Read offline anytime on phone, tablet, or laptop.
          </p>

          <div className="trust-badges-row">
            <span>⭐ 4.9/5 Rating (25,000+ Downloads)</span>
            <span>•</span>
            <span>🔒 Bank-Grade Cashfree Checkout (UPI / Cards)</span>
            <span>•</span>
            <span>⚡ 100% Instant Delivery</span>
          </div>
        </div>
      </header>

      {/* Product Catalog Section */}
      <section className="catalog-section" id="products">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Official Digital Store</span>
            <h2 className="section-title">Explore Our Top Bestsellers</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '6px' }}>
              All products priced transparently in <strong>Indian Rupees (INR - ₹)</strong> with no hidden costs.
            </p>
          </div>

          <div className="products-grid">
            {/* Card 1: ADRE Combo */}
            <div className="product-card featured">
              <div className="product-ribbon">{adreProduct.featuredBadge}</div>
              <div className="product-img-wrapper">
                <img src={adreProduct.coverImage} alt={adreProduct.name} />
              </div>
              <div className="product-details">
                <h3>{adreProduct.name}</h3>
                <p className="product-desc">{adreProduct.description}</p>

                <ul className="features-list">
                  {adreProduct.features.map((feat, idx) => (
                    <li key={idx}>
                      <span className="check">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <div className="pricing-row">
                  <div className="price-box">
                    <span className="price-current">₹{adreProduct.price}</span>
                    <span className="price-old">₹{adreProduct.originalPrice}</span>
                  </div>
                  <span className="discount-badge">{adreProduct.discountPercent}</span>
                </div>

                <div className="buttons-group">
                  <button
                    type="button"
                    className="btn-view-details"
                    onClick={() => onNavigate('adre')}
                  >
                    <span>View Product Details →</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: CineMood Lightroom Presets */}
            <div className="product-card" style={{ borderColor: 'rgba(0, 180, 216, 0.4)' }}>
              <div className="product-ribbon" style={{ background: 'linear-gradient(135deg, #38bdf8, #00b4d8)', color: '#030712' }}>
                {cinemoodProduct.featuredBadge}
              </div>
              <div className="product-img-wrapper" style={{ position: 'relative', background: '#020610' }}>
                <img 
                  src="/presets/cinemood-banner.jpg" 
                  alt={cinemoodProduct.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span style={{ position: 'absolute', bottom: '10px', right: '10px', background: '#001b3a', color: '#38bdf8', border: '1px solid #38bdf8', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '900', fontFamily: 'monospace' }}>
                  Lr PRESETS
                </span>
              </div>
              <div className="product-details">
                <h3>{cinemoodProduct.name}</h3>
                <p className="product-desc">{cinemoodProduct.description}</p>

                <ul className="features-list">
                  {cinemoodProduct.features.slice(0, 5).map((feat, idx) => (
                    <li key={idx}>
                      <span className="check" style={{ color: '#38bdf8' }}>✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <div className="pricing-row">
                  <div className="price-box">
                    <span className="price-current" style={{ color: '#38bdf8' }}>₹{cinemoodProduct.price}</span>
                    <span className="price-old">₹{cinemoodProduct.originalPrice}</span>
                  </div>
                  <span className="discount-badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.4)' }}>
                    {cinemoodProduct.discountPercent}
                  </span>
                </div>

                <div className="buttons-group">
                  <button
                    type="button"
                    className="btn-view-details"
                    style={{ borderColor: 'rgba(56, 189, 248, 0.4)', color: '#38bdf8' }}
                    onClick={() => onNavigate('cinemood-presets')}
                  >
                    <span>View Presets & Before/After →</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Card 3: Spoken English Bundle */}
            {spokenProduct && (
              <div className="product-card" style={{ borderColor: 'rgba(245, 158, 11, 0.45)' }}>
                <div className="product-ribbon" style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', color: '#030712' }}>
                  {spokenProduct.featuredBadge}
                </div>
                <div className="product-img-wrapper" style={{ position: 'relative', background: '#050d1a' }}>
                  <img 
                    src={spokenProduct.coverImage} 
                    alt={spokenProduct.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '10px' }}
                  />
                  <span style={{ position: 'absolute', bottom: '10px', right: '10px', background: '#1c1303', color: '#fbbf24', border: '1px solid #f59e0b', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '900', fontFamily: 'monospace' }}>
                    4 EBOOKS
                  </span>
                </div>
                <div className="product-details">
                  <h3>{spokenProduct.name}</h3>
                  <p className="product-desc">{spokenProduct.description}</p>

                  <ul className="features-list">
                    {spokenProduct.features.slice(0, 5).map((feat, idx) => (
                      <li key={idx}>
                        <span className="check" style={{ color: '#fbbf24' }}>✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pricing-row">
                    <div className="price-box">
                      <span className="price-current" style={{ color: '#fbbf24' }}>₹{spokenProduct.price}</span>
                      <span className="price-old">₹{spokenProduct.originalPrice}</span>
                    </div>
                    <span className="discount-badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
                      {spokenProduct.discountPercent}
                    </span>
                  </div>

                  <div className="buttons-group">
                    <button
                      type="button"
                      className="btn-view-details"
                      style={{ borderColor: 'rgba(245, 158, 11, 0.45)', color: '#fbbf24' }}
                      onClick={() => onNavigate('spoken-english')}
                    >
                      <span>View Spoken English Funnel →</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="why-us-section" id="why-us">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Why Choose ProjuktiSoft</span>
            <h2 className="section-title">Built For Seamless Digital Learning</h2>
          </div>

          <div className="perks-grid">
            <div className="perk-box">
              <div className="perk-icon">⚡</div>
              <h4>Instant Delivery in INR</h4>
              <p>Secure checkout in Indian Rupees with download links generated immediately after payment.</p>
            </div>
            <div className="perk-box">
              <div className="perk-icon">📱</div>
              <h4>Offline Mobile Access</h4>
              <p>Crystal-clear PDF formatting for smartphone, iPad, and computer screens.</p>
            </div>
            <div className="perk-box">
              <div className="perk-icon">🔒</div>
              <h4>Cashfree 256-Bit SSL</h4>
              <p>Official UPI intent (GPay, PhonePe, Paytm, QR) with bank-grade encryption.</p>
            </div>
            <div className="perk-box">
              <div className="perk-icon">🤝</div>
              <h4>Candidate Support</h4>
              <p>Email and WhatsApp customer assistance if you ever need download help.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

