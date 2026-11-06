import { 
  PRODUCTS as STATIC_PRODUCTS, 
  CTET_ORDER_BUMP, 
  FB_AUTOMATION_BUMP, 
  WEDDING_ORDER_BUMP 
} from './products';
import { 
  saveProductToFirestore, 
  fetchProductsFromFirestore, 
  deleteProductFromFirestore,
  saveFunnelConfigToFirestore, 
  fetchFunnelConfigFromFirestore, 
  fetchAllFunnelsFromFirestore,
  saveDefaultFunnelSlugToFirestore,
  fetchDefaultFunnelSlugFromFirestore
} from '../firebase';

const STORAGE_KEY_PRODUCTS = 'pj_custom_products_v2';
const STORAGE_KEY_FUNNELS = 'pj_funnel_configs_v2';
const STORAGE_KEY_DEFAULT_SLUG = 'pj_default_funnel_slug_v2';

/**
 * Generate a complete, high-converting default section list for any product
 */
export function generateDefaultSections(product) {
  const prod = product || {};
  const price = prod.price || 299;
  const oldPrice = prod.originalPrice || 4999;
  const name = prod.name || 'USA Facebook Earning Masterclass 2026';
  const videoUrl = prod.demoVideoUrl || 'https://drive.google.com/file/d/1zxeZfgmfTwdZkHMOMIoJpb9A6Qh4EJvJ/preview';

  return [
    {
      id: 'urgency_bar',
      type: 'urgency_bar',
      name: 'Top Flash Sale Urgency Ticker Bar',
      icon: '⚡',
      enabled: true,
      data: {
        badgeText: '⚡ FLASH LAUNCH SALE',
        offerText: `Limited Period Launch Special: Flat 94% OFF Ends In:`,
        priceText: `Complete Access Sirf ₹${price}`
      }
    },
    {
      id: 'hero',
      type: 'hero',
      name: 'Hero Section (Headline, Subtitle, CTA)',
      icon: '🎯',
      enabled: true,
      data: {
        badge1: '🔥 2026 PROVEN MONETIZATION BLUEPRINT',
        badge2: '🛡️ 100% TOS & Ban-Proof System',
        title: name,
        gradientHighlight: 'Zero se 7-Figure tak (10+ Hours)',
        subtitle: prod.tagline || 'USA Facebook Earning ka poora system — 3 proven methods, 10+ ghante, zero se automation tak.',
        problemQuote: '“Facebook se earning karni hai lekin kahan se shuru karna hai, yeh nahi pata? Is 10+ ghanton ke step-by-step course mein poori strategy hai — zero se lekar full automation tak.”',
        ctaButtonText: `Masterclass Unlock Karein — sirf ₹${price}`,
        payoutBadgeText: 'Verified In-Stream Payout: $15,353.41 (₹12,80,000+) Credited'
      }
    },
    {
      id: 'pillars',
      type: 'pillars',
      name: 'Core Pillars / Framework (What You Learn)',
      icon: '📍',
      enabled: true,
      data: {
        sectionTag: 'CORE FRAMEWORK',
        sectionTitle: 'Is Course Mein Kya Sikhoge?',
        sectionDesc: 'Ye 5 proven pillars aapko zero experience se high-RPM USA Facebook earning tak le jayenge:',
        items: [
          { label: 'METHOD 1', icon: '📍', color: 'blue', title: 'USA Group Sharing Method', desc: 'Active high-engagement USA groups mein ban-proof safe posting, group matrix rules aur organic reach multiplication.' },
          { label: 'METHOD 2', icon: '💰', color: 'emerald', title: 'Paid Method ($10-20 Budget)', desc: 'Sirf $10-20 chote ad-budget se ad-based views generate karke pages ko ROI-positive aur instant monetize banane ka formula.' },
          { label: 'METHOD 3', icon: '📄', color: 'cyan', title: 'Page Sharing Method', desc: 'Bade USA established pages se share requests aur cross-promotion partnerships bina high cost ke hasil karna.' },
          { label: 'MONETIZATION', icon: '📺', color: 'amber', title: 'TV Show Repurposing', desc: 'Licensed TV shows aur viral content se ad revenue generate karna — 100% copyright-safe aur fair-use compliant strategy.' },
          { label: 'SPEED & SCALE', icon: '🤖', color: 'purple', title: 'Full AI Automation', desc: 'AI tools aur prompt workflows se 1 din mein 10 active pages ka high-retention video content generate aur schedule karein.', isFull: true }
        ]
      }
    },
    {
      id: 'video_demo',
      type: 'video_demo',
      name: 'Video Player (Google Drive / YouTube Protected Embed)',
      icon: '🎬',
      enabled: true,
      data: {
        badge: '🎁 100% FREE STARTER PACK (2 HOURS)',
        title: 'Full Course Ka 10% — Pehle Dekho, Phir Lene Ka Socho',
        desc: 'Hum hawa mein baat nahi karte — yeh 2 ghante ka starter pack dekhkar strategy samjhein. Video isi screen par chalegi bina kisi ad ya redirect ke:',
        videoUrl: videoUrl,
        shieldTitle: 'ProjuktiSoft HD Player • Module 1 & 2 Free Starter Pack (2 Hours)',
        footerTag: 'YEH SIRF 10% PREVIEW HAI',
        footerText: 'Baki 90% Advanced Content, TV Show Repurposing, AI Automation & Payout Setup full 10+ hours masterclass mein unlock hoga:',
        ctaText: `Complete Masterclass Unlock (₹${price}) →`
      }
    },
    {
      id: 'proofs',
      type: 'proofs',
      name: 'Payment Proofs & Live Analytics Showcase',
      icon: '💳',
      enabled: true,
      data: {
        sectionTag: 'VERIFIED PAYMENT PROOF',
        sectionTitle: 'Live Facebook In-Stream Monetization Payouts',
        sectionDesc: 'Koi photoshop ya hypothetical claims nahi — dekhiye live meta transactions aur direct Indian bank transfer receipts:',
        metrics: [
          { value: '$15,353.41', label: 'Single Month Bank Payout', sub: '₹12,80,000+ Direct in Indian Bank', color: 'emerald' },
          { value: '13M+ Views', label: '28-Day Video Reach', sub: '↑ 132% Verified Organic Growth', color: 'blue' },
          { value: '$3,131+', label: 'Per-Page Monthly Ad Earning', sub: 'Consistent In-Stream Ads Revenue', color: 'amber' }
        ],
        proofImages: [
          { tag: '28 DAYS ANALYTICS', tagColor: 'blue', url: '/fb-masterclass/proof-analytics-13m.webp', title: '13 Million Views & $1,493.57', desc: '28 Days Growth: 132% views hike aur 721K+ engagement rate.' },
          { tag: 'META TRANSACTIONS', tagColor: 'emerald', url: '/fb-masterclass/proof-payout-transactions.png', title: '$3,131.91 & $3,119.87 Multiple Pages', desc: 'May 17 Payout: $15,353.41 Paid to Punjab National Bank.' },
          { tag: 'BANK CREDITED DETAILS', tagColor: 'purple', url: '/fb-masterclass/proof-payout-detail.jpg', title: 'Status: PAID ✓ ($15,353.41)', desc: 'Direct bank transfer confirmation with verified Meta Transaction ID.' }
        ]
      }
    },
    {
      id: 'deliverables',
      type: 'deliverables',
      name: 'Deliverables & Total Value Stack',
      icon: '📦',
      enabled: true,
      data: {
        sectionTag: 'PACKAGE DELIVERABLES',
        title: 'Kya Milega Masterclass Ke Sath:',
        items: [
          { title: '13 Complete In-Depth HD Video Modules', desc: '10+ ghante ka step-by-step training video course zero se lekar scale karne tak.' },
          { title: 'Action Checklists & PDF Guides', desc: 'Har module ke end mein exact actionable checklist taaki confuse na hona pade.' },
          { title: 'Real Earning Screenshots & Case Studies', desc: 'Proven high-RPM niches, viral hooks aur live analytics breakdown.' },
          { title: 'Private VIP WhatsApp Support Group', desc: 'Sirf verified buyers ke liye dedicated community — queries aur support ke liye.' },
          { title: 'Free Lifetime Updates', desc: 'Future mein jab bhi Facebook algorithm ya nayi method aayegi, course mein free add hogi.' }
        ],
        valueItems: [
          { label: '10+ Hours Video Course', val: '₹2,499' },
          { label: '13 Action Checklists & PDFs', val: '₹999' },
          { label: 'VIP WhatsApp Community', val: '₹999' },
          { label: 'Lifetime Updates & Support', val: '₹500' }
        ],
        totalOriginalValue: `₹${oldPrice}`,
        ctaText: 'Abhi Access Unlock Karein →'
      }
    },
    {
      id: 'curriculum',
      type: 'curriculum',
      name: '13 Modules Curriculum (Accordion)',
      icon: '📚',
      enabled: true,
      data: {
        sectionTag: 'CURRICULUM BREAKDOWN',
        sectionTitle: 'Complete 13 Modules (10+ Hours)',
        sectionDesc: 'Har module practical screen-recording aur clear Hindi explanation ke saath step-by-step cover kiya gaya hai:',
        modules: [
          { id: 1, title: 'Facebook ID & Pages — Setup se Pehla Page tak', duration: '45 mins' },
          { id: 2, title: 'International (USA) Audience Targeting — TOS-Safe Tarika', duration: '50 mins' },
          { id: 3, title: 'Growth & Invite Strategy (Safe Limits, Ban se Bachao)', duration: '40 mins' },
          { id: 4, title: 'Advanced Prompt Engineering — Content Fast Banayein', duration: '55 mins' },
          { id: 5, title: 'AI Movie Making — Viral Clips se Ad Revenue', duration: '60 mins' },
          { id: 6, title: 'Competitor Page Analysis — Kisi Bhi Page Ka Model Copy Kiye Bina Khar Karna', duration: '45 mins' },
          { id: 7, title: 'Trending & Evergreen Niches — 2026 Ke Hisaab Se', duration: '40 mins' },
          { id: 8, title: 'Licensed Content Repurposing Method (Copyright-Safe)', duration: '65 mins' },
          { id: 9, title: 'Views Boost: PC & Mobile Dono Methods', duration: '45 mins' },
          { id: 10, title: 'Low-Monetization Pages Ki Earning Kaise 2x Karein', duration: '50 mins' },
          { id: 11, title: 'Facebook Automation — Ek Din Mein 10 Pages Ka Content', duration: '70 mins' },
          { id: 12, title: 'Payment & Payout Setup (Payoneer/Wise Se Direct Indian Bank Transfer)', duration: '45 mins' },
          { id: 13, title: 'Full System — Sab Jod Ke Chalta Hai, Yeh Hai Playbook', duration: '55 mins' }
        ]
      }
    },
    {
      id: 'pricing',
      type: 'pricing',
      name: 'Pricing Box & CTA (Checkout Trigger)',
      icon: '🏷️',
      enabled: true,
      data: {
        ribbonText: '⭐ LIMITED TIME LAUNCH DEAL • 94% OFF',
        tierTag: 'FULL ACCESS PASS',
        title: name,
        tagline: 'Zero se 7-Figure tak (10+ Hours Complete Step-by-Step System)',
        checklist: [
          'Full 10+ Hours Video Course (13 Modules)',
          'USA Active Group Sharing Matrix (Ban-Proof)',
          '$10-20 Paid Ad Setup Strategy',
          'Copyright-Safe TV Show Repurposing',
          '1-Day 10 Pages AI Automation Scripts',
          'Payoneer & Wise Indian Bank Payout Guide',
          '13 Downloadable Action Checklists [PDF]',
          'Private VIP WhatsApp Support Group',
          'Free Lifetime Updates on Nayi Methods'
        ],
        ctaButtonText: `Masterclass Lijiye — Sirf ₹${price}`,
        paymentNote: 'Payment ke turant baad screen par access link open hoga aur backup link aapke email par bhej diya jayega.'
      }
    },
    {
      id: 'faq',
      type: 'faq',
      name: 'Frequently Asked Questions (Accordion)',
      icon: '❓',
      enabled: true,
      data: {
        sectionTag: 'COMMON QUESTIONS',
        sectionTitle: 'Frequently Asked Questions',
        faqs: [
          { q: 'Kya is course ke liye laptop/computer zaroori hai ya phone se bhi kar sakte hain?', a: 'Aap phone aur PC dono se kar sakte hain. Module 9 mein humne specially PC aur Mobile dono methods detail mein cover kiye hain taaki agar aapke paas sirf smartphone hai toh bhi aap page manage, content post aur views boost kar sakein.' },
          { q: 'Kya copyright strike ya page red/demonetize hone ka risk hai?', a: 'Nahi! Is course ka sabse bada USP hi TOS-Safe aur Copyright-Safe methods hain. Module 8 (Licensed Content Repurposing) aur Module 3 (Growth & Safe Limits) mein humne wahi proprietary frameworks sikhaye hain jisse pages bina kisi strike ke saalon chalte hain.' },
          { q: 'USA Dollar earning India ke bank account mein kaise aayegi?', a: 'Module 12 poora Payout Setup par dedicated hai. Humne step-by-step dikhaya hai ki kaise Payoneer ya Wise ke through direct Indian Bank Account (jaise Punjab National Bank, SBI, HDFC) mein dollar convert hoke direct rupee transfer hota hai.' },
          { q: 'FREE Starter Pack (2 Hours) aur Full Masterclass mein kya antar hai?', a: 'Free Starter Pack (jo upar video player mein hai) full course ka sirf 10% introductory preview hai. Full 10+ Hours Masterclass mein baki ke saare 13 detailed modules, AI Automation scripts, USA Active Groups matrix, private WhatsApp VIP community aur regular lifetime updates shamil hain.' },
          { q: 'Agar kahin doubt aaya toh support kaise milega?', a: 'Masterclass join karte hi aapko private VIP WhatsApp Support Group ka direct invite link milta hai jahan hum regularly updates, queries aur troubleshooting provide karte hain.' }
        ]
      }
    },
    {
      id: 'sticky_bar',
      type: 'sticky_bar',
      name: 'Bottom Sticky Bar with Timer (Mobile & Desktop)',
      icon: '📱',
      enabled: true,
      data: {
        badgeText: '10+ HOURS',
        buttonText: `Masterclass Lijiye — sirf ₹${price} →`
      }
    }
  ];
}

