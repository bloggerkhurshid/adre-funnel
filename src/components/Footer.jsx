import React from 'react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-brand">
          <img src="/logo.png" alt="ProjuktiSoft Logo" />
          <strong className="footer-brand-name">
            ProjuktiSoft
          </strong>
        </div>

        <p className="footer-brand-desc">
          Empowering competitive exam aspirants and students across India with premium, verified digital ebooks and interactive study bundles.
        </p>

        {/* Mandatory Policy & Customer Access Links */}
        <div className="policy-links-row">
          <a href="/my-downloads" onClick={(e) => { e.preventDefault(); onNavigate('my-downloads'); }} className="footer-downloads-link">
            ⚡ Access My Downloads
          </a>
          <span>•</span>
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
          <span>•</span>
          <a href="/admin" onClick={(e) => { e.preventDefault(); onNavigate('admin'); }} className="footer-admin-link">
            Admin
          </a>
        </div>

        <p className="footer-disclaimer-text">
          Disclaimer: All study materials are educational practice tools. Selection in competitive exams depends on individual merit, preparation, and dedication.
        </p>

        <p className="footer-copyright-text">
          © 2026 ProjuktiSoft. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

