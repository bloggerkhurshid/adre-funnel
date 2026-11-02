import React, { useEffect } from 'react';
import { MetaPixel } from '../components/MetaPixel';

export default function RefundPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
    MetaPixel.pageView('Refunds & Cancellations');
  }, []);

  return (
    <div className="policy-page-container">
      <div className="container">
        <div className="policy-card">
          <span className="policy-badge">Customer Protection</span>
          <h1>Refunds & Cancellations Policy</h1>
          <p className="policy-subtitle">Last updated: November 2, 2026</p>

          <div className="policy-content-body">
            <h3>1. Digital Product Nature & Instant Access</h3>
            <p>
              At ProjuktiSoft (<strong>projuktisoft.shop</strong>), we offer digital products including downloadable PDF ebooks, practice question banks, and video courses. Because digital content is delivered instantly upon successful payment, standard physical return procedures do not apply.
            </p>

            <h3>2. Cancellation Policy</h3>
            <p>
              Since access and download links are generated in real-time immediately after payment confirmation, an order cannot be cancelled once the digital download link has been delivered to your screen or email.
            </p>

            <h3>3. 7-Day Value & Technical Resolution Guarantee</h3>
            <p>
              We want every candidate to have a seamless learning experience. We offer refund considerations under the following specific circumstances:
            </p>
            <ul className="policy-list">
              <li><strong>Duplicate Payment:</strong> If you were accidentally charged more than once for the same bundle due to a network or gateway glitch, the duplicate amount will be refunded 100% within 5-7 business days.</li>
              <li><strong>Technical Inaccessibility:</strong> If you are unable to open, view, or download the files after payment and our technical support team is unable to resolve the issue within 24 hours of notification.</li>
              <li><strong>Significant Discrepancy:</strong> If the bundle delivered is substantially different from what was described on the product page.</li>
            </ul>

            <h3>4. How to Request a Refund</h3>
            <p>
              To initiate a refund request, please email our support team at <a href="mailto:support@projuktisoft.shop" className="contact-link">support@projuktisoft.shop</a> within <strong>7 days</strong> of purchase with:
            </p>
            <ul className="policy-list">
              <li>Your Registered Email ID & WhatsApp Mobile Number</li>
              <li>Razorpay Payment ID (e.g. <code>pay_xxxxxxxxxxxx</code>)</li>
              <li>Screenshot or clear description of the technical issue faced</li>
            </ul>

            <h3>5. Refund Processing Timeline</h3>
            <p>
              Once approved, your refund will be processed back to your original payment method (Bank Account, UPI, or Card via Razorpay) within <strong>5 to 7 business days</strong> as per standard banking guidelines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

