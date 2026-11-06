import React, { useState } from 'react';
import { funnelManager } from '../data/funnelManager';

export default function AdminProductManager({ 
  onSelectProductForBuilder, 
  onNavigate, 
  showToast 
}) {
  const [products, setProducts] = useState(() => funnelManager.getAllProducts());
  const [defaultSlug, setDefaultSlug] = useState(() => funnelManager.getDefaultSlug());
  
  // Modal State for New Product
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    price: 299,
    originalPrice: 4999,
    tagline: '',
    category: 'Digital Course & Masterclass',
    demoVideoUrl: '',
    downloadUrl: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick price editing state
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [quickPrice, setQuickPrice] = useState('');

  const refreshList = () => {
    setProducts(funnelManager.getAllProducts());
    setDefaultSlug(funnelManager.getDefaultSlug());
  };

  const handleSetDefault = async (slug) => {
    await funnelManager.setDefaultSlug(slug);
    setDefaultSlug(slug);
    refreshList();
    if (showToast) showToast(`Product '${slug}' is now the Active Homepage (/) Funnel!`, 'success');
  };

  const handleOpenModal = () => {
    setFormData({
      title: '',
      slug: '',
      price: 299,
      originalPrice: 4999,
      tagline: '',
      category: 'Digital Course & Masterclass',
      demoVideoUrl: 'https://drive.google.com/file/d/1zxeZfgmfTwdZkHMOMIoJpb9A6Qh4EJvJ/preview',
      downloadUrl: 'https://drive.google.com/drive/folders/1x5XWr2uextv3b3eSoKIpYjoWvu-nqv0n?usp=sharing'
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleTitleChange = (val) => {
    const autoSlug = val.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    setFormData(prev => ({
      ...prev,
      title: val,
      slug: prev.slug === '' || prev.slug === autoSlug.slice(0, -1) ? autoSlug : prev.slug
    }));
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.slug.trim()) errors.slug = 'URL slug is required';
    if (!formData.price || Number(formData.price) <= 0) errors.price = 'Valid price is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const cleanSlug = formData.slug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
      
      const newProduct = {
        id: cleanSlug,
        slug: cleanSlug,
        name: formData.title.trim(),
        shortName: formData.title.trim().slice(0, 30),
        tagline: formData.tagline.trim() || 'Complete Step-by-Step Training & Practice System',
        category: formData.category || 'Online Business & Training',
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice) || (Number(formData.price) * 5),
        demoVideoUrl: formData.demoVideoUrl.trim() || 'https://drive.google.com/file/d/1zxeZfgmfTwdZkHMOMIoJpb9A6Qh4EJvJ/preview',
        downloadUrl: formData.downloadUrl.trim() || 'https://drive.google.com/drive/folders/1x5XWr2uextv3b3eSoKIpYjoWvu-nqv0n?usp=sharing',
        isCustom: true
      };

      await funnelManager.saveProduct(newProduct);
      refreshList();
      setIsModalOpen(false);

      if (showToast) showToast(`Product '${newProduct.name}' created successfully!`, 'success');

      // Automatically open the Funnel Page Builder for this new product
      if (onSelectProductForBuilder) {
        onSelectProductForBuilder(newProduct);
      }
    } catch (err) {
      console.error('Error creating product:', err);
      if (showToast) showToast(`Failed to create product: ${err.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveQuickPrice = async (prod) => {
    const p = Number(quickPrice);
    if (!p || p <= 0) {
      setEditingPriceId(null);
      return;
    }

    try {
      await funnelManager.saveProduct({
        ...prod,
        price: p
      });
      refreshList();
      setEditingPriceId(null);
      if (showToast) showToast(`Price updated to ₹${p} for ${prod.name}!`, 'success');
    } catch (e) {
      if (showToast) showToast('Failed to update price', 'error');
    }
  };

  const handleDeleteProduct = async (prodId, prodName) => {
    if (prodId === defaultSlug) {
      alert('Cannot delete the active Homepage funnel! Set another product as homepage first.');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete product "${prodName}" (${prodId})?`)) {
      return;
    }

    await funnelManager.deleteProduct(prodId);
    refreshList();
    if (showToast) showToast(`Product '${prodName}' deleted.`, 'info');
  };

  return (
    <div className="admin-product-manager">
      
      {/* Top Action Header */}
      <div className="apm-header">
        <div>
          <span className="admin-section-tag">CATALOG &amp; PRICING CONTROLS</span>
          <h2 className="apm-title">Manage Products &amp; Pages</h2>
          <p className="apm-desc">
            Yahan se naye products banayein, price aur links change karein, ya kisi bhi product ko website ka <strong>Active Homepage (/)</strong> banayein.
          </p>
        </div>

        <button 
          type="button" 
          className="admin-btn admin-btn-primary"
          onClick={handleOpenModal}
        >
          <span>➕ Create New Product &amp; Page</span>
        </button>
      </div>

      {/* Products Grid */}
      <div className="apm-grid">
        {products.map((prod) => {
          const isHome = prod.id === defaultSlug || prod.slug === defaultSlug;
          const isQuickEditing = editingPriceId === prod.id;

          return (
            <div key={prod.id} className={`apm-card ${isHome ? 'apm-card-home' : ''}`}>
              
              {/* Card Header & Badges */}
              <div className="apm-card-top">
                <div className="apm-badge-group">
                  {isHome && (
                    <span className="apm-pill-home">⭐ ACTIVE HOMEPAGE (/)</span>
                  )}
                  <span className="apm-pill-slug">/{prod.id}</span>
                </div>

                <div className="apm-card-actions-mini">
                  <a 
                    href={`/${prod.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="apm-btn-icon"
                    title="Open live page in new tab"
                  >
                    ↗️
                  </a>
                  {!isHome && prod.isCustom && (
                    <button
                      type="button"
                      className="apm-btn-icon text-danger"
                      onClick={() => handleDeleteProduct(prod.id, prod.name)}
                      title="Delete this custom product"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>

              {/* Title & Tagline */}
              <h3 className="apm-prod-title">{prod.name}</h3>
              <p className="apm-prod-tagline">{prod.tagline || 'No tagline specified'}</p>

              {/* Pricing Box */}
              <div className="apm-price-row">
                <div className="apm-price-block">
                  <span className="apm-price-label">PRICE:</span>
                  {isQuickEditing ? (
                    <div className="apm-price-edit-group">
                      <span className="apm-curr">₹</span>
                      <input 
                        type="number"
                        className="apm-price-input"
                        value={quickPrice}
                        onChange={(e) => setQuickPrice(e.target.value)}
                        autoFocus
                      />
                      <button 
                        type="button" 
                        className="apm-btn-save-sm"
                        onClick={() => handleSaveQuickPrice(prod)}
                      >
                        ✓
                      </button>
                      <button 
                        type="button" 
                        className="apm-btn-cancel-sm"
                        onClick={() => setEditingPriceId(null)}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="apm-price-val-wrap" onClick={() => { setEditingPriceId(prod.id); setQuickPrice(prod.price); }} title="Click to edit price">
                      <span className="apm-curr">₹</span>
                      <span className="apm-val">{prod.price}</span>
                      <del className="apm-old">₹{prod.originalPrice}</del>
                      <span className="apm-edit-hint">✏️ Edit</span>
                    </div>
                  )}
                </div>

                <div className="apm-discount-pill">
                  {prod.discountPercent || '80% OFF'}
                </div>
              </div>

              {/* Info Rows */}
              <div className="apm-meta-box">
                <div className="apm-meta-line">
                  <span className="meta-k">🎬 Demo Video:</span>
                  <span className="meta-v" title={prod.demoVideoUrl || 'None'}>
                    {prod.demoVideoUrl?.includes('drive.google.com') ? 'Google Drive Stream' : 
                     prod.demoVideoUrl?.includes('youtube') ? 'YouTube Player' : 'Configured'}
                  </span>
                </div>
                <div className="apm-meta-line">
                  <span className="meta-k">📥 Download:</span>
                  <span className="meta-v" title={prod.downloadUrl || 'None'}>
                    {prod.downloadUrl ? 'Google Drive Folder' : 'Configured'}
                  </span>
                </div>
              </div>

              {/* Bottom Buttons */}
              <div className="apm-bottom-actions">
                <button
                  type="button"
                  className="apm-btn-builder"
                  onClick={() => onSelectProductForBuilder && onSelectProductForBuilder(prod)}
                >
                  <span>🎨 Edit Funnel Page (Drag &amp; Drop) →</span>
                </button>

                {!isHome ? (
                  <button
                    type="button"
                    className="apm-btn-set-home"
                    onClick={() => handleSetDefault(prod.id)}
                    title="Make this page appear at root URL /"
                  >
                    <span>🏠 Set as Home (/)</span>
                  </button>
                ) : (
                  <span className="apm-home-status">✓ Currently at Root (/)</span>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* ========================================================
          CREATE NEW PRODUCT MODAL
         ======================================================== */}
      {isModalOpen && (
        <div className="admin-modal-overlay animate-fadeIn" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal-card apm-modal-card" onClick={(e) => e.stopPropagation()}>
            
            <div className="admin-modal-header">
              <div>
                <span className="modal-category">NEW PRODUCT FUNNEL</span>
                <h3 className="admin-modal-title">Create Product &amp; Landing Page</h3>
              </div>
              <button 
                type="button" 
                className="admin-modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="apm-modal-form">
              
              {/* Product Title */}
              <div className="form-group">
                <label className="form-label">
                  Product Title / Name <span className="req">*</span>
                </label>
                <input 
                  type="text"
                  className={`form-input ${formErrors.title ? 'is-invalid' : ''}`}
                  placeholder="e.g. AI Video Mastery Masterclass 2026"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                />
                {formErrors.title && <span className="error-text">{formErrors.title}</span>}
              </div>

              {/* URL Slug & Price in 1 Row */}
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">
                    Page URL Link / Slug <span className="req">*</span>
                  </label>
                  <div className="input-prefix-wrap">
                    <span className="input-prefix">/</span>
                    <input 
                      type="text"
                      className={`form-input ${formErrors.slug ? 'is-invalid' : ''}`}
                      placeholder="ai-mastery"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    />
                  </div>
                  <span className="hint-text">Accessible at: projuktisoft.shop/{formData.slug || 'slug'}</span>
                  {formErrors.slug && <span className="error-text">{formErrors.slug}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Selling Price (INR ₹) <span className="req">*</span>
                  </label>
                  <div className="input-prefix-wrap">
                    <span className="input-prefix">₹</span>
                    <input 
                      type="number"
                      className="form-input"
                      placeholder="299"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Original Price (₹)
                  </label>
                  <div className="input-prefix-wrap">
                    <span className="input-prefix">₹</span>
                    <input 
                      type="number"
                      className="form-input"
                      placeholder="4999"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Tagline */}
              <div className="form-group">
                <label className="form-label">
                  Tagline / Short Hook
                </label>
                <input 
                  type="text"
                  className="form-input"
                  placeholder="e.g. Zero se 7-Figure tak — 10+ ghante ka complete step-by-step system"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                />
              </div>

              {/* Demo Video URL (Google Drive or YouTube) */}
              <div className="form-group">
                <label className="form-label">
                  Demo Video URL (Google Drive / YouTube)
                </label>
                <input 
                  type="text"
                  className="form-input"
                  placeholder="https://drive.google.com/file/d/.../view OR https://youtube.com/watch?v=..."
                  value={formData.demoVideoUrl}
                  onChange={(e) => setFormData({ ...formData, demoVideoUrl: e.target.value })}
                />
                <span className="hint-text">Google Drive share link paste karein ya YouTube URL — player automatically safe format mein embed karega.</span>
              </div>

              {/* Download Link */}
              <div className="form-group">
                <label className="form-label">
                  Customer Download Link (Google Drive Folder / Link)
                </label>
                <input 
                  type="text"
                  className="form-input"
                  placeholder="https://drive.google.com/drive/folders/..."
                  value={formData.downloadUrl}
                  onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
                />
                <span className="hint-text">Payment hone par yeh link customer ko screen par aur email mein access ke liye milega.</span>
              </div>

              {/* Actions */}
              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                  disabled={isSubmitting}
                >
                  <span>{isSubmitting ? 'Creating...' : '🚀 Create & Start Building Funnel →'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

