'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type BasketItem = {
  productId: string
  name: string
  sku: string
  price: number
  moq: number
  qty: number
  image: string | null
  materials: string | null
}

type BasketContextType = {
  items: BasketItem[]
  addItem: (item: Omit<BasketItem, 'qty'> & { qty?: number }) => void
  removeItem: (productId: string) => void
  updateQty: (productId: string, qty: number) => void
  clearBasket: () => void
  totalItems: number
  totalPrice: number
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const BasketContext = createContext<BasketContextType | null>(null)

export function useBasket() {
  const ctx = useContext(BasketContext)
  if (!ctx) throw new Error('useBasket must be used within BasketProvider')
  return ctx
}

export function BasketProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BasketItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sivo-basket')
      if (saved) setItems(JSON.parse(saved))
    } catch {}
    setLoaded(true)
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    if (loaded) {
      localStorage.setItem('sivo-basket', JSON.stringify(items))
    }
  }, [items, loaded])

  const addItem = (item: Omit<BasketItem, 'qty'> & { qty?: number }) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === item.productId)
      if (existing) {
        return prev.map(i =>
          i.productId === item.productId
            ? { ...i, qty: i.qty + (item.qty || item.moq) }
            : i
        )
      }
      return [...prev, { ...item, qty: item.qty || item.moq }]
    })
    setIsOpen(true)
  }

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(i => i.productId !== productId))
  }

  const updateQty = (productId: string, qty: number) => {
    setItems(prev =>
      prev.map(i => {
        if (i.productId !== productId) return i
        return { ...i, qty: Math.max(i.moq, qty) }
      })
    )
  }

  const clearBasket = () => {
    setItems([])
    setIsOpen(false)
  }

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.qty, 0)

  return (
    <BasketContext.Provider value={{
      items, addItem, removeItem, updateQty, clearBasket,
      totalItems, totalPrice, isOpen, setIsOpen
    }}>
      {children}
    </BasketContext.Provider>
  )
}
