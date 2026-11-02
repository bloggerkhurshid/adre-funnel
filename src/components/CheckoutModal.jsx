import React, { useState, useEffect } from 'react';
import { MetaPixel } from './MetaPixel';

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

  // Lock body scroll on phone/desktop when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const trackingProduct = {
      ...product,
      price: totalAmount,
      name: includeOrderBump && hasOrderBump ? `${product.name} + ${product.orderBump.name}` : product.name
    };

    // 1. Fire InitiateCheckout on Meta Pixel
    MetaPixel.initiateCheckout(trackingProduct);

    // 2. Configure Razorpay Options
    const options = {
      key: 'rzp_live_placeholder', // Replaced with user's live key in production
      amount: totalAmount * 100, // In paise
      currency: 'INR',
      name: 'ProjuktiSoft',
      description: trackingProduct.name,
      image: '/logo.png',
      prefill: {
        name: name,
        email: email,
        contact: phone
      },
      theme: {
        color: '#8ac926'
      },
      handler: function (response) {
        setIsProcessing(false);
        const paymentId = response.razorpay_payment_id || `pay_${Date.now()}`;
        const payload = {
          product,
          orderBumpSelected: includeOrderBump && hasOrderBump,
          orderBump: product.orderBump,
          totalAmount,
          paymentId,
          name,
          email,
          phone,
          timestamp: Date.now()
        };
        try {
          sessionStorage.setItem('pj_verified_order', JSON.stringify(payload));
        } catch (e) {}
        onClose();
        if (onSuccess) {
          onSuccess(payload);
        }
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
        }
      }
    };

    if (window.Razorpay) {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      // Fallback preview mode
      setTimeout(() => {
        setIsProcessing(false);
        const payload = {
          product,
          orderBumpSelected: includeOrderBump && hasOrderBump,
          orderBump: product.orderBump,
          totalAmount,
          paymentId: `pay_preview_${Date.now()}`,
          name,
          email,
          phone,
          timestamp: Date.now()
        };
        try {
          sessionStorage.setItem('pj_verified_order', JSON.stringify(payload));
        } catch (e) {}
        onClose();
        if (onSuccess) {
          onSuccess(payload);
        }
      }, 1000);
    }
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
            <span>⚡ UPI (GPay/PhonePe/Paytm), Cards & NetBanking</span>
          </div>
        </form>
      </div>
    </div>
  );
}
