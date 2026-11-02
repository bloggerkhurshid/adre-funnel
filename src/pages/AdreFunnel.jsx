import React, { useState, useEffect } from 'react';
import { PRODUCTS } from '../data/products';
import { MetaPixel } from '../components/MetaPixel';

export default function AdreFunnel({ onBuyProduct, onNavigate }) {
  const product = PRODUCTS['adre-combo'];

  // 15-Minute Countdown State
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 52);
  // Live Visitors State
  const [liveCount, setLiveCount] = useState(64);
  // Active FAQ Accordion State
  const [activeFaq, setActiveFaq] = useState(0);
  // Sticky bar visibility
  const [showSticky, setShowSticky] = useState(false);
  // Toast Notification State
  const [toast, setToast] = useState({ show: false, name: 'Bikash Saikia', city: 'Guwahati', initial: 'B' });
  // Optional CTET Order Bump Selection State
  const [selectedBump, setSelectedBump] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    MetaPixel.pageView('ADRE Funnel');
    MetaPixel.viewContent(product);

    // Countdown Timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 15 * 60));
    }, 1000);

    // Live Visitor Fluctuations
    const visitorInterval = setInterval(() => {
      setLiveCount((prev) => {
        const change = Math.floor(Math.random() * 5) - 2;
        return Math.min(84, Math.max(52, prev + change));
      });
    }, 5000);

    // Assam Buyer Toast Notifications
    const assamBuyers = [
      { name: 'Bikash Saikia', city: 'Guwahati', initial: 'B' },
      { name: 'Pranjal Kalita', city: 'Jorhat', initial: 'P' },
      { name: 'Debajit Baruah', city: 'Dibrugarh', initial: 'D' },
      { name: 'Ritu Moni Gogoi', city: 'Sivasagar', initial: 'R' },
      { name: 'Manash Pratim Bora', city: 'Nagaon', initial: 'M' },
      { name: 'Ananya Hazarika', city: 'North Lakhimpur', initial: 'A' },
      { name: 'Pallab Chaliha', city: 'Barpeta', initial: 'P' },
      { name: 'Dipankar Medhi', city: 'Bongaigaon', initial: 'D' }
    ];
    let buyerIdx = 0;

    const toastInterval = setInterval(() => {
      const b = assamBuyers[buyerIdx % assamBuyers.length];
      buyerIdx++;
      setToast({ show: true, ...b });

      setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 4500);
    }, 12000);

    // Sticky Scroll Listener
    const handleScroll = () => {
      setShowSticky(window.scrollY > 450);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearInterval(timer);
      clearInterval(visitorInterval);
      clearInterval(toastInterval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [product]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const faqs = [
    {
      q: 'How will I receive the ebooks after payment?',
      a: 'Delivery is 100% instant and automated! Immediately after completing the ₹99 payment on Razorpay, you will be redirected to the download screen to access all 4 PDF ebooks right away. An email with download links is also sent automatically.'
    },
    {
      q: 'Are the questions in Assamese or English?',
      a: 'They are bilingual (English & Assamese)! Questions and options are presented in both languages side-by-side, making it ideal for Assamese medium as well as English medium candidates.'
    },
    {
      q: 'Are all 3 bonuses really included for free?',
      a: 'Yes! When you buy the Combo today for ₹99, you get the ADRE Ebook plus Bonus 1 (SSC GD 1500+ MCQs), Bonus 2 (Assam Police SI 2000+ MCQs), and Bonus 3 (Assam Police Constable 2000+ MCQs) completely FREE.'
    },
    {
      q: 'Can I read the PDF offline on my phone?',
      a: 'Yes! Once downloaded, you can read them offline on any smartphone (Android/iPhone), tablet, or laptop using any standard PDF reader without requiring internet connection.'
    },
    {
      q: 'Are correct answers provided for every question?',
      a: 'Yes, every single question has the verified correct answer clearly highlighted right below the options so you can practice smoothly without getting stuck.'
    }
  ];

  return (
    <div className="funnel-container">
      {/* Top Banner */}
      <div className="top-banner">
        <div className="banner-content">
          <span className="live-badge">⚡ ASSAM SPECIAL OFFER</span>
          <span>Flat 90% OFF Combo Offer Ends In: <span className="timer-box-banner">{formattedTime}</span></span>
          <span>•</span>
          <span>Original Price: <del>₹999</del> <strong>Today: ₹99 INR Only!</strong></span>
        </div>
      </div>

      {/* Hero Section */}
      <header className="hero section-padding">
        <div className="container text-center">
          <div className="hero-pill-badge">
            <span className="pulse-dot"></span>
            <span><strong>{liveCount}</strong> Assam aspirants are viewing this offer right now</span>
          </div>

          <span className="hero-target-tag">For Assam Police SI • Constable • SSC GD • ADRE Aspirants</span>
          <h1 className="hero-title">
            ADRE All-Subject MCQ Bundle + <span className="text-gold">3 Dedicated Exam Bonuses</span>
          </h1>
          <p className="hero-subtitle">
            The ultimate practice bank designed strictly on the latest Assam exam patterns. Practice high-yield questions with 100% verified answers in <strong>English & Assamese (দ্বিভাষিক)</strong> directly on your mobile phone!
          </p>

          <div className="rating-box">
            <span className="stars">★★★★★</span>
            <span style={{ fontWeight: 700, color: '#fff' }}>4.9/5 Rating</span>
            <span>•</span>
            <span>Trusted by <strong>12,400+ Assam Aspirants</strong></span>
          </div>

          {/* Banner Graphic */}
          <div className="hero-banner-container">
            <img src="/combo-banner.jpg" alt="Assam Police SI, Constable, SSC GD & ADRE MCQ Combo" />
          </div>

          {/* Feature Badges with High-Quality Vector Icons */}
          <div className="combo-feature-row">
            <div className="feature-pill">
              <div className="feature-pill-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <polyline points="9 15 12 18 15 15" />
                </svg>
              </div>
              <div className="feature-pill-text">Instant PDF Download</div>
            </div>

            <div className="feature-pill">
              <div className="feature-pill-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="3" ry="3" />
                  <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2.5" />
                </svg>
              </div>
              <div className="feature-pill-text">Read Anywhere on Phone</div>
            </div>

            <div className="feature-pill">
              <div className="feature-pill-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div className="feature-pill-text">Answers with Every MCQ</div>
            </div>

            <div className="feature-pill">
              <div className="feature-pill-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  <line x1="9" y1="7" x2="15" y2="7" />
                  <line x1="9" y1="11" x2="15" y2="11" />
                </svg>
              </div>
              <div className="feature-pill-text">4 Ebooks in 1 Combo</div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="cta-wrapper">
            <button
              type="button"
              className="btn-primary-cta"
              onClick={() => onBuyProduct(product, selectedBump)}
            >
              <span>GET THE COMBO NOW (₹99)</span>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>

            <a href="#sample" className="btn-sample-cta">
              <span>📄 Check Free PDF Sample First</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M7 13l5 5 5-5M12 4v14" />
              </svg>
            </a>

            <div className="price-subtext" style={{ marginTop: '8px' }}>
              <span>Original Price: <del>₹999</del></span>
              <span className="today-deal">⚡ Today Just ₹99 (Save 90%)</span>
              <span>• Instant Digital Access</span>
            </div>
          </div>
        </div>
      </header>

      {/* Free Sample Showcase */}
      <section className="section-padding free-sample-section" id="sample">
        <div className="container">
          <div className="sample-showcase-grid">
            <div className="sample-image-preview">
              <img src="/sample-page.jpg" alt="Real Sample Question Page Preview" />
            </div>

            <div className="sample-info-content">
              <span style={{ color: '#8ac926', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
                100% Transparency
              </span>
              <h3>See The Premium Quality For Yourself Before You Buy!</h3>
              <p>
                We don't want you to guess. Inspect the exact questions, authentic bilingual formatting (English & Assamese), and accurate answer keys in our sample PDF. The full ebooks have the exact same uncompromising quality!
              </p>

              <ul className="sample-features-list">
                <li><span className="check-icon">✓</span> <strong>Bilingual Format:</strong> Assamese (অসমীয়া) & English side-by-side.</li>
                <li><span className="check-icon">✓</span> <strong>Authentic Standard:</strong> Structured on recent Assam recruitment patterns.</li>
                <li><span className="check-icon">✓</span> <strong>Verified Answers:</strong> Every question comes with its correct solution.</li>
                <li><span className="check-icon">✓</span> <strong>Mobile Friendly:</strong> Clean fonts for smooth offline reading.</li>
              </ul>

              <a
                href={product.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary-cta"
                style={{ fontSize: '1.05rem', padding: '14px 28px', width: 'auto', display: 'inline-flex' }}
              >
                <span>DOWNLOAD FREE SAMPLE PDF</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Ebooks Detailed Breakdown */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center" style={{ maxWidth: '800px', margin: '0 auto 40px' }}>
            <span style={{ color: '#8ac926', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
              What You Will Get Inside
            </span>
            <h2 style={{ fontSize: '2.4rem', marginTop: '8px' }}>The 4-in-1 Mega Practice Arsenal</h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem' }}>Everything you need to master your syllabus and secure top ranks in upcoming Assam recruitment exams.</p>
          </div>

          <div className="combo-books-grid">
            <div className="book-card flagship">
              <div className="book-top-badge">🌟 FLAGSHIP CORE EBOOK</div>
              <h3>ADRE All Subject-Wise MCQ Ebook</h3>
              <p>The definitive preparation powerhouse for Assam Direct Recruitment (Grade 3 & Grade 4). Covers every single syllabus subject with deep topic-wise bifurcation.</p>
              <ul className="book-topics-list">
                <li>Assam History, Art, Literature & Culture</li>
                <li>Assam Geography, Natural Resources & Demography</li>
                <li>General Knowledge & Indian Polity</li>
                <li>General Science (Physics, Chemistry, Biology)</li>
                <li>Quantitative Aptitude & Mental Ability</li>
                <li>Logical Reasoning & Critical Thinking</li>
              </ul>
            </div>

            <div className="book-card bonus">
              <div className="book-top-badge">🎁 FREE BONUS #1</div>
              <h3>SSC GD Special MCQ E-Book</h3>
              <p>Curated for SSC GD Constable aspirants from Assam. Packed with <strong>1500+ MCQs</strong> matching the exact Staff Selection Commission exam pattern.</p>
              <ul className="book-topics-list">
                <li>General Intelligence & Reasoning</li>
                <li>General Knowledge & General Awareness</li>
                <li>Elementary Mathematics</li>
                <li>Practice Mock Sets</li>
              </ul>
            </div>

            <div className="book-card bonus">
              <div className="book-top-badge">🎁 FREE BONUS #2</div>
              <h3>Assam Police Sub-Inspector (SI) E-Book</h3>
              <p>Targeted practice for the high-stake Assam Police SI examination. Contains <strong>2000+ MCQs</strong> covering both high-weightage topics and past exam patterns.</p>
              <ul className="book-topics-list">
                <li>Logical Reasoning & Aptitude</li>
                <li>History & Culture of Assam & India</li>
                <li>General Science & Everyday Observations</li>
                <li>Current Events & National Affairs</li>
              </ul>
            </div>

            <div className="book-card bonus">
              <div className="book-top-badge">🎁 FREE BONUS #3</div>
              <h3>Assam Police Constable MCQ E-Book</h3>
              <p>Complete revision and practice toolkit for AB & UB Constable posts. Loaded with <strong>2000+ MCQs</strong> formulated for maximum scoring efficiency.</p>
              <ul className="book-topics-list">
                <li>Assam History & Basic Geography</li>
                <li>General Awareness & Constitution basics</li>
                <li>Elementary Arithmetic & Speed Math</li>
                <li>General English & Mental Ability</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Candidate Reviews */}
      <section className="section-padding reviews-section">
        <div className="container">
          <div className="text-center" style={{ maxWidth: '800px', margin: '0 auto 35px' }}>
            <div className="reviews-summary-badge">
              <span className="stars">★★★★★</span>
              <span style={{ fontWeight: 700, color: '#fff' }}>4.9 out of 5 Rating</span>
              <span style={{ color: '#94a3b8' }}>•</span>
              <span style={{ color: '#8ac926', fontWeight: 600 }}>Based on 1,420+ Reviews from Assam Aspirants</span>
            </div>
            <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Real Aspirant Feedback
            </span>
            <h2 style={{ fontSize: '2.3rem', marginTop: '8px' }}>What Candidates Across Assam Are Saying</h2>
          </div>

          <div className="reviews-grid">
            <div className="review-card">
              <div className="review-stars-row">
                <span className="stars">★★★★★</span>
                <span className="review-date">Yesterday</span>
              </div>
              <p className="review-text">
                "The bilingual format (English & Assamese) is a huge relief! Usually reference books are only in English which makes Assam GK confusing, but here every single question has crystal clear explanations and verified answers. The Assam History and Geography section alone is worth way more than ₹99!"
              </p>
              <div className="review-author-row">
                <div className="review-avatar">B</div>
                <div className="review-author-info">
                  <h4>Bikash Saikia</h4>
                  <div className="review-author-role">
                    <span>Guwahati</span>
                    <span>•</span>
                    <span className="review-verified-tag">✔ Verified Buyer (Assam Police SI Aspirant)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="review-card">
              <div className="review-stars-row">
                <span className="stars">★★★★★</span>
                <span className="review-date">2 days ago</span>
              </div>
              <p className="review-text">
                "Best practice question bank for ADRE preparation. Maths, Reasoning, and Assam Art & Culture are neatly categorized topic by topic. I downloaded the PDF and read it on my phone during my daily commute. 10/10 recommended for every serious Assam aspirant."
              </p>
              <div className="review-author-row">
                <div className="review-avatar" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>P</div>
                <div className="review-author-info">
                  <h4>Pranjal Kalita</h4>
                  <div className="review-author-role">
                    <span>Jorhat</span>
                    <span>•</span>
                    <span className="review-verified-tag">✔ Verified Buyer (ADRE Grade 3 Aspirant)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="review-card">
              <div className="review-stars-row">
                <span className="stars">★★★★★</span>
                <span className="review-date">3 days ago</span>
              </div>
              <p className="review-text">
                "The bonus Constable ebook with 2000+ MCQs is fantastic. Direct exam-pattern questions with correct answers clearly provided below. Instead of buying expensive guidebooks of ₹500 from bookstores, getting all 4 ebooks for ₹99 is unbeatable value."
              </p>
              <div className="review-author-row">
                <div className="review-avatar" style={{ background: 'linear-gradient(135deg, #0284c7, #0369a1)' }}>D</div>
                <div className="review-author-info">
                  <h4>Debajit Baruah</h4>
                  <div className="review-author-role">
                    <span>Dibrugarh</span>
                    <span>•</span>
                    <span className="review-verified-tag">✔ Verified Buyer (Assam Police AB/UB Aspirant)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section-padding pricing-section" id="pricing">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '35px' }}>
            <span style={{ color: '#8ac926', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Today's Exclusive Offer in INR (₹)
            </span>
            <h2 style={{ fontSize: '2.4rem', marginTop: '8px' }}>Get The Complete 4-in-1 Combo Today</h2>
          </div>

          <div className="pricing-box-wrapper">
            <div className="pricing-glow-bg"></div>

            <div className="pricing-card">
              <div className="popular-ribbon">🔥 90% DISCOUNT LAUNCH DEAL 🔥</div>

              <div className="pricing-header">
                <h3>Assam Govt Exam MCQ Ebook Combo</h3>
                <p>ADRE All-Subject Ebook + 3 FREE Bonuses • Instant Download</p>

                <div className="price-display">
                  <span className="price-currency">₹</span>
                  <span className="price-main">{product.price}</span>
                  <span className="price-regular">₹{product.originalPrice}</span>
                </div>
                <span className="savings-chip">⚡ You Save ₹900 Today (90% OFF)</span>
              </div>

              <div className="pricing-countdown-box">
                ⏰ Special Price & Free Bonuses Expire In: <span className="timer-box">{formattedTime}</span>
              </div>

              <ul className="value-stack-list">
                <li className="value-item">
                  <span className="item-title">📕 ADRE All Subject-Wise MCQ Ebook</span>
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>₹399 Value</span>
                </li>
                <li className="value-item bonus-item">
                  <span className="item-title">🎁 Bonus 1: SSC GD E-Book (1500+ MCQs)</span>
                  <span className="item-worth">FREE (₹199)</span>
                </li>
                <li className="value-item bonus-item">
                  <span className="item-title">🎁 Bonus 2: Assam Police SI E-Book (2000+ MCQs)</span>
                  <span className="item-worth">FREE (₹249)</span>
                </li>
                <li className="value-item bonus-item">
                  <span className="item-title">🎁 Bonus 3: Assam Police Constable E-Book (2000+ MCQs)</span>
                  <span className="item-worth">FREE (₹199)</span>
                </li>
              </ul>

              <div className="total-value-row">
                <span>Total Value: <del style={{ color: '#ef4444' }}>₹1,046</del></span>
                <span style={{ color: '#8ac926' }}>Today Only: Just ₹99 INR</span>
              </div>

              {/* Optional CTET Paper I & II Order Bump */}
              {product.orderBump && (
                <div className={`funnel-order-bump-card ${selectedBump ? 'is-checked' : ''}`}>
                  <div className="bump-top-meta">
                    <span className="bump-badge-fire">🔥 50% SPECIAL SAVINGS</span>
                    <span className="bump-badge-guarantee">Optional Add-on</span>
                  </div>

                  <label className="bump-interactive-label">
                    <input
                      type="checkbox"
                      checked={selectedBump}
                      onChange={(e) => setSelectedBump(e.target.checked)}
                      className="bump-checkbox-input"
                    />
                    <div className="bump-headline-wrap">
                      <span className="bump-custom-box">{selectedBump ? '✓' : ''}</span>
                      <span className="bump-title-text">
                        <strong>YES! Add {product.orderBump.name}</strong> for just <span className="bump-price-highlight">₹{product.orderBump.price}</span> <del className="bump-del-price">₹{product.orderBump.originalPrice}</del>
                      </span>
                    </div>
                  </label>

                  <div className="bump-content-row">
                    <div className="bump-img-col">
                      <img 
                        src={product.orderBump.coverImage} 
                        alt={product.orderBump.name} 
                        className="bump-product-image"
                      />
                    </div>
                    <div className="bump-text-col">
                      <p className="bump-pitch">
                        {product.orderBump.pitch}
                      </p>
                      <ul className="bump-checklist">
                        <li>✓ Child Development and Pedagogy</li>
                        <li>✓ Language I & II, Mathematics & EVS</li>
                        <li>✓ 100% Exam-Oriented Practice MCQs with Answers</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="cta-wrapper">
                <button
                  type="button"
                  className="btn-primary-cta"
                  style={{ fontSize: '1.25rem' }}
                  onClick={() => onBuyProduct(product, selectedBump)}
                >
                  <span>
                    {selectedBump 
                      ? `BUY COMBO + CTET EBOOK NOW (₹${product.price + product.orderBump.price})` 
                      : `BUY NOW: INSTANT DOWNLOAD (₹${product.price})`}
                  </span>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="secure-payment-icons">
                <span className="payment-badge-pill">🔒 100% Safe & Secure Checkout</span>
                <span className="payment-badge-pill">⚡ Instant PDF Delivery</span>
                <span className="payment-badge-pill">📱 UPI (GPay/PhonePe/Paytm), Cards & NetBanking</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="section-padding" style={{ background: 'rgba(8, 14, 18, 0.4)' }}>
        <div className="container">
          <div className="text-center" style={{ maxWidth: '760px', margin: '0 auto 35px' }}>
            <span style={{ color: '#8ac926', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Clear Answers
            </span>
            <h2 style={{ fontSize: '2.2rem', marginTop: '8px' }}>Frequently Asked Questions</h2>
          </div>

          <div className="faq-list">
            {faqs.map((faq, idx) => (
              <div key={idx} className={`faq-item ${activeFaq === idx ? 'active' : ''}`}>
                <button className="faq-question" onClick={() => setActiveFaq(activeFaq === idx ? -1 : idx)}>
                  <span>{faq.q}</span>
                  <svg className="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {activeFaq === idx && (
                  <div className="faq-answer" style={{ maxHeight: '300px', padding: '0 22px 20px' }}>
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky Bottom Buy Bar */}
      <div className={`sticky-buy-bar ${showSticky ? 'visible' : ''}`}>
        <div className="sticky-bar-content">
          <div className="sticky-price-info">
            <div className="sticky-bundle-title">Assam Exam 4-in-1 Combo (4 Ebooks)</div>
            <div className="sticky-price-row">
              <span className="sticky-price">₹99</span>
              <span className="sticky-old-price">₹999</span>
              <span className="sticky-timer-pill">Ends: {formattedTime}</span>
            </div>
          </div>
          <button
            type="button"
            className="sticky-cta-btn"
            onClick={() => onBuyProduct(product, selectedBump)}
          >
            <span>{selectedBump ? `Get Combo + CTET (₹${product.price + product.orderBump.price})` : `Get Combo (₹${product.price})`}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* 100% Assam Buyer Toast Notification */}
      <div className={`purchase-popup-toast ${toast.show ? 'show' : ''}`}>
        <div className="toast-avatar">{toast.initial}</div>
        <div className="toast-info">
          <h5><span>{toast.name}</span> ({toast.city})</h5>
          <p>Just bought Assam Exam 4-in-1 Combo</p>
          <span className="toast-time">Just now</span>
        </div>
      </div>
    </div>
  );
}

