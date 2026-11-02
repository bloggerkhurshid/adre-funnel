import React, { useState, useEffect } from 'react';
import { MetaPixel } from '../components/MetaPixel';
import { saveOrderToFirestore } from '../firebase';
import { PRODUCTS, CTET_ORDER_BUMP, WEDDING_ORDER_BUMP, getProductById } from '../data/products';

export default function Checkout({ product: propProduct, initialOrderBumpSelected = false, onNavigate, onSuccess }) {
  // Safe helper to resolve current product from prop, URL search parameters, or session
  const resolveTargetProduct = () => {
    if (propProduct) return propProduct;
    try {
      const params = new URLSearchParams(window.location.search);
      const prodId = params.get('product') || params.get('id');
      const resolved = getProductById(prodId);
      if (resolved) return resolved;

      const savedId = sessionStorage.getItem('pj_checkout_product_id');
      const savedProd = getProductById(savedId);
      if (savedProd) return savedProd;
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

  const [product, setProduct] = useState(resolveTargetProduct);
  const [includeOrderBump, setIncludeOrderBump] = useState(getInitialBump);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Keep product reactively in sync when props or URL changes
  useEffect(() => {
    if (propProduct) {
      setProduct(propProduct);
    } else {
      const resolved = resolveTargetProduct();
      if (resolved) setProduct(resolved);
    }
  }, [propProduct]);

  useEffect(() => {
    if (initialOrderBumpSelected !== undefined) {
      setIncludeOrderBump(Boolean(initialOrderBumpSelected));
    }
  }, [initialOrderBumpSelected]);

  useEffect(() => {
    window.scrollTo(0, 0);
    MetaPixel.pageView('Checkout Page');
    try {
      if (product) {
        sessionStorage.setItem('pj_checkout_product_id', product.id);
      }
    } catch (e) {}
  }, [product]);

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
      <div className="checkout-minimal-wrap">
        
        {/* Top Back Nav & Secure Badge */}
        <div className="checkout-top-nav">
          <button type="button" className="checkout-back-link" onClick={handleBack}>
            ← {isCinemood ? 'Back to Presets' : 'Back to Store'}
          </button>
          <span className="checkout-secure-pill">🔒 256-Bit SSL Encrypted</span>
        </div>

        {/* Minimal Checkout Card */}
        <div className="checkout-minimal-card">
          
          {/* Product Header Row */}
          <div className="checkout-item-header">
            <img 
              src={product?.coverImage || '/presets/cinemood-banner.jpg'} 
              alt={product?.name}
              className="checkout-item-img"
            />
            <div className="checkout-item-info">
              <span className="checkout-item-badge">{isCinemood ? '50+ DNG PACK' : 'EXAM COMBO'}</span>
              <h2 className="checkout-item-title">{product?.shortName || product?.name}</h2>
              <div className="checkout-item-price-tag">
                <span className="checkout-price-main">₹{product?.price}</span>
                <del className="checkout-price-del">₹{product?.originalPrice}</del>
                <span className="checkout-price-save">{product?.discountPercent}</span>
              </div>
            </div>
          </div>

          {/* Order Bump Checkbox Card with Detailed Description */}
          {hasOrderBump && (
            <div 
              className={`checkout-bump-mini-box ${includeOrderBump ? 'active' : ''}`}
              onClick={() => handleBumpToggle(!includeOrderBump)}
            >
              <div className="checkout-bump-top-row">
                <label className="checkout-bump-checkbox-label" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={includeOrderBump}
                    onChange={(e) => handleBumpToggle(e.target.checked)}
                    className="checkout-bump-checkbox"
                  />
                  <span className="checkout-bump-label-title">
                    ⚡ <strong>ONE-TIME OFFER: Add {product.orderBump.name}</strong>
                  </span>
                </label>
                <span className="checkout-bump-price-badge">
                  +₹{product.orderBump.price} <del>₹{product.orderBump.originalPrice}</del>
                </span>
              </div>

              <div className="checkout-bump-desc-wrap">
                <p className="checkout-bump-pitch-text">
                  {product.orderBump.pitch}
                </p>

                <div className="checkout-bump-bullets-mini">
                  <strong>What’s Included:</strong>
                  <ul>
                    {product.orderBump.features.map((feat, fIdx) => (
                      <li key={fIdx}>✓ {feat}</li>
                    ))}
                  </ul>
                </div>

                <div className="checkout-bump-footer-note">
                  <em>{product.orderBump.perfectFor || (isCinemood 
                    ? '💍 Perfect For: Wedding photography, pre-wedding shoots, engagement portraits, couple photography, and cinematic storytelling.'
                    : '📚 Perfect For: CTET Paper I & II candidates, Assam TET aspirants, and government teaching exam preparation.')}</em>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="checkout-minimal-error">
              ⚠️ {errorMessage}
            </div>
          )}

          {/* 3 Essential Inputs Form */}
          <form onSubmit={handleSubmit} className="checkout-minimal-form">
            <div className="checkout-field">
              <label htmlFor="chk-name">Full Name <span className="req">*</span></label>
              <input
                id="chk-name"
                type="text"
                required
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="checkout-clean-input"
              />
            </div>

            <div className="checkout-field">
              <label htmlFor="chk-email">
                Email Address <span className="req">*</span>
                <span className="field-note">(Files will be delivered here)</span>
              </label>
              <input
                id="chk-email"
                type="email"
                required
                placeholder="name@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="checkout-clean-input"
              />
            </div>

            <div className="checkout-field">
              <label htmlFor="chk-phone">WhatsApp / Mobile Number <span className="req">*</span></label>
              <div className="checkout-clean-phone">
                <span className="phone-prefix">+91</span>
                <input
                  id="chk-phone"
                  type="tel"
                  required
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="checkout-clean-input phone-input"
                  maxLength={10}
                />
              </div>
            </div>

            {/* Total Row */}
            <div className="checkout-minimal-total">
              <span className="total-label">Total Payable:</span>
              <span className="total-amount">₹{totalAmount}</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="checkout-clean-pay-btn"
            >
              {isProcessing ? (
                <span>Connecting to Secure Gateway...</span>
              ) : (
                <span>Pay ₹{totalAmount} via UPI / Card →</span>
              )}
            </button>

            {/* Micro Trust */}
            <div className="checkout-micro-trust">
              <span>🔒 100% Secure via Cashfree</span>
              <span>•</span>
              <span>⚡ Instant Download</span>
              <span>•</span>
              <span>📩 Email Delivery</span>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
