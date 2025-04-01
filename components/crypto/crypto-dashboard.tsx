"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Link from "next/link"
import { ArrowRight, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CryptoCard } from "@/components/crypto/crypto-card"
import { fetchCryptoData } from "@/redux/features/cryptoSlice"
import { toggleFavoriteCrypto } from "@/redux/features/userPreferencesSlice"
import type { RootState, AppDispatch } from "@/redux/store"

interface CryptoDashboardProps {
  fullView?: boolean
}

export function CryptoDashboard({ fullView = false }: CryptoDashboardProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { data, status, error } = useSelector((state: RootState) => state.crypto)
  const { favoriteCryptos } = useSelector((state: RootState) => state.userPreferences)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCryptoData())
    }

    // Refresh crypto data every 60 seconds
    const interval = setInterval(() => {
      dispatch(fetchCryptoData())
    }, 60000)

    return () => clearInterval(interval)
  }, [dispatch, status])

  const handleToggleFavorite = (cryptoId: string) => {
    dispatch(toggleFavoriteCrypto(cryptoId))
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await dispatch(fetchCryptoData())
    setTimeout(() => setRefreshing(false), 1000) // Ensure animation plays fully
  }

  if (status === "loading" && !data.length) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Cryptocurrency</h2>
          <div className="animate-pulse h-8 w-24 bg-muted rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse p-6">
              <div className="h-6 bg-muted rounded w-24 mb-4"></div>
              <div className="h-8 bg-muted rounded w-32 mb-2"></div>
              <div className="h-4 bg-muted rounded w-full mb-2"></div>
              <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-9 bg-muted rounded w-full"></div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (status === "failed") {
    return (
      <Card className="border-destructive p-6">
        <h3 className="text-lg font-semibold mb-2">Error Loading Cryptocurrency Data</h3>
        <p className="mb-4">{error || "Failed to load cryptocurrency data. Please try again later."}</p>
        <Button onClick={() => dispatch(fetchCryptoData())}>Retry</Button>
      </Card>
    )
  }

  // Filter cryptos based on favorites if there are any
  const cryptosToDisplay = fullView
    ? data
    : favoriteCryptos.length > 0
      ? data.filter((crypto) => favoriteCryptos.includes(crypto.id))
      : data.slice(0, 3)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Cryptocurrency</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={refreshing || status === "loading"}
            className="relative"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing || status === "loading" ? "animate-spin" : ""}`} />
            <span className="sr-only">Refresh</span>
            {(refreshing || status === "loading") && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
            )}
          </Button>
          {!fullView && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/crypto">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      {favoriteCryptos.length > 0 && !fullView && (
        <div className="flex items-center">
          <p className="text-sm text-muted-foreground">Showing your favorite cryptocurrencies</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cryptosToDisplay.map((crypto) => (
          <CryptoCard
            key={crypto.id}
            crypto={crypto}
            isFavorite={favoriteCryptos.includes(crypto.id)}
            onToggleFavorite={() => handleToggleFavorite(crypto.id)}
          />
        ))}
      </div>
    </div>
  )
}

