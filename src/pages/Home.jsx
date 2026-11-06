import React, { useEffect } from 'react';
import { PRODUCTS } from '../data/products';
import { funnelManager } from '../data/funnelManager';
import { MetaPixel } from '../components/MetaPixel';

export default function Home({ onNavigate, onBuyProduct }) {
  useEffect(() => {
    window.scrollTo(0, 0);
    MetaPixel.pageView('Storefront Home');
  }, []);

  const fbProduct = PRODUCTS['fb-masterclass'];
  const adreProduct = PRODUCTS['adre-combo'];
  const cinemoodProduct = PRODUCTS['cinemood-presets'];
  const spokenProduct = PRODUCTS['spoken-english'];

  // Custom products created dynamically in Admin Panel
  const allProducts = funnelManager.getAllProducts();
  const customProducts = allProducts.filter(p => p.isCustom);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <header className="hero-section">
        <div className="container">
          <div className="hero-pill">
            <span>⚡ 100% INSTANT DIGITAL DOWNLOAD IN INR (₹)</span>
          </div>
          <h1 className="hero-heading">
            Official Store • <span className="text-gradient">Training, Presets &amp; Study Materials</span>
          </h1>
          <p className="hero-desc">
            Direct instant access courses, exam-cracking practice question banks, and creative digital assets. Handcrafted for competitive aspirants and digital creators across India.
          </p>

          <div className="trust-badges-row">
            <span>⭐ 4.9/5 Rating (25,000+ Students &amp; Creators)</span>
            <span>•</span>
            <span>🔒 Bank-Grade Cashfree Checkout (UPI, GPay, PhonePe, QR)</span>
            <span>•</span>
            <span>⚡ 100% Instant Delivery</span>
          </div>
        </div>
      </header>

      {/* Product Catalog Section */}
      <section className="catalog-section" id="products">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Official Catalog</span>
            <h2 className="section-title">Explore All Available Products</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '6px' }}>
              All products priced transparently in <strong>Indian Rupees (INR - ₹)</strong> with zero hidden fees.
            </p>
          </div>

          <div className="products-grid">
            
            {/* Card 1: USA Facebook Earning Masterclass (Featured Flagship) */}
            {fbProduct && (
              <div className="product-card featured" style={{ borderColor: 'rgba(24, 119, 242, 0.55)', background: 'linear-gradient(180deg, rgba(8, 18, 38, 0.95), rgba(4, 9, 20, 0.98))' }}>
                <div className="product-ribbon" style={{ background: 'linear-gradient(135deg, #1877f2, #0056b3)', color: '#ffffff' }}>
                  {fbProduct.featuredBadge || '🔥 2026 PROVEN BLUEPRINT'}
                </div>
                
                <div className="product-img-wrapper" style={{ position: 'relative', background: '#020612', minHeight: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img 
                    src={fbProduct.coverImage || '/fb-masterclass/cover-masterclass.svg'} 
                    alt={fbProduct.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '12px' }}
                  />
                  <span style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(24, 119, 242, 0.25)', color: '#38bdf8', border: '1px solid #1877f2', padding: '3px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '900', fontFamily: 'monospace' }}>
                    10+ HOURS HD
                  </span>
                </div>

                <div className="product-details">
                  <div style={{ display: 'inline-block', fontSize: '0.72rem', fontWeight: '800', color: '#38bdf8', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '6px' }}>
                    ONLINE BUSINESS &amp; AUTOMATION
                  </div>
                  <h3>{fbProduct.name}</h3>
                  <p className="product-desc">{fbProduct.description}</p>

                  <ul className="features-list">
                    <li><span className="check" style={{ color: '#38bdf8' }}>✓</span> <span>USA Group Sharing Method (Ban-Proof Posting)</span></li>
                    <li><span className="check" style={{ color: '#38bdf8' }}>✓</span> <span>$10-20 Paid Ad Strategy for ROI-Positive Pages</span></li>
                    <li><span className="check" style={{ color: '#38bdf8' }}>✓</span> <span>Copyright-Safe TV Show Repurposing Framework</span></li>
                    <li><span className="check" style={{ color: '#38bdf8' }}>✓</span> <span>AI Automation (1 Day Mein 10 Pages Content)</span></li>
                    <li><span className="check" style={{ color: '#38bdf8' }}>✓</span> <span>Payoneer/Wise to Indian Bank Account Payout Guide</span></li>
                  </ul>

                  <div className="pricing-row">
                    <div className="price-box">
                      <span className="price-current" style={{ color: '#38bdf8' }}>₹{fbProduct.price}</span>
                      <del className="price-old">₹{fbProduct.originalPrice}</del>
                    </div>
                    <span className="discount-badge" style={{ background: 'rgba(24, 119, 242, 0.15)', color: '#38bdf8', border: '1px solid rgba(24, 119, 242, 0.4)' }}>
                      {fbProduct.discountPercent}
                    </span>
                  </div>

                  <div className="buttons-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                      type="button"
                      className="btn-view-details"
                      style={{ background: 'linear-gradient(135deg, #1877f2, #0d5bbd)', color: '#ffffff', border: 'none', fontWeight: '700' }}
                      onClick={() => onNavigate('fb-masterclass')}
                    >
                      <span>View Funnel &amp; Free 2-Hour Video →</span>
                    </button>
                    <button
                      type="button"
                      style={{ background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#94a3b8', padding: '9px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: '600', transition: 'all 0.2s ease' }}
                      onClick={() => onBuyProduct && onBuyProduct(fbProduct)}
                    >
                      ⚡ Direct Buy Pass (₹{fbProduct.price})
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Card 2: ADRE 2.0 Exam 4-in-1 Combo */}
            {adreProduct && (
              <div className="product-card" style={{ borderColor: 'rgba(16, 185, 129, 0.4)' }}>
                <div className="product-ribbon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#ffffff' }}>
                  {adreProduct.featuredBadge || '⭐ #1 EXAM BESTSELLER'}
                </div>
                <div className="product-img-wrapper" style={{ position: 'relative', background: '#020d0a', minHeight: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={adreProduct.coverImage} alt={adreProduct.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '12px' }} />
                  <span style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(16, 185, 129, 0.25)', color: '#34d399', border: '1px solid #10b981', padding: '3px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '900', fontFamily: 'monospace' }}>
                    4-IN-1 EBOOKS
                  </span>
                </div>
                <div className="product-details">
                  <div style={{ display: 'inline-block', fontSize: '0.72rem', fontWeight: '800', color: '#34d399', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '6px' }}>
                    ASSAM GOVT EXAM PREP
                  </div>
                  <h3>{adreProduct.name}</h3>
                  <p className="product-desc">{adreProduct.description}</p>

                  <ul className="features-list">
                    {adreProduct.features.slice(0, 5).map((feat, idx) => (
                      <li key={idx}>
                        <span className="check" style={{ color: '#34d399' }}>✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pricing-row">
                    <div className="price-box">
                      <span className="price-current" style={{ color: '#34d399' }}>₹{adreProduct.price}</span>
                      <del className="price-old">₹{adreProduct.originalPrice}</del>
                    </div>
                    <span className="discount-badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.4)' }}>
                      {adreProduct.discountPercent}
                    </span>
                  </div>

                  <div className="buttons-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                      type="button"
                      className="btn-view-details"
                      style={{ borderColor: 'rgba(16, 185, 129, 0.4)', color: '#34d399' }}
                      onClick={() => onNavigate('adre')}
                    >
                      <span>View ADRE Funnel →</span>
                    </button>
                    <button
                      type="button"
                      style={{ background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#94a3b8', padding: '9px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: '600' }}
                      onClick={() => onBuyProduct && onBuyProduct(adreProduct)}
                    >
                      ⚡ Direct Buy (₹{adreProduct.price})
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Card 3: CineMood Lightroom Presets */}
            {cinemoodProduct && (
              <div className="product-card" style={{ borderColor: 'rgba(0, 180, 216, 0.4)' }}>
                <div className="product-ribbon" style={{ background: 'linear-gradient(135deg, #38bdf8, #00b4d8)', color: '#030712' }}>
                  {cinemoodProduct.featuredBadge || '📸 100+ PRESETS'}
                </div>
                <div className="product-img-wrapper" style={{ position: 'relative', background: '#020610', minHeight: '220px' }}>
                  <img 
                    src="/presets/cinemood-banner.jpg" 
                    alt={cinemoodProduct.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span style={{ position: 'absolute', bottom: '10px', right: '10px', background: '#001b3a', color: '#38bdf8', border: '1px solid #38bdf8', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '900', fontFamily: 'monospace' }}>
                    Lr XML + DNG
                  </span>
                </div>
                <div className="product-details">
                  <div style={{ display: 'inline-block', fontSize: '0.72rem', fontWeight: '800', color: '#38bdf8', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '6px' }}>
                    CREATIVE PHOTO PRESETS
                  </div>
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
                      <del className="price-old">₹{cinemoodProduct.originalPrice}</del>
                    </div>
                    <span className="discount-badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.4)' }}>
                      {cinemoodProduct.discountPercent}
                    </span>
                  </div>

                  <div className="buttons-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                      type="button"
                      className="btn-view-details"
                      style={{ borderColor: 'rgba(56, 189, 248, 0.4)', color: '#38bdf8' }}
                      onClick={() => onNavigate('cinemood-presets')}
                    >
                      <span>View Presets &amp; Samples →</span>
                    </button>
                    <button
                      type="button"
                      style={{ background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#94a3b8', padding: '9px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: '600' }}
                      onClick={() => onBuyProduct && onBuyProduct(cinemoodProduct)}
                    >
                      ⚡ Direct Buy (₹{cinemoodProduct.price})
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Card 4: Spoken English Bundle */}
            {spokenProduct && (
              <div className="product-card" style={{ borderColor: 'rgba(245, 158, 11, 0.45)' }}>
                <div className="product-ribbon" style={{ background: 'linear-gradient(135deg, #fbbf24, #f59e0b)', color: '#030712' }}>
                  {spokenProduct.featuredBadge || '💬 FLUENCY BUNDLE'}
                </div>
                <div className="product-img-wrapper" style={{ position: 'relative', background: '#050d1a', minHeight: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img 
                    src={spokenProduct.coverImage} 
                    alt={spokenProduct.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '12px' }}
                  />
                  <span style={{ position: 'absolute', bottom: '10px', right: '10px', background: '#1c1303', color: '#fbbf24', border: '1px solid #f59e0b', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '900', fontFamily: 'monospace' }}>
                    4 EBOOKS PRACTICE
                  </span>
                </div>
                <div className="product-details">
                  <div style={{ display: 'inline-block', fontSize: '0.72rem', fontWeight: '800', color: '#fbbf24', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '6px' }}>
                    COMMUNICATION &amp; CAREER
                  </div>
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
                      <del className="price-old">₹{spokenProduct.originalPrice}</del>
                    </div>
                    <span className="discount-badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
                      {spokenProduct.discountPercent}
                    </span>
                  </div>

                  <div className="buttons-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                      type="button"
                      className="btn-view-details"
                      style={{ borderColor: 'rgba(245, 158, 11, 0.45)', color: '#fbbf24' }}
                      onClick={() => onNavigate('spoken-english')}
                    >
                      <span>View Spoken English Funnel →</span>
                    </button>
                    <button
                      type="button"
                      style={{ background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#94a3b8', padding: '9px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: '600' }}
                      onClick={() => onBuyProduct && onBuyProduct(spokenProduct)}
                    >
                      ⚡ Direct Buy (₹{spokenProduct.price})
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic Custom Products created from Admin Panel */}
            {customProducts.map(cp => (
              <div key={cp.id} className="product-card" style={{ borderColor: 'rgba(168, 85, 247, 0.4)' }}>
                <div className="product-ribbon" style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)', color: '#ffffff' }}>
                  ⭐ CUSTOM PRODUCT
                </div>
                <div className="product-img-wrapper" style={{ position: 'relative', background: '#0c071a', minHeight: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '3rem' }}>📦</span>
                  <span style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(168, 85, 247, 0.25)', color: '#c084fc', border: '1px solid #a855f7', padding: '3px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '900', fontFamily: 'monospace' }}>
                    /{cp.id}
                  </span>
                </div>
                <div className="product-details">
                  <div style={{ display: 'inline-block', fontSize: '0.72rem', fontWeight: '800', color: '#c084fc', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '6px' }}>
                    {cp.category || 'DIGITAL PRODUCT'}
                  </div>
                  <h3>{cp.name}</h3>
                  <p className="product-desc">{cp.tagline || 'Custom high-converting digital product & training.'}</p>

                  <div className="pricing-row" style={{ marginTop: 'auto' }}>
                    <div className="price-box">
                      <span className="price-current" style={{ color: '#c084fc' }}>₹{cp.price}</span>
                      <del className="price-old">₹{cp.originalPrice || cp.price * 5}</del>
                    </div>
                  </div>

                  <div className="buttons-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                      type="button"
                      className="btn-view-details"
                      style={{ borderColor: 'rgba(168, 85, 247, 0.5)', color: '#c084fc' }}
                      onClick={() => onNavigate(`funnel:${cp.id}`)}
                    >
                      <span>View Custom Funnel Page →</span>
                    </button>
                    <button
                      type="button"
                      style={{ background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#94a3b8', padding: '9px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.88rem', fontWeight: '600' }}
                      onClick={() => onBuyProduct && onBuyProduct(cp)}
                    >
                      ⚡ Direct Buy (₹{cp.price})
                    </button>
                  </div>
                </div>
              </div>
            ))}

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
              <p>Crystal-clear PDF formatting and HD video players optimized for smartphone, tablet, and PC screens.</p>
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
