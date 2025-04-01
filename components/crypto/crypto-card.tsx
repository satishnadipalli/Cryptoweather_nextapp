"use client"

import Link from "next/link"
import { Star, TrendingDown, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { CryptoData } from "@/types/crypto"

interface CryptoCardProps {
  crypto: CryptoData
  isFavorite: boolean
  onToggleFavorite: () => void
}

export function CryptoCard({ crypto, isFavorite, onToggleFavorite }: CryptoCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatMarketCap = (value: number) => {
    if (value >= 1e12) {
      return `$${(value / 1e12).toFixed(2)}T`
    } else if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`
    } else {
      return formatCurrency(value)
    }
  }

  const priceChangeColor = crypto.priceChangePercentage24h >= 0 ? "text-green-500" : "text-red-500"

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <img
              src={crypto.image || "/placeholder.svg"}
              alt={crypto.name}
              className="w-6 h-6"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg?height=24&width=24"
              }}
            />
            {crypto.name}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleFavorite}
            className={isFavorite ? "text-yellow-500" : "text-muted-foreground"}
          >
            <Star className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-2xl font-bold mb-1">{formatCurrency(crypto.currentPrice)}</div>
        <div className="flex items-center gap-1">
          {crypto.priceChangePercentage24h >= 0 ? (
            <TrendingUp className={`h-4 w-4 ${priceChangeColor}`} />
          ) : (
            <TrendingDown className={`h-4 w-4 ${priceChangeColor}`} />
          )}
          <span className={`text-sm ${priceChangeColor}`}>{crypto.priceChangePercentage24h.toFixed(2)}% (24h)</span>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="text-xs">
            <span className="text-muted-foreground">Market Cap:</span> {formatMarketCap(crypto.marketCap)}
          </div>
          <div className="text-xs">
            <span className="text-muted-foreground">Volume (24h):</span> {formatMarketCap(crypto.totalVolume)}
          </div>
          <div className="text-xs">
            <span className="text-muted-foreground">Circulating Supply:</span>{" "}
            {Math.round(crypto.circulatingSupply).toLocaleString()}
          </div>
          <div className="text-xs">
            <span className="text-muted-foreground">Symbol:</span> {crypto.symbol.toUpperCase()}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link href={`/crypto/${crypto.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

