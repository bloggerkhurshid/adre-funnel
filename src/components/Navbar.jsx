import React, { useState } from 'react';

export default function Navbar({ onNavigate }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (route) => {
    setIsMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(route);
    }
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        {/* Brand Link */}
        <a 
          href="/" 
          onClick={(e) => { e.preventDefault(); handleNavClick('home'); }} 
          className="brand-link"
        >
          <img src="/logo.png" alt="ProjuktiSoft Logo" className="brand-logo-img" />
          <div className="brand-title">
            <span>ProjuktiSoft</span>
          </div>
        </a>

        {/* Desktop Navigation Menu */}
        <ul className="nav-menu">
          <li>
            <a href="/" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}>
              All Products
            </a>
          </li>
          <li>
            <a href="/spoken-english" onClick={(e) => { e.preventDefault(); handleNavClick('spoken-english'); }}>
              Spoken English (₹99)
            </a>
          </li>
          <li>
            <a href="/adre-combo" onClick={(e) => { e.preventDefault(); handleNavClick('adre-combo'); }}>
              ADRE Exam Combo
            </a>
          </li>
          <li>
            <a href="/cinemood-presets" onClick={(e) => { e.preventDefault(); handleNavClick('cinemood-presets'); }}>
              CineMood Presets
            </a>
          </li>
          <li>
            <a href="/contact" onClick={(e) => { e.preventDefault(); handleNavClick('contact'); }}>
              Contact Us
            </a>
          </li>
          <li>
            <a href="/my-downloads" onClick={(e) => { e.preventDefault(); handleNavClick('my-downloads'); }} className="nav-downloads-link">
              📥 Access Downloads
            </a>
          </li>
        </ul>

        {/* Mobile Action Controls (Direct Downloads Pill + Hamburger Toggle) */}
        <div className="nav-mobile-actions">
          <button
            type="button"
            className="nav-mobile-download-btn"
            onClick={() => handleNavClick('my-downloads')}
            title="Access Your Downloads"
          >
            📥 Downloads
          </button>

          <button
            type="button"
            className="nav-hamburger-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="4" y1="7" x2="20" y2="7"></line>
                <line x1="4" y1="12" x2="20" y2="12"></line>
                <line x1="4" y1="17" x2="20" y2="17"></line>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="nav-mobile-drawer">
          <ul className="nav-mobile-list">
            <li>
              <a href="/" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}>
                <span>🏠 All Products</span>
                <span className="mobile-chevron">→</span>
              </a>
            </li>
            <li>
              <a href="/spoken-english" onClick={(e) => { e.preventDefault(); handleNavClick('spoken-english'); }}>
                <span>🗣️ Spoken English Bundle (₹99)</span>
                <span className="mobile-chevron">→</span>
              </a>
            </li>
            <li>
              <a href="/adre-combo" onClick={(e) => { e.preventDefault(); handleNavClick('adre-combo'); }}>
                <span>📚 ADRE 3.0 Exam Combo (₹99)</span>
                <span className="mobile-chevron">→</span>
              </a>
            </li>
            <li>
              <a href="/cinemood-presets" onClick={(e) => { e.preventDefault(); handleNavClick('cinemood-presets'); }}>
                <span>🎨 CineMood Lightroom Presets (₹149)</span>
                <span className="mobile-chevron">→</span>
              </a>
            </li>
            <li>
              <a href="/contact" onClick={(e) => { e.preventDefault(); handleNavClick('contact'); }}>
                <span>💬 Contact Customer Support</span>
                <span className="mobile-chevron">→</span>
              </a>
            </li>
            <li className="mobile-highlight-item">
              <a href="/my-downloads" onClick={(e) => { e.preventDefault(); handleNavClick('my-downloads'); }}>
                <span>📥 Access My Purchased Files</span>
                <span className="mobile-badge-new">INSTANT</span>
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
