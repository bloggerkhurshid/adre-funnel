import React, { useEffect } from 'react';
import { MetaPixel } from '../components/MetaPixel';
import { PRODUCTS } from '../data/products';

export default function Success({ purchaseData, onNavigate }) {
  const product = purchaseData?.product || PRODUCTS['adre-combo'];
  const paymentId = purchaseData?.paymentId || `pay_live_${Date.now()}`;
  const buyerName = purchaseData?.name || 'Valued Learner';
  const buyerEmail = purchaseData?.email || 'your registered email';
  const orderBump = purchaseData?.orderBumpSelected 
    ? (purchaseData.orderBump || product.orderBump) 
    : null;
  const totalAmount = purchaseData?.totalAmount || product.price;

  useEffect(() => {
    window.scrollTo(0, 0);
    // 1. Fire PageView
    MetaPixel.pageView('Purchase Success');
    // 2. Fire Purchase Event on Meta Pixel
    MetaPixel.purchase({
      ...product,
      price: totalAmount,
      name: orderBump ? `${product.name} + ${orderBump.name}` : product.name
    }, paymentId);
  }, [product, paymentId, totalAmount, orderBump]);

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
