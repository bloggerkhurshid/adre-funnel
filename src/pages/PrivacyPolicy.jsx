import React, { useEffect } from 'react';
import { MetaPixel } from '../components/MetaPixel';

export default function PrivacyPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
    MetaPixel.pageView('Privacy Policy');
  }, []);

  return (
    <div className="policy-page-container">
      <div className="container">
        <div className="policy-card">
          <span className="policy-badge">Data Security</span>
          <h1>Privacy Policy</h1>
          <p className="policy-subtitle">Last updated: November 2, 2026</p>

          <div className="policy-content-body">
            <h3>1. Commitment to Privacy</h3>
            <p>
              ProjuktiSoft (accessible at <strong>projuktisoft.shop</strong>) is committed to safeguarding the personal privacy of our learners and visitors. This Privacy Policy outlines what information we collect and how it is protected.
            </p>

            <h3>2. Information We Collect</h3>
            <p>When you purchase a study bundle from our website, we collect:</p>
            <ul className="policy-list">
              <li><strong>Contact Information:</strong> Your Full Name, Email Address, and WhatsApp Phone Number.</li>
              <li><strong>Transaction Data:</strong> Payment ID, amount paid in INR (₹), and product purchased.</li>
              <li><strong>Technical Data:</strong> Browser type, device category, and IP address for fraud detection and performance analytics.</li>
            </ul>

            <h3>3. How We Use Your Information</h3>
            <p>We use your information exclusively to:</p>
            <ul className="policy-list">
              <li>Deliver your digital study materials, download links, and order invoices.</li>
              <li>Send critical syllabus updates, bonus additions, and technical support notices.</li>
              <li>Prevent unauthorized access and fraudulent transactions.</li>
            </ul>

            <h3>4. Payment Security & Razorpay</h3>
            <p>
              We do <strong>not</strong> collect or store your Debit/Credit Card numbers, CVV, Net Banking credentials, or UPI PINs on our servers. All financial transactions are securely processed through RBI-authorized payment gateways (Razorpay) using industry-standard 256-bit SSL encryption.
            </p>

            <h3>5. Cookies & Advertising Pixels</h3>
            <p>
              We use standard cookies and the Meta (Facebook & Instagram) Pixel to measure website performance and display relevant educational recommendations to candidates. No sensitive personal data is shared with advertisers.
            </p>

            <h3>6. No Third-Party Data Selling</h3>
            <p>
              We maintain a strict zero-spam policy. We do not sell, rent, or trade your personal information to third-party telemarketers or marketing agencies.
            </p>

            <h3>7. Contact for Privacy Inquiries</h3>
            <p>
              If you have any questions regarding this Privacy Policy or wish to request the deletion of your customer record, please contact us at <a href="mailto:support@projuktisoft.shop" className="contact-link">support@projuktisoft.shop</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

