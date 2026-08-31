'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface CartItem {
  id: string
  productId: string
  title: string
  slug: string
  barcode: string
  price: number
  referencePrice?: number | null
  image: string
  quantity: number
  category?: string
  brand?: string
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (product: any, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('mpm_cart')
      if (savedCart) {
        setCart(JSON.parse(savedCart))
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage', e)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('mpm_cart', JSON.stringify(cart))
      } catch (e) {
        console.error('Failed to save cart to localStorage', e)
      }
    }
  }, [cart, isLoaded])

  const addToCart = (product: any, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.productId === product.id || item.productId === product.productId
      )
      const imageUrl =
        product.images?.[0]?.url ||
        product.image ||
        (Array.isArray(product.images) && product.images.length > 0 ? product.images[0].url : '') ||
        'https://placehold.co/400x400/1e293b/ffffff?text=MPM'

      if (existingItem) {
        return prevCart.map((item) =>
          item.productId === (product.id || product.productId)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        return [
          ...prevCart,
          {
            id: product.id || product.productId,
            productId: product.id || product.productId,
            title: product.title,
            slug: product.slug,
            barcode: product.barcode,
            price: Number(product.sale_price || product.price),
            referencePrice: product.reference_price ? Number(product.reference_price) : null,
            image: imageUrl,
            quantity: quantity,
            category: product.category?.name || product.category,
            brand: product.brand,
          },
        ]
      }
    })
    setIsCartOpen(true)
  }

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
