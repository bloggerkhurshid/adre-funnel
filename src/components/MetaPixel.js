/**
 * Meta (Facebook & Instagram) Pixel Helper
 * Pixel ID: 1899853834758606
 */

export const MetaPixel = {
  pageView: (pageName = '') => {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      window.fbq('track', 'PageView', { page_name: pageName });
    }
  },

  viewContent: (product) => {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function' && product) {
      window.fbq('track', 'ViewContent', {
        content_name: product.name,
        content_category: product.category,
        content_ids: [product.id],
        value: product.price,
        currency: 'INR'
      });
    }
  },

  initiateCheckout: (product) => {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function' && product) {
      window.fbq('track', 'InitiateCheckout', {
        content_name: product.name,
        content_category: product.category,
        content_ids: [product.id],
        value: product.price,
        currency: 'INR',
        num_items: 1
      });
    }
  },

  purchase: (product, paymentId = '') => {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function' && product) {
      window.fbq('track', 'Purchase', {
        content_name: product.name,
        content_type: 'product',
        content_ids: [product.id],
        value: product.price,
        currency: 'INR',
        transaction_id: paymentId
      });
    }
  }
};

