"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, ShoppingCart, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import { getOrdersByDate } from "@/app/actions/order-actions"

export function SalesSummary() {
  const [summary, setSummary] = useState({
    totalSales: 0,
    transactions: 0,
    avgSale: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTodaySales() {
      setLoading(true)
      try {
        // Get today's date range
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        const result = await getOrdersByDate(today, tomorrow)

        if (result.success && result.data) {
          const orders = result.data
          const totalSales = orders.reduce((sum, order) => sum + order.total, 0)
          const transactions = orders.length
          const avgSale = transactions > 0 ? totalSales / transactions : 0

          setSummary({
            totalSales,
            transactions,
            avgSale,
          })
        }
      } catch (error) {
        console.error("Failed to fetch today's sales:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTodaySales()
  }, [])

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4">Today's Sales Summary</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard
            title="Total Sales"
            value={loading ? "Loading..." : `$${summary.totalSales.toFixed(2)}`}
            icon={<DollarSign className="h-5 w-5" />}
          />

          <SummaryCard
            title="Transactions"
            value={loading ? "Loading..." : `${summary.transactions}`}
            icon={<ShoppingCart className="h-5 w-5" />}
          />

          <SummaryCard
            title="Avg. Sale"
            value={loading ? "Loading..." : `$${summary.avgSale.toFixed(2)}`}
            icon={<TrendingUp className="h-5 w-5" />}
          />
        </div>
      </CardContent>
    </Card>
  )
}

function SummaryCard({
  title,
  value,
  icon,
}: {
  title: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <div className="bg-muted/50 rounded-lg p-4 flex items-center">
      <div className="bg-primary/10 rounded-full p-3 mr-4">{icon}</div>
      <div>
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className="text-xl font-bold">{value}</div>
      </div>
    </div>
  )
}

