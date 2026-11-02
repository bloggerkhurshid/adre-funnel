import React, { useState, useEffect } from 'react';
import { MetaPixel } from '../components/MetaPixel';
import { PRODUCTS } from '../data/products';

export default function Success({ purchaseData, onNavigate }) {
  // Look for verified in-memory purchaseData OR valid sessionStorage from completed Razorpay checkout
  const activeOrder = (() => {
    if (purchaseData && purchaseData.paymentId) return purchaseData;
    try {
      const raw = sessionStorage.getItem('pj_verified_order');
      if (raw) {
        const parsed = JSON.parse(raw);
        // Valid for 2 hours only after successful payment
        if (parsed.timestamp && Date.now() - parsed.timestamp < 2 * 60 * 60 * 1000) {
          return parsed;
        }
      }
    } catch (e) {}
    return null;
  })();

  const [countdown, setCountdown] = useState(5);

  // If no verified active order, auto-redirect back to storefront
  useEffect(() => {
    if (!activeOrder) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            if (onNavigate) onNavigate('home');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [activeOrder, onNavigate]);

  // If verified order exists, fire Meta Pixel tracking once and dispatch delivery email
  useEffect(() => {
    if (activeOrder && activeOrder.paymentId) {
      window.scrollTo(0, 0);
      MetaPixel.pageView('Purchase Success');
      MetaPixel.purchase({
        ...activeOrder.product,
        price: activeOrder.totalAmount,
        name: activeOrder.orderBumpSelected && activeOrder.orderBump
          ? `${activeOrder.product.name} + ${activeOrder.orderBump.name}`
          : activeOrder.product.name
      }, activeOrder.paymentId);

      // Automated delivery confirmation email dispatch (runs once per verified payment)
      if (activeOrder.email) {
        const emailSentKey = `email_dispatched_${activeOrder.paymentId}`;
        if (!sessionStorage.getItem(emailSentKey)) {
          sessionStorage.setItem(emailSentKey, 'true');
          fetch('/api/send-order-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            keepalive: true,
            body: JSON.stringify({
              customerEmail: activeOrder.email,
              customerName: activeOrder.name,
              customerPhone: activeOrder.phone,
              orderId: activeOrder.paymentId,
              productName: activeOrder.product?.name,
              totalAmount: activeOrder.totalAmount,
              downloadUrl: activeOrder.product?.downloadUrl,
              files: activeOrder.product?.files,
              orderBumpSelected: activeOrder.orderBumpSelected,
              orderBumpName: activeOrder.orderBump?.name,
              orderBumpDownloadUrl: activeOrder.orderBump?.downloadUrl,
              orderBumpFiles: activeOrder.orderBump?.files
            })
          })
          .then(res => res.json())
          .then(data => console.log('Delivery email status from success page:', data))
          .catch(err => console.warn('Delivery email dispatch warning:', err));
        }
      }
    }
  }, [activeOrder]);

  // ========================================================
  // ACCESS RESTRICTED SCREEN (Direct URL Typing / Shared Link)
  // ========================================================
  if (!activeOrder) {
    return (
      <div className="success-page-wrapper">
        <div className="success-container access-denied-card">
          <div className="brand-top">
            <img src="/logo.png" alt="ProjuktiSoft Logo" />
            <span>ProjuktiSoft</span>
          </div>

          <div className="restricted-badge">
            <div className="restricted-icon">🔒</div>
            <h2>Access Restricted: No Verified Order Found</h2>
          </div>

          <p className="delivery-note" style={{ color: '#cbd5e1' }}>
            Direct access to this download URL is blocked. This page is strictly accessible to customers with a verified, completed Cashfree transaction on <strong>projuktisoft.shop</strong>.
          </p>

          <div className="redirect-notice-box">
            <span>⚡ Automatically redirecting to official store in <strong>{countdown}s</strong>...</span>
          </div>

          <div className="access-denied-actions">
            <button 
              type="button" 
              className="btn-primary-cta"
              onClick={() => onNavigate && onNavigate('home')}
            >
              <span>← Go to Official Storefront</span>
            </button>
            <div style={{ marginTop: '14px' }}>
              <a 
                href="/contact" 
                onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('contact'); }}
                style={{ color: '#94a3b8', fontSize: '0.85rem', textDecoration: 'underline' }}
              >
                Already paid? Contact Support with your Payment Screenshot
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // AUTHENTICATED SUCCESS SCREEN (Real Buyer Only)
  // ========================================================
  const product = activeOrder.product || PRODUCTS['adre-combo'];
  const paymentId = activeOrder.paymentId;
  const buyerName = activeOrder.name || 'Valued Learner';
  const buyerEmail = activeOrder.email || 'your registered email';
  const orderBump = activeOrder.orderBumpSelected ? (activeOrder.orderBump || product.orderBump) : null;

  return (
    <div className="success-page-wrapper">
      <div className="success-container">
        <div className="brand-top">
          <img src="/logo.png" alt="ProjuktiSoft Logo" />
          <span>ProjuktiSoft</span>
        </div>

        <div className="tick-circle">✓</div>
        <h1>Payment Successful!</h1>
        <div className="tx-id">Transaction ID: {paymentId}</div>

        <p className="delivery-note">
          Thank you for your order, <strong style={{ color: '#fff' }}>{buyerName}</strong>! Your digital learning bundle is ready for immediate access below. We have also sent a confirmation invoice and download backup link to <strong style={{ color: '#8ac926' }}>{buyerEmail}</strong>.
        </p>

        {/* Primary Product Download Box */}
        <div className="downloads-box">
          <h3>
            <span>📥</span> {product.name}
          </h3>

          <div className="files-list">
            {product.files && product.files.map((file, idx) => (
              <div key={idx} className="file-item">
                <span>{file}</span>
                <span className="file-tag">INSTANT</span>
              </div>
            ))}
          </div>

          <a
            href={product.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-download-primary"
          >
            <span>ACCESS & DOWNLOAD ALL FILES (GOOGLE DRIVE)</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
          </a>
        </div>

        {/* Optional CTET Paper I & II Order Bump Download Box */}
        {orderBump && (
          <div className="downloads-box downloads-box-addon">
            <div className="addon-header-row">
              <h3>
                <span>🎁</span> {orderBump.name}
              </h3>
              <span className="addon-success-pill">ORDER BUMP INCLUDED</span>
            </div>

            <div className="files-list">
              {orderBump.files && orderBump.files.map((file, idx) => (
                <div key={idx} className="file-item">
                  <span>{file}</span>
                  <span className="file-tag addon-tag">INSTANT</span>
                </div>
              ))}
            </div>

            <a
              href={orderBump.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-download-addon"
            >
              <span>DOWNLOAD CTET PAPER I & II MCQ EBOOK</span>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
              </svg>
            </a>
          </div>
        )}

        <div className="footer-links">
          <a href="/" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>
            ← Return to Storefront
          </a>
          <span>•</span>
          <a href="/contact" onClick={(e) => { e.preventDefault(); onNavigate('contact'); }}>
            Need Assistance? Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
