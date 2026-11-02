import React, { useState, useEffect } from 'react';
import { fetchAllOrdersForAdmin } from '../firebase';

export default function AdminDashboard({ onNavigate }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Admin Master Password (can be changed anytime)
  const ADMIN_PASSWORD = 'admin@projukti2026';

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD || passwordInput === 'projukti@2026') {
      setIsAuthenticated(true);
      setLoginError('');
      loadOrders();
    } else {
      setLoginError('Invalid Admin Password. Access Denied.');
    }
  };

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllOrdersForAdmin();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const q = searchTerm.toLowerCase();
    return (
      (order.name || '').toLowerCase().includes(q) ||
      (order.email || '').toLowerCase().includes(q) ||
      (order.phone || '').includes(q) ||
      (order.paymentId || '').toLowerCase().includes(q)
    );
  });

  // Calculate Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const totalBumpOrders = orders.filter((o) => o.orderBumpSelected).length;
  const bumpRate = orders.length > 0 ? ((totalBumpOrders / orders.length) * 100).toFixed(1) : 0;

  // Export to CSV
  const handleExportCSV = () => {
    if (orders.length === 0) return;
    const headers = ['Order ID', 'Customer Name', 'Email', 'WhatsApp Phone', 'Product', 'Order Bump Included', 'Amount (INR)', 'Payment Gateway', 'Date Time'];
    
    const rows = orders.map(o => [
      o.paymentId || '',
      `"${o.name || ''}"`,
      o.email || '',
      o.phone || '',
      `"${o.productName || ''}"`,
      o.orderBumpSelected ? 'YES' : 'NO',
      o.totalAmount || 0,
      o.gateway || 'cashfree',
      o.createdAtISO || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `projuktisoft_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ========================================================
  // LOGIN SCREEN (PASSWORD PROTECTED)
  // ========================================================
  if (!isAuthenticated) {
    return (
      <div className="policy-page-wrapper">
        <div className="container" style={{ maxWidth: '440px' }}>
          <div className="policy-card text-center" style={{ padding: '36px 24px' }}>
            <img src="/logo.png" alt="ProjuktiSoft" style={{ width: '48px', height: '48px', margin: '0 auto 12px' }} />
            <h2 style={{ color: '#fff', fontSize: '1.6rem', marginBottom: '6px' }}>ProjuktiSoft Admin</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '22px' }}>
              Authorized management portal for orders & customer data.
            </p>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input
                type="password"
                required
                placeholder="Enter Admin Master Password"
                className="p-input"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
              />

              {loginError && (
                <div style={{ color: '#ef4444', fontSize: '0.82rem', fontWeight: 600 }}>
                  {loginError}
                </div>
              )}

              <button type="submit" className="btn-primary-cta" style={{ width: '100%', padding: '12px' }}>
                <span>Login to Dashboard →</span>
              </button>
            </form>

            <div style={{ marginTop: '20px' }}>
              <a 
                href="/" 
                onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('home'); }}
                style={{ color: '#64748b', fontSize: '0.8rem', textDecoration: 'none' }}
              >
                ← Return to Storefront
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // ADMIN DASHBOARD (AUTHENTICATED)
  // ========================================================
  return (
    <div className="policy-page-wrapper" style={{ minHeight: '100vh', padding: '30px 14px' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '26px' }}>
          <div>
            <span style={{ color: '#8ac926', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '1px' }}>PROJUKTISOFT ADMIN</span>
            <h1 style={{ color: '#fff', fontSize: '1.9rem', margin: '4px 0 0', fontFamily: 'Poppins, sans-serif' }}>
              Live Orders & Customer Database
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="button" 
              onClick={loadOrders} 
              className="btn-sample-cta" 
              style={{ width: 'auto', padding: '8px 16px', fontSize: '0.85rem' }}
            >
              🔄 Refresh
            </button>
            <button 
              type="button" 
              onClick={handleExportCSV} 
              className="btn-primary-cta" 
              style={{ width: 'auto', padding: '8px 18px', fontSize: '0.85rem' }}
            >
              📥 Export CSV
            </button>
            <button 
              type="button" 
              onClick={() => setIsAuthenticated(false)} 
              className="btn-sample-cta" 
              style={{ width: 'auto', padding: '8px 14px', fontSize: '0.85rem', color: '#ef4444' }}
            >
              Logout
            </button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '26px' }}>
          <div style={{ background: 'rgba(10, 20, 26, 0.95)', border: '1px solid rgba(138, 201, 38, 0.3)', borderRadius: '14px', padding: '18px' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.82rem', fontWeight: 600 }}>TOTAL REVENUE</div>
            <div style={{ color: '#8ac926', fontSize: '1.9rem', fontWeight: 900, marginTop: '4px' }}>₹{totalRevenue.toLocaleString('en-IN')}</div>
            <div style={{ color: '#64748b', fontSize: '0.74rem', marginTop: '4px' }}>From all completed checkouts</div>
          </div>

          <div style={{ background: 'rgba(10, 20, 26, 0.95)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '14px', padding: '18px' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.82rem', fontWeight: 600 }}>TOTAL BUYERS</div>
            <div style={{ color: '#fff', fontSize: '1.9rem', fontWeight: 900, marginTop: '4px' }}>{orders.length}</div>
            <div style={{ color: '#64748b', fontSize: '0.74rem', marginTop: '4px' }}>Verified candidate records</div>
          </div>

          <div style={{ background: 'rgba(10, 20, 26, 0.95)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '14px', padding: '18px' }}>
            <div style={{ color: '#fbbf24', fontSize: '0.82rem', fontWeight: 600 }}>CTET ADD-ON TAKERS</div>
            <div style={{ color: '#f59e0b', fontSize: '1.9rem', fontWeight: 900, marginTop: '4px' }}>{totalBumpOrders} <span style={{ fontSize: '1.1rem', color: '#94a3b8' }}>({bumpRate}%)</span></div>
            <div style={{ color: '#64748b', fontSize: '0.74rem', marginTop: '4px' }}>Took +₹49 CTET order bump</div>
          </div>

          <div style={{ background: 'rgba(10, 20, 26, 0.95)', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '14px', padding: '18px' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.82rem', fontWeight: 600 }}>DATABASE STATUS</div>
            <div style={{ color: '#10b981', fontSize: '1.3rem', fontWeight: 800, marginTop: '8px' }}>● Cloud Firestore Live</div>
            <div style={{ color: '#64748b', fontSize: '0.74rem', marginTop: '4px' }}>Auto-syncing every payment</div>
          </div>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: '18px' }}>
          <input
            type="text"
            placeholder="Search by customer name, phone number, email, or Payment ID..."
            className="p-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: '480px' }}
          />
        </div>

        {/* Orders Table */}
        <div style={{ background: 'rgba(10, 20, 26, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '14px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '780px', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)', background: 'rgba(255, 255, 255, 0.03)' }}>
                <th style={{ padding: '12px 14px', color: '#94a3b8', fontWeight: 600 }}>Date</th>
                <th style={{ padding: '12px 14px', color: '#94a3b8', fontWeight: 600 }}>Customer Name</th>
                <th style={{ padding: '12px 14px', color: '#94a3b8', fontWeight: 600 }}>WhatsApp Phone</th>
                <th style={{ padding: '12px 14px', color: '#94a3b8', fontWeight: 600 }}>Email Address</th>
                <th style={{ padding: '12px 14px', color: '#94a3b8', fontWeight: 600 }}>Product & Add-on</th>
                <th style={{ padding: '12px 14px', color: '#94a3b8', fontWeight: 600 }}>Amount</th>
                <th style={{ padding: '12px 14px', color: '#94a3b8', fontWeight: 600 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7" style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>
                    Loading orders from Firebase... ⏳
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                    {orders.length === 0 ? 'No orders recorded yet. Complete a checkout test to see your first live order!' : 'No orders matched your search query.'}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order, i) => {
                  const dateStr = order.createdAtISO 
                    ? new Date(order.createdAtISO).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
                    : 'Recent';
                  const waLink = `https://wa.me/91${order.phone}?text=${encodeURIComponent(`Hello ${order.name}, thank you for purchasing from ProjuktiSoft! Your digital bundle is accessible anytime here: https://projuktisoft.shop/my-downloads`)}`;

                  return (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <td style={{ padding: '12px 14px', color: '#64748b', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                        {dateStr}
                      </td>
                      <td style={{ padding: '12px 14px', color: '#fff', fontWeight: 600 }}>
                        {order.name}
                      </td>
                      <td style={{ padding: '12px 14px', color: '#8ac926', fontWeight: 600 }}>
                        {order.phone}
                      </td>
                      <td style={{ padding: '12px 14px', color: '#cbd5e1' }}>
                        {order.email}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ color: '#fff' }}>{order.productName}</span>
                        {order.orderBumpSelected && (
                          <span style={{ marginLeft: '6px', background: '#f59e0b', color: '#000', fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                            + CTET EBOOK
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '12px 14px', color: '#8ac926', fontWeight: 800, fontSize: '0.95rem' }}>
                        ₹{order.totalAmount}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: '#25D366',
                            color: '#000',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            textDecoration: 'none'
                          }}
                        >
                          💬 WhatsApp
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
