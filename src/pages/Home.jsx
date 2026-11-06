import React, { useState, useEffect } from 'react';
import { PRODUCTS } from '../data/products';
import { funnelManager } from '../data/funnelManager';
import { MetaPixel } from '../components/MetaPixel';

export default function Home({ onNavigate, onBuyProduct }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeFaq, setActiveFaq] = useState(0);

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

  // Filter logic
  const isMatchCategory = (cat) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'masterclass') return cat === 'fb-masterclass';
    if (activeCategory === 'exams') return cat === 'adre';
    if (activeCategory === 'presets') return cat === 'cinemood';
    if (activeCategory === 'english') return cat === 'spoken-english';
    if (activeCategory === 'custom') return cat === 'custom';
    return true;
  };

  return (
    <div className="home-page light-mode-root">
      
      {/* 1. Hero Header */}
      <header className="home-hero-section">
        <div className="container">
          <div className="home-hero-badge-pill">
            <span className="live-dot"></span>
            <span>⚡ 100% INSTANT DIGITAL DOWNLOAD • SECURE UPI IN INR (₹)</span>
          </div>

          <h1 className="home-hero-title">
            Premium Courses, Exam Bundles &amp; <span className="home-gradient-text">Creative Presets</span>
          </h1>

          <p className="home-hero-subtitle">
            Direct instant access courses, bilingual exam-cracking practice books, and high-conversion presets. Handcrafted for competitive aspirants and digital creators across India.
          </p>

          <div className="home-trust-matrix-row">
            <div className="home-trust-item">
              <span className="trust-icon">⭐</span>
              <span><strong>4.9/5 Rating</strong> (25,000+ Downloads)</span>
            </div>
            <div className="home-trust-item">
              <span className="trust-icon">🔒</span>
              <span><strong>Cashfree Bank-Grade 256-Bit SSL</strong> (UPI / Cards)</span>
            </div>
            <div className="home-trust-item">
              <span className="trust-icon">⚡</span>
              <span><strong>100% Instant Delivery</strong> to Email &amp; WhatsApp</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Top Spotlight Featured Product (USA Facebook Earning Masterclass) */}
      {(activeCategory === 'all' || activeCategory === 'masterclass') && fbProduct && (
        <section className="home-spotlight-section">
          <div className="container">
            <div className="home-spotlight-card">
              
              {/* Left Column: Image & Media Preview */}
              <div className="home-spotlight-left">
                <div className="home-spotlight-cover-wrap">
                  <img 
                    src={fbProduct.coverImage || '/fb-masterclass/cover-masterclass.svg'} 
                    alt={fbProduct.name} 
                    className="home-spotlight-img"
                  />
                  <div className="home-spotlight-overlay-badge">
                    <span>🎬 10+ HOURS HD VIDEO</span>
                  </div>
                </div>

                <div className="home-spotlight-payout-chip">
                  <span className="payout-check">✓</span>
                  <span>Verified Meta Payout: <strong>$15,353.41 (₹12,80,000+)</strong> Paid to PNB</span>
                </div>

                {/* 3 Real Proof Thumbnails linking to Funnel Proofs */}
                <div className="home-spotlight-proof-strip">
                  <div 
                    className="proof-thumb-item" 
                    onClick={() => onNavigate('fb-masterclass')} 
                    title="13 Million Views Analytics - Click to see full proof"
                  >
                    <img src="/fb-masterclass/proof-analytics-13m.webp" alt="13M Views Analytics" />
                    <span>13M Views ($1,493)</span>
                  </div>
                  <div 
                    className="proof-thumb-item" 
                    onClick={() => onNavigate('fb-masterclass')} 
                    title="Meta Monetization Transactions - Click to see full proof"
                  >
                    <img src="/fb-masterclass/proof-payout-transactions.png" alt="Meta Transactions" />
                    <span>$3,131 Payouts</span>
                  </div>
                  <div 
                    className="proof-thumb-item" 
                    onClick={() => onNavigate('fb-masterclass')} 
                    title="PNB Bank Credit Receipt - Click to see full proof"
                  >
                    <img src="/fb-masterclass/proof-payout-detail.jpg" alt="Bank Credit Detail" />
                    <span>$15,353 PNB Paid</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Copy & Actions */}
              <div className="home-spotlight-right">
                <div className="home-spotlight-badge-row">
                  <span className="spotlight-flagship-pill">🔥 2026 PROVEN BLUEPRINT • BESTSELLER #1</span>
                  <span className="spotlight-rating-pill">⭐ 4.9/5 (1,280+ Students)</span>
                </div>

                <h2 className="home-spotlight-title">{fbProduct.name}</h2>
                <p className="home-spotlight-tagline">{fbProduct.tagline}</p>

                {/* 4 Pillars Checklist */}
                <div className="home-spotlight-checklist">
                  <div className="spotlight-check-item">
                    <span className="check-icon">✓</span>
                    <div>
                      <strong>USA Active Group Sharing</strong>
                      <p>Active groups mein ban-proof safe posting &amp; organic reach multiplication.</p>
                    </div>
                  </div>
                  <div className="spotlight-check-item">
                    <span className="check-icon">✓</span>
                    <div>
                      <strong>$10-20 Paid Method</strong>
                      <p>Small ad-budget se views boost karke pages ko instant ROI-positive banayein.</p>
                    </div>
                  </div>
                  <div className="spotlight-check-item">
                    <span className="check-icon">✓</span>
                    <div>
                      <strong>TV Show Repurposing</strong>
                      <p>Licensed viral clips se in-stream ad revenue — 100% copyright-safe.</p>
                    </div>
                  </div>
                  <div className="spotlight-check-item">
                    <span className="check-icon">✓</span>
                    <div>
                      <strong>1-Day 10 Pages AI Automation</strong>
                      <p>AI tools aur prompt workflows se viral video content schedule karein.</p>
                    </div>
                  </div>
                </div>

                {/* Price & Action Row */}
                <div className="home-spotlight-price-row">
                  <div className="home-spotlight-price-box">
                    <span className="currency-symbol">₹</span>
                    <span className="current-price">{fbProduct.price}</span>
                    <del className="old-price">₹{fbProduct.originalPrice}</del>
                    <span className="discount-chip">{fbProduct.discountPercent}</span>
                  </div>

                  <div className="home-spotlight-btn-group">
                    <button 
                      type="button" 
                      className="home-btn-primary"
                      onClick={() => onNavigate('fb-masterclass')}
                    >
                      <span>View Funnel &amp; Free 2-Hour Video →</span>
                    </button>
                    <button 
                      type="button" 
                      className="home-btn-secondary"
                      onClick={() => onBuyProduct && onBuyProduct(fbProduct)}
                    >
                      ⚡ Buy Masterclass (₹{fbProduct.price})
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>
      )}

      {/* 3. Products Catalog Grid with Category Filter Tabs */}
      <section className="home-catalog-section" id="products">
        <div className="container">
          
          <div className="home-section-header text-center">
            <span className="home-section-tag">OFFICIAL DIGITAL STORE</span>
            <h2 className="home-section-title">Explore All Available Products</h2>
            <p className="home-section-desc">
              All digital materials priced transparently in <strong>Indian Rupees (INR - ₹)</strong> with instant direct access.
            </p>

            {/* Category Filter Pills */}
            <div className="home-category-tabs">
              <button 
                type="button" 
                className={`home-cat-tab ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => setActiveCategory('all')}
              >
                <span>🌟 All Products</span>
                <span className="cat-count">{4 + customProducts.length}</span>
              </button>
              <button 
                type="button" 
                className={`home-cat-tab ${activeCategory === 'masterclass' ? 'active' : ''}`}
                onClick={() => setActiveCategory('masterclass')}
              >
                <span>📺 Video Masterclasses</span>
                <span className="cat-count">1</span>
              </button>
              <button 
                type="button" 
                className={`home-cat-tab ${activeCategory === 'exams' ? 'active' : ''}`}
                onClick={() => setActiveCategory('exams')}
              >
                <span>📚 Exam Study Bundles</span>
                <span className="cat-count">1</span>
              </button>
              <button 
                type="button" 
                className={`home-cat-tab ${activeCategory === 'presets' ? 'active' : ''}`}
                onClick={() => setActiveCategory('presets')}
              >
                <span>📸 Lightroom Presets</span>
                <span className="cat-count">1</span>
              </button>
              <button 
                type="button" 
                className={`home-cat-tab ${activeCategory === 'english' ? 'active' : ''}`}
                onClick={() => setActiveCategory('english')}
              >
                <span>💬 Spoken English</span>
                <span className="cat-count">1</span>
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="home-products-grid">
            
            {/* Card 1: FB Masterclass Card */}
            {isMatchCategory('fb-masterclass') && fbProduct && (
              <div className="home-product-card card-fb">
                <div className="home-card-badge-wrap">
                  <span className="home-card-badge badge-blue">🔥 2026 PROVEN BLUEPRINT</span>
                  <span className="home-card-discount-tag">94% OFF</span>
                </div>

                <div className="home-card-img-wrapper">
                  <img src={fbProduct.coverImage || '/fb-masterclass/cover-masterclass.svg'} alt={fbProduct.name} />
                  <span className="home-card-duration-badge">10+ HOURS HD</span>
                </div>

                <div className="home-card-body">
                  <div className="home-card-meta">
                    <span className="home-card-category text-blue">ONLINE BUSINESS &amp; AUTOMATION</span>
                    <span className="home-card-rating">⭐ 4.9 (1,280+ Students)</span>
                  </div>

                  <h3 className="home-card-title">{fbProduct.name}</h3>
                  <p className="home-card-desc">{fbProduct.description}</p>

                  <ul className="home-card-features">
                    <li><span className="check check-blue">✓</span> <span>USA Group Sharing Matrix (Ban-Proof Safe Limits)</span></li>
                    <li><span className="check check-blue">✓</span> <span>$10-20 Ad Setup for Fast Monetization</span></li>
                    <li><span className="check check-blue">✓</span> <span>Copyright-Safe TV Show Repurposing</span></li>
                    <li><span className="check check-blue">✓</span> <span>AI Automation (10 Pages Daily Content)</span></li>
                    <li><span className="check check-blue">✓</span> <span>Payoneer &amp; Wise Indian Bank Payout Guide</span></li>
                  </ul>

                  <div className="home-card-pricing-row">
                    <div className="home-card-price">
                      <span className="currency">₹</span>
                      <span className="amount">{fbProduct.price}</span>
                      <del className="old-amount">₹{fbProduct.originalPrice}</del>
                    </div>
                    <span className="home-savings-pill">Save ₹{fbProduct.originalPrice - fbProduct.price}</span>
                  </div>

                  <div className="home-card-actions">
                    <button 
                      type="button" 
                      className="home-card-btn-primary btn-blue"
                      onClick={() => onNavigate('fb-masterclass')}
                    >
                      <span>View Funnel &amp; Video →</span>
                    </button>
                    <button 
                      type="button" 
                      className="home-card-btn-secondary"
                      onClick={() => onBuyProduct && onBuyProduct(fbProduct)}
                    >
                      ⚡ Buy (₹{fbProduct.price})
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Card 2: ADRE 2.0 Exam Combo */}
            {isMatchCategory('adre') && adreProduct && (
              <div className="home-product-card card-emerald">
                <div className="home-card-badge-wrap">
                  <span className="home-card-badge badge-emerald">⭐ #1 EXAM BESTSELLER</span>
                  <span className="home-card-discount-tag">80% OFF</span>
                </div>

                <div className="home-card-img-wrapper">
                  <img src={adreProduct.coverImage || '/combo-banner.jpg'} alt={adreProduct.name} />
                  <span className="home-card-duration-badge" style={{ background: '#059669' }}>4-IN-1 EBOOKS</span>
                </div>

                <div className="home-card-body">
                  <div className="home-card-meta">
                    <span className="home-card-category text-emerald">ASSAM GOVT EXAM PREP</span>
                    <span className="home-card-rating">⭐ 4.9 (18,400+ Candidates)</span>
                  </div>

                  <h3 className="home-card-title">{adreProduct.name}</h3>
                  <p className="home-card-desc">{adreProduct.description}</p>

                  <ul className="home-card-features">
                    {adreProduct.features.slice(0, 5).map((feat, idx) => (
                      <li key={idx}>
                        <span className="check check-emerald">✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="home-card-pricing-row">
                    <div className="home-card-price">
                      <span className="currency">₹</span>
                      <span className="amount">{adreProduct.price}</span>
                      <del className="old-amount">₹{adreProduct.originalPrice}</del>
                    </div>
                    <span className="home-savings-pill">Save ₹{adreProduct.originalPrice - adreProduct.price}</span>
                  </div>

                  <div className="home-card-actions">
                    <button 
                      type="button" 
                      className="home-card-btn-primary btn-emerald"
                      onClick={() => onNavigate('adre')}
                    >
                      <span>View ADRE Funnel →</span>
                    </button>
                    <button 
                      type="button" 
                      className="home-card-btn-secondary"
                      onClick={() => onBuyProduct && onBuyProduct(adreProduct)}
                    >
                      ⚡ Buy (₹{adreProduct.price})
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Card 3: CineMood Lightroom Presets */}
            {isMatchCategory('cinemood') && cinemoodProduct && (
              <div className="home-product-card card-cyan">
                <div className="home-card-badge-wrap">
                  <span className="home-card-badge badge-cyan">📸 100+ PRESETS</span>
                  <span className="home-card-discount-tag">90% OFF</span>
                </div>

                <div className="home-card-img-wrapper">
                  <img src="/presets/cinemood-banner.jpg" alt={cinemoodProduct.name} />
                  <span className="home-card-duration-badge" style={{ background: '#0284c7' }}>XML + DNG</span>
                </div>

                <div className="home-card-body">
                  <div className="home-card-meta">
                    <span className="home-card-category text-cyan">CREATIVE PHOTO PRESETS</span>
                    <span className="home-card-rating">⭐ 4.9 (4,200+ Creators)</span>
                  </div>

                  <h3 className="home-card-title">{cinemoodProduct.name}</h3>
                  <p className="home-card-desc">{cinemoodProduct.description}</p>

                  <ul className="home-card-features">
                    {cinemoodProduct.features.slice(0, 5).map((feat, idx) => (
                      <li key={idx}>
                        <span className="check check-cyan">✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="home-card-pricing-row">
                    <div className="home-card-price">
                      <span className="currency">₹</span>
                      <span className="amount">{cinemoodProduct.price}</span>
                      <del className="old-amount">₹{cinemoodProduct.originalPrice}</del>
                    </div>
                    <span className="home-savings-pill">Save ₹{cinemoodProduct.originalPrice - cinemoodProduct.price}</span>
                  </div>

                  <div className="home-card-actions">
                    <button 
                      type="button" 
                      className="home-card-btn-primary btn-cyan"
                      onClick={() => onNavigate('cinemood-presets')}
                    >
                      <span>View Presets &amp; Samples →</span>
                    </button>
                    <button 
                      type="button" 
                      className="home-card-btn-secondary"
                      onClick={() => onBuyProduct && onBuyProduct(cinemoodProduct)}
                    >
                      ⚡ Buy (₹{cinemoodProduct.price})
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Card 4: Spoken English Bundle */}
            {isMatchCategory('spoken-english') && spokenProduct && (
              <div className="home-product-card card-amber">
                <div className="home-card-badge-wrap">
                  <span className="home-card-badge badge-amber">💬 FLUENCY BUNDLE</span>
                  <span className="home-card-discount-tag">90% OFF</span>
                </div>

                <div className="home-card-img-wrapper">
                  <img src={spokenProduct.coverImage || '/spoken-english/cover-bundle.svg'} alt={spokenProduct.name} />
                  <span className="home-card-duration-badge" style={{ background: '#d97706' }}>4 EBOOKS PRACTICE</span>
                </div>

                <div className="home-card-body">
                  <div className="home-card-meta">
                    <span className="home-card-category text-amber">COMMUNICATION &amp; CAREER</span>
                    <span className="home-card-rating">⭐ 4.8 (3,100+ Readers)</span>
                  </div>

                  <h3 className="home-card-title">{spokenProduct.name}</h3>
                  <p className="home-card-desc">{spokenProduct.description}</p>

                  <ul className="home-card-features">
                    {spokenProduct.features.slice(0, 5).map((feat, idx) => (
                      <li key={idx}>
                        <span className="check check-amber">✓</span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="home-card-pricing-row">
                    <div className="home-card-price">
                      <span className="currency">₹</span>
                      <span className="amount">{spokenProduct.price}</span>
                      <del className="old-amount">₹{spokenProduct.originalPrice}</del>
                    </div>
                    <span className="home-savings-pill">Save ₹{spokenProduct.originalPrice - spokenProduct.price}</span>
                  </div>

                  <div className="home-card-actions">
                    <button 
                      type="button" 
                      className="home-card-btn-primary btn-amber"
                      onClick={() => onNavigate('spoken-english')}
                    >
                      <span>View Spoken English Funnel →</span>
                    </button>
                    <button 
                      type="button" 
                      className="home-card-btn-secondary"
                      onClick={() => onBuyProduct && onBuyProduct(spokenProduct)}
                    >
                      ⚡ Buy (₹{spokenProduct.price})
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic Custom Products created from Admin Panel */}
            {customProducts.map(cp => (
              <div key={cp.id} className="home-product-card card-purple">
                <div className="home-card-badge-wrap">
                  <span className="home-card-badge badge-purple">⭐ CUSTOM PRODUCT</span>
                  <span className="home-card-discount-tag">SPECIAL</span>
                </div>

                <div className="home-card-img-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#faf5ff' }}>
                  <span style={{ fontSize: '3.5rem' }}>📦</span>
                  <span className="home-card-duration-badge" style={{ background: '#7c3aed' }}>/{cp.id}</span>
                </div>

                <div className="home-card-body">
                  <div className="home-card-meta">
                    <span className="home-card-category text-purple">{cp.category || 'DIGITAL PRODUCT'}</span>
                    <span className="home-card-rating">⭐ 4.9 Verified</span>
                  </div>

                  <h3 className="home-card-title">{cp.name}</h3>
                  <p className="home-card-desc">{cp.tagline || 'Custom high-converting digital product & training.'}</p>

                  <div className="home-card-pricing-row" style={{ marginTop: 'auto' }}>
                    <div className="home-card-price">
                      <span className="currency">₹</span>
                      <span className="amount">{cp.price}</span>
                      <del className="old-amount">₹{cp.originalPrice || cp.price * 5}</del>
                    </div>
                  </div>

                  <div className="home-card-actions">
                    <button 
                      type="button" 
                      className="home-card-btn-primary btn-purple"
                      onClick={() => onNavigate(`funnel:${cp.id}`)}
                    >
                      <span>View Custom Funnel Page →</span>
                    </button>
                    <button 
                      type="button" 
                      className="home-card-btn-secondary"
                      onClick={() => onBuyProduct && onBuyProduct(cp)}
                    >
                      ⚡ Buy (₹{cp.price})
                    </button>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* 4. Why Choose ProjuktiSoft (Trust Section in Clean Light Mode) */}
      <section className="home-why-section">
        <div className="container">
          <div className="home-section-header text-center">
            <span className="home-section-tag">WHY PROJUKTISOFT</span>
            <h2 className="home-section-title">Built For Seamless Digital Learning</h2>
            <p className="home-section-desc">We deliver verified, high-scoring study tools and digital blueprints with 100% peace of mind.</p>
          </div>

          <div className="home-perks-grid">
            <div className="home-perk-card">
              <div className="home-perk-icon-box bg-emerald">⚡</div>
              <h4>Instant Delivery in INR</h4>
              <p>Secure checkout in Indian Rupees with download links generated immediately after payment on screen &amp; via email.</p>
            </div>
            <div className="home-perk-card">
              <div className="home-perk-icon-box bg-blue">📱</div>
              <h4>Offline Mobile Access</h4>
              <p>Crystal-clear PDF formatting and HD video players optimized for smartphone, tablet, and PC screens with zero lag.</p>
            </div>
            <div className="home-perk-card">
              <div className="home-perk-icon-box bg-purple">🔒</div>
              <h4>Cashfree 256-Bit SSL</h4>
              <p>Official bank-grade UPI intent (Google Pay, PhonePe, Paytm, QR) with end-to-end encrypted transaction security.</p>
            </div>
            <div className="home-perk-card">
              <div className="home-perk-icon-box bg-amber">🤝</div>
              <h4>Dedicated Human Support</h4>
              <p>Quick WhatsApp and email customer assistance if you ever need download help or have queries.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Authentic Reviews Showcase */}
      <section className="home-reviews-section">
        <div className="container">
          <div className="home-section-header text-center">
            <span className="home-section-tag">STUDENT &amp; CREATOR VOICES</span>
            <h2 className="home-section-title">Trusted By 25,000+ Across India</h2>
          </div>

          <div className="home-reviews-grid">
            <div className="home-review-card">
              <div className="home-review-stars">⭐⭐⭐⭐⭐</div>
              <p className="home-review-text">
                “Facebook Masterclass ka TV show repurposing method sach mein gamechanger hai. Pehle 2 hafton mein mera page reach 4x ho gaya bina kisi copyright strike ke!”
              </p>
              <div className="home-review-author">
                <div className="author-avatar bg-blue">RS</div>
                <div>
                  <strong>Rahul S.</strong>
                  <span>Facebook Content Creator • Verified Buyer</span>
                </div>
              </div>
            </div>

            <div className="home-review-card">
              <div className="home-review-stars">⭐⭐⭐⭐⭐</div>
              <p className="home-review-text">
                “ADRE 4-in-1 combo book ki vajah se mera revision bohot fast hua. Bilingual format hone ki wajah se Assamese aur English dono samajh aate hain.”
              </p>
              <div className="home-review-author">
                <div className="author-avatar bg-emerald">DB</div>
                <div>
                  <strong>Dimpu B.</strong>
                  <span>ADRE Grade III Aspirant • Guwahati</span>
                </div>
              </div>
            </div>

            <div className="home-review-card">
              <div className="home-review-stars">⭐⭐⭐⭐⭐</div>
              <p className="home-review-text">
                “CineMood presets XML direct Lightroom mobile mein 1-click import ho gaye. Photos ka tone ekdum cinematic film jaisa lagta hai!”
              </p>
              <div className="home-review-author">
                <div className="author-avatar bg-cyan">AK</div>
                <div>
                  <strong>Ankit K.</strong>
                  <span>Photographer &amp; Reel Creator</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Frequently Asked Questions */}
      <section className="home-faq-section">
        <div className="container" style={{ maxWidth: '860px' }}>
          <div className="home-section-header text-center">
            <span className="home-section-tag">COMMON QUERIES</span>
            <h2 className="home-section-title">Frequently Asked Questions</h2>
          </div>

          <div className="home-faq-list">
            {[
              {
                q: 'Payment ke baad download link kaise milega?',
                a: 'Payment complete hote hi screen par direct Instant Download button open hota hai. Saath hi ek backup link aapke registered email aur phone par bhi automatic bhej diya jata hai.'
              },
              {
                q: 'Kya ye materials mobile phone par khulenge?',
                a: 'Haan! Saari ebooks, video players aur presets smartphone, tablet aur PC sabhi devices ke liye fully optimized hain. Kisi specific high-end device ki zaroorat nahi hai.'
              },
              {
                q: 'Kaun-kaun se payment methods available hain?',
                a: 'Aap Google Pay, PhonePe, Paytm, BHIM UPI, QR Code, Netbanking, Debit Card ya Credit Card se Cashfree ke 256-bit safe gateway ke through payment kar sakte hain.'
              },
              {
                q: 'Agar download mein koi dikkat aayi toh kahan contact karein?',
                a: 'Aap turant hamari support team se WhatsApp (+91 98765 43210) ya support@projuktisoft.shop par contact kar sakte hain. Hum 24 hours ke andar query resolve karte hain.'
              }
            ].map((faq, idx) => (
              <div 
                key={idx} 
                className={`home-faq-item ${activeFaq === idx ? 'active' : ''}`}
                onClick={() => setActiveFaq(activeFaq === idx ? -1 : idx)}
              >
                <div className="home-faq-q">
                  <span>{faq.q}</span>
                  <span className="faq-toggle">{activeFaq === idx ? '−' : '+'}</span>
                </div>
                {activeFaq === idx && (
                  <div className="home-faq-a animate-fadeIn">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
