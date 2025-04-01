"use client"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import type { CryptoHistoryData } from "@/types/crypto"

interface CryptoChartProps {
  data: CryptoHistoryData[]
}

export function CryptoChart({ data }: CryptoChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return

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

    // Find min and max prices
    const prices = data.map((d) => d.price)
    const minPrice = Math.min(...prices) * 0.95
    const maxPrice = Math.max(...prices) * 1.05
    const priceRange = maxPrice - minPrice

    // Draw axes
    ctx.beginPath()
    ctx.strokeStyle = "#94a3b8" // slate-400
    ctx.lineWidth = 1

    // X-axis
    ctx.moveTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)

    // Y-axis
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.stroke()

    // Draw price line
    ctx.beginPath()
    ctx.strokeStyle = "#10b981" // emerald-500
    ctx.lineWidth = 2

    // Calculate x and y positions
    const xStep = chartWidth / (data.length - 1)

    data.forEach((point, i) => {
      const x = padding + i * xStep
      const y = height - padding - ((point.price - minPrice) / priceRange) * chartHeight

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Fill area under the line
    ctx.lineTo(padding + (data.length - 1) * xStep, height - padding)
    ctx.lineTo(padding, height - padding)
    ctx.fillStyle = "rgba(16, 185, 129, 0.1)" // emerald-500 with opacity
    ctx.fill()

    // Draw points and labels
    data.forEach((point, i) => {
      if (i % Math.ceil(data.length / 10) === 0 || i === data.length - 1) {
        const x = padding + i * xStep
        const y = height - padding - ((point.price - minPrice) / priceRange) * chartHeight

        // Draw point
        ctx.fillStyle = "#10b981" // emerald-500
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fill()

        // Draw price label
        ctx.fillStyle = "#1e293b" // slate-800
        ctx.font = "12px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(`$${point.price.toFixed(2)}`, x, y - 10)

        // Draw date label on x-axis
        const date = new Date(point.timestamp)
        const dateLabel = date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
        ctx.fillText(dateLabel, x, height - padding + 20)
      }
    })

    // Draw y-axis labels
    ctx.fillStyle = "#1e293b" // slate-800
    ctx.textAlign = "right"

    const yStep = chartHeight / 4
    for (let i = 0; i <= 4; i++) {
      const y = height - padding - i * yStep
      const price = minPrice + (i / 4) * priceRange
      ctx.fillText(`$${price.toFixed(2)}`, padding - 10, y + 4)
    }
  }, [data])

  if (data.length === 0) {
    return <Card className="p-6 text-center text-muted-foreground">No historical data available</Card>
  }

  return (
    <div className="w-full h-80">
      <canvas ref={canvasRef} width={800} height={400} className="w-full h-full" />
    </div>
  )
}

