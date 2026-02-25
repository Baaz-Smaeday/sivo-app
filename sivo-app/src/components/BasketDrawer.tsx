'use client'

import Link from 'next/link'
import { useBasket } from '@/lib/basket'

export default function BasketDrawer() {
  const { items, removeItem, updateQty, totalItems, totalPrice, isOpen, setIsOpen } = useBasket()

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 z-[1001]" onClick={() => setIsOpen(false)} />

      {/* Drawer */}
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[var(--card)] border-l border-[var(--border)] z-[1002] flex flex-col animate-fade-up"
           style={{ animation: 'slideInRight 0.3s ease-out' }}>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <div>
            <h2 className="font-serif text-xl text-white">Quote Basket</h2>
            <div className="text-xs text-[var(--muted)]">{totalItems} items · {items.length} products</div>
          </div>
          <button onClick={() => setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center text-[var(--muted)] hover:text-white transition-colors text-lg">
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">🛒</div>
              <p className="text-[var(--muted)] text-sm">Your quote basket is empty</p>
              <Link href="/catalog" onClick={() => setIsOpen(false)}
                    className="text-[var(--gold)] text-sm mt-2 inline-block hover:underline">
                Browse Collection →
              </Link>
            </div>
          ) : (
            items.map(item => (
              <div key={item.productId} className="card p-3 flex gap-3">
                {/* Image */}
                <div className="w-16 h-16 rounded bg-[var(--surface)] overflow-hidden shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">🪑</div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white font-medium truncate">{item.name}</div>
                  <div className="text-[10px] text-[var(--muted)]">{item.sku} · MOQ: {item.moq}</div>
                  <div className="text-xs text-[var(--gold)] mt-0.5">
                    £{item.price.toLocaleString()} × {item.qty} = <b>£{(item.price * item.qty).toLocaleString()}</b>
                  </div>

                  {/* Qty controls */}
                  <div className="flex items-center gap-2 mt-1.5">
                    <button onClick={() => updateQty(item.productId, item.qty - 1)}
                            className="w-6 h-6 border border-[var(--border)] rounded text-xs text-[var(--muted)] hover:border-[var(--gold)] hover:text-[var(--gold)]">
                      −
                    </button>
                    <span className="text-xs text-white w-8 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.productId, item.qty + 1)}
                            className="w-6 h-6 border border-[var(--border)] rounded text-xs text-[var(--muted)] hover:border-[var(--gold)] hover:text-[var(--gold)]">
                      +
                    </button>
                    <button onClick={() => removeItem(item.productId)}
                            className="ml-auto text-[10px] text-red-400 hover:text-red-300">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[var(--border)] p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--muted)]">Estimated Total</span>
              <span className="font-serif text-2xl text-[var(--gold)]">£{totalPrice.toLocaleString()}</span>
            </div>
            <div className="text-[10px] text-[var(--muted)]">
              50% deposit to confirm · Final price confirmed in formal quote
            </div>
            <Link href="/quote" onClick={() => setIsOpen(false)}
                  className="btn-gold w-full text-sm tracking-wider uppercase block text-center">
              Review & Submit Quote →
            </Link>
            <button onClick={() => setIsOpen(false)}
                    className="btn-outline btn-sm w-full text-xs tracking-wider uppercase">
              Continue Browsing
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  )
}
