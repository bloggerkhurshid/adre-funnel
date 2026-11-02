import React, { useState } from 'react';
import { findOrdersByEmailOrPhone } from '../firebase';
import { PRODUCTS, CTET_ORDER_BUMP, WEDDING_ORDER_BUMP } from '../data/products';

export default function MyDownloads({ onNavigate }) {
  const [queryInput, setQueryInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [foundOrders, setFoundOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    const query = queryInput.trim();
    if (!query) return;

    setIsSearching(true);
    setErrorMessage('');
    setHasSearched(true);

    try {
      const orders = await findOrdersByEmailOrPhone(query);
      setFoundOrders(orders);
      if (orders.length === 0) {
        setErrorMessage('No active order found with this Email / Phone number. Please ensure you entered the exact details used during checkout.');
      }
    } catch (err) {
      setErrorMessage('Search temporarily unavailable. Please check your connection or contact support.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="policy-page-wrapper">
      <div className="container" style={{ maxWidth: '820px' }}>
        <div className="policy-card" style={{ padding: '36px 28px' }}>
          
          <div className="text-center" style={{ marginBottom: '28px' }}>
            <span style={{ 
              background: 'rgba(138, 201, 38, 0.15)', 
              color: '#8ac926', 
              border: '1px solid rgba(138, 201, 38, 0.35)',
              padding: '4px 14px', 
              borderRadius: '20px', 
              fontSize: '0.8rem', 
              fontWeight: 700 
            }}>
              ⚡ OFFICIAL CUSTOMER ACCESS PORTAL
            </span>
            <h1 style={{ fontSize: '2.1rem', margin: '14px 0 8px', color: '#fff', fontFamily: 'Poppins, sans-serif' }}>
              Access Your Purchased Ebooks
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '580px', margin: '0 auto' }}>
              Lost your link or changed device? Enter the <strong>Email Address</strong> or <strong>WhatsApp Number</strong> used during payment to retrieve your files instantly.
            </p>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearch} style={{ maxWidth: '560px', margin: '0 auto 30px' }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input
                type="text"
                required
                placeholder="Enter Email or 10-digit WhatsApp number"
                className="p-input"
                style={{ flex: 1, minWidth: '240px' }}
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
              />
              <button
                type="submit"
                disabled={isSearching}
                className="btn-primary-cta"
                style={{ width: 'auto', padding: '12px 24px', fontSize: '1rem', whiteSpace: 'nowrap' }}
              >
                <span>{isSearching ? 'Verifying... ⏳' : 'Find My Ebooks →'}</span>
              </button>
            </div>
          </form>

          {/* Error / Not Found Message */}
          {hasSearched && errorMessage && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px dashed #ef4444',
              borderRadius: '12px',
              padding: '18px 20px',
              textAlign: 'center',
              marginBottom: '25px',
              color: '#fca5a5'
            }}>
              <p style={{ fontSize: '0.95rem', marginBottom: '10px' }}>{errorMessage}</p>
              <a
                href="/contact"
                onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('contact'); }}
                style={{ color: '#8ac926', fontWeight: 700, fontSize: '0.88rem', textDecoration: 'underline' }}
              >
                Need Help? Contact ProjuktiSoft WhatsApp & Email Support →
              </a>
            </div>
          )}

          {/* Found Orders Display */}
          {foundOrders.length > 0 && (
            <div className="found-orders-section animate-fadeIn">
              <div style={{
                background: 'rgba(138, 201, 38, 0.1)',
                border: '1px solid rgba(138, 201, 38, 0.3)',
                borderRadius: '10px',
                padding: '10px 16px',
                marginBottom: '20px',
                color: '#8ac926',
                fontWeight: 700,
                fontSize: '0.9rem'
              }}>
                ✓ {foundOrders.length} Verified Order{foundOrders.length > 1 ? 's' : ''} Found! Access your ebooks below:
              </div>

              {foundOrders.map((order, idx) => {
                const prod = PRODUCTS[order.productId] || PRODUCTS['adre-combo'];
                const hasBump = order.orderBumpSelected;
                const formattedDate = order.createdAtISO 
                  ? new Date(order.createdAtISO).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                  : 'Recent Order';

                return (
                  <div 
                    key={idx} 
                    style={{
                      background: 'rgba(10, 20, 26, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '16px',
                      padding: '24px 20px',
                      marginBottom: '22px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px', marginBottom: '16px' }}>
                      <div>
                        <strong style={{ color: '#fff', fontSize: '1.1rem' }}>{order.productName || prod.name}</strong>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '3px' }}>
                          Ordered by: <strong>{order.name}</strong> • {formattedDate}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800 }}>
                          VERIFIED PAID (₹{order.totalAmount})
                        </span>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '4px' }}>
                          TXN: {order.paymentId}
                        </div>
                      </div>
                    </div>

                    {/* Main Product Download Box */}
                    <div className="downloads-box" style={{ margin: '14px 0' }}>
                      <h3 style={{ fontSize: '1.05rem', marginBottom: '10px' }}>
                        <span>📥</span> {prod.name}
                      </h3>
                      <div className="files-list" style={{ marginBottom: '14px' }}>
                        {prod.files && prod.files.map((f, i) => (
                          <div key={i} className="file-item">
                            <span>{f}</span>
                            <span className="file-tag">VERIFIED</span>
                          </div>
                        ))}
                      </div>
                      <a
                        href={prod.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-download-primary"
                      >
                        <span>DOWNLOAD ALL FILES (GOOGLE DRIVE)</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                        </svg>
                      </a>
                    </div>

                    {/* Order Bump Download Box (If Purchased) */}
                    {hasBump && (() => {
                      const bumpObj = prod.orderBump || (order.orderBumpName?.includes('Wedding') ? WEDDING_ORDER_BUMP : CTET_ORDER_BUMP);
                      return (
                        <div className="downloads-box downloads-box-addon" style={{ margin: '18px 0 6px' }}>
                          <div className="addon-header-row">
                            <h3 style={{ fontSize: '1.05rem' }}>
                              <span>🎁</span> {order.orderBumpName || bumpObj.name}
                            </h3>
                            <span className="addon-success-pill">ORDER BUMP UNLOCKED</span>
                          </div>
                          <div className="files-list" style={{ marginBottom: '14px' }}>
                            {bumpObj.files && bumpObj.files.map((f, i) => (
                              <div key={i} className="file-item">
                                <span>{f}</span>
                                <span className="file-tag addon-tag">INCLUDED</span>
                              </div>
                            ))}
                          </div>
                          <a
                            href={bumpObj.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-download-addon"
                          >
                            <span>ACCESS & DOWNLOAD {bumpObj.shortName || bumpObj.name}</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                            </svg>
                          </a>
                        </div>
                      );
                    })()}
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <a 
              href="/" 
              onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('home'); }}
              style={{ color: '#8ac926', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}
            >
              ← Return to ProjuktiSoft Store
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}

