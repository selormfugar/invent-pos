"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { createOrder, type CartItem } from "@/app/actions/order-actions"

type POSContextType = {
  cart: CartItem[]
  addToCart: (product: any) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  isOnline: boolean
  checkout: (paymentMethod: string) => Promise<any>
  offlineOrders: any[]
  syncOfflineOrders: () => Promise<void>
}

const POSContext = createContext<POSContextType | undefined>(undefined)

export function POSProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isOnline, setIsOnline] = useState(true)
  const [offlineOrders, setOfflineOrders] = useState<any[]>([])

  // Load cart from localStorage on initial load
  useEffect(() => {
    const savedCart = localStorage.getItem("pos_cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }

    const savedOfflineOrders = localStorage.getItem("pos_offline_orders")
    if (savedOfflineOrders) {
      setOfflineOrders(JSON.parse(savedOfflineOrders))
    }

    // Check online status
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("pos_cart", JSON.stringify(cart))
  }, [cart])

  // Save offline orders to localStorage
  useEffect(() => {
    localStorage.setItem("pos_offline_orders", JSON.stringify(offlineOrders))
  }, [offlineOrders])

  const addToCart = (product: any) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)

      if (existingItem) {
        return prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        return [
          ...prevCart,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
          },
        ]
      }
    })
  }

  const updateQuantity = (id: number, quantity: number) => {
    setCart((prevCart) => {
      if (quantity <= 0) {
        return prevCart.filter((item) => item.id !== id)
      }

      return prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
    })
  }

  const clearCart = () => {
    setCart([])
  }

  const checkout = async (paymentMethod: string) => {
    try {
      if (isOnline) {
        // Process order online
        const result = await createOrder(cart, paymentMethod)
        if (result.success) {
          clearCart()
        }
        return result
      } else {
        // Store order for later sync
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
        const taxRate = 0.07
        const tax = subtotal * taxRate
        const total = subtotal + tax

        const offlineOrder = {
          items: cart,
          paymentMethod,
          subtotal,
          tax,
          total,
          createdAt: new Date().toISOString(),
        }

        setOfflineOrders((prev) => [...prev, offlineOrder])
        clearCart()

        return {
          success: true,
          offline: true,
          message: "Order saved offline and will sync when connection is restored",
        }
      }
    } catch (error) {
      console.error("Checkout error:", error)
      return { success: false, error: "Failed to process checkout" }
    }
  }

  const syncOfflineOrders = async () => {
    if (!isOnline || offlineOrders.length === 0) return

    try {
      // Import here to avoid circular dependency
      const { syncOfflineOrders: syncOrders } = await import("@/app/actions/order-actions")

      const result = await syncOrders(offlineOrders)

      if (result.success) {
        setOfflineOrders([])
      }
    } catch (error) {
      console.error("Failed to sync offline orders:", error)
    }
  }

  // Try to sync offline orders when coming back online
  useEffect(() => {
    if (isOnline && offlineOrders.length > 0) {
      syncOfflineOrders()
    }
  }, [isOnline])

  return (
    <POSContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        clearCart,
        isOnline,
        checkout,
        offlineOrders,
        syncOfflineOrders,
      }}
    >
      {children}
    </POSContext.Provider>
  )
}

export function usePOS() {
  const context = useContext(POSContext)
  if (context === undefined) {
    throw new Error("usePOS must be used within a POSProvider")
  }
  return context
}