class FunnelManager {
  constructor() {
    this.customProducts = new Map();
    this.funnelConfigs = new Map();
    this.defaultSlug = 'fb-masterclass';
    this.init();
  }

  init() {
    // 1. Load LocalStorage Caches
    try {
      const localSlug = localStorage.getItem(STORAGE_KEY_DEFAULT_SLUG);
      if (localSlug) this.defaultSlug = localSlug;

      const localProds = localStorage.getItem(STORAGE_KEY_PRODUCTS);
      if (localProds) {
        const parsed = JSON.parse(localProds);
        Object.values(parsed).forEach(p => this.customProducts.set(p.id, p));
      }

      const localFunnels = localStorage.getItem(STORAGE_KEY_FUNNELS);
      if (localFunnels) {
        const parsed = JSON.parse(localFunnels);
        Object.entries(parsed).forEach(([slug, cfg]) => this.funnelConfigs.set(slug, cfg));
      }
    } catch (e) {
      console.warn('FunnelManager localStorage init error:', e);
    }

    // 2. Async background sync from Firestore
    this.syncFromFirestore();
  }

  async syncFromFirestore() {
    try {
      // Sync Default Slug
      const remoteSlug = await fetchDefaultFunnelSlugFromFirestore();
      if (remoteSlug) {
        this.defaultSlug = remoteSlug;
        localStorage.setItem(STORAGE_KEY_DEFAULT_SLUG, remoteSlug);
      }

      // Sync Products
      const remoteProds = await fetchProductsFromFirestore();
      if (remoteProds && remoteProds.length > 0) {
        remoteProds.forEach(p => this.customProducts.set(p.id, p));
        this._saveLocalProducts();
      }

      // Sync Funnel Configs
      const remoteFunnels = await fetchAllFunnelsFromFirestore();
      if (remoteFunnels && remoteFunnels.length > 0) {
        remoteFunnels.forEach(f => this.funnelConfigs.set(f.slug, f));
        this._saveLocalFunnels();
      }
    } catch (e) {
      console.warn('FunnelManager Firestore sync error:', e);
    }
  }

