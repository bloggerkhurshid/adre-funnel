import React, { useEffect } from 'react';
import { PRODUCTS } from '../data/products';
import { MetaPixel } from '../components/MetaPixel';

export default function Home({ onNavigate, onBuyProduct }) {
  useEffect(() => {
    window.scrollTo(0, 0);
    MetaPixel.pageView('Storefront Home');
  }, []);

  const adreProduct = PRODUCTS['adre-combo'];
  const englishProduct = PRODUCTS['english-bundle'];

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
            <span>🔒 Bank-Grade Razorpay Checkout (UPI / Cards)</span>
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
                    View Details →
                  </button>
                  <button
                    type="button"
                    className="btn-buy-direct"
                    onClick={() => onBuyProduct(adreProduct)}
                  >
                    <span>⚡ Buy Now (₹{adreProduct.price})</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: English Learning Mega Bundle */}
            <div className="product-card">
              <div className="product-ribbon" style={{ background: 'linear-gradient(135deg, #38bdf8, #0284c7)', color: '#fff' }}>
                {englishProduct.featuredBadge}
              </div>
              <div className="product-img-wrapper" style={{ background: 'linear-gradient(135deg, #131b2e, #0a0e17)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ background: 'rgba(245,158,11,0.2)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.4)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' }}>
                    10 EBOOKS + 3 BONUSES
                  </span>
                  <h4 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.45rem', color: '#fff', marginTop: '12px' }}>
                    Complete English Learning
                  </h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>
                    Speak Confidently & Master Fluency
                  </p>
                </div>
              </div>
              <div className="product-details">
                <h3>{englishProduct.name}</h3>
                <p className="product-desc">{englishProduct.description}</p>

                <ul className="features-list">
                  {englishProduct.features.map((feat, idx) => (
                    <li key={idx}>
                      <span className="check">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <div className="pricing-row">
                  <div className="price-box">
                    <span className="price-current">₹{englishProduct.price}</span>
                    <span className="price-old">₹{englishProduct.originalPrice}</span>
                  </div>
                  <span className="discount-badge">{englishProduct.discountPercent}</span>
                </div>

                <div className="buttons-group">
                  <button
                    type="button"
                    className="btn-view-details"
                    onClick={() => onNavigate('english')}
                  >
                    View Details →
                  </button>
                  <button
                    type="button"
                    className="btn-buy-direct"
                    onClick={() => onBuyProduct(englishProduct)}
                  >
                    <span>⚡ Buy Now (₹{englishProduct.price})</span>
                  </button>
                </div>
              </div>
            </div>
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
              <h4>Razorpay 256-Bit SSL</h4>
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

