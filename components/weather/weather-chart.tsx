"use client"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import type { WeatherHistoryData } from "@/types/weather"

interface WeatherChartProps {
  data: WeatherHistoryData[]
}

export function WeatherChart({ data }: WeatherChartProps) {
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

    // Find min and max temperatures
    const temperatures = data.map((d) => d.temperature)
    const minTemp = Math.min(...temperatures) - 2
    const maxTemp = Math.max(...temperatures) + 2
    const tempRange = maxTemp - minTemp

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

    // Draw temperature line
    ctx.beginPath()
    ctx.strokeStyle = "#3b82f6" // blue-500
    ctx.lineWidth = 2

    // Calculate x and y positions
    const xStep = chartWidth / (data.length - 1)

    data.forEach((point, i) => {
      const x = padding + i * xStep
      const y = height - padding - ((point.temperature - minTemp) / tempRange) * chartHeight

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }

      // Draw point
      ctx.fillStyle = "#3b82f6" // blue-500
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()

      // Draw temperature label
      ctx.fillStyle = "#1e293b" // slate-800
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`${Math.round(point.temperature)}°C`, x, y - 10)

      // Draw date label on x-axis
      const date = new Date(point.date)
      const dateLabel = date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
      ctx.fillText(dateLabel, x, height - padding + 20)
    })

    ctx.stroke()

    // Draw y-axis labels
    ctx.fillStyle = "#1e293b" // slate-800
    ctx.textAlign = "right"

    const yStep = chartHeight / 4
    for (let i = 0; i <= 4; i++) {
      const y = height - padding - i * yStep
      const temp = minTemp + (i / 4) * tempRange
      ctx.fillText(`${Math.round(temp)}°C`, padding - 10, y + 4)
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