  _saveLocalProducts() {
    try {
      const obj = {};
      this.customProducts.forEach((v, k) => { obj[k] = v; });
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(obj));
    } catch (e) {}
  }

  _saveLocalFunnels() {
    try {
      const obj = {};
      this.funnelConfigs.forEach((v, k) => { obj[k] = v; });
      localStorage.setItem(STORAGE_KEY_FUNNELS, JSON.stringify(obj));
    } catch (e) {}
  }

  getDefaultSlug() {
    return this.defaultSlug || 'fb-masterclass';
  }

  async setDefaultSlug(slug) {
    if (!slug) return;
    this.defaultSlug = slug;
    try {
      localStorage.setItem(STORAGE_KEY_DEFAULT_SLUG, slug);
    } catch (e) {}
    saveDefaultFunnelSlugToFirestore(slug);
  }

  /**
   * Get all active & custom products
   */
  getAllProducts() {
    const map = new Map();

    // 1. Static defaults first
    Object.entries(STATIC_PRODUCTS).forEach(([k, v]) => {
      // Only include canonical products (avoid duplication of aliases)
      if (v.id === k) {
        map.set(v.id, { ...v });
      }
    });

    // 2. Custom overrides / new products
    this.customProducts.forEach((prod, id) => {
      map.set(id, { ...prod });
    });

    return Array.from(map.values());
  }

  /**
   * Get a single product by ID or Slug
   */
  getProduct(rawId) {
    if (!rawId) return null;
    const cleanId = String(rawId).trim().toLowerCase();

    // 1. Check custom products
    if (this.customProducts.has(cleanId)) {
      return this.customProducts.get(cleanId);
    }

    // 2. Check static products & aliases
    if (STATIC_PRODUCTS[cleanId]) {
      return STATIC_PRODUCTS[cleanId];
    }

    // 3. Fallback match by shortName or id substring
    for (const [id, prod] of this.customProducts.entries()) {
      if (id.includes(cleanId) || (prod.slug && prod.slug === cleanId)) {
        return prod;
      }
    }

    return null;
  }

  /**
   * Save / Create / Update a Product
   */
  async saveProduct(productData) {
    if (!productData || !productData.id) {
      throw new Error('Product slug/id is required');
    }

    const cleanId = String(productData.id).trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const existing = this.getProduct(cleanId) || {};

    const cleanPrice = Number(productData.price) || 299;
    const cleanOldPrice = Number(productData.originalPrice) || (cleanPrice * 5);
    const discount = Math.round(((cleanOldPrice - cleanPrice) / cleanOldPrice) * 100);

    const mergedProduct = {
      ...existing,
      ...productData,
      id: cleanId,
      slug: cleanId,
      price: cleanPrice,
      originalPrice: cleanOldPrice,
      discountPercent: `${discount}% OFF`,
      currency: 'INR',
      currencySymbol: '₹',
      updatedAt: new Date().toISOString()
    };

    // Save in memory & local storage
    this.customProducts.set(cleanId, mergedProduct);
    this._saveLocalProducts();

    // Ensure funnel config exists for this product
    if (!this.funnelConfigs.has(cleanId)) {
      const defaultSections = generateDefaultSections(mergedProduct);
      this.saveFunnelConfig(cleanId, {
        slug: cleanId,
        productId: cleanId,
        sections: defaultSections
      });
    }

    // Sync to Firestore in background
    saveProductToFirestore(mergedProduct);

    return mergedProduct;
  }

  /**
   * Delete a custom product
   */
  async deleteProduct(productId) {
    if (!productId) return false;
    const cleanId = String(productId).trim().toLowerCase();
    this.customProducts.delete(cleanId);
    this.funnelConfigs.delete(cleanId);
    this._saveLocalProducts();
    this._saveLocalFunnels();

    // Sync to Firestore
    deleteProductFromFirestore(cleanId);
    return true;
  }

  /**
   * Get Funnel Page Configuration (Sections & Data) for a given product slug
   */
  getFunnelConfig(slug) {
    const cleanSlug = String(slug || this.defaultSlug).trim().toLowerCase();
    
    // If customized config exists
    if (this.funnelConfigs.has(cleanSlug)) {
      return this.funnelConfigs.get(cleanSlug);
    }

    // Otherwise generate default sections for this product
    const product = this.getProduct(cleanSlug) || this.getProduct('fb-masterclass') || STATIC_PRODUCTS['fb-masterclass'];
    const defaultSections = generateDefaultSections(product);
    
    const initialConfig = {
      slug: cleanSlug,
      productId: product?.id || cleanSlug,
      sections: defaultSections
    };

    this.funnelConfigs.set(cleanSlug, initialConfig);
    this._saveLocalFunnels();
    return initialConfig;
  }

  /**
   * Save / Update Funnel Configuration (Order of sections, content, etc.)
   */
  async saveFunnelConfig(slug, configData) {
    if (!slug) return null;
    const cleanSlug = String(slug).trim().toLowerCase();

    const mergedConfig = {
      slug: cleanSlug,
      productId: configData.productId || cleanSlug,
      sections: configData.sections || generateDefaultSections(this.getProduct(cleanSlug)),
      updatedAt: new Date().toISOString()
    };

    this.funnelConfigs.set(cleanSlug, mergedConfig);
    this._saveLocalFunnels();

    // Sync to Firestore in background
    saveFunnelConfigToFirestore(cleanSlug, mergedConfig);

    return mergedConfig;
  }
}

export const funnelManager = new FunnelManager();
