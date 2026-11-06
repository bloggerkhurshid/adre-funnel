import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Checkout from './pages/Checkout';
import Home from './pages/Home';
import FbMasterclassFunnel from './pages/FbMasterclassFunnel';
import AdreFunnel from './pages/AdreFunnel';
import CinemoodFunnel from './pages/CinemoodFunnel';
import SpokenEnglishFunnel from './pages/SpokenEnglishFunnel';
import Success from './pages/Success';
import ContactUs from './pages/ContactUs';
import Terms from './pages/Terms';
import RefundPolicy from './pages/RefundPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import MyDownloads from './pages/MyDownloads';
import AdminDashboard from './pages/AdminDashboard';
import { PRODUCTS, getProductById } from './data/products';
import { funnelManager } from './data/funnelManager';

// Dynamic Router: Resolves custom funnels, products created in Admin Panel, and standard utility routes
const resolveCurrentRoute = () => {
  const path = window.location.pathname.replace(/^\/+/, '').replace(/\/+$/, '').toLowerCase();
  const hash = window.location.hash.replace('#', '').replace(/^\/+/, '').toLowerCase();
  const target = path || hash;

  if (target === 'checkout' || target === 'pay' || target === 'order') return 'checkout';
  if (target === 'contact' || target === 'contact-us') return 'contact';
  if (target === 'terms' || target === 'terms-and-conditions') return 'terms';
  if (target === 'refund-policy' || target === 'refund' || target === 'refunds') return 'refund';
  if (target === 'privacy-policy' || target === 'privacy') return 'privacy';
  if (target === 'my-downloads' || target === 'downloads' || target === 'download') return 'my-downloads';
  if (target === 'admin' || target === 'dashboard') return 'admin';
  if (target === 'success') return 'success';

  if (!target || target === 'home') {
    return 'home';
  }

  // Check if target matches any dynamic product / funnel created in Admin Panel
  const matchedProd = funnelManager.getProduct(target);
  if (matchedProd) {
    return `funnel:${matchedProd.id}`;
  }

  return 'home';
};

const resolveInitialCheckoutProduct = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const prodId = params.get('product') || params.get('id');
    if (prodId) {
      const resolved = funnelManager.getProduct(prodId) || getProductById(prodId);
      if (resolved) return resolved;
    }
    const saved = sessionStorage.getItem('pj_checkout_product_id');
    if (saved) {
      const savedProd = funnelManager.getProduct(saved) || getProductById(saved);
      if (savedProd) return savedProd;
    }
  } catch (e) {}

  const defSlug = funnelManager.getDefaultSlug();
  return funnelManager.getProduct(defSlug) || PRODUCTS['fb-masterclass'];
};

export default function App() {
  const [currentRoute, setCurrentRoute] = useState(resolveCurrentRoute());
  const [checkoutProduct, setCheckoutProduct] = useState(resolveInitialCheckoutProduct);
  const [initialOrderBumpSelected, setInitialOrderBumpSelected] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const bumpParam = params.get('bump');
      if (bumpParam === '1' || bumpParam === 'true') return true;
      if (bumpParam === '0' || bumpParam === 'false') return false;
      return sessionStorage.getItem('pj_checkout_bump') === '1';
    } catch (e) {}
    return false;
  });
  const [purchaseData, setPurchaseData] = useState(null);

  useEffect(() => {
    const handleLocationChange = () => {
      const newRoute = resolveCurrentRoute();
      setCurrentRoute(newRoute);
      if (newRoute === 'checkout') {
        const prod = resolveInitialCheckoutProduct();
        if (prod) setCheckoutProduct(prod);
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateTo = (route, options = {}) => {
    let urlPath = '/';
    let normalized = route;

    if (route === 'home') {
      urlPath = '/';
      normalized = 'home';
    } else if (route.startsWith('funnel:')) {
      const slug = route.replace('funnel:', '');
      urlPath = `/${slug}`;
      normalized = route;
    } else if (route === 'fb-masterclass' || route === 'masterclass' || route === 'fb') {
      urlPath = '/';
      normalized = 'home';
    } else if (route === 'checkout' || route === 'pay') {
      const defSlug = funnelManager.getDefaultSlug();
      const targetProd = options.product || checkoutProduct || funnelManager.getProduct(defSlug) || PRODUCTS['fb-masterclass'];
      const bump = options.withBump !== undefined ? options.withBump : initialOrderBumpSelected;
      setCheckoutProduct(targetProd);
      if (options.withBump !== undefined) setInitialOrderBumpSelected(bump);
      urlPath = `/checkout?product=${targetProd.id}${bump ? '&bump=1' : ''}`;
      normalized = 'checkout';
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
    } else if (route === 'my-downloads' || route === 'downloads') {
      urlPath = '/my-downloads';
      normalized = 'my-downloads';
    } else if (route === 'admin') {
      urlPath = '/admin';
      normalized = 'admin';
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
    try {
      sessionStorage.setItem('pj_checkout_product_id', product.id);
      sessionStorage.setItem('pj_checkout_bump', withBump ? '1' : '0');
    } catch (e) {}
    navigateTo('checkout', { product, withBump });
  };

  const handlePaymentSuccess = (data) => {
    setPurchaseData(data);
    navigateTo('success');
  };

  // Funnel pages, checkout page, success screen, and admin must have ZERO global nav distractions
  const isFunnelPage = currentRoute === 'home' || currentRoute.startsWith('funnel:') || currentRoute === 'fb-masterclass' || currentRoute === 'checkout' || currentRoute === 'success' || currentRoute === 'admin';

  return (
    <div className={`app-root ${isFunnelPage ? 'is-funnel-mode' : ''}`}>
      {/* Top Navbar - Hidden on Funnel Pages (/ & /checkout) & Admin */}
      {!isFunnelPage && <Navbar onNavigate={navigateTo} />}

      {/* Main Content Router */}
      <main className="main-content">
        {(currentRoute === 'home' || currentRoute.startsWith('funnel:') || currentRoute === 'fb-masterclass') && (
          <FbMasterclassFunnel 
            slug={currentRoute.startsWith('funnel:') ? currentRoute.replace('funnel:', '') : funnelManager.getDefaultSlug()} 
            onBuyProduct={handleBuyProduct} 
            onNavigate={navigateTo} 
          />
        )}
        {currentRoute === 'checkout' && (
          <Checkout
            product={checkoutProduct}
            initialOrderBumpSelected={initialOrderBumpSelected}
            onNavigate={navigateTo}
            onSuccess={handlePaymentSuccess}
          />
        )}
        {currentRoute === 'contact' && <ContactUs />}
        {currentRoute === 'terms' && <Terms />}
        {currentRoute === 'refund' && <RefundPolicy />}
        {currentRoute === 'privacy' && <PrivacyPolicy />}
        {currentRoute === 'my-downloads' && (
          <MyDownloads onNavigate={navigateTo} />
        )}
        {currentRoute === 'admin' && (
          <AdminDashboard onNavigate={navigateTo} />
        )}
        {currentRoute === 'success' && (
          <Success purchaseData={purchaseData} onNavigate={navigateTo} />
        )}
      </main>

      {/* Global Footer - Hidden on Funnel Pages & Admin */}
      {!isFunnelPage && <Footer onNavigate={navigateTo} />}
    </div>
  );
}
