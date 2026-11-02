import React from 'react';

export default function Navbar({ onNavigate }) {
  return (
    <nav className="navbar">
      <div className="container nav-container">
        <a 
          href="#home" 
          onClick={(e) => { e.preventDefault(); onNavigate('home'); }} 
          className="brand-link"
        >
          <img src="/logo.png" alt="ProjuktiSoft Logo" className="brand-logo-img" />
          <div className="brand-title">
            <span>ProjuktiSoft</span>
          </div>
        </a>

        <ul className="nav-menu">
          <li>
            <a href="/" onClick={(e) => { e.preventDefault(); onNavigate('home'); }}>
              All Products
            </a>
          </li>
          <li>
            <a href="/adre-combo" onClick={(e) => { e.preventDefault(); onNavigate('adre-combo'); }}>
              ADRE Exam Combo
            </a>
          </li>
          <li>
            <a href="/cinemood-presets" onClick={(e) => { e.preventDefault(); onNavigate('cinemood-presets'); }}>
              CineMood Presets
            </a>
          </li>
          <li>
            <a href="/contact" onClick={(e) => { e.preventDefault(); onNavigate('contact'); }}>
              Contact Us
            </a>
          </li>
          <li>
            <a href="/my-downloads" onClick={(e) => { e.preventDefault(); onNavigate('my-downloads'); }} style={{ color: '#8ac926', fontWeight: 700 }}>
              📥 Access Downloads
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

