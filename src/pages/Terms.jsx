import React, { useEffect } from 'react';
import { MetaPixel } from '../components/MetaPixel';

export default function Terms() {
  useEffect(() => {
    window.scrollTo(0, 0);
    MetaPixel.pageView('Terms & Conditions');
  }, []);

  return (
    <div className="policy-page-container">
      <div className="container">
        <div className="policy-card">
          <span className="policy-badge">Legal Documentation</span>
          <h1>Terms & Conditions</h1>
          <p className="policy-subtitle">Last updated: November 2, 2026</p>

          <div className="policy-content-body">
            <h3>1. Introduction</h3>
            <p>
              Welcome to ProjuktiSoft (accessible at <strong>projuktisoft.shop</strong>). By accessing our website, browsing our catalog, or purchasing any digital products (ebooks, video courses, or study materials), you agree to comply with and be bound by the following terms and conditions.
            </p>

            <h3>2. Pricing & Currency</h3>
            <p>
              All products, study materials, and combos listed on <strong>projuktisoft.shop</strong> are priced and charged in <strong>Indian Rupees (INR - ₹)</strong>. Prices are clearly displayed before purchase and inclusive of all applicable taxes unless specified otherwise. We reserve the right to alter pricing or promotional offers at any time without prior notice.
            </p>

            <h3>3. Nature of Digital Products & Instant Delivery</h3>
            <p>
              All products sold on this website are <strong>strictly digital products</strong> (PDF ebooks, video streaming links, and downloadable resources). No physical goods or paper books will be shipped. Access to the digital products is granted immediately upon successful payment via Cashfree / UPI. A confirmation email with download links is also sent automatically to the email address provided during checkout.
            </p>

            <h3>4. License & Intellectual Property</h3>
            <p>
              Upon completing payment, ProjuktiSoft grants you a personal, revocable, non-exclusive, non-transferable license to access, download, and study the purchased materials for personal, non-commercial educational preparation. You may not resell, redistribute, upload to public file-sharing platforms, or modify any part of the materials without prior written consent from ProjuktiSoft.
            </p>

            <h3>5. Exam Selection Disclaimer</h3>
            <p>
              All practice questions, sample answers, and syllabus summaries are curated for practice and preparation purposes only. While our materials follow official syllabus patterns, ProjuktiSoft does not guarantee selection, appointment, or specific marks in any recruitment exam (ADRE, Assam Police, SSC GD, or others). Success is determined by individual merit and hard work.
            </p>

            <h3>6. Governing Law & Jurisdiction</h3>
            <p>
              These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any legal disputes arising out of the use of this website shall be subject to the exclusive jurisdiction of the competent courts in Guwahati, Assam, India.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

