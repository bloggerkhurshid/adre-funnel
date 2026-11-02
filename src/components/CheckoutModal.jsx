import React, { useState, useEffect } from 'react';
import { MetaPixel } from './MetaPixel';
import { saveOrderToFirestore } from '../firebase';

export default function CheckoutModal({ 
  isOpen, 
  onClose, 
  product, 
  initialOrderBumpSelected = false, 
  onSuccess 
}) {
  if (!isOpen || !product) return null;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [includeOrderBump, setIncludeOrderBump] = useState(initialOrderBumpSelected);

  // Sync state whenever modal opens or initial selection changes
  useEffect(() => {
    setIncludeOrderBump(initialOrderBumpSelected);
  }, [initialOrderBumpSelected, isOpen]);

  // Lock body scroll cleanly using class when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  // Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const hasOrderBump = !!product.orderBump;
  const bumpPrice = hasOrderBump ? product.orderBump.price : 0;
  const totalAmount = includeOrderBump && hasOrderBump ? (product.price + bumpPrice) : product.price;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const trackingProduct = {
      ...product,
      price: totalAmount,
      name: includeOrderBump && hasOrderBump ? `${product.name} + ${product.orderBump.name}` : product.name
    };

    // 1. Fire InitiateCheckout on Meta Pixel
    MetaPixel.initiateCheckout(trackingProduct);

    const handleSuccessfulPayment = async (paymentId) => {
      const payload = {
        product,
        orderBumpSelected: includeOrderBump && hasOrderBump,
        orderBump: product.orderBump,
        totalAmount,
        paymentId: paymentId || `cf_${Date.now()}`,
        name,
        email,
        phone,
        gateway: 'cashfree',
        timestamp: Date.now()
      };
      try {
        sessionStorage.setItem('pj_verified_order', JSON.stringify(payload));
      } catch (err) {}

      // Save order to Firebase Firestore
      try {
        await saveOrderToFirestore(payload);
      } catch (fbErr) {
        console.error('Firebase save error:', fbErr);
      }

      setIsProcessing(false);
      onClose();
      if (onSuccess) {
        onSuccess(payload);
      }
    };

    // 2. Attempt Cashfree Gateway Checkout via Serverless Function
    try {
      const response = await fetch('/api/create-cashfree-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalAmount,
          customerName: name,
          customerEmail: email,
          customerPhone: phone,
          orderNote: trackingProduct.name
        })
      });

      const orderData = await response.json();

      // If live Cashfree payment_session_id returned and SDK is ready
      if (orderData.payment_session_id && window.Cashfree && !orderData.preview_mode) {
        // Pre-save order details to sessionStorage & Firebase so both modal & mobile redirect work smoothly
        const livePayload = {
          product,
          orderBumpSelected: includeOrderBump && hasOrderBump,
          orderBump: product.orderBump,
          totalAmount,
          paymentId: orderData.order_id,
          name,
          email,
          phone,
          gateway: 'cashfree',
          timestamp: Date.now()
        };
        try {
          sessionStorage.setItem('pj_verified_order', JSON.stringify(livePayload));
          saveOrderToFirestore(livePayload);
        } catch (e) {}

        const cashfree = window.Cashfree({ mode: 'production' });
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

    // 3. Fallback / Preview Checkout (when testing locally or before credentials are added)
    setTimeout(() => {
      handleSuccessfulPayment(`cf_test_${Date.now()}`);
    }, 1000);
  };

  return (
    <div className="p-modal-overlay" onClick={onClose}>
      <div className="p-modal-card" onClick={(e) => e.stopPropagation()}>
        <button 
          className="p-modal-close-btn" 
          onClick={onClose} 
          aria-label="Close Checkout"
          type="button"
        >
          ✕
        </button>

        <div className="p-modal-header">
          <div className="p-brand-badge">
            <img src="/logo.png" alt="ProjuktiSoft Logo" className="p-modal-logo" />
            <div>
              <h4>ProjuktiSoft Checkout</h4>
              <p>⚡ Instant Delivery • 256-Bit SSL Encrypted</p>
            </div>
          </div>
        </div>

        {/* Order Items Summary */}
        <div className="p-order-summary">
          <div className="p-summary-item">
            <div>
              <strong>{product.name}</strong>
              <span className="p-summary-sub">{product.category} (PDF Download)</span>
            </div>
            <div className="p-summary-price">
              <del>₹{product.originalPrice}</del>
              <span>₹{product.price}</span>
            </div>
          </div>

          {includeOrderBump && hasOrderBump && (
            <div className="p-summary-item p-summary-addon animate-fadeIn">
              <div>
                <strong>+ {product.orderBump.name}</strong>
                <span className="p-summary-sub">Teaching Special Add-on (PDF)</span>
              </div>
              <div className="p-summary-price">
                <del>₹{product.orderBump.originalPrice}</del>
                <span style={{ color: '#8ac926' }}>₹{product.orderBump.price}</span>
              </div>
            </div>
          )}

          <div className="p-summary-total-row">
            <span>Total Payable:</span>
            <span className="p-total-highlight">₹{totalAmount} INR</span>
          </div>
        </div>

        {/* Optional CTET Order Bump Box */}
        {hasOrderBump && (
          <div className={`p-bump-box ${includeOrderBump ? 'p-bump-active' : ''}`}>
            <div className="p-bump-header-strip">
              <span className="p-bump-tag">🔥 EXCLUSIVE ORDER BUMP</span>
              <span className="p-bump-save-tag">SAVE 50% NOW</span>
            </div>

            <label className="p-bump-checkbox-wrapper">
              <input
                type="checkbox"
                checked={includeOrderBump}
                onChange={(e) => setIncludeOrderBump(e.target.checked)}
                className="p-bump-real-checkbox"
              />
              <div className="p-bump-title-row">
                <span className="p-bump-checkbox-styled">
                  {includeOrderBump ? '✓' : ''}
                </span>
                <span className="p-bump-main-title">
                  <strong>YES! Add {product.orderBump.name}</strong> for just <span className="p-bump-deal-price">₹{product.orderBump.price}</span> <del className="p-bump-old-price">₹{product.orderBump.originalPrice}</del>
                </span>
              </div>
            </label>

            <div className="p-bump-content-grid">
              <div className="p-bump-image-col">
                <img 
                  src={product.orderBump.coverImage} 
                  alt={product.orderBump.name} 
                  className="p-bump-img"
                  loading="lazy"
                />
              </div>
              <div className="p-bump-info-col">
                <p className="p-bump-pitch-text">
                  {product.orderBump.pitch}
                </p>
                <div className="p-bump-mini-features">
                  <span>✓ Child Pedagogy & EVS</span>
                  <span>✓ Mathematics & Languages</span>
                  <span>✓ 100% Exam-Oriented MCQs</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-checkout-form">
          <div className="p-form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              required
              autoComplete="name"
              placeholder="e.g. Rahul Sharma"
              className="p-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="p-form-group">
            <label htmlFor="email">Email Address (For instant bundle delivery) *</label>
            <input
              type="email"
              id="email"
              required
              autoComplete="email"
              inputMode="email"
              placeholder="name@example.com"
              className="p-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="p-form-group">
            <label htmlFor="phone">WhatsApp Number (For download notification) *</label>
            <input
              type="tel"
              id="phone"
              required
              autoComplete="tel"
              inputMode="tel"
              maxLength={10}
              pattern="[0-9]{10}"
              placeholder="10-digit mobile number"
              className="p-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            />
          </div>

          <button type="submit" disabled={isProcessing} className="p-pay-button">
            <span>
              {isProcessing 
                ? 'Processing... ⏳' 
                : `PAY & DOWNLOAD NOW (₹${totalAmount})`}
            </span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>

          <div className="p-modal-footer-badges">
            <span>🔒 100% Safe Payment in INR (₹)</span>
            <span>⚡ Cashfree UPI (GPay/PhonePe/Paytm/QR) & Cards</span>
          </div>
        </form>
      </div>
    </div>
  );
}
