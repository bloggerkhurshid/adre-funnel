import React, { useState, useEffect, useMemo } from 'react';
import { 
  fetchAllOrdersForAdmin, 
  deleteOrderFromFirestore, 
  deleteOrdersBulkFromFirestore 
} from '../firebase';
import { 
  PRODUCTS, 
  CTET_ORDER_BUMP, 
  WEDDING_ORDER_BUMP, 
  getProductById 
} from '../data/products';

export default function AdminDashboard({ onNavigate }) {
  // Session-persisted Authentication
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem('pj_admin_session') === 'authenticated_2026';
    } catch (e) {
      return false;
    }
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Orders State
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filter & Search Controls
  const [searchTerm, setSearchTerm] = useState('');
  const [productFilter, setProductFilter] = useState('all'); // 'all', 'adre-combo', 'cinemood-presets', 'bump-only'
  const [sortOption, setSortOption] = useState('date-desc'); // 'date-desc', 'date-asc', 'amount-desc', 'amount-asc'

  // Selection for Bulk Actions
  const [selectedOrderIds, setSelectedOrderIds] = useState(new Set());

  // Action Modals State
  const [deleteModalState, setDeleteModalState] = useState({ isOpen: false, order: null, isBulk: false });
  const [isDeleting, setIsDeleting] = useState(false);
  const [emailSendingId, setEmailSendingId] = useState(null);
  const [whatsappModalState, setWhatsappModalState] = useState({ isOpen: false, order: null, messageText: '', waUrl: '' });

  // Floating Toast State
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'info' });
    }, 4000);
  };

  // Master Passwords
  const ADMIN_PASSWORDS = ['admin@projukti2026', 'projukti@2026'];

  const handleLogin = (e) => {
    e.preventDefault();
    if (ADMIN_PASSWORDS.includes(passwordInput.trim())) {
      setIsAuthenticated(true);
      try {
        sessionStorage.setItem('pj_admin_session', 'authenticated_2026');
      } catch (e) {}
      setLoginError('');
      loadOrders();
      showToast('Welcome back, Admin! Session authenticated.', 'success');
    } else {
      setLoginError('Invalid Admin Master Password. Access Denied.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem('pj_admin_session');
    } catch (e) {}
    setPasswordInput('');
    setSelectedOrderIds(new Set());
    showToast('Logged out of Admin Console', 'info');
  };

  // Load Orders from Firestore
  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllOrdersForAdmin();
      setOrders(data);
      // Clean up any stale selected IDs
      setSelectedOrderIds(new Set());
    } catch (err) {
      console.error('Failed to load orders:', err);
      showToast('Error loading orders from Firestore. Check connection.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated]);

  // Helper to resolve product & official Google Drive download links
  const resolveOrderMeta = (order) => {
    const prod = getProductById(order.productId) || PRODUCTS[order.productId] || PRODUCTS['adre-combo'];
    const isCinemood = prod.id === 'cinemood-presets' || prod.id === 'english-bundle' || (order.productName || '').toLowerCase().includes('preset') || (order.productName || '').toLowerCase().includes('cinemood');
    
    const bumpObj = isCinemood ? WEDDING_ORDER_BUMP : CTET_ORDER_BUMP;
    const mainDownload = prod.downloadUrl || 'https://drive.google.com/drive/folders/1x5XWr2uextv3b3eSoKIpYjoWvu-nqv0n?usp=sharing';
    const bumpDownload = bumpObj.downloadUrl;

    return {
      product: prod,
      isCinemood,
      mainDownload,
      bumpObj,
      bumpDownload
    };
  };

  // WhatsApp Message Composer
  const buildWhatsAppContent = (order) => {
    const { product, mainDownload, bumpObj, bumpDownload } = resolveOrderMeta(order);
    const cleanPhone = (order.phone || '').replace(/\D/g, '').slice(-10);
    const cleanName = order.name || 'Learner';
    const cleanProdName = order.productName || product.name;

    let msg = `Hello ${cleanName}! 👋\n`;
    msg += `Thank you for choosing *ProjuktiSoft*! Here are the official access details for your digital purchase.\n\n`;
    msg += `🧾 *Order Receipt:*\n`;
    msg += `• Product: ${cleanProdName}\n`;
    msg += `• Amount Paid: ₹${order.totalAmount || product.price} (Verified)\n`;
    msg += `• Transaction ID: ${order.paymentId}\n\n`;
    msg += `🔗 *Your Official Google Drive Download Links:*\n`;
    msg += `📥 *Main Ebook / Preset Bundle:*\n${mainDownload}\n`;

    if (order.orderBumpSelected) {
      msg += `\n🎁 *Bonus Order Bump Unlocked:*\n${order.orderBumpName || bumpObj.name}\n${bumpDownload}\n`;
    }

    msg += `\n⚡ *Instant Customer Portal:*\nYou can also access and re-download your files anytime on phone or PC using your registered phone/email at:\nhttps://projuktisoft.shop/my-downloads\n\n`;
    msg += `If you have any questions or need download help, feel free to reply directly to this chat.\n\nBest regards,\n*Team ProjuktiSoft*\nsupport@projuktisoft.shop`;

    const waUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(msg)}`;
    return { text: msg, url: waUrl, cleanPhone };
  };

  const handleOpenWhatsAppModal = (order) => {
    const { text, url } = buildWhatsAppContent(order);
    setWhatsappModalState({ isOpen: true, order, messageText: text, waUrl: url });
  };

  // Resend Email Handler
  const handleSendEmail = async (order) => {
    if (!order.email || !order.email.includes('@')) {
      showToast('⚠️ Cannot send email: Invalid customer email address.', 'error');
      return;
    }

    const { product, mainDownload, bumpObj, bumpDownload } = resolveOrderMeta(order);
    setEmailSendingId(order.id);

    try {
      const payload = {
        customerEmail: order.email.trim(),
        customerName: order.name || 'Valued Learner',
        customerPhone: order.phone || '',
        orderId: order.paymentId || `ord_${Date.now()}`,
        productName: order.productName || product.name,
        totalAmount: order.totalAmount || product.price,
        downloadUrl: mainDownload,
        files: product.files || [],
        orderBumpSelected: !!order.orderBumpSelected,
        orderBumpName: order.orderBumpName || bumpObj.name,
        orderBumpDownloadUrl: bumpDownload,
        orderBumpFiles: bumpObj.files || []
      };

      const res = await fetch('/api/send-order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const resData = await res.json();
      if (res.ok && resData.success) {
        showToast(`✓ Access & invoice email delivered to ${order.email}`, 'success');
      } else {
        showToast(`⚠️ Email dispatch: ${resData.message || resData.error || 'Server error'}`, 'error');
      }
    } catch (err) {
      console.error('Email sending error:', err);
      showToast('⚠️ Failed to dispatch email. Please check network/SMTP settings.', 'error');
    } finally {
      setEmailSendingId(null);
    }
  };

  // Single Order Delete Handlers
  const handleOpenSingleDelete = (order) => {
    setDeleteModalState({ isOpen: true, order, isBulk: false });
  };

  // Bulk Delete Handlers
  const handleOpenBulkDelete = () => {
    if (selectedOrderIds.size === 0) return;
    setDeleteModalState({ isOpen: true, order: null, isBulk: true });
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      if (deleteModalState.isBulk) {
        const idsToDelete = Array.from(selectedOrderIds);
        const result = await deleteOrdersBulkFromFirestore(idsToDelete);
        if (result.success) {
          setOrders(prev => prev.filter(o => !selectedOrderIds.has(o.id)));
          showToast(`✓ Successfully deleted ${idsToDelete.length} selected orders from Firestore!`, 'success');
          setSelectedOrderIds(new Set());
        } else {
          showToast(`⚠️ Bulk delete failed: ${result.error?.message || 'Error'}`, 'error');
        }
      } else if (deleteModalState.order) {
        const orderId = deleteModalState.order.id;
        const result = await deleteOrderFromFirestore(orderId);
        if (result.success) {
          setOrders(prev => prev.filter(o => o.id !== orderId));
          // If was selected, remove from selected
          if (selectedOrderIds.has(orderId)) {
            const nextSet = new Set(selectedOrderIds);
            nextSet.delete(orderId);
            setSelectedOrderIds(nextSet);
          }
          showToast(`✓ Order for ${deleteModalState.order.name} deleted successfully!`, 'success');
        } else {
          showToast(`⚠️ Delete failed: ${result.error?.message || 'Error'}`, 'error');
        }
      }
    } catch (err) {
      console.error('Delete execution error:', err);
      showToast('⚠️ Error while deleting order from Firestore.', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteModalState({ isOpen: false, order: null, isBulk: false });
    }
  };

  // Checkbox Selection Toggles
  const handleToggleSelectOrder = (id) => {
    setSelectedOrderIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Filtered & Sorted Orders
  const processedOrders = useMemo(() => {
    let result = [...orders];

    // 1. Text Search Filter
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      result = result.filter(order => {
        const nameMatch = (order.name || '').toLowerCase().includes(q);
        const emailMatch = (order.email || '').toLowerCase().includes(q);
        const phoneMatch = (order.phone || '').includes(q);
        const payMatch = (order.paymentId || '').toLowerCase().includes(q);
        const prodMatch = (order.productName || '').toLowerCase().includes(q);
        return nameMatch || emailMatch || phoneMatch || payMatch || prodMatch;
      });
    }

    // 2. Product Category Filter
    if (productFilter === 'adre-combo') {
      result = result.filter(o => (o.productId || '').includes('adre') || (o.productName || '').toLowerCase().includes('adre') || (o.productName || '').toLowerCase().includes('assam'));
    } else if (productFilter === 'cinemood-presets') {
      result = result.filter(o => (o.productId || '').includes('cinemood') || (o.productId || '').includes('english') || (o.productName || '').toLowerCase().includes('preset') || (o.productName || '').toLowerCase().includes('cinemood'));
    } else if (productFilter === 'bump-only') {
      result = result.filter(o => o.orderBumpSelected);
    }

    // 3. Sorting
    result.sort((a, b) => {
      if (sortOption === 'date-desc') {
        return new Date(b.createdAtISO || 0).getTime() - new Date(a.createdAtISO || 0).getTime();
      }
      if (sortOption === 'date-asc') {
        return new Date(a.createdAtISO || 0).getTime() - new Date(b.createdAtISO || 0).getTime();
      }
      if (sortOption === 'amount-desc') {
        return (Number(b.totalAmount) || 0) - (Number(a.totalAmount) || 0);
      }
      if (sortOption === 'amount-asc') {
        return (Number(a.totalAmount) || 0) - (Number(b.totalAmount) || 0);
      }
      return 0;
    });

    return result;
  }, [orders, searchTerm, productFilter, sortOption]);

  // Select / Deselect All for CURRENT filtered view
  const isAllFilteredSelected = processedOrders.length > 0 && processedOrders.every(o => selectedOrderIds.has(o.id));
  const handleToggleSelectAll = () => {
    if (isAllFilteredSelected) {
      setSelectedOrderIds(new Set());
    } else {
      const next = new Set(selectedOrderIds);
      processedOrders.forEach(o => next.add(o.id));
      setSelectedOrderIds(next);
    }
  };

  // Metrics Calculation
  const metrics = useMemo(() => {
    const totalRev = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
    const totalBump = orders.filter(o => o.orderBumpSelected).length;
    const bumpRate = orders.length > 0 ? ((totalBump / orders.length) * 100).toFixed(1) : '0';
    const aov = orders.length > 0 ? Math.round(totalRev / orders.length) : 0;

    // Today's orders
    const todayStr = new Date().toDateString();
    const todayOrders = orders.filter(o => o.createdAtISO && new Date(o.createdAtISO).toDateString() === todayStr);
    const todayRev = todayOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

    return {
      totalRev,
      totalOrders: orders.length,
      todayRev,
      todayCount: todayOrders.length,
      totalBump,
      bumpRate,
      aov
    };
  }, [orders]);

  // Export Filtered or All to CSV
  const handleExportCSV = () => {
    const listToExport = selectedOrderIds.size > 0 
      ? orders.filter(o => selectedOrderIds.has(o.id))
      : processedOrders;

    if (listToExport.length === 0) {
      showToast('No orders available to export', 'error');
      return;
    }

    const headers = [
      'Order ID / Payment ID', 
      'Customer Name', 
      'Email', 
      'WhatsApp Phone', 
      'Product', 
      'Order Bump Add-on', 
      'Amount (INR)', 
      'Payment Gateway', 
      'Date & Time (ISO)'
    ];

    const rows = listToExport.map(o => [
      `"${o.paymentId || ''}"`,
      `"${(o.name || '').replace(/"/g, '""')}"`,
      `"${o.email || ''}"`,
      `"${o.phone || ''}"`,
      `"${(o.productName || '').replace(/"/g, '""')}"`,
      o.orderBumpSelected ? `"${(o.orderBumpName || 'YES').replace(/"/g, '""')}"` : '"NO"',
      o.totalAmount || 0,
      `"${o.gateway || 'cashfree'}"`,
      `"${o.createdAtISO || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `projuktisoft_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`✓ Exported ${listToExport.length} orders to CSV successfully!`, 'success');
  };

  // ========================================================
  // 1. LOGIN SCREEN (PASSWORD PROTECTED)
  // ========================================================
  if (!isAuthenticated) {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-login-card">
          <div className="admin-brand-badge">
            <img src="/logo.png" alt="ProjuktiSoft" className="admin-logo" />
            <div>
              <h2>ProjuktiSoft Console</h2>
              <span className="admin-tag-live">🔒 256-BIT ENCRYPTED</span>
            </div>
          </div>

          <p className="admin-login-desc">
            Authorized management access for order delivery, customer communications, and database records.
          </p>

          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="admin-input-group">
              <label htmlFor="adm-pass">Master Password</label>
              <input
                id="adm-pass"
                type="password"
                required
                autoFocus
                placeholder="Enter admin master password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="admin-input-field"
              />
            </div>

            {loginError && (
              <div className="admin-error-box">
                ⚠️ {loginError}
              </div>
            )}

            <button type="submit" className="admin-login-btn">
              <span>Unlock Admin Console →</span>
            </button>
          </form>

          <div className="admin-login-footer">
            <a 
              href="/" 
              onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('home'); }}
              className="admin-back-link"
            >
              ← Return to Official Storefront
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // 2. AUTHENTICATED PROFESSIONAL DASHBOARD
  // ========================================================
  return (
    <div className="admin-dashboard-root">
      
      {/* Top Navbar */}
      <header className="admin-top-nav">
        <div className="admin-nav-container">
          <div className="admin-brand-left">
            <img src="/logo.png" alt="Logo" className="admin-nav-logo" />
            <div>
              <div className="admin-title-row">
                <strong className="admin-brand-name">ProjuktiSoft</strong>
                <span className="admin-badge-role">ADMINISTRATOR</span>
              </div>
              <span className="admin-sync-tag">
                <span className="admin-live-dot"></span> Cloud Firestore Connected (Live)
              </span>
            </div>
          </div>

          <div className="admin-nav-actions">
            <button 
              type="button" 
              onClick={loadOrders} 
              disabled={isLoading}
              className="admin-btn admin-btn-secondary"
              title="Sync latest orders from Firebase"
            >
              <span>{isLoading ? 'Syncing... ⏳' : '🔄 Refresh Data'}</span>
            </button>

            <button 
              type="button" 
              onClick={handleExportCSV} 
              className="admin-btn admin-btn-secondary"
              title="Download orders in CSV format"
            >
              <span>📥 Export CSV</span>
            </button>

            <button 
              type="button" 
              onClick={() => onNavigate && onNavigate('home')} 
              className="admin-btn admin-btn-ghost"
              title="Go to customer view"
            >
              <span>🏠 View Store</span>
            </button>

            <button 
              type="button" 
              onClick={handleLogout} 
              className="admin-btn admin-btn-danger-ghost"
              title="Lock Admin Console"
            >
              <span>🚪 Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="admin-main-wrap">

        {/* Hero Section: Welcome & KPI Grid */}
        <section className="admin-stats-section">
          <div className="admin-section-title-row">
            <div>
              <h1 className="admin-page-title">Executive Revenue & Orders Dashboard</h1>
              <p className="admin-page-subtitle">
                Real-time tracking of candidate orders, automated delivery dispatches, and customer support channels.
              </p>
            </div>
            <div className="admin-timestamp-pill">
              🕒 Local Time: {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          {/* 4 KPI Cards */}
          <div className="admin-kpi-grid">
            
            {/* Card 1: Total Revenue */}
            <div className="admin-kpi-card kpi-green">
              <div className="kpi-top">
                <span className="kpi-label">TOTAL REVENUE (INR)</span>
                <span className="kpi-icon">💰</span>
              </div>
              <div className="kpi-value text-accent">₹{metrics.totalRev.toLocaleString('en-IN')}</div>
              <div className="kpi-subtext">
                Average Order Value: <strong>₹{metrics.aov}</strong>
              </div>
            </div>

            {/* Card 2: Total Orders */}
            <div className="admin-kpi-card kpi-blue">
              <div className="kpi-top">
                <span className="kpi-label">TOTAL VERIFIED ORDERS</span>
                <span className="kpi-icon">📦</span>
              </div>
              <div className="kpi-value">{metrics.totalOrders}</div>
              <div className="kpi-subtext">
                All-time successful customer checkouts
              </div>
            </div>

            {/* Card 3: Today's Traction */}
            <div className="admin-kpi-card kpi-purple">
              <div className="kpi-top">
                <span className="kpi-label">TODAY'S ORDERS</span>
                <span className="kpi-icon">⚡</span>
              </div>
              <div className="kpi-value text-cyan">{metrics.todayCount} <span className="kpi-small">Orders</span></div>
              <div className="kpi-subtext">
                Today's Gross: <strong>₹{metrics.todayRev.toLocaleString('en-IN')}</strong>
              </div>
            </div>

            {/* Card 4: Order Bump Uptake */}
            <div className="admin-kpi-card kpi-amber">
              <div className="kpi-top">
                <span className="kpi-label">ORDER BUMP UPTAKE</span>
                <span className="kpi-icon">🎁</span>
              </div>
              <div className="kpi-value text-amber">{metrics.totalBump} <span className="kpi-small">({metrics.bumpRate}%)</span></div>
              <div className="kpi-subtext">
                Candidates who added +₹49 bump
              </div>
            </div>

          </div>
        </section>

        {/* Filter, Search & Controls Bar */}
        <section className="admin-controls-card">
          <div className="admin-search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by customer name, 10-digit WhatsApp phone, email, or Payment ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-search-input"
            />
            {searchTerm && (
              <button 
                type="button" 
                onClick={() => setSearchTerm('')} 
                className="clear-search-btn"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="admin-filters-group">
            {/* Filter Tabs */}
            <div className="admin-tab-pills">
              <button 
                type="button" 
                className={`tab-pill ${productFilter === 'all' ? 'active' : ''}`}
                onClick={() => setProductFilter('all')}
              >
                All ({orders.length})
              </button>
              <button 
                type="button" 
                className={`tab-pill ${productFilter === 'adre-combo' ? 'active' : ''}`}
                onClick={() => setProductFilter('adre-combo')}
              >
                ADRE Combo
              </button>
              <button 
                type="button" 
                className={`tab-pill ${productFilter === 'cinemood-presets' ? 'active' : ''}`}
                onClick={() => setProductFilter('cinemood-presets')}
              >
                CineMood Presets
              </button>
              <button 
                type="button" 
                className={`tab-pill ${productFilter === 'bump-only' ? 'active' : ''}`}
                onClick={() => setProductFilter('bump-only')}
              >
                + Bump Orders ({metrics.totalBump})
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="admin-sort-wrap">
              <label htmlFor="adm-sort" className="sort-label">Sort:</label>
              <select 
                id="adm-sort"
                value={sortOption} 
                onChange={(e) => setSortOption(e.target.value)}
                className="admin-sort-select"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="amount-desc">Highest Amount</option>
                <option value="amount-asc">Lowest Amount</option>
              </select>
            </div>
          </div>
        </section>

        {/* Dynamic Bulk Action Bar (Shows when 1+ rows selected) */}
        {selectedOrderIds.size > 0 && (
          <div className="admin-bulk-toolbar animate-slideUp">
            <div className="bulk-info">
              <span className="bulk-badge">{selectedOrderIds.size}</span>
              <strong>order{selectedOrderIds.size > 1 ? 's' : ''} selected</strong>
              <span className="bulk-sep">•</span>
              <span>Total value: ₹{
                orders
                  .filter(o => selectedOrderIds.has(o.id))
                  .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0)
                  .toLocaleString('en-IN')
              }</span>
            </div>

            <div className="bulk-actions">
              <button
                type="button"
                onClick={handleOpenBulkDelete}
                className="admin-btn admin-btn-danger"
                title="Permanently remove selected orders from Firebase"
              >
                <span>🗑️ Bulk Delete Selected ({selectedOrderIds.size})</span>
              </button>

              <button
                type="button"
                onClick={handleExportCSV}
                className="admin-btn admin-btn-secondary"
                title="Export selected orders only"
              >
                <span>📥 Export Selected CSV</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedOrderIds(new Set())}
                className="admin-btn admin-btn-ghost"
              >
                ✕ Deselect All
              </button>
            </div>
          </div>
        )}

        {/* Live Orders Table */}
        <section className="admin-table-container">
          <div className="admin-table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th className="th-checkbox">
                    <input
                      type="checkbox"
                      checked={isAllFilteredSelected}
                      onChange={handleToggleSelectAll}
                      aria-label="Select all displayed orders"
                      className="admin-custom-checkbox"
                    />
                  </th>
                  <th>Order & Timestamp</th>
                  <th>Customer Information</th>
                  <th>Product Purchased</th>
                  <th>Paid Amount</th>
                  <th>Delivery & Communications</th>
                  <th className="text-right">Manage</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="table-empty-row">
                      <div className="admin-loading-spinner"></div>
                      <span>Connecting to Cloud Firestore & loading orders...</span>
                    </td>
                  </tr>
                ) : processedOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="table-empty-row">
                      {orders.length === 0 ? (
                        <div>
                          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📭</div>
                          <strong style={{ color: '#fff', fontSize: '1.1rem' }}>No orders in database yet</strong>
                          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>
                            Perform a test checkout on the storefront to record your first verified customer order!
                          </p>
                        </div>
                      ) : (
                        <div>
                          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔍</div>
                          <strong style={{ color: '#fff' }}>No orders matching "{searchTerm}"</strong>
                          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>
                            Try adjusting your search query or reset the product category filter.
                          </p>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  processedOrders.map((order) => {
                    const isSelected = selectedOrderIds.has(order.id);
                    const { product, isCinemood, bumpObj } = resolveOrderMeta(order);
                    const formattedDate = order.createdAtISO 
                      ? new Date(order.createdAtISO).toLocaleString('en-IN', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric',
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })
                      : 'Recent';

                    const isSendingThisEmail = emailSendingId === order.id;

                    return (
                      <tr key={order.id} className={isSelected ? 'row-selected' : ''}>
                        {/* Checkbox */}
                        <td className="td-checkbox">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelectOrder(order.id)}
                            aria-label={`Select order ${order.paymentId}`}
                            className="admin-custom-checkbox"
                          />
                        </td>

                        {/* Order & Date */}
                        <td className="td-order-meta">
                          <div className="order-date-text">{formattedDate}</div>
                          <div className="order-id-badge" title={order.paymentId}>
                            <code>{order.paymentId || 'pay_preview'}</code>
                          </div>
                          <span className="gateway-pill">
                            {order.gateway === 'cashfree' ? '🔒 Cashfree' : '💳 Online Payment'}
                          </span>
                        </td>

                        {/* Customer Info */}
                        <td className="td-customer">
                          <div className="customer-name-row">
                            <span className="customer-avatar">
                              {(order.name || 'U').charAt(0).toUpperCase()}
                            </span>
                            <strong className="customer-name">{order.name || 'Valued Learner'}</strong>
                          </div>
                          <div className="customer-sub-row">
                            <a 
                              href={`tel:${order.phone}`} 
                              className="customer-phone-link"
                              title="Call customer"
                            >
                              📞 +91 {order.phone}
                            </a>
                            <span className="dot-sep">•</span>
                            <a 
                              href={`mailto:${order.email}`} 
                              className="customer-email-link"
                              title="Send direct email"
                            >
                              ✉️ {order.email}
                            </a>
                          </div>
                        </td>

                        {/* Product & Add-on */}
                        <td className="td-product">
                          <div className="product-title-row">
                            <span className={`prod-type-dot ${isCinemood ? 'dot-blue' : 'dot-green'}`}></span>
                            <span className="prod-title">{order.productName || product.name}</span>
                          </div>
                          {order.orderBumpSelected && (
                            <div className="bump-tag-active">
                              <span>🎁 ADDON: {order.orderBumpName || bumpObj.shortName || 'CTET MCQ Ebook'}</span>
                            </div>
                          )}
                        </td>

                        {/* Amount */}
                        <td className="td-amount">
                          <div className="amount-highlight">₹{order.totalAmount || product.price}</div>
                          <div className="paid-status-tag">✓ VERIFIED PAID</div>
                        </td>

                        {/* Delivery & Share Actions (WhatsApp & Email) */}
                        <td className="td-comms">
                          <div className="comms-btn-group">
                            {/* WhatsApp Button */}
                            <button
                              type="button"
                              onClick={() => handleOpenWhatsAppModal(order)}
                              className="action-pill-btn btn-wa"
                              title="Share Google Drive download link on WhatsApp"
                            >
                              <span className="btn-icon">💬</span>
                              <span>WhatsApp</span>
                            </button>

                            {/* Resend Email Button */}
                            <button
                              type="button"
                              onClick={() => handleSendEmail(order)}
                              disabled={isSendingThisEmail}
                              className="action-pill-btn btn-mail"
                              title="Dispatch instant access backup email to customer"
                            >
                              <span className="btn-icon">✉️</span>
                              <span>{isSendingThisEmail ? 'Sending... ⏳' : 'Send Mail'}</span>
                            </button>
                          </div>
                        </td>

                        {/* Delete Action */}
                        <td className="td-actions text-right">
                          <button
                            type="button"
                            onClick={() => handleOpenSingleDelete(order)}
                            className="btn-delete-icon"
                            title="Delete this order permanently"
                            aria-label="Delete order"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer Count */}
          <div className="admin-table-footer">
            <span>Showing <strong>{processedOrders.length}</strong> of <strong>{orders.length}</strong> total orders</span>
            {selectedOrderIds.size > 0 && (
              <span className="selected-summary-count">({selectedOrderIds.size} selected)</span>
            )}
          </div>
        </section>

      </main>

      {/* ========================================================
          CONFIRMATION MODAL: DELETE (SINGLE / BULK)
         ======================================================== */}
      {deleteModalState.isOpen && (
        <div className="admin-modal-backdrop animate-fadeIn">
          <div className="admin-modal-card">
            <div className="admin-modal-header danger-header">
              <div className="danger-icon-circle">⚠️</div>
              <div>
                <h3 className="modal-title">
                  {deleteModalState.isBulk ? 'Bulk Delete Orders' : 'Delete Order Record'}
                </h3>
                <span className="modal-sub">This action permanently deletes records from Cloud Firestore.</span>
              </div>
            </div>

            <div className="admin-modal-body">
              {deleteModalState.isBulk ? (
                <p>
                  Are you sure you want to permanently delete <strong>{selectedOrderIds.size} selected orders</strong>? 
                  Once deleted, customer access can only be retrieved if you re-enter their record manually.
                </p>
              ) : (
                <div>
                  <p>Are you sure you want to delete the order for <strong>{deleteModalState.order?.name}</strong>?</p>
                  <div className="modal-detail-strip">
                    <div>• <strong>Amount:</strong> ₹{deleteModalState.order?.totalAmount}</div>
                    <div>• <strong>Phone:</strong> +91 {deleteModalState.order?.phone}</div>
                    <div>• <strong>Payment ID:</strong> {deleteModalState.order?.paymentId}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="admin-modal-actions">
              <button
                type="button"
                onClick={() => setDeleteModalState({ isOpen: false, order: null, isBulk: false })}
                disabled={isDeleting}
                className="admin-btn admin-btn-ghost"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="admin-btn admin-btn-danger"
              >
                <span>{isDeleting ? 'Deleting from Firestore... ⏳' : 'Yes, Delete Permanently'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: WHATSAPP SHARING PREVIEW
         ======================================================== */}
      {whatsappModalState.isOpen && whatsappModalState.order && (
        <div className="admin-modal-backdrop animate-fadeIn">
          <div className="admin-modal-card whatsapp-preview-modal">
            <div className="admin-modal-header wa-header">
              <div className="wa-icon-circle">💬</div>
              <div>
                <h3 className="modal-title">Send Access Links via WhatsApp</h3>
                <span className="modal-sub">To: {whatsappModalState.order.name} (+91 {whatsappModalState.order.phone})</span>
              </div>
            </div>

            <div className="admin-modal-body">
              <div className="wa-preview-note">
                The customer will receive the verified Google Drive folder download link and portal login details:
              </div>

              <textarea
                readOnly
                rows={11}
                value={whatsappModalState.messageText}
                className="wa-message-textarea"
              />
            </div>

            <div className="admin-modal-actions">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(whatsappModalState.messageText);
                  showToast('✓ WhatsApp message copied to clipboard!', 'success');
                }}
                className="admin-btn admin-btn-secondary"
              >
                📋 Copy Message
              </button>

              <button
                type="button"
                onClick={() => setWhatsappModalState({ isOpen: false, order: null, messageText: '', waUrl: '' })}
                className="admin-btn admin-btn-ghost"
              >
                Close
              </button>

              <a
                href={whatsappModalState.waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setWhatsappModalState({ isOpen: false, order: null, messageText: '', waUrl: '' });
                  showToast(`✓ Opening WhatsApp for ${whatsappModalState.order.name}...`, 'success');
                }}
                className="admin-btn admin-btn-wa"
              >
                <span>🚀 Open in WhatsApp Web / App →</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          FLOATING TOAST NOTIFICATION
         ======================================================== */}
      {toast.show && (
        <div className={`admin-toast-pill toast-${toast.type} animate-slideUp`}>
          <span>{toast.message}</span>
        </div>
      )}

    </div>
  );
}
