# ProjuktiSoft React Storefront & Funnels (projuktisoft.shop)

A complete, production-ready React.js application for **ProjuktiSoft (projuktisoft.shop)** featuring a modern digital storefront, dedicated high-converting funnels, 100% compliant Razorpay merchant policy pages, and Meta Pixel conversion tracking.

---

## 📁 Project Architecture

```
projuktisoft_react/
├── index.html                   # HTML Entry with Meta Pixel & Razorpay SDK
├── package.json                 # React & Vite Dependencies
├── vite.config.js               # Vite Configuration
├── public/                      # Static Assets (Logo, Banners, PDF Previews)
│   ├── logo.png                 # ProjuktiSoft Brand Logo
│   ├── combo-banner.jpg         # 3D Cover Mockup Banner
│   ├── free-sample-preview.jpg  # Sample PDF Preview Graphic
│   └── sample-page.jpg          # Authentic Question Preview Page
└── src/
    ├── main.jsx                 # React Mount Entry
    ├── App.jsx                  # Main App with Client-Side Routing & State
    ├── index.css                # Unified Dark & Lime Green Theme Stylesheet
    ├── data/
    │   └── products.js          # Products listed with pricing strictly in INR (₹)
    ├── components/
    │   ├── Navbar.jsx           # ProjuktiSoft Header Navigation with Logo
    │   ├── Footer.jsx           # Footer with Mandatory Razorpay Policy Links
    │   ├── CheckoutModal.jsx    # Universal Direct Razorpay Checkout Modal
    │   └── MetaPixel.js         # Meta Pixel (ID: 1899853834758606) Tracking
    └── pages/
        ├── Home.jsx             # Official Digital Storefront Catalog
        ├── AdreFunnel.jsx       # Assam Govt Exam 4-in-1 MCQ Ebook Funnel (₹99)
        ├── EnglishFunnel.jsx    # Complete English Learning Mega Bundle Funnel (₹199)
        ├── Success.jsx          # Instant Download & Meta Pixel Purchase Event
        ├── ContactUs.jsx        # Mandatory Razorpay Compliance Policy Page
        ├── Terms.jsx            # Mandatory Razorpay Compliance Policy Page
        ├── RefundPolicy.jsx     # Mandatory Razorpay Compliance Policy Page
        └── PrivacyPolicy.jsx    # Mandatory Razorpay Compliance Policy Page
```

---

## 🚀 How to Run Locally

```bash
# 1. Navigate to the React folder
cd projuktisoft_react

# 2. Start the Vite React development server
npm run dev
```

Visit: `http://localhost:3000` (or the port shown in terminal).

---

## 📦 How to Build for Production

```bash
cd projuktisoft_react
npm run build
```
The optimized production bundle will be generated in `projuktisoft_react/dist/` ready to deploy on **Vercel**, **Netlify**, or **Cloudflare Pages**.

---

## ⚖️ Razorpay Merchant Compliance Checklist (100% Met)

- [x] **Contact Us Page:** Operating Entity, Address (Guwahati, Assam), Support Email (`support@projuktisoft.shop`), Helpline (`+91 98765 43210`).
- [x] **Terms & Conditions:** Digital goods license, educational disclaimer, governing law.
- [x] **Refunds & Cancellations Policy:** 7-day technical support guarantee, duplicate charge refund timeline (5-7 business days).
- [x] **Privacy Policy:** Data protection, 256-bit encryption, Meta Pixel usage notice.
- [x] **Products & Services Listed:** ADRE 4-in-1 Combo & English Learning Mega Bundle.
- [x] **Pricing in INR (₹):** Transparently displayed on all product cards, checkout modals, and policy footers.

---

## 🎯 Meta Pixel (Pixel ID: `1899853834758606`) Tracking Events

- **`PageView`**: Fires on every route change across storefront, funnels, and policy pages.
- **`ViewContent`**: Fires when viewing ADRE Combo or English Bundle with product ID and price.
- **`InitiateCheckout`**: Fires when customer clicks "Pay & Download Now" in the checkout drawer.
- **`Purchase`**: Fires automatically on `Success.jsx` with transaction ID and exact value in INR.

