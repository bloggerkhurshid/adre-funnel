import React from 'react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-brand">
          <img src="/logo.png" alt="ProjuktiSoft Logo" />
          <strong style={{ color: '#fff', fontSize: '1.15rem' }}>
            ProjuktiSoft
          </strong>
        </div>

        <p style={{ maxWidth: '650px', margin: '0 auto 16px', color: '#94a3b8' }}>
          Empowering competitive exam aspirants and students across India with premium, verified digital ebooks and interactive study bundles.
        </p>

        {/* Mandatory Razorpay Compliance Policy Links */}
        <div className="policy-links-row">
          <a href="/contact" onClick={(e) => { e.preventDefault(); onNavigate('contact'); }}>
            Contact Us
          </a>
          <span>•</span>
          <a href="/terms" onClick={(e) => { e.preventDefault(); onNavigate('terms'); }}>
            Terms & Conditions
          </a>
          <span>•</span>
          <a href="/refund-policy" onClick={(e) => { e.preventDefault(); onNavigate('refund'); }}>
            Refunds & Cancellations
          </a>
          <span>•</span>
          <a href="/privacy-policy" onClick={(e) => { e.preventDefault(); onNavigate('privacy'); }}>
            Privacy Policy
          </a>
        </div>

        <div className="pricing-disclaimer-box">
          <p>
            <strong>Pricing & Currency Notice:</strong> All digital products and services listed on ProjuktiSoft are billed and processed in <strong>Indian Rupees (INR - ₹)</strong>. Delivery is 100% digital and instant.
          </p>
        </div>

        <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '14px 0' }}>
          Disclaimer: All study materials are educational practice tools. Selection in competitive exams depends on individual merit, preparation, and dedication.
        </p>

        <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
          © 2026 ProjuktiSoft. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

