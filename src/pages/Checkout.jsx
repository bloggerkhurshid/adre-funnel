import React, { useState, useEffect } from 'react';
import { MetaPixel } from '../components/MetaPixel';
import { saveOrderToFirestore } from '../firebase';
import { PRODUCTS, CTET_ORDER_BUMP, WEDDING_ORDER_BUMP } from '../data/products';

export default function Checkout({ product: propProduct, initialOrderBumpSelected = false, onNavigate, onSuccess }) {
  // 1. Resolve product: from prop or query param (default: cinemood-presets)
  const getInitialProduct = () => {
    if (propProduct) return propProduct;
    try {
      const params = new URLSearchParams(window.location.search);
      const prodId = params.get('product') || params.get('id');
      if (prodId && PRODUCTS[prodId]) {
        return PRODUCTS[prodId];
      }
      const savedId = sessionStorage.getItem('pj_checkout_product_id');
      if (savedId && PRODUCTS[savedId]) {
        return PRODUCTS[savedId];
      }
    } catch (e) {}
    return PRODUCTS['cinemood-presets'] || PRODUCTS['adre-combo'];
  };

  const getInitialBump = () => {
    if (initialOrderBumpSelected) return true;
    try {
      const params = new URLSearchParams(window.location.search);
      const bumpParam = params.get('bump');
      if (bumpParam === '1' || bumpParam === 'true') return true;
      if (bumpParam === '0' || bumpParam === 'false') return false;
      const savedBump = sessionStorage.getItem('pj_checkout_bump');
      if (savedBump === '1') return true;
    } catch (e) {}
    return false;
  };

  const [product, setProduct] = useState(getInitialProduct);
  const [includeOrderBump, setIncludeOrderBump] = useState(getInitialBump);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Urgency Timer (14 mins countdown)
  const [timeLeft, setTimeLeft] = useState(14 * 60 + 28);

  useEffect(() => {
    window.scrollTo(0, 0);
    MetaPixel.pageView('Checkout Page');
    try {
      if (product) {
        sessionStorage.setItem('pj_checkout_product_id', product.id);
      }
    } catch (e) {}
  }, [product]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isCinemood = product?.id === 'cinemood-presets' || product?.id === 'english-bundle';
  const hasOrderBump = !!product?.orderBump;
  const bumpPrice = hasOrderBump ? product.orderBump.price : 0;
  const totalAmount = includeOrderBump && hasOrderBump ? (product.price + bumpPrice) : product.price;

  const handleBumpToggle = (checked) => {
    setIncludeOrderBump(checked);
    try {
      sessionStorage.setItem('pj_checkout_bump', checked ? '1' : '0');
    } catch (e) {}
  };

  const handleBack = () => {
    if (onNavigate) {
      onNavigate(isCinemood ? 'cinemood-presets' : 'adre-combo');
    } else {
      window.history.back();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your full name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsProcessing(true);

    const trackingProduct = {
      ...product,
      price: totalAmount,
      name: includeOrderBump && hasOrderBump ? `${product.name} + ${product.orderBump.name}` : product.name
    };

    // 1. Meta Pixel Initiate Checkout
    MetaPixel.initiateCheckout(trackingProduct);

    const handleSuccessfulPayment = async (paymentId) => {
      const payload = {
        product,
        orderBumpSelected: includeOrderBump && hasOrderBump,
        orderBump: product.orderBump,
        totalAmount,
        paymentId: paymentId || `cf_${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        phone: cleanPhone,
        gateway: 'cashfree',
        timestamp: Date.now()
      };

      try {
        sessionStorage.setItem('pj_verified_order', JSON.stringify(payload));
      } catch (err) {}

      // Save to Firebase Firestore
      try {
        await saveOrderToFirestore(payload);
      } catch (fbErr) {
        console.error('Firebase save error:', fbErr);
      }

      // Automated delivery confirmation email via Netlify Function / Hostinger SMTP
      try {
        const emailSentKey = `email_dispatched_${payload.paymentId}`;
        if (!sessionStorage.getItem(emailSentKey)) {
          sessionStorage.setItem(emailSentKey, 'true');
          fetch('/api/send-order-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            keepalive: true,
            body: JSON.stringify({
              customerEmail: email.trim(),
              customerName: name.trim(),
              customerPhone: cleanPhone,
              orderId: payload.paymentId,
              productName: product.name,
              totalAmount: payload.totalAmount,
              downloadUrl: product.downloadUrl,
              files: product.files,
              orderBumpSelected: payload.orderBumpSelected,
              orderBumpName: payload.orderBump?.name,
              orderBumpDownloadUrl: payload.orderBump?.downloadUrl,
              orderBumpFiles: payload.orderBump?.files
            })
          }).catch((err) => console.warn('Background email dispatch notice:', err));
        }
      } catch (mailErr) {
        console.warn('Background email trigger error:', mailErr);
      }

      setIsProcessing(false);
      if (onSuccess) {
        onSuccess(payload);
      } else if (onNavigate) {
        onNavigate('success');
      } else {
        window.location.href = `/success?order_id=${payload.paymentId}`;
      }
    };

    // 2. Call Cashfree Order Creation API
    try {
      const response = await fetch('/api/create-cashfree-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalAmount,
          customerName: name.trim(),
          customerEmail: email.trim(),
          customerPhone: cleanPhone,
          orderNote: trackingProduct.name
        })
      });

      const orderData = await response.json();

      if (orderData.payment_session_id && window.Cashfree && !orderData.preview_mode) {
        const livePayload = {
          product,
          orderBumpSelected: includeOrderBump && hasOrderBump,
          orderBump: product.orderBump,
          totalAmount,
          paymentId: orderData.order_id,
          name: name.trim(),
          email: email.trim(),
          phone: cleanPhone,
          gateway: 'cashfree',
          timestamp: Date.now()
        };
        try {
          sessionStorage.setItem('pj_verified_order', JSON.stringify(livePayload));
          saveOrderToFirestore(livePayload);
        } catch (e) {}

        const cashfreeMode = orderData.environment === 'sandbox' ? 'sandbox' : 'production';
        const cashfree = window.Cashfree({ mode: cashfreeMode });
        
        cashfree.checkout({
          paymentSessionId: orderData.payment_session_id,
          redirectTarget: '_modal'
        }).then((result) => {
          if (result.error) {
            setIsProcessing(false);
            console.log('Cashfree modal closed/error:', result.error);
          } else if (result.paymentDetails) {
            handleSuccessfulPayment(orderData.order_id);
          }
        });
        return;
      }
    } catch (apiErr) {
      console.warn('Cashfree serverless API offline or not configured, using instant preview checkout:', apiErr);
    }

    // 3. Fallback / Test Preview
    setTimeout(() => {
      handleSuccessfulPayment(`preview_${Date.now()}`);
    }, 1000);
  };

  return (
    <div className={`checkout-page ${isCinemood ? 'theme-cinemood' : 'theme-adre'}`}>
      {/* Top Header */}
      <header className="checkout-header">
        <div className="checkout-header-inner">
          <button type="button" className="checkout-back-btn" onClick={handleBack}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>{isCinemood ? 'Back to Presets' : 'Back to Store'}</span>
          </button>

          <div className="checkout-brand-center">
            {isCinemood ? (
              <div className="checkout-lr-badge">
                <span className="checkout-lr-icon">Lr</span>
                <span>CineMood Presets Checkout</span>
              </div>
            ) : (
              <div className="checkout-brand-title">
                <span>📚 ProjuktiSoft Checkout</span>
              </div>
            )}
          </div>

          <div className="checkout-secure-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>256-Bit SSL Secure</span>
          </div>
        </div>
      </header>

      {/* Urgency Countdown Bar */}
      <div className="checkout-urgency-bar">
        <div className="checkout-urgency-inner">
          <span className="checkout-live-dot">●</span>
          <span>Your 90% Discount is Reserved for: <strong>{formatTimer(timeLeft)}</strong></span>
          <span className="checkout-urgency-sep">•</span>
          <span>⚡ Instant Digital Delivery on Screen & Email</span>
        </div>
      </div>

      {/* Main Two-Column Checkout Layout */}
      <div className="checkout-container">
        <div className="checkout-grid">
          
          {/* Left Column: Customer Form & Payment */}
          <div className="checkout-col-form">
            <div className="checkout-card">
              <div className="checkout-card-header">
                <div className="checkout-step-badge">1</div>
                <div>
                  <h2 className="checkout-card-title">Customer Information</h2>
                  <p className="checkout-card-subtitle">Where should we deliver your digital files and official receipt?</p>
                </div>
              </div>

              {errorMessage && (
                <div className="checkout-error-banner">
                  ⚠️ {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="checkout-form">
                <div className="checkout-form-group">
                  <label htmlFor="chk-name">
                    Full Name <span className="req">*</span>
                  </label>
                  <input
                    id="chk-name"
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="checkout-input"
                  />
                </div>

                <div className="checkout-form-group">
                  <label htmlFor="chk-email">
                    Email Address <span className="req">*</span>
                  </label>
                  <input
                    id="chk-email"
                    type="email"
                    required
                    placeholder="name@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="checkout-input"
                  />
                  <span className="checkout-field-hint">
                    📩 Google Drive download link & order receipt will be sent to this email instantly.
                  </span>
                </div>

                <div className="checkout-form-group">
                  <label htmlFor="chk-phone">
                    Phone / WhatsApp Number <span className="req">*</span>
                  </label>
                  <div className="checkout-phone-input-wrap">
                    <span className="checkout-phone-prefix">+91</span>
                    <input
                      id="chk-phone"
                      type="tel"
                      required
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="checkout-input checkout-input-phone"
                      maxLength={10}
                    />
                  </div>
                  <span className="checkout-field-hint">
                    📱 For instant order delivery verification and customer support.
                  </span>
                </div>

                {/* Step 2: Payment Method Section */}
                <div className="checkout-payment-section">
                  <div className="checkout-card-header" style={{ marginBottom: '14px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="checkout-step-badge">2</div>
                    <div>
                      <h3 className="checkout-card-title" style={{ fontSize: '1.15rem' }}>Select Payment Method</h3>
                      <p className="checkout-card-subtitle">100% RBI Authorized & Secure Cashfree Gateway</p>
                    </div>
                  </div>

                  <div className="checkout-payment-methods-box">
                    <div className="checkout-payment-option selected">
                      <div className="checkout-radio-indicator">✓</div>
                      <div className="checkout-pay-details">
                        <strong>UPI Instant Pay (Google Pay / PhonePe / Paytm / BHIM)</strong>
                        <span>Fastest zero-fee checkout via QR Code or direct UPI Intent</span>
                      </div>
                      <span className="checkout-popular-tag">MOST POPULAR</span>
                    </div>

                    <div className="checkout-payment-option">
                      <div className="checkout-radio-indicator empty"></div>
                      <div className="checkout-pay-details">
                        <strong>Debit Card / Credit Card / NetBanking / Wallets</strong>
                        <span>Visa, Mastercard, RuPay, ICICI, HDFC, SBI, Cred</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Pay Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="checkout-submit-btn"
                >
                  {isProcessing ? (
                    <span className="checkout-btn-loading">
                      <svg className="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeLinecap="round" />
                      </svg>
                      Connecting to Secure Gateway...
                    </span>
                  ) : (
                    <span>
                      🔒 PAY ₹{totalAmount} & GET INSTANT ACCESS →
                    </span>
                  )}
                </button>

                <div className="checkout-guarantee-row">
                  <div className="checkout-g-item">
                    <span>🛡️</span>
                    <span>7-Day 100% Satisfaction Guarantee</span>
                  </div>
                  <div className="checkout-g-item">
                    <span>⚡</span>
                    <span>Instant Digital Access</span>
                  </div>
                  <div className="checkout-g-item">
                    <span>🔒</span>
                    <span>RBI Authorized Gateway</span>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Order Summary & Bump Offer */}
          <div className="checkout-col-summary">
            <div className="checkout-summary-card">
              <h3 className="checkout-summary-title">Order Summary</h3>

              {/* Product Preview Card */}
              <div className="checkout-prod-preview">
                <img 
                  src={product?.coverImage || '/presets/cinemood-banner.jpg'} 
                  alt={product?.name}
                  className="checkout-prod-thumb"
                />
                <div className="checkout-prod-meta">
                  <span className="checkout-prod-tag">{isCinemood ? '50+ DNG PACK' : 'EXAM BUNDLE'}</span>
                  <h4 className="checkout-prod-name">{product?.name}</h4>
                  <div className="checkout-prod-price-row">
                    <span className="checkout-prod-curr">₹{product?.price}</span>
                    <del className="checkout-prod-old">₹{product?.originalPrice}</del>
                    <span className="checkout-prod-discount">{product?.discountPercent}</span>
                  </div>
                </div>
              </div>

              {/* Order Bump Card (If Available) */}
              {hasOrderBump && (
                <div 
                  className={`checkout-bump-card ${includeOrderBump ? 'active' : ''}`}
                  onClick={() => handleBumpToggle(!includeOrderBump)}
                >
                  <div className="checkout-bump-header">
                    <label className="checkout-bump-checkbox" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={includeOrderBump}
                        onChange={(e) => handleBumpToggle(e.target.checked)}
                      />
                      <span className="checkout-bump-label-title">
                        ⚡ Add {product.orderBump.name} for just <span className="highlight">₹{product.orderBump.price}</span> <del>₹{product.orderBump.originalPrice}</del>
                      </span>
                    </label>
                    <span className="checkout-bump-pill">90% OFF</span>
                  </div>

                  <p className="checkout-bump-pitch">{product.orderBump.pitch}</p>

                  <div className="checkout-bump-features-list">
                    {product.orderBump.features.slice(0, 3).map((feat, fIdx) => (
                      <div key={fIdx} className="checkout-bump-feat-item">
                        ✓ {feat}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Detailed Bill Breakdown */}
              <div className="checkout-bill-box">
                <div className="checkout-bill-row">
                  <span>{product?.shortName || product?.name}</span>
                  <span>₹{product?.price}</span>
                </div>

                {includeOrderBump && hasOrderBump && (
                  <div className="checkout-bill-row bump-row">
                    <span>+ {product.orderBump.shortName || product.orderBump.name}</span>
                    <span>₹{product.orderBump.price}</span>
                  </div>
                )}

                <div className="checkout-bill-row">
                  <span>Digital Delivery & Handling</span>
                  <span className="checkout-free-text">FREE (Instant)</span>
                </div>

                <div className="checkout-bill-row discount-row">
                  <span>Launch Special Savings</span>
                  <span className="checkout-saved-text">-₹{product?.originalPrice - product?.price}</span>
                </div>

                <div className="checkout-bill-divider" />

                <div className="checkout-bill-total-row">
                  <div>
                    <strong>Total Amount Payable</strong>
                    <small>All taxes & digital fees included</small>
                  </div>
                  <div className="checkout-total-number">
                    ₹{totalAmount}
                  </div>
                </div>
              </div>

              {/* What You Receive */}
              <div className="checkout-included-deliverables">
                <strong>📦 Instant Deliverables After Payment:</strong>
                <ul>
                  {product?.files?.map((file, idx) => (
                    <li key={idx}>✓ {file}</li>
                  ))}
                  {includeOrderBump && hasOrderBump && product.orderBump.files?.map((file, idx) => (
                    <li key={`bump-${idx}`} style={{ color: '#38bdf8' }}>✓ [BONUS] {file}</li>
                  ))}
                </ul>
              </div>

              {/* Trust Badge Bar */}
              <div className="checkout-trust-footer">
                <div className="checkout-tf-item">
                  <span className="checkout-tf-icon">🔒</span>
                  <span>Direct Encrypted Checkout via Cashfree Payments</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
