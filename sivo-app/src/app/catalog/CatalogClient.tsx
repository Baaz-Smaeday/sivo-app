'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'
import { useBasket } from '@/lib/basket'

type Category = { id: string; name: string; slug: string }
type Subcategory = { id: string; name: string; slug: string; icon: string | null; category_id: string; sort_order: number }
type Product = {
  id: string; sku: string; name: string; slug: string;
  trade_price: number; rrp: number | null; moq: number;
  materials: string | null; dimensions: string | null;
  description: string | null; featured: boolean; collection: string | null;
  subcategory_id: string | null;
  category: { name: string; slug: string } | null;
  subcategory: { name: string; slug: string } | null;
  images: { url: string; alt_text: string | null; is_primary: boolean; sort_order: number }[];
}

export default function CatalogClient({ categories, subcategories, products }: { categories: Category[]; subcategories: Subcategory[]; products: Product[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [activeSubcategory, setActiveSubcategory] = useState<string>('all')
  const [activeMaterial, setActiveMaterial] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [canSeePrice, setCanSeePrice] = useState(false)
  const [saved, setSaved] = useState<string[]>([])
  const [projects, setProjects] = useState<string[]>([])
  const [projectModal, setProjectModal] = useState<{ open: boolean; productId: string; productName: string }>({ open: false, productId: '', productName: '' })
  const [newProjectName, setNewProjectName] = useState('')
  const [projectList, setProjectList] = useState<{ name: string; items: string[] }[]>([])
  const [toast, setToast] = useState('')
  const supabase = createClient()
  const { addItem, items: basketItems } = useBasket()

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  // Extract unique materials from products
  const allMaterials = useMemo(() => {
    const mats = new Set<string>()
    products.forEach(p => {
      if (p.materials) {
        p.materials.split(/[\/,&]/).forEach(m => {
          const trimmed = m.trim()
          if (trimmed) mats.add(trimmed)
        })
      }
    })
    return Array.from(mats).sort()
  }, [products])

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem('sivo_saved') || '[]')
      const p = JSON.parse(localStorage.getItem('sivo_projects') || '[]')
      setSaved(s)
      setProjectList(p)
      setProjects(p.flatMap((pr: any) => pr.items))
    } catch {}

    const check = async () => {
      const demoMatch = document.cookie.match(/sivo-demo-role=([^;]+)/)
      const demoRole = demoMatch ? demoMatch[1] : ''
      if (demoRole === 'buyer' || demoRole === 'admin' || demoRole === 'supplier') {
        setCanSeePrice(true)
        return
      }
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('role, status').eq('id', user.id).single()
        if (profile?.role === 'admin' || profile?.status === 'approved') setCanSeePrice(true)
      }
    }
    check()
  }, [])

  // Reset filters when category changes
  const handleCategoryChange = (slug: string) => {
    setActiveCategory(slug)
    setActiveSubcategory('all')
  }

  const clearAllFilters = () => {
    setActiveCategory('all')
    setActiveSubcategory('all')
    setActiveMaterial('all')
    setSearchQuery('')
  }

  const toggleSave = (productId: string, productName: string) => {
    setSaved(prev => {
      const next = prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
      localStorage.setItem('sivo_saved', JSON.stringify(next))
      showToast(prev.includes(productId) ? `Removed from saved` : `❤️ ${productName} saved`)
      return next
    })
  }

  const openProjectModal = (productId: string, productName: string) => {
    setProjectModal({ open: true, productId, productName })
    setNewProjectName('')
  }

  const addToProject = (projectName: string) => {
    setProjectList(prev => {
      const existing = prev.find(p => p.name === projectName)
      let next
      if (existing) {
        next = prev.map(p => p.name === projectName
          ? { ...p, items: p.items.includes(projectModal.productId) ? p.items : [...p.items, projectModal.productId] }
          : p
        )
      } else {
        next = [...prev, { name: projectName, items: [projectModal.productId] }]
      }
      localStorage.setItem('sivo_projects', JSON.stringify(next))
      setProjects(next.flatMap(p => p.items))
      return next
    })
    showToast(`📁 Added to "${projectName}"`)
    setProjectModal({ open: false, productId: '', productName: '' })
  }

  const handleNewProject = () => {
    if (!newProjectName.trim()) return
    addToProject(newProjectName.trim())
  }

  // Get subcategories for the active category
  const activeCategoryId = categories.find(c => c.slug === activeCategory)?.id
  const filteredSubcategories = activeCategory !== 'all' && activeCategoryId
    ? subcategories.filter(sc => sc.category_id === activeCategoryId)
    : []

  // Filter products
  const filtered = useMemo(() => {
    let result = products

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.materials && p.materials.toLowerCase().includes(q)) ||
        (p.collection && p.collection.toLowerCase().includes(q)) ||
        (p.category?.name && p.category.name.toLowerCase().includes(q)) ||
        (p.subcategory?.name && p.subcategory.name.toLowerCase().includes(q))
      )
    }

    // Category
    if (activeCategory !== 'all') {
      result = result.filter(p => p.category?.slug === activeCategory)
    }

    // Subcategory
    if (activeSubcategory !== 'all') {
      const subId = subcategories.find(sc => sc.slug === activeSubcategory)?.id
      if (subId) result = result.filter(p => p.subcategory_id === subId)
    }

    // Material
    if (activeMaterial !== 'all') {
      result = result.filter(p => p.materials && p.materials.toLowerCase().includes(activeMaterial.toLowerCase()))
    }

    return result
  }, [products, searchQuery, activeCategory, activeSubcategory, activeMaterial, subcategories])

  const hasActiveFilters = activeCategory !== 'all' || activeSubcategory !== 'all' || activeMaterial !== 'all' || searchQuery.trim() !== ''

  const getImg = (p: Product) => p.images?.find(i => i.is_primary)?.url || p.images?.[0]?.url || null
  const inBasket = (id: string) => basketItems.some(i => i.productId === id)
  const getStockType = (p: Product) => p.featured ? 'uk' : 'lead'

  return (
    <div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          padding: '12px 20px', background: 'var(--card)',
          border: '1px solid rgba(201,169,110,.3)', borderRadius: 8,
          color: '#fff', fontSize: 13, boxShadow: '0 8px 32px rgba(0,0,0,.5)',
          animation: 'fadeIn .2s ease',
        }}>{toast}</div>
      )}

      {/* Project Modal */}
      {projectModal.open && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          background: 'rgba(0,0,0,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={() => setProjectModal({ open: false, productId: '', productName: '' })}>
          <div style={{
            background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12,
            padding: 28, width: 380, maxWidth: '90vw',
          }} onClick={e => e.stopPropagation()}>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#fff', marginBottom: 4 }}>Add to Project</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 20 }}>{projectModal.productName}</div>

            {projectList.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 9, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>Existing Projects</div>
                {projectList.map(p => (
                  <button key={p.name} onClick={() => addToProject(p.name)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      width: '100%', padding: '10px 14px', marginBottom: 6,
                      background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6,
                      color: p.items.includes(projectModal.productId) ? 'var(--gold)' : '#fff',
                      fontSize: 12, cursor: 'pointer', textAlign: 'left',
                    }}>
                    <span>📁 {p.name}</span>
                    <span style={{ fontSize: 10, color: 'var(--muted)' }}>
                      {p.items.includes(projectModal.productId) ? '✓ Added' : `${p.items.length} items`}
                    </span>
                  </button>
                ))}
              </div>
            )}

            <div style={{ fontSize: 9, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>
              {projectList.length > 0 ? 'Or Create New Project' : 'Create a Project'}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={newProjectName}
                onChange={e => setNewProjectName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleNewProject()}
                placeholder="e.g. Hotel Lobby Refresh"
                style={{
                  flex: 1, padding: '10px 14px', background: 'var(--surface)',
                  border: '1px solid var(--border)', borderRadius: 6,
                  color: 'var(--txt)', fontSize: 12,
                }}
                autoFocus
              />
              <button onClick={handleNewProject}
                style={{
                  padding: '10px 16px', background: 'var(--gold)', color: 'var(--dark)',
                  border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                }}>
                Create
              </button>
            </div>

            <button onClick={() => setProjectModal({ open: false, productId: '', productName: '' })}
              style={{ marginTop: 16, width: '100%', padding: '8px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 6, color: 'var(--muted)', fontSize: 11, cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Mixed SKU Banner */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px',
        background: 'rgba(201,169,110,.06)', border: '1px solid rgba(201,169,110,.12)',
        borderRadius: 8, marginBottom: 20, flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: 13 }}>📦</span>
        <span style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 600 }}>Mixed SKU ordering available</span>
        <span style={{ fontSize: 11, color: 'var(--muted)' }}>· Combine products from different collections into one consolidated shipment</span>
        <Link href="/trade-terms" style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 'auto' }}>View trade terms →</Link>
      </div>

      {/* Search + Material Filter Row */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 280px', minWidth: 200 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, opacity: .5 }}>🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search products, SKUs, materials..."
            style={{
              width: '100%', padding: '10px 12px 10px 36px',
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 8, color: 'var(--txt)', fontSize: 12,
              outline: 'none', transition: 'border-color .2s',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(201,169,110,.4)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,.1)', border: 'none', borderRadius: '50%',
                width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, color: 'var(--muted)', cursor: 'pointer',
              }}
            >✕</button>
          )}
        </div>

        {/* Material filter */}
        <div style={{ position: 'relative', flex: '0 0 auto' }}>
          <select
            value={activeMaterial}
            onChange={e => setActiveMaterial(e.target.value)}
            style={{
              padding: '10px 32px 10px 12px',
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 8, color: activeMaterial === 'all' ? 'var(--muted)' : 'var(--gold)',
              fontSize: 12, cursor: 'pointer', outline: 'none',
              appearance: 'none', WebkitAppearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236e6e7a' d='M3 4.5L6 8l3-3.5'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
            }}
          >
            <option value="all">All Materials</option>
            {allMaterials.map(mat => (
              <option key={mat} value={mat}>{mat}</option>
            ))}
          </select>
        </div>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            style={{
              padding: '10px 14px', background: 'rgba(239,68,68,.1)',
              border: '1px solid rgba(239,68,68,.2)', borderRadius: 8,
              color: '#ef4444', fontSize: 11, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
              transition: 'all .2s',
            }}
          >
            ✕ Clear filters
          </button>
        )}
      </div>

      {/* Active filter summary */}
      {hasActiveFilters && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16,
          fontSize: 11, color: 'var(--muted)', flexWrap: 'wrap',
        }}>
          <span>Showing {filtered.length} of {products.length} products</span>
          {searchQuery && <span style={{ padding: '2px 8px', background: 'rgba(201,169,110,.1)', borderRadius: 4, color: 'var(--gold)' }}>Search: "{searchQuery}"</span>}
          {activeMaterial !== 'all' && <span style={{ padding: '2px 8px', background: 'rgba(201,169,110,.1)', borderRadius: 4, color: 'var(--gold)' }}>{activeMaterial}</span>}
        </div>
      )}

      {/* Category filter */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: filteredSubcategories.length > 0 ? 12 : 24 }}>
        <button onClick={() => handleCategoryChange('all')} className={`px-4 py-2 rounded text-xs tracking-wider uppercase transition-colors ${activeCategory === 'all' ? 'bg-brand-gold text-brand-bg font-semibold' : 'bg-brand-surface border border-brand-border text-brand-muted hover:border-brand-gold hover:text-brand-gold'}`}>
          All ({products.length})
        </button>
        {categories.map(cat => {
          const count = products.filter(p => p.category?.slug === cat.slug).length
          if (count === 0) return null
          return (
            <button key={cat.id} onClick={() => handleCategoryChange(cat.slug)} className={`px-4 py-2 rounded text-xs tracking-wider uppercase transition-colors ${activeCategory === cat.slug ? 'bg-brand-gold text-brand-bg font-semibold' : 'bg-brand-surface border border-brand-border text-brand-muted hover:border-brand-gold hover:text-brand-gold'}`}>
              {cat.name} ({count})
            </button>
          )
        })}
      </div>

      {/* Subcategory filter */}
      {filteredSubcategories.length > 0 && (
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24,
          paddingLeft: 8, borderLeft: '2px solid rgba(201,169,110,.3)',
        }}>
          <button
            onClick={() => setActiveSubcategory('all')}
            style={{
              padding: '6px 12px', borderRadius: 6, fontSize: 11, cursor: 'pointer',
              border: activeSubcategory === 'all' ? '1px solid rgba(201,169,110,.5)' : '1px solid var(--border)',
              background: activeSubcategory === 'all' ? 'rgba(201,169,110,.15)' : 'var(--surface)',
              color: activeSubcategory === 'all' ? 'var(--gold)' : 'var(--muted)',
              fontWeight: activeSubcategory === 'all' ? 600 : 400,
              transition: 'all .2s',
            }}
          >
            All Subcategories
          </button>
          {filteredSubcategories.map(sc => {
            const count = products.filter(p => p.subcategory_id === sc.id).length
            return (
              <button
                key={sc.id}
                onClick={() => setActiveSubcategory(sc.slug)}
                style={{
                  padding: '6px 12px', borderRadius: 6, fontSize: 11, cursor: 'pointer',
                  border: activeSubcategory === sc.slug ? '1px solid rgba(201,169,110,.5)' : '1px solid var(--border)',
                  background: activeSubcategory === sc.slug ? 'rgba(201,169,110,.15)' : 'var(--surface)',
                  color: activeSubcategory === sc.slug ? 'var(--gold)' : 'var(--muted)',
                  fontWeight: activeSubcategory === sc.slug ? 600 : 400,
                  transition: 'all .2s',
                }}
              >
                {sc.icon ? `${sc.icon} ` : ''}{sc.name}{count > 0 ? ` (${count})` : ''}
              </button>
            )
          })}
        </div>
      )}

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 16, opacity: .3 }}>🔍</div>
          <p style={{ color: 'var(--muted)', fontSize: 16, marginBottom: 8 }}>
            {searchQuery ? `No products matching "${searchQuery}"` : `No products in this ${activeSubcategory !== 'all' ? 'subcategory' : 'category'} yet.`}
          </p>
          <p style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 16 }}>Products are being added regularly — check back soon.</p>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              style={{
                padding: '8px 16px', background: 'rgba(201,169,110,.1)',
                border: '1px solid rgba(201,169,110,.2)', borderRadius: 6,
                color: 'var(--gold)', fontSize: 12, cursor: 'pointer',
              }}
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {filtered.map(product => {
            const img = getImg(product)
            const stockType = getStockType(product)
            const isInBasket = inBasket(product.id)
            const isSaved = saved.includes(product.id)
            const inProject = projects.includes(product.id)

            return (
              <div key={product.id} className="card card-glow shimmer" style={{ overflow: 'hidden' }}>
                {/* Image */}
                <Link href={`/catalog/${product.slug}`}>
                  <div className="pc-img">
                    {product.featured && <div className="new-badge">New</div>}
                    {img ? (
                      <img src={img} alt={product.name} />
                    ) : (
                      <div style={{ fontSize: 48, opacity: .3 }}>🪑</div>
                    )}
                    <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 4, zIndex: 2 }}>
                      <span className="sivo-seal-badge">SIVO Verified</span>
                    </div>
                    {canSeePrice && (
                      <button
                        onClick={e => { e.preventDefault(); e.stopPropagation(); toggleSave(product.id, product.name) }}
                        style={{
                          position: 'absolute', top: 8, left: 8, zIndex: 3,
                          width: 32, height: 32, borderRadius: '50%',
                          background: 'rgba(11,11,14,.7)', backdropFilter: 'blur(8px)',
                          border: `1px solid ${isSaved ? 'rgba(239,68,68,.5)' : 'rgba(255,255,255,.15)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 14, cursor: 'pointer', transition: 'all .2s',
                        }}>
                        {isSaved ? '❤️' : '🤍'}
                      </button>
                    )}
                  </div>
                </Link>

                {/* Body */}
                <div className="pc-body">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap' }}>
                    {product.category && (
                      <span style={{
                        display: 'inline-block', padding: '3px 8px', borderRadius: 3,
                        fontSize: 8, fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase',
                        background: 'rgba(201,169,110,.12)', color: 'var(--gold)',
                      }}>{product.category.name}</span>
                    )}
                    {product.subcategory && (
                      <span style={{
                        display: 'inline-block', padding: '3px 8px', borderRadius: 3,
                        fontSize: 8, fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase',
                        background: 'rgba(255,255,255,.06)', color: 'var(--muted)',
                      }}>{product.subcategory.name}</span>
                    )}
                    {stockType === 'uk' ? (
                      <span className="stock-badge stock-uk">In UK Stock</span>
                    ) : (
                      <span className="stock-badge stock-lead">8-10 Week Lead</span>
                    )}
                  </div>

                  <Link href={`/catalog/${product.slug}`} style={{ textDecoration: 'none' }}>
                    <div className="pc-name">{product.name}</div>
                  </Link>
                  <div className="pc-code">{product.sku}</div>

                  <div className="pc-specs">
                    {product.materials && <>Material: <b>{product.materials}</b><br /></>}
                    {product.dimensions && <>Size: <b>{product.dimensions}</b><br /></>}
                    {product.moq && <>MOQ: <b>{product.moq} units</b></>}
                  </div>

                  {canSeePrice ? (
                    <>
                      <div className="pc-price">
                        £{product.trade_price.toLocaleString()}{' '}
                        <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'sans-serif' }}>per unit</span>
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--muted)', margin: '-4px 0 8px' }}>
                        From £{(product.trade_price * product.moq).toLocaleString()}{' '}
                        <span style={{ opacity: .7 }}>({product.moq} units MOQ)</span>
                      </div>
                    </>
                  ) : (
                    <div style={{ margin: '8px 0' }}>
                      <Link href="/auth?tab=login" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '8px 12px', background: 'rgba(201,169,110,.06)',
                        border: '1px dashed rgba(201,169,110,.2)', borderRadius: 'var(--r)',
                        fontSize: 11, color: 'var(--gold)', textDecoration: 'none',
                      }}>
                        🔒 Login for trade price
                      </Link>
                    </div>
                  )}

                  <button
                    className={`btn-add ${isInBasket ? 'btn-added' : ''}`}
                    onClick={() => addItem({
                      productId: product.id, name: product.name, sku: product.sku,
                      price: product.trade_price, moq: product.moq,
                      image: img, materials: product.materials,
                    })}
                  >
                    {isInBasket ? `✓ In Basket` : '+ Add to Quote Basket'}
                  </button>

                  {canSeePrice && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 8 }}>
                      <button
                        onClick={() => toggleSave(product.id, product.name)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px',
                          fontSize: 11, color: isSaved ? '#ef4444' : 'var(--muted)',
                          display: 'flex', alignItems: 'center', gap: 4, transition: 'color .2s',
                        }}>
                        {isSaved ? '❤️ Saved' : '🤍 Save'}
                      </button>
                      <span style={{ color: 'var(--border)' }}>·</span>
                      <button
                        onClick={() => openProjectModal(product.id, product.name)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer', padding: '2px 6px',
                          fontSize: 11, color: inProject ? 'var(--gold)' : '#42a5f5',
                          display: 'flex', alignItems: 'center', gap: 4, transition: 'color .2s',
                        }}>
                        {inProject ? '📁 In Project' : '📁 Project'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>
  )
}
