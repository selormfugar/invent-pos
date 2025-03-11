import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    // Check if we already have products
    const productCount = await prisma.product.count()

    if (productCount === 0) {
      // Seed products
      await prisma.product.createMany({
        data: [
          {
            name: "Organic Apples",
            sku: "PRD001",
            description: "Fresh organic apples",
            price: 2.99,
            inStock: 45,
            minStock: 20,
          },
          {
            name: "Whole Milk 1gal",
            sku: "PRD002",
            description: "Whole milk, 1 gallon",
            price: 3.49,
            inStock: 12,
            minStock: 15,
          },
          {
            name: "Wheat Bread",
            sku: "PRD003",
            description: "Freshly baked wheat bread",
            price: 2.5,
            inStock: 28,
            minStock: 10,
          },
          {
            name: "Organic Bananas",
            sku: "PRD004",
            description: "Organic bananas, per pound",
            price: 1.99,
            inStock: 56,
            minStock: 25,
          },
          {
            name: "Free Range Eggs",
            sku: "PRD005",
            description: "Free range eggs, dozen",
            price: 4.99,
            inStock: 8,
            minStock: 12,
          },
        ],
      })
    }

    // Check if we already have invoices
    const invoiceCount = await prisma.invoice.count()

    if (invoiceCount === 0) {
      // Seed invoices
      await prisma.invoice.createMany({
        data: [
          {
            invoiceNumber: "INV-001",
            customer: "John Smith",
            amount: 124.99,
            status: "paid",
          },
          {
            invoiceNumber: "INV-002",
            customer: "Sarah Johnson",
            amount: 89.5,
            status: "paid",
          },
          {
            invoiceNumber: "INV-003",
            customer: "Michael Brown",
            amount: 245.0,
            status: "pending",
          },
          {
            invoiceNumber: "INV-004",
            customer: "Emily Davis",
            amount: 67.25,
            status: "paid",
          },
          {
            invoiceNumber: "INV-005",
            customer: "Robert Wilson",
            amount: 189.99,
            status: "overdue",
          },
        ],
      })
    }

    // Create some sample orders
    const orderCount = await prisma.order.count()

    if (orderCount === 0) {
      // Get product IDs
      const products = await prisma.product.findMany({
        select: { id: true, price: true },
      })

      if (products.length > 0) {
        // Create sample orders
        const today = new Date()

        // Create orders for the past week
        for (let i = 0; i < 7; i++) {
          const orderDate = new Date(today)
          orderDate.setDate(today.getDate() - i)

          // Create 1-5 orders per day
          const ordersPerDay = Math.floor(Math.random() * 5) + 1

          for (let j = 0; j < ordersPerDay; j++) {
            // Select 1-3 random products for this order
            const orderProducts = []
            const numProducts = Math.floor(Math.random() * 3) + 1

            for (let k = 0; k < numProducts; k++) {
              const randomProduct = products[Math.floor(Math.random() * products.length)]
              const quantity = Math.floor(Math.random() * 3) + 1

              orderProducts.push({
                productId: randomProduct.id,
                quantity,
                price: randomProduct.price,
              })
            }

            // Calculate totals
            const subtotal = orderProducts.reduce((sum, item) => sum + item.price * item.quantity, 0)
            const tax = subtotal * 0.07
            const total = subtotal + tax

            // Create the order
            await prisma.order.create({
              data: {
                orderNumber: `ORD-${Date.now()}-${j}`,
                subtotal,
                tax,
                total,
                paymentMethod: Math.random() > 0.5 ? "Cash" : "Card",
                createdAt: orderDate,
                items: {
                  create: orderProducts,
                },
              },
            })
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
    })
  } catch (error) {
    console.error("Seed error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to seed database",
      },
      { status: 500 },
    )
  }
}

