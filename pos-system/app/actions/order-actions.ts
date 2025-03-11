"use server"

import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"

export type CartItem = {
  id: number
  name: string
  price: number
  quantity: number
}

export async function createOrder(items: CartItem[], paymentMethod: string) {
  try {
    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const taxRate = 0.07 // 7% tax
    const tax = subtotal * taxRate
    const total = subtotal + tax

    // Generate order number
    const orderNumber = `ORD-${Date.now()}`

    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber,
        subtotal,
        tax,
        total,
        paymentMethod,
        items: {
          create: items.map((item) => ({
            quantity: item.quantity,
            price: item.price,
            productId: item.id,
          })),
        },
      },
      include: {
        items: true,
      },
    })

    // Update inventory
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.id },
        data: {
          inStock: {
            decrement: item.quantity,
          },
        },
      })
    }

    revalidatePath("/checkout")
    revalidatePath("/inventory")
    revalidatePath("/reports")

    return { success: true, data: order }
  } catch (error) {
    console.error("Failed to create order:", error)
    return { success: false, error: "Failed to create order" }
  }
}

export async function getOrders() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return { success: true, data: orders }
  } catch (error) {
    console.error("Failed to fetch orders:", error)
    return { success: false, error: "Failed to fetch orders" }
  }
}

export async function getOrdersByDate(startDate: Date, endDate: Date) {
  try {
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return { success: true, data: orders }
  } catch (error) {
    console.error("Failed to fetch orders by date:", error)
    return { success: false, error: "Failed to fetch orders by date" }
  }
}

export async function syncOfflineOrders(offlineOrders: any[]) {
  try {
    const results = []

    for (const order of offlineOrders) {
      // Create the order in the database
      const result = await createOrder(order.items, order.paymentMethod)
      results.push(result)
    }

    return { success: true, data: results }
  } catch (error) {
    console.error("Failed to sync offline orders:", error)
    return { success: false, error: "Failed to sync offline orders" }
  }
}

