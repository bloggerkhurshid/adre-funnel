import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CheckoutModal from './components/CheckoutModal';
import Home from './pages/Home';
import AdreFunnel from './pages/AdreFunnel';
import EnglishFunnel from './pages/EnglishFunnel';
import Success from './pages/Success';
import ContactUs from './pages/ContactUs';
import Terms from './pages/Terms';
import RefundPolicy from './pages/RefundPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import { PRODUCTS } from './data/products';

// Helper to determine route from clean pathname (e.g. /adre-combo, /ebook) or fallback hash
const resolveCurrentRoute = () => {
  const path = window.location.pathname.replace(/^\/+/, '').replace(/\/+$/, '').toLowerCase();
  const hash = window.location.hash.replace('#', '').replace(/^\/+/, '').toLowerCase();
  const target = path || hash;

  if (target === 'adre-combo' || target === 'ebook' || target === 'adre') return 'adre-combo';
  if (target === 'english-bundle' || target === 'english') return 'english-bundle';
  if (target === 'contact' || target === 'contact-us') return 'contact';
  if (target === 'terms' || target === 'terms-and-conditions') return 'terms';
  if (target === 'refund-policy' || target === 'refund' || target === 'refunds') return 'refund';
  if (target === 'privacy-policy' || target === 'privacy') return 'privacy';
  if (target === 'success') return 'success';
  return 'home';
};

export default function App() {
  const [currentRoute, setCurrentRoute] = useState(resolveCurrentRoute());
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [initialOrderBumpSelected, setInitialOrderBumpSelected] = useState(false);
  const [purchaseData, setPurchaseData] = useState(null);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentRoute(resolveCurrentRoute());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateTo = (route) => {
    let urlPath = '/';
    let normalized = route;

    if (route === 'adre-combo' || route === 'adre' || route === 'ebook') {
      urlPath = '/adre-combo';
      normalized = 'adre-combo';
    } else if (route === 'english-bundle' || route === 'english') {
      urlPath = '/english-bundle';
      normalized = 'english-bundle';
    } else if (route === 'contact') {
      urlPath = '/contact';
      normalized = 'contact';
    } else if (route === 'terms') {
      urlPath = '/terms';
      normalized = 'terms';
    } else if (route === 'refund') {
      urlPath = '/refund-policy';
      normalized = 'refund';
    } else if (route === 'privacy') {
      urlPath = '/privacy-policy';
      normalized = 'privacy';
    } else if (route === 'success') {
      urlPath = '/success';
      normalized = 'success';
    }

    // Push clean HTML5 path without hash
    try {
      window.history.pushState({}, '', urlPath);
    } catch (e) {
      window.location.hash = urlPath;
    }

    setCurrentRoute(normalized);
    window.scrollTo(0, 0);
  };

  const handleBuyProduct = (product, withBump = false) => {
    setCheckoutProduct(product);
    setInitialOrderBumpSelected(withBump);
    setIsCheckoutOpen(true);
  };

  const handlePaymentSuccess = (data) => {
    setPurchaseData(data);
    setIsCheckoutOpen(false);
    navigateTo('success');
  };

  // Funnel pages and success screen must have ZERO header/footer distractions
  const isFunnelPage = currentRoute === 'adre-combo' || currentRoute === 'english-bundle' || currentRoute === 'success';

  return (
    <div className={`app-root ${isFunnelPage ? 'is-funnel-mode' : ''}`}>
      {/* Top Navbar - Hidden on Funnel Pages (/adre-combo, /english-bundle) */}
      {!isFunnelPage && <Navbar onNavigate={navigateTo} />}

      {/* Main Content Router */}
      <main className="main-content">
        {currentRoute === 'home' && (
          <Home onNavigate={navigateTo} onBuyProduct={handleBuyProduct} />
        )}
        {currentRoute === 'adre-combo' && (
          <AdreFunnel onBuyProduct={handleBuyProduct} onNavigate={navigateTo} />
        )}
        {currentRoute === 'english-bundle' && (
          <EnglishFunnel onBuyProduct={handleBuyProduct} onNavigate={navigateTo} />
        )}
        {currentRoute === 'contact' && <ContactUs />}
        {currentRoute === 'terms' && <Terms />}
        {currentRoute === 'refund' && <RefundPolicy />}
        {currentRoute === 'privacy' && <PrivacyPolicy />}
        {currentRoute === 'success' && (
          <Success purchaseData={purchaseData} onNavigate={navigateTo} />
        )}
      </main>

      {/* Global Footer - Hidden on Funnel Pages */}
      {!isFunnelPage && <Footer onNavigate={navigateTo} />}

      {/* Universal Direct Razorpay Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        product={checkoutProduct}
        initialOrderBumpSelected={initialOrderBumpSelected}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
