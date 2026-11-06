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
import AdminProductManager from '../components/AdminProductManager';
import AdminFunnelBuilder from '../components/AdminFunnelBuilder';
import { funnelManager } from '../data/funnelManager';

export default function AdminDashboard({ onNavigate }) {
  // Navigation Tabs: 'builder', 'products', 'orders'
  const [activeAdminTab, setActiveAdminTab] = useState(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      const tabParam = p.get('tab');
      if (tabParam && ['builder', 'products', 'orders'].includes(tabParam)) return tabParam;
    } catch (e) {}
    return 'builder'; // Default directly to Funnel Builder so admin immediately sees the Drag & Drop editor
  });
  const [builderSelectedProduct, setBuilderSelectedProduct] = useState(null);

  const handleSelectProductForBuilder = (product) => {
    setBuilderSelectedProduct(product);
    setActiveAdminTab('builder');
  };

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

  // Time Period & Analytics Controls
  // 'today', 'yesterday', 'this-week', 'this-month', 'all-time'
  const [analyticsPeriod, setAnalyticsPeriod] = useState('today');
  // 'revenue', 'orders'
  const [chartMetric, setChartMetric] = useState('revenue');
  // Interactive Hovered Bar state for chart tooltip
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);
  // Option to filter table to match active analytics period
  const [filterTableByPeriod, setFilterTableByPeriod] = useState(false);

  // Filter & Search Controls for Orders Table
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

  // ========================================================
  // TIME PERIOD CALCULATIONS & GRAPH ANALYTICS
  // ========================================================
  const dateRanges = useMemo(() => {
    const now = new Date();

    // Today (00:00:00 to 23:59:59)
    const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    // Yesterday (00:00:00 to 23:59:59)
    const startYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0, 0);
    const endYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59, 999);

    // Day Before Yesterday (for comparing Yesterday)
    const startDayBefore = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 0, 0, 0, 0);
    const endDayBefore = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 23, 59, 59, 999);

    // This Week: Last 7 Days (6 days ago to today)
    const startThisWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6, 0, 0, 0, 0);
    // Previous Week (7 to 13 days ago)
    const startPrevWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 13, 0, 0, 0, 0);
    const endPrevWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7, 23, 59, 59, 999);

    // This Month: 1st of current month to today
    const startThisMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    // Previous Month: 1st to last day of last month
    const startPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
    const endPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    return {
      startToday, endToday,
      startYesterday, endYesterday,
      startDayBefore, endDayBefore,
      startThisWeek, startPrevWeek, endPrevWeek,
      startThisMonth, startPrevMonth, endPrevMonth
    };
  }, []);

  // Filter orders strictly by active analytics period
  const periodOrders = useMemo(() => {
    return orders.filter(order => {
      const orderTime = new Date(order.createdAtISO || 0).getTime();
      if (analyticsPeriod === 'today') {
        return orderTime >= dateRanges.startToday.getTime() && orderTime <= dateRanges.endToday.getTime();
      }
      if (analyticsPeriod === 'yesterday') {
        return orderTime >= dateRanges.startYesterday.getTime() && orderTime <= dateRanges.endYesterday.getTime();
      }
      if (analyticsPeriod === 'this-week') {
        return orderTime >= dateRanges.startThisWeek.getTime() && orderTime <= dateRanges.endToday.getTime();
      }
      if (analyticsPeriod === 'this-month') {
        return orderTime >= dateRanges.startThisMonth.getTime() && orderTime <= dateRanges.endToday.getTime();
      }
      return true; // 'all-time'
    });
  }, [orders, analyticsPeriod, dateRanges]);

  // Comparative Period Statistics (e.g. Today vs Yesterday)
  const periodStats = useMemo(() => {
    let prevOrders = [];
    let compareLabel = 'vs Yesterday';

    if (analyticsPeriod === 'today') {
      prevOrders = orders.filter(o => {
        const t = new Date(o.createdAtISO || 0).getTime();
        return t >= dateRanges.startYesterday.getTime() && t <= dateRanges.endYesterday.getTime();
      });
      compareLabel = 'vs Yesterday';
    } else if (analyticsPeriod === 'yesterday') {
      prevOrders = orders.filter(o => {
        const t = new Date(o.createdAtISO || 0).getTime();
        return t >= dateRanges.startDayBefore.getTime() && t <= dateRanges.endDayBefore.getTime();
      });
      compareLabel = 'vs Day Before';
    } else if (analyticsPeriod === 'this-week') {
      prevOrders = orders.filter(o => {
        const t = new Date(o.createdAtISO || 0).getTime();
        return t >= dateRanges.startPrevWeek.getTime() && t <= dateRanges.endPrevWeek.getTime();
      });
      compareLabel = 'vs Previous 7 Days';
    } else if (analyticsPeriod === 'this-month') {
      prevOrders = orders.filter(o => {
        const t = new Date(o.createdAtISO || 0).getTime();
        return t >= dateRanges.startPrevMonth.getTime() && t <= dateRanges.endPrevMonth.getTime();
      });
      compareLabel = 'vs Last Month';
    } else {
      compareLabel = 'All-time lifetime metrics';
    }

    const currentRev = periodOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
    const prevRev = prevOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
    const currentOrders = periodOrders.length;
    const prevOrdersCount = prevOrders.length;

    const currentBump = periodOrders.filter(o => o.orderBumpSelected).length;
    const bumpRate = currentOrders > 0 ? ((currentBump / currentOrders) * 100).toFixed(1) : '0';
    const aov = currentOrders > 0 ? Math.round(currentRev / currentOrders) : 0;

    // Calculate growth percentages
    const calcGrowth = (curr, prev) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return Math.round(((curr - prev) / prev) * 100);
    };

    const revGrowth = calcGrowth(currentRev, prevRev);
    const orderGrowth = calcGrowth(currentOrders, prevOrdersCount);

    return {
      currentRev,
      prevRev,
      currentOrders,
      prevOrdersCount,
      currentBump,
      bumpRate,
      aov,
      compareLabel,
      revGrowth,
      orderGrowth
    };
  }, [orders, periodOrders, analyticsPeriod, dateRanges]);

  // Visual Graph Timeline Intervals Generator
  const chartIntervals = useMemo(() => {
    // 1. TODAY & YESTERDAY: 8 Hourly blocks (every 3 hours)
    if (analyticsPeriod === 'today' || analyticsPeriod === 'yesterday') {
      const isToday = analyticsPeriod === 'today';
      const base = isToday ? dateRanges.startToday : dateRanges.startYesterday;

      const blocks = [
        { label: '12 AM', startH: 0, endH: 3 },
        { label: '3 AM', startH: 3, endH: 6 },
        { label: '6 AM', startH: 6, endH: 9 },
        { label: '9 AM', startH: 9, endH: 12 },
        { label: '12 PM', startH: 12, endH: 15 },
        { label: '3 PM', startH: 15, endH: 18 },
        { label: '6 PM', startH: 18, endH: 21 },
        { label: '9 PM', startH: 21, endH: 24 }
      ];

      return blocks.map((b) => {
        const slotStart = new Date(base.getFullYear(), base.getMonth(), base.getDate(), b.startH, 0, 0, 0).getTime();
        const slotEnd = new Date(base.getFullYear(), base.getMonth(), base.getDate(), b.endH, 0, 0, 0).getTime();

        const inSlot = periodOrders.filter(o => {
          const t = new Date(o.createdAtISO || 0).getTime();
          return t >= slotStart && t < slotEnd;
        });

        const rev = inSlot.reduce((s, o) => s + (Number(o.totalAmount) || 0), 0);
        return {
          title: b.label,
          subtitle: `${b.startH}:00 - ${b.endH}:00`,
          revenue: rev,
          orders: inSlot.length
        };
      });
    }

    // 2. THIS WEEK: 7 Daily Columns (6 days ago to Today)
    if (analyticsPeriod === 'this-week') {
      const now = new Date();
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
        const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0).getTime();
        const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999).getTime();

        const inDay = periodOrders.filter(o => {
          const t = new Date(o.createdAtISO || 0).getTime();
          return t >= start && t <= end;
        });

        const rev = inDay.reduce((s, o) => s + (Number(o.totalAmount) || 0), 0);
        const dayLabel = i === 0 ? 'Today' : d.toLocaleDateString('en-IN', { weekday: 'short' });
        const dateSub = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

        days.push({
          title: dayLabel,
          subtitle: dateSub,
          revenue: rev,
          orders: inDay.length
        });
      }
      return days;
    }

    // 3. THIS MONTH: Daily bars from 1st of month to Current Date
    if (analyticsPeriod === 'this-month') {
      const now = new Date();
      const currentDay = now.getDate();
      const days = [];

      for (let day = 1; day <= currentDay; day++) {
        const start = new Date(now.getFullYear(), now.getMonth(), day, 0, 0, 0, 0).getTime();
        const end = new Date(now.getFullYear(), now.getMonth(), day, 23, 59, 59, 999).getTime();

        const inDay = periodOrders.filter(o => {
          const t = new Date(o.createdAtISO || 0).getTime();
          return t >= start && t <= end;
        });

        const rev = inDay.reduce((s, o) => s + (Number(o.totalAmount) || 0), 0);
        days.push({
          title: `${day}`,
          subtitle: `${day} ${now.toLocaleDateString('en-IN', { month: 'short' })}`,
          revenue: rev,
          orders: inDay.length
        });
      }
      return days;
    }

    // 4. ALL TIME: Last 6 Months
    const now = new Date();
    const months = [];
    for (let m = 5; m >= 0; m--) {
      const d = new Date(now.getFullYear(), now.getMonth() - m, 1);
      const start = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0).getTime();
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999).getTime();

      const inMonth = periodOrders.filter(o => {
        const t = new Date(o.createdAtISO || 0).getTime();
        return t >= start && t <= end;
      });

      const rev = inMonth.reduce((s, o) => s + (Number(o.totalAmount) || 0), 0);
      months.push({
        title: d.toLocaleDateString('en-IN', { month: 'short' }),
        subtitle: `${d.getFullYear()}`,
        revenue: rev,
        orders: inMonth.length
      });
    }
    return months;
  }, [analyticsPeriod, periodOrders, dateRanges]);

  // Product Distribution Breakdown for Active Period
  const productDistribution = useMemo(() => {
    let adreRev = 0, adreCount = 0;
    let cinemoodRev = 0, cinemoodCount = 0;
    let bumpRev = 0, bumpCount = 0;

    periodOrders.forEach(o => {
      const isCinemood = (o.productId || '').includes('cinemood') || (o.productName || '').toLowerCase().includes('preset') || (o.productName || '').toLowerCase().includes('cinemood');
      const amt = Number(o.totalAmount) || 0;

      if (o.orderBumpSelected) {
        bumpRev += 49;
        bumpCount += 1;
      }

      if (isCinemood) {
        cinemoodCount += 1;
        cinemoodRev += (amt - (o.orderBumpSelected ? 49 : 0));
      } else {
        adreCount += 1;
        adreRev += (amt - (o.orderBumpSelected ? 49 : 0));
      }
    });

    const totalPeriodRev = periodOrders.reduce((s, o) => s + (Number(o.totalAmount) || 0), 0) || 1;

    return {
      adre: { rev: adreRev, count: adreCount, pct: Math.round((adreRev / totalPeriodRev) * 100) },
      cinemood: { rev: cinemoodRev, count: cinemoodCount, pct: Math.round((cinemoodRev / totalPeriodRev) * 100) },
      bump: { rev: bumpRev, count: bumpCount, pct: Math.round((bumpRev / totalPeriodRev) * 100) }
    };
  }, [periodOrders]);

  // Find Maximum Value in Active Chart for scaling
  const chartMax = useMemo(() => {
    const values = chartIntervals.map(i => chartMetric === 'revenue' ? i.revenue : i.orders);
    const maxVal = Math.max(...values, 0);
    if (chartMetric === 'revenue') {
      return maxVal > 0 ? maxVal : 500;
    }
    return maxVal > 0 ? maxVal : 5;
  }, [chartIntervals, chartMetric]);

  // ========================================================
  // FILTERED & SORTED ORDERS FOR TABLE VIEW
  // ========================================================
  const processedOrders = useMemo(() => {
    let result = filterTableByPeriod ? [...periodOrders] : [...orders];

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
  }, [orders, periodOrders, filterTableByPeriod, searchTerm, productFilter, sortOption]);

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
            Authorized management access for revenue analytics, customer dispatches, and Firestore database records.
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

      {/* Admin Module Navigation Tabs Bar */}
      <nav className="admin-nav-tabs-bar">
        <div className="container admin-nav-tabs-container">
          <button
            type="button"
            className={`admin-nav-tab ${activeAdminTab === 'builder' ? 'active' : ''}`}
            onClick={() => setActiveAdminTab('builder')}
          >
            <span>🎨 Funnel Page Builder</span>
            <span className="admin-tab-pill">Drag &amp; Drop</span>
          </button>

          <button
            type="button"
            className={`admin-nav-tab ${activeAdminTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveAdminTab('products')}
          >
            <span>📦 Products &amp; Pricing</span>
            <span className="admin-tab-pill" style={{ background: '#3b82f6' }}>+ New Page</span>
          </button>

          <button
            type="button"
            className={`admin-nav-tab ${activeAdminTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveAdminTab('orders')}
          >
            <span>📊 Orders &amp; Analytics</span>
            <span className="admin-tab-count">{orders.length}</span>
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="admin-main-wrap">
        
        {/* TAB 1: FUNNEL BUILDER */}
        {activeAdminTab === 'builder' && (
          <AdminFunnelBuilder 
            initialProduct={builderSelectedProduct} 
            onNavigate={onNavigate} 
            showToast={showToast} 
          />
        )}

        {/* TAB 2: PRODUCT & PRICING MANAGER */}
        {activeAdminTab === 'products' && (
          <AdminProductManager 
            onSelectProductForBuilder={handleSelectProductForBuilder} 
            onNavigate={onNavigate} 
            showToast={showToast} 
          />
        )}

        {/* TAB 3: ORDERS & REVENUE ANALYTICS */}
        {activeAdminTab === 'orders' && (
          <>
        {/* ========================================================
            PERIOD FILTER SELECTOR & TOP EXECUTIVE STATS
           ======================================================== */}
        <section className="admin-period-bar-section">
          <div className="admin-period-bar-wrap">
            <div className="admin-period-title-block">
              <span className="admin-section-tag">EXECUTIVE PERFORMANCE METRICS</span>
              <h1 className="admin-page-title">Revenue & Order Analytics</h1>
            </div>

            {/* Time Filter Pills: Today, Yesterday, This Week, This Month, All Time */}
            <div className="admin-time-filter-pills">
              <button
                type="button"
                onClick={() => { setAnalyticsPeriod('today'); setHoveredBarIndex(null); }}
                className={`time-filter-pill ${analyticsPeriod === 'today' ? 'active' : ''}`}
              >
                <span>⚡ Today</span>
              </button>

              <button
                type="button"
                onClick={() => { setAnalyticsPeriod('yesterday'); setHoveredBarIndex(null); }}
                className={`time-filter-pill ${analyticsPeriod === 'yesterday' ? 'active' : ''}`}
              >
                <span>📅 Yesterday</span>
              </button>

              <button
                type="button"
                onClick={() => { setAnalyticsPeriod('this-week'); setHoveredBarIndex(null); }}
                className={`time-filter-pill ${analyticsPeriod === 'this-week' ? 'active' : ''}`}
              >
                <span>📊 This Week (7D)</span>
              </button>

              <button
                type="button"
                onClick={() => { setAnalyticsPeriod('this-month'); setHoveredBarIndex(null); }}
                className={`time-filter-pill ${analyticsPeriod === 'this-month' ? 'active' : ''}`}
              >
                <span>🗓️ This Month</span>
              </button>

              <button
                type="button"
                onClick={() => { setAnalyticsPeriod('all-time'); setHoveredBarIndex(null); }}
                className={`time-filter-pill ${analyticsPeriod === 'all-time' ? 'active' : ''}`}
              >
                <span>🌐 All Time</span>
              </button>
            </div>
          </div>

          {/* 4 Dynamic Period KPI Cards */}
          <div className="admin-kpi-grid">
            
            {/* KPI 1: Revenue in Period */}
            <div className="admin-kpi-card kpi-green">
              <div className="kpi-top">
                <span className="kpi-label">
                  {analyticsPeriod === 'today' ? "TODAY'S REVENUE" :
                   analyticsPeriod === 'yesterday' ? "YESTERDAY'S REVENUE" :
                   analyticsPeriod === 'this-week' ? "THIS WEEK'S REVENUE" :
                   analyticsPeriod === 'this-month' ? "THIS MONTH'S REVENUE" : "LIFETIME REVENUE"}
                </span>
                <span className="kpi-icon">💰</span>
              </div>
              <div className="kpi-value text-accent">₹{periodStats.currentRev.toLocaleString('en-IN')}</div>
              <div className="kpi-subtext">
                {analyticsPeriod !== 'all-time' ? (
                  <span className={`growth-tag ${periodStats.revGrowth >= 0 ? 'growth-up' : 'growth-down'}`}>
                    {periodStats.revGrowth >= 0 ? `▲ +${periodStats.revGrowth}%` : `▼ ${periodStats.revGrowth}%`} {periodStats.compareLabel}
                  </span>
                ) : (
                  <span>From all verified completed checkouts</span>
                )}
              </div>
            </div>

            {/* KPI 2: Orders in Period */}
            <div className="admin-kpi-card kpi-blue">
              <div className="kpi-top">
                <span className="kpi-label">
                  {analyticsPeriod === 'today' ? "TODAY'S ORDERS" :
                   analyticsPeriod === 'yesterday' ? "YESTERDAY'S ORDERS" :
                   analyticsPeriod === 'this-week' ? "THIS WEEK'S ORDERS" :
                   analyticsPeriod === 'this-month' ? "THIS MONTH'S ORDERS" : "TOTAL ORDERS"}
                </span>
                <span className="kpi-icon">📦</span>
              </div>
              <div className="kpi-value text-cyan">
                {periodStats.currentOrders} <span className="kpi-small">Orders</span>
              </div>
              <div className="kpi-subtext">
                {analyticsPeriod !== 'all-time' ? (
                  <span className={`growth-tag ${periodStats.orderGrowth >= 0 ? 'growth-up' : 'growth-down'}`}>
                    {periodStats.orderGrowth >= 0 ? `▲ +${periodStats.orderGrowth}%` : `▼ ${periodStats.orderGrowth}%`} {periodStats.compareLabel}
                  </span>
                ) : (
                  <span>All-time verified customer accounts</span>
                )}
              </div>
            </div>

            {/* KPI 3: Average Order Value (AOV) */}
            <div className="admin-kpi-card kpi-purple">
              <div className="kpi-top">
                <span className="kpi-label">AVERAGE ORDER VALUE</span>
                <span className="kpi-icon">🎯</span>
              </div>
              <div className="kpi-value">₹{periodStats.aov}</div>
              <div className="kpi-subtext">
                Basket size for {analyticsPeriod.replace('-', ' ')}
              </div>
            </div>

            {/* KPI 4: Order Bump Uptake */}
            <div className="admin-kpi-card kpi-amber">
              <div className="kpi-top">
                <span className="kpi-label">ORDER BUMP UPTAKE</span>
                <span className="kpi-icon">🎁</span>
              </div>
              <div className="kpi-value text-amber">
                {periodStats.currentBump} <span className="kpi-small">({periodStats.bumpRate}%)</span>
              </div>
              <div className="kpi-subtext">
                Candidates who added +₹49 bump
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================
            INTERACTIVE VISUAL GRAPH SECTION (REVENUE & ORDERS)
           ======================================================== */}
        <section className="admin-graph-section">
          <div className="admin-graph-card">
            
            {/* Graph Header: Title & Metric Switcher (Revenue vs Orders) */}
            <div className="graph-card-header">
              <div>
                <h3 className="graph-title">
                  {chartMetric === 'revenue' ? '📈 Revenue Trend Graph' : '📊 Order Volume Trend Graph'}
                </h3>
                <span className="graph-subtitle">
                  Showing timeline breakdown for: <strong style={{ color: '#fff' }}>
                    {analyticsPeriod === 'today' ? "Today (Hourly Slots)" :
                     analyticsPeriod === 'yesterday' ? "Yesterday (Hourly Slots)" :
                     analyticsPeriod === 'this-week' ? "This Week (Day by Day)" :
                     analyticsPeriod === 'this-month' ? "This Month (Daily Breakdown)" : "All Time (Monthly Trend)"}
                  </strong>
                </span>
              </div>

              <div className="graph-metric-toggle">
                <button
                  type="button"
                  onClick={() => setChartMetric('revenue')}
                  className={`metric-toggle-btn ${chartMetric === 'revenue' ? 'active-green' : ''}`}
                >
                  <span>💰 Revenue (₹)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChartMetric('orders')}
                  className={`metric-toggle-btn ${chartMetric === 'orders' ? 'active-blue' : ''}`}
                >
                  <span>📦 Orders Count</span>
                </button>
              </div>
            </div>

            {/* Interactive SVG Bar Chart */}
            <div className="graph-canvas-container">
              
              {/* Tooltip on Hover */}
              {hoveredBarIndex !== null && chartIntervals[hoveredBarIndex] && (
                <div className="graph-tooltip-card animate-fadeIn">
                  <div className="tooltip-title">{chartIntervals[hoveredBarIndex].title} ({chartIntervals[hoveredBarIndex].subtitle})</div>
                  <div className="tooltip-values">
                    <div>💰 <strong>₹{chartIntervals[hoveredBarIndex].revenue.toLocaleString('en-IN')}</strong> Revenue</div>
                    <div>📦 <strong>{chartIntervals[hoveredBarIndex].orders}</strong> Order{chartIntervals[hoveredBarIndex].orders !== 1 ? 's' : ''}</div>
                  </div>
                </div>
              )}

              {/* Chart Bars Grid */}
              <div className="graph-bars-flex">
                {chartIntervals.map((item, idx) => {
                  const val = chartMetric === 'revenue' ? item.revenue : item.orders;
                  const heightPercent = chartMax > 0 
                    ? Math.max(val > 0 ? (val / chartMax) * 100 : 0, val > 0 ? 6 : 2)
                    : 2;

                  const isHovered = hoveredBarIndex === idx;

                  return (
                    <div 
                      key={idx} 
                      className="graph-bar-col"
                      onMouseEnter={() => setHoveredBarIndex(idx)}
                      onMouseLeave={() => setHoveredBarIndex(null)}
                      onClick={() => setHoveredBarIndex(hoveredBarIndex === idx ? null : idx)}
                    >
                      {/* Bar Track */}
                      <div className="graph-bar-track">
                        <div 
                          className={`graph-bar-fill ${chartMetric === 'revenue' ? 'fill-revenue' : 'fill-orders'} ${isHovered ? 'bar-hovered' : ''}`}
                          style={{ height: `${heightPercent}%` }}
                        >
                          {val > 0 && (
                            <span className="graph-bar-val-pop">
                              {chartMetric === 'revenue' ? `₹${val}` : val}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* X-Axis Label */}
                      <div className="graph-axis-label" title={item.subtitle}>
                        {item.title}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chart Baseline */}
              <div className="graph-baseline-line"></div>
            </div>

            {/* Bottom Product Revenue Distribution Row */}
            <div className="graph-distribution-bar">
              <div className="dist-item">
                <span className="dist-dot dot-green"></span>
                <span>ADRE Exam Combo: <strong>₹{productDistribution.adre.rev.toLocaleString('en-IN')}</strong> ({productDistribution.adre.count} orders • {productDistribution.adre.pct}%)</span>
              </div>
              <div className="dist-item">
                <span className="dist-dot dot-blue"></span>
                <span>CineMood Presets: <strong>₹{productDistribution.cinemood.rev.toLocaleString('en-IN')}</strong> ({productDistribution.cinemood.count} orders • {productDistribution.cinemood.pct}%)</span>
              </div>
              <div className="dist-item">
                <span className="dist-dot dot-amber"></span>
                <span>Bump Add-ons (+₹49): <strong>₹{productDistribution.bump.rev.toLocaleString('en-IN')}</strong> ({productDistribution.bump.count} orders • {productDistribution.bump.pct}%)</span>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================
            SEARCH, FILTER & TABLE CONTROLS BAR
           ======================================================== */}
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
            {/* Filter Table by Period Toggle */}
            <button
              type="button"
              onClick={() => setFilterTableByPeriod(!filterTableByPeriod)}
              className={`period-table-toggle-btn ${filterTableByPeriod ? 'active' : ''}`}
              title="Toggle table between showing all orders or only selected period orders"
            >
              <span>{filterTableByPeriod ? `Filtered: ${analyticsPeriod.toUpperCase()}` : 'Viewing: ALL ORDERS'}</span>
              <span className="toggle-chip">{filterTableByPeriod ? 'Reset to All' : 'Sync to Graph'}</span>
            </button>

            {/* Filter Tabs */}
            <div className="admin-tab-pills">
              <button 
                type="button" 
                className={`tab-pill ${productFilter === 'all' ? 'active' : ''}`}
                onClick={() => setProductFilter('all')}
              >
                All Products
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
                + Bump Orders
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
                          <strong style={{ color: '#fff', fontSize: '1.1rem' }}>No orders recorded in database yet</strong>
                          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>
                            Perform a test checkout on the storefront to record your first verified customer order!
                          </p>
                        </div>
                      ) : (
                        <div>
                          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔍</div>
                          <strong style={{ color: '#fff' }}>No orders found for this view</strong>
                          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>
                            {filterTableByPeriod ? `No orders recorded during "${analyticsPeriod}". Toggle "Reset to All" above.` : 'Try adjusting your search query or reset the product category filter.'}
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
            {filterTableByPeriod && (
              <span className="selected-summary-count">(Period: {analyticsPeriod.toUpperCase()})</span>
            )}
            {selectedOrderIds.size > 0 && (
              <span className="selected-summary-count">({selectedOrderIds.size} selected)</span>
            )}
          </div>
        </section>
        </>
        )}

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
