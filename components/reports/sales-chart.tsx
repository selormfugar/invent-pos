"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useRef } from "react"

// Sample data for the chart
const dailySales = [
  { day: "Mon", sales: 850 },
  { day: "Tue", sales: 740 },
  { day: "Wed", sales: 900 },
  { day: "Thu", sales: 1200 },
  { day: "Fri", sales: 1400 },
  { day: "Sat", sales: 1100 },
]

export function SalesChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    // Set dimensions
    const width = canvasRef.current.width
    const height = canvasRef.current.height
    const padding = 40
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    // Find max value for scaling
    const maxSales = Math.max(...dailySales.map((d) => d.sales))

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = "#94a3b8"
    ctx.lineWidth = 1

    // X-axis
    ctx.moveTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)

    // Y-axis
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.stroke()

    // Draw bars
    const barWidth = (chartWidth / dailySales.length) * 0.6
    const barSpacing = chartWidth / dailySales.length

    dailySales.forEach((data, index) => {
      const barHeight = (data.sales / maxSales) * chartHeight
      const x = padding + index * barSpacing + barSpacing / 2 - barWidth / 2
      const y = height - padding - barHeight

      // Draw bar
      ctx.fillStyle = "#3b82f6"
      ctx.fillRect(x, y, barWidth, barHeight)

      // Draw day label
      ctx.fillStyle = "#64748b"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(data.day, x + barWidth / 2, height - padding + 20)

      // Draw value on top of bar
      ctx.fillStyle = "#1e293b"
      ctx.fillText(`$${data.sales}`, x + barWidth / 2, y - 10)
    })
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Sales Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full aspect-[4/3]">
          <canvas ref={canvasRef} width={500} height={300} className="w-full h-full"></canvas>
        </div>
      </CardContent>
    </Card>
  )
}

