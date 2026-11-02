import React, { useEffect } from 'react';
import { MetaPixel } from '../components/MetaPixel';

export default function ContactUs() {
  useEffect(() => {
    window.scrollTo(0, 0);
    MetaPixel.pageView('Contact Us');
  }, []);

  return (
    <div className="policy-page-container">
      <div className="container">
        <div className="policy-card">
          <span className="policy-badge">Customer Support & Helpdesk</span>
          <h1>Contact Us</h1>
          <p className="policy-subtitle">
            Have questions about your order, download links, or payment? We're here to assist you.
          </p>

          <div className="contact-details-grid">
            <div className="contact-box">
              <div className="contact-icon">🏢</div>
              <h3>Operating Entity</h3>
              <p><strong>ProjuktiSoft</strong></p>
              <p>Guwahati, Kamrup Metropolitan, Assam, India - 781001</p>
            </div>

            <div className="contact-box">
              <div className="contact-icon">📧</div>
              <h3>Email Support</h3>
              <p>General & Order Queries:</p>
              <p><a href="mailto:support@projuktisoft.shop" className="contact-link">support@projuktisoft.shop</a></p>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>Response within 2-4 hours</p>
            </div>

            <div className="contact-box">
              <div className="contact-icon">💬</div>
              <h3>WhatsApp & Phone</h3>
              <p>Candidate Helpline:</p>
              <p><strong style={{ color: '#8ac926' }}>+91 98765 43210</strong></p>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>Mon - Sat, 9:00 AM - 7:00 PM IST</p>
            </div>

            <div className="contact-box">
              <div className="contact-icon">⚡</div>
              <h3>Digital Product Delivery</h3>
              <p>All ebooks and video access keys are delivered <strong>instantly</strong> on-screen and to your registered email immediately after payment.</p>
            </div>
          </div>

          <div className="policy-content-body" style={{ marginTop: '30px' }}>
            <h3>Send Us a Direct Message</h3>
            <p>If you face any issues downloading your bundle after completing payment, please write to us with your registered Email ID and Razorpay Payment ID. Our team will verify and resend the download links immediately.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

