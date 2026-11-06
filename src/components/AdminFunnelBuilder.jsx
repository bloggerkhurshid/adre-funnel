import React, { useState, useEffect } from 'react';
import { funnelManager, generateDefaultSections } from '../data/funnelManager';
import FbMasterclassFunnel from '../pages/FbMasterclassFunnel';

export default function AdminFunnelBuilder({ 
  initialProduct, 
  onNavigate, 
  showToast 
}) {
  const [allProducts, setAllProducts] = useState(() => funnelManager.getAllProducts());
  const [selectedSlug, setSelectedSlug] = useState(() => initialProduct?.id || funnelManager.getDefaultSlug());
  const [defaultSlug, setDefaultSlug] = useState(() => funnelManager.getDefaultSlug());

  // Current active product & funnel config
  const currentProduct = funnelManager.getProduct(selectedSlug) || allProducts[0];
  const [funnelConfig, setFunnelConfig] = useState(() => funnelManager.getFunnelConfig(selectedSlug));
  const [sections, setSections] = useState(() => funnelConfig?.sections || generateDefaultSections(currentProduct));

  // Expanded section id for inline editing
  const [expandedSectionId, setExpandedSectionId] = useState(null);

  // Live preview mode
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewDevice, setPreviewDevice] = useState('mobile'); // 'mobile', 'desktop'

  // Drag & drop state
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // When selected slug changes, reload product & config
  useEffect(() => {
    const prod = funnelManager.getProduct(selectedSlug) || allProducts[0];
    const cfg = funnelManager.getFunnelConfig(selectedSlug);
    setFunnelConfig(cfg);
    setSections(cfg?.sections || generateDefaultSections(prod));
    setExpandedSectionId(null);
  }, [selectedSlug, allProducts]);

  // Handle Drag & Drop reordering
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    const updated = [...sections];
    const item = updated.splice(draggedIndex, 1)[0];
    updated.splice(index, 0, item);
    setDraggedIndex(index);
    setSections(updated);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Move Up / Move Down buttons for 1-click mobile-friendly reordering
  const moveSection = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= sections.length) return;
    const updated = [...sections];
    const item = updated.splice(index, 1)[0];
    updated.splice(targetIndex, 0, item);
    setSections(updated);
  };

  // Toggle section enabled / disabled
  const toggleSectionEnabled = (sectionId) => {
    setSections(prev => prev.map(s => {
      if (s.id === sectionId) {
        return { ...s, enabled: s.enabled === false ? true : false };
      }
      return s;
    }));
  };

  // Update specific field inside section data
  const updateSectionData = (sectionId, field, value) => {
    setSections(prev => prev.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          data: {
            ...s.data,
            [field]: value
          }
        };
      }
      return s;
    }));
  };

  // Save Funnel Config
  const handleSaveConfig = async () => {
    setIsSaving(true);
    try {
      await funnelManager.saveFunnelConfig(selectedSlug, {
        productId: selectedSlug,
        sections: sections
      });
      if (showToast) showToast(`Funnel for '${currentProduct?.name || selectedSlug}' saved & published!`, 'success');
    } catch (err) {
      console.error('Error saving funnel:', err);
      if (showToast) showToast('Failed to save funnel', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to Defaults
  const handleResetDefaults = () => {
    if (!window.confirm('Reset this funnel to high-converting default sections and layout?')) return;
    const defaults = generateDefaultSections(currentProduct);
    setSections(defaults);
    if (showToast) showToast('Sections reset to defaults. Click "Save & Publish" to apply.', 'info');
  };

  // Set as Homepage
  const handleSetHome = async () => {
    await funnelManager.setDefaultSlug(selectedSlug);
    setDefaultSlug(selectedSlug);
    if (showToast) showToast(`'${selectedSlug}' is now set as the active root (/) landing page!`, 'success');
  };

  const isCurrentHome = defaultSlug === selectedSlug;
  const pageUrl = `${window.location.origin}/${selectedSlug === defaultSlug ? '' : selectedSlug}`;

  const copyPageLink = () => {
    navigator.clipboard.writeText(pageUrl);
    if (showToast) showToast('Page link copied to clipboard!', 'success');
  };

  return (
    <div className="admin-funnel-builder">
      
      {/* Top Builder Control Header */}
      <div className="afb-top-panel">
        <div className="afb-top-left">
          <div className="afb-product-picker-wrap">
            <span className="afb-label">CUSTOMIZING FUNNEL FOR:</span>
            <select 
              className="afb-product-select"
              value={selectedSlug}
              onChange={(e) => setSelectedSlug(e.target.value)}
            >
              {allProducts.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} (/{p.id}) {p.id === defaultSlug ? '★ Homepage' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="afb-url-chip">
            <span className="afb-url-tag">LIVE LINK:</span>
            <code className="afb-url-text">{pageUrl}</code>
            <button type="button" className="afb-btn-link" onClick={copyPageLink} title="Copy Page Link">
              📋 Copy
            </button>
            <a href={pageUrl} target="_blank" rel="noreferrer" className="afb-btn-link" title="Open live page">
              ↗️ Visit
            </a>
          </div>
        </div>

        <div className="afb-top-right">
          {/* Set as Homepage Button */}
          {!isCurrentHome ? (
            <button 
              type="button" 
              className="admin-btn admin-btn-secondary"
              onClick={handleSetHome}
              title="Set this funnel as the main homepage at /"
            >
              <span>🏠 Set as Homepage (/)</span>
            </button>
          ) : (
            <span className="afb-home-badge">⭐ ACTIVE ROOT (/) PAGE</span>
          )}

          {/* Toggle Live Preview */}
          <button 
            type="button" 
            className={`admin-btn ${isPreviewMode ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            <span>{isPreviewMode ? '✏️ Edit Sections' : '👁️ Live Preview'}</span>
          </button>

          {/* Save & Publish Button */}
          <button 
            type="button" 
            className="admin-btn admin-btn-success pulse-btn"
            onClick={handleSaveConfig}
            disabled={isSaving}
          >
            <span>{isSaving ? 'Publishing... ⏳' : '💾 Save & Publish'}</span>
          </button>
        </div>
      </div>

      {/* Main Builder Workspace */}
      <div className="afb-workspace">
        
        {/* ========================================================
            VIEW A: SECTION BLOCKS BUILDER (Drag & Drop + Editor)
           ======================================================== */}
        {!isPreviewMode && (
          <div className="afb-editor-container">
            
            <div className="afb-guide-banner">
              <div className="afb-guide-text">
                <strong>💡 Drag &amp; Drop Reorderable Sections:</strong> Section ko pakad kar drag karein ya <strong>⬆️ Up / ⬇️ Down</strong> buttons use karein. Kisi bhi section ko hide karne ke liye <strong>👁️</strong> toggle karein, aur text/links change karne ke liye section par click karein.
              </div>
              <button type="button" className="afb-btn-reset" onClick={handleResetDefaults}>
                🔄 Reset Defaults
              </button>
            </div>

            {/* Sections Drag-and-Drop List */}
            <div className="afb-sections-list">
              {sections.map((sec, index) => {
                const isExpanded = expandedSectionId === sec.id;
                const isEnabled = sec.enabled !== false;

                return (
                  <div 
                    key={sec.id || index}
                    className={`afb-section-card ${!isEnabled ? 'is-disabled' : ''} ${draggedIndex === index ? 'is-dragging' : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                  >
                    {/* Section Card Top Bar */}
                    <div className="afb-section-card-bar">
                      
                      {/* Left: Drag Grip Handle & Move Buttons */}
                      <div className="afb-drag-controls">
                        <span className="afb-drag-grip" title="Drag to reorder">⠿</span>
                        <div className="afb-move-arrows">
                          <button 
                            type="button" 
                            className="afb-arrow-btn"
                            disabled={index === 0}
                            onClick={() => moveSection(index, -1)}
                            title="Move Up"
                          >
                            ▲
                          </button>
                          <button 
                            type="button" 
                            className="afb-arrow-btn"
                            disabled={index === sections.length - 1}
                            onClick={() => moveSection(index, 1)}
                            title="Move Down"
                          >
                            ▼
                          </button>
                        </div>
                      </div>

                      {/* Center: Section Title & Type */}
                      <div className="afb-section-title-wrap" onClick={() => setExpandedSectionId(isExpanded ? null : sec.id)}>
                        <span className="afb-sec-icon">{sec.icon || '📦'}</span>
                        <div className="afb-sec-texts">
                          <span className="afb-sec-name">{sec.name}</span>
                          <span className="afb-sec-type">Type: <code>{sec.type}</code></span>
                        </div>
                      </div>

                      {/* Right: Visibility Toggle & Expand Button */}
                      <div className="afb-sec-actions">
                        <button
                          type="button"
                          className={`afb-btn-toggle-eye ${isEnabled ? 'is-on' : 'is-off'}`}
                          onClick={() => toggleSectionEnabled(sec.id)}
                          title={isEnabled ? 'Section is visible on page' : 'Section is hidden'}
                        >
                          {isEnabled ? '👁️ Shown' : '🙈 Hidden'}
                        </button>

                        <button
                          type="button"
                          className="afb-btn-expand"
                          onClick={() => setExpandedSectionId(isExpanded ? null : sec.id)}
                        >
                          {isExpanded ? '▲ Hide Fields' : '▼ Edit Content'}
                        </button>
                      </div>

                    </div>

                    {/* Section Fields Editor (When Expanded) */}
                    {isExpanded && (
                      <div className="afb-section-editor animate-fadeIn">
                        
                        {/* 1. Urgency Bar Editor */}
                        {sec.type === 'urgency_bar' && (
                          <div className="afb-fields-grid">
                            <div className="form-group">
                              <label className="form-label">Badge Pill Text</label>
                              <input 
                                type="text"
                                className="form-input"
                                value={sec.data?.badgeText || ''}
                                onChange={(e) => updateSectionData(sec.id, 'badgeText', e.target.value)}
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Urgency Ticker Text</label>
                              <input 
                                type="text"
                                className="form-input"
                                value={sec.data?.offerText || ''}
                                onChange={(e) => updateSectionData(sec.id, 'offerText', e.target.value)}
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Price Highlight Text</label>
                              <input 
                                type="text"
                                className="form-input"
                                value={sec.data?.priceText || ''}
                                onChange={(e) => updateSectionData(sec.id, 'priceText', e.target.value)}
                              />
                            </div>
                          </div>
                        )}

                        {/* 2. Hero Section Editor */}
                        {sec.type === 'hero' && (
                          <div className="afb-fields-stack">
                            <div className="form-row-2">
                              <div className="form-group">
                                <label className="form-label">Top Pill Badge 1</label>
                                <input 
                                  type="text"
                                  className="form-input"
                                  value={sec.data?.badge1 || ''}
                                  onChange={(e) => updateSectionData(sec.id, 'badge1', e.target.value)}
                                />
                              </div>
                              <div className="form-group">
                                <label className="form-label">Top Pill Badge 2</label>
                                <input 
                                  type="text"
                                  className="form-input"
                                  value={sec.data?.badge2 || ''}
                                  onChange={(e) => updateSectionData(sec.id, 'badge2', e.target.value)}
                                />
                              </div>
                            </div>

                            <div className="form-group">
                              <label className="form-label">Hero Main Headline (Title)</label>
                              <input 
                                type="text"
                                className="form-input font-bold"
                                value={sec.data?.title || ''}
                                onChange={(e) => updateSectionData(sec.id, 'title', e.target.value)}
                              />
                            </div>

                            <div className="form-group">
                              <label className="form-label">Gradient Highlight Words</label>
                              <input 
                                type="text"
                                className="form-input"
                                value={sec.data?.gradientHighlight || ''}
                                onChange={(e) => updateSectionData(sec.id, 'gradientHighlight', e.target.value)}
                              />
                            </div>

                            <div className="form-group">
                              <label className="form-label">Subline Description</label>
                              <textarea 
                                className="form-textarea"
                                rows="2"
                                value={sec.data?.subtitle || ''}
                                onChange={(e) => updateSectionData(sec.id, 'subtitle', e.target.value)}
                              />
                            </div>

                            <div className="form-group">
                              <label className="form-label">Problem Agitation Quote (Empathy Box)</label>
                              <textarea 
                                className="form-textarea"
                                rows="2"
                                value={sec.data?.problemQuote || ''}
                                onChange={(e) => updateSectionData(sec.id, 'problemQuote', e.target.value)}
                              />
                            </div>

                            <div className="form-row-2">
                              <div className="form-group">
                                <label className="form-label">Hero Primary CTA Button Text</label>
                                <input 
                                  type="text"
                                  className="form-input"
                                  value={sec.data?.ctaButtonText || ''}
                                  onChange={(e) => updateSectionData(sec.id, 'ctaButtonText', e.target.value)}
                                />
                              </div>
                              <div className="form-group">
                                <label className="form-label">Verified Payout Badge Text</label>
                                <input 
                                  type="text"
                                  className="form-input"
                                  value={sec.data?.payoutBadgeText || ''}
                                  onChange={(e) => updateSectionData(sec.id, 'payoutBadgeText', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 3. Video Player Section Editor */}
                        {sec.type === 'video_demo' && (
                          <div className="afb-fields-stack">
                            <div className="form-group">
                              <label className="form-label">
                                🎬 Video URL (Google Drive Preview Link OR YouTube Link)
                              </label>
                              <input 
                                type="text"
                                className="form-input"
                                placeholder="https://drive.google.com/file/d/1ABC.../preview"
                                value={sec.data?.videoUrl || ''}
                                onChange={(e) => updateSectionData(sec.id, 'videoUrl', e.target.value)}
                              />
                              <span className="hint-text">Google Drive share link paste karein ya YouTube URL — player automatically safe embed format mein stream karega.</span>
                            </div>

                            <div className="form-row-2">
                              <div className="form-group">
                                <label className="form-label">Top Starter Pill Text</label>
                                <input 
                                  type="text"
                                  className="form-input"
                                  value={sec.data?.badge || ''}
                                  onChange={(e) => updateSectionData(sec.id, 'badge', e.target.value)}
                                />
                              </div>
                              <div className="form-group">
                                <label className="form-label">Player Shield Title</label>
                                <input 
                                  type="text"
                                  className="form-input"
                                  value={sec.data?.shieldTitle || ''}
                                  onChange={(e) => updateSectionData(sec.id, 'shieldTitle', e.target.value)}
                                />
                              </div>
                            </div>

                            <div className="form-group">
                              <label className="form-label">Video Section Headline</label>
                              <input 
                                type="text"
                                className="form-input font-bold"
                                value={sec.data?.title || ''}
                                onChange={(e) => updateSectionData(sec.id, 'title', e.target.value)}
                              />
                            </div>

                            <div className="form-group">
                              <label className="form-label">Section Description</label>
                              <textarea 
                                className="form-textarea"
                                rows="2"
                                value={sec.data?.desc || ''}
                                onChange={(e) => updateSectionData(sec.id, 'desc', e.target.value)}
                              />
                            </div>

                            <div className="form-row-2">
                              <div className="form-group">
                                <label className="form-label">Post-Video Box Text</label>
                                <input 
                                  type="text"
                                  className="form-input"
                                  value={sec.data?.footerText || ''}
                                  onChange={(e) => updateSectionData(sec.id, 'footerText', e.target.value)}
                                />
                              </div>
                              <div className="form-group">
                                <label className="form-label">CTA Button Text</label>
                                <input 
                                  type="text"
                                  className="form-input"
                                  value={sec.data?.ctaText || ''}
                                  onChange={(e) => updateSectionData(sec.id, 'ctaText', e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 4. Pricing Section Editor */}
                        {sec.type === 'pricing' && (
                          <div className="afb-fields-stack">
                            <div className="form-row-2">
                              <div className="form-group">
                                <label className="form-label">Ribbon Badge Text</label>
                                <input 
                                  type="text"
                                  className="form-input"
                                  value={sec.data?.ribbonText || ''}
                                  onChange={(e) => updateSectionData(sec.id, 'ribbonText', e.target.value)}
                                />
                              </div>
                              <div className="form-group">
                                <label className="form-label">Tier Tag</label>
                                <input 
                                  type="text"
                                  className="form-input"
                                  value={sec.data?.tierTag || ''}
                                  onChange={(e) => updateSectionData(sec.id, 'tierTag', e.target.value)}
                                />
                              </div>
                            </div>

                            <div className="form-group">
                              <label className="form-label">Pricing Card Title</label>
                              <input 
                                type="text"
                                className="form-input font-bold"
                                value={sec.data?.title || ''}
                                onChange={(e) => updateSectionData(sec.id, 'title', e.target.value)}
                              />
                            </div>

                            <div className="form-group">
                              <label className="form-label">CTA Button Text</label>
                              <input 
                                type="text"
                                className="form-input"
                                value={sec.data?.ctaButtonText || ''}
                                onChange={(e) => updateSectionData(sec.id, 'ctaButtonText', e.target.value)}
                              />
                            </div>

                            <div className="form-group">
                              <label className="form-label">Payment Reassurance Note</label>
                              <input 
                                type="text"
                                className="form-input"
                                value={sec.data?.paymentNote || ''}
                                onChange={(e) => updateSectionData(sec.id, 'paymentNote', e.target.value)}
                              />
                            </div>
                          </div>
                        )}

                        {/* 5. Sticky Bottom Bar Editor */}
                        {sec.type === 'sticky_bar' && (
                          <div className="afb-fields-grid">
                            <div className="form-group">
                              <label className="form-label">Sticky Badge Text</label>
                              <input 
                                type="text"
                                className="form-input"
                                value={sec.data?.badgeText || ''}
                                onChange={(e) => updateSectionData(sec.id, 'badgeText', e.target.value)}
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Sticky Button Text</label>
                              <input 
                                type="text"
                                className="form-input"
                                value={sec.data?.buttonText || ''}
                                onChange={(e) => updateSectionData(sec.id, 'buttonText', e.target.value)}
                              />
                            </div>
                          </div>
                        )}

                        {/* General Notice for other sections */}
                        {['pillars', 'proofs', 'deliverables', 'curriculum', 'faq'].includes(sec.type) && (
                          <div className="afb-fields-stack">
                            <div className="form-group">
                              <label className="form-label">Section Title</label>
                              <input 
                                type="text"
                                className="form-input font-bold"
                                value={sec.data?.sectionTitle || sec.data?.title || ''}
                                onChange={(e) => {
                                  updateSectionData(sec.id, sec.data?.sectionTitle !== undefined ? 'sectionTitle' : 'title', e.target.value);
                                }}
                              />
                            </div>
                            {sec.data?.sectionDesc !== undefined && (
                              <div className="form-group">
                                <label className="form-label">Section Description</label>
                                <textarea 
                                  className="form-textarea"
                                  rows="2"
                                  value={sec.data?.sectionDesc || ''}
                                  onChange={(e) => updateSectionData(sec.id, 'sectionDesc', e.target.value)}
                                />
                              </div>
                            )}
                          </div>
                        )}

                      </div>
                    )}

                  </div>
                );
              })}
            </div>

            {/* Bottom Save Bar */}
            <div className="afb-bottom-save-bar">
              <button 
                type="button" 
                className="admin-btn admin-btn-success pulse-btn"
                onClick={handleSaveConfig}
                disabled={isSaving}
              >
                <span>{isSaving ? 'Publishing Changes...' : '💾 Save & Publish Funnel'}</span>
              </button>
            </div>

          </div>
        )}

        {/* ========================================================
            VIEW B: LIVE IN-APP PREVIEW MODE
           ======================================================== */}
        {isPreviewMode && (
          <div className="afb-preview-workspace">
            
            {/* Device Switcher Bar */}
            <div className="afb-device-bar">
              <div className="afb-device-pills">
                <button
                  type="button"
                  className={`device-pill ${previewDevice === 'mobile' ? 'active' : ''}`}
                  onClick={() => setPreviewDevice('mobile')}
                >
                  📱 Mobile View (375px)
                </button>
                <button
                  type="button"
                  className={`device-pill ${previewDevice === 'desktop' ? 'active' : ''}`}
                  onClick={() => setPreviewDevice('desktop')}
                >
                  💻 Desktop View (Full)
                </button>
              </div>

              <div className="afb-preview-info">
                <span>🔴 Live Preview — Rendering exact sections &amp; order</span>
              </div>
            </div>

            {/* Embedded Screen Container */}
            <div className={`afb-preview-screen-wrap device-${previewDevice}`}>
              <div className="afb-preview-frame">
                <FbMasterclassFunnel
                  slug={selectedSlug}
                  product={currentProduct}
                  config={{ productId: selectedSlug, sections }}
                  isPreview={true}
                  onBuyProduct={() => alert(`Test checkout click for ${currentProduct.name} (₹${currentProduct.price})`)}
                />
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}

