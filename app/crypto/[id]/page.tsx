"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/header"
import { CryptoChart } from "@/components/crypto/crypto-chart"
import { CryptoMetrics } from "@/components/crypto/crypto-metrics"
import { fetchCryptoData, fetchCryptoHistory } from "@/redux/features/cryptoSlice"
import { toggleFavoriteCrypto } from "@/redux/features/userPreferencesSlice"
import type { RootState, AppDispatch } from "@/redux/store"

export default function CryptoDetailPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { data, history, status, error } = useSelector((state: RootState) => state.crypto)
  const { favoriteCryptos } = useSelector((state: RootState) => state.userPreferences)

  const cryptoId = params.id as string
  const crypto = data.find((c) => c.id === cryptoId)
  const isFavorite = favoriteCryptos.includes(cryptoId)

  useEffect(() => {
    if (status === "idle" || data.length === 0) {
      dispatch(fetchCryptoData())
    }

    if (cryptoId) {
      dispatch(fetchCryptoHistory(cryptoId))
    }
  }, [dispatch, status, data.length, cryptoId])

  const handleToggleFavorite = () => {
    dispatch(toggleFavoriteCrypto(cryptoId))
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  if (!crypto && status !== "loading") {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>

          <Card className="border-destructive">
            <CardHeader>
              <CardTitle>Cryptocurrency Not Found</CardTitle>
              <CardDescription>
                The cryptocurrency you are looking for does not exist or could not be loaded.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push("/crypto")}>View All Cryptocurrencies</Button>
            </CardContent>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        {crypto ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <img
                    src={crypto?.image || "/placeholder.svg"}
                    alt={crypto?.name}
                    className="w-8 h-8"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=32&width=32"
                    }}
                  />
                  <h1 className="text-3xl font-bold">
                    {crypto?.name} ({crypto?.symbol?.toUpperCase()})
                  </h1>
                </div>
                <p className="text-muted-foreground">Detailed cryptocurrency information and price history</p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleToggleFavorite}
                className={isFavorite ? "text-yellow-500" : "text-muted-foreground"}
              >
                <Star className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
              </Button>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Current Price</CardTitle>
                <CardDescription>Last updated: {new Date().toLocaleTimeString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  <div>
                    <div className="text-4xl font-bold mb-2">
                      {crypto?.currentPrice ? formatCurrency(crypto?.currentPrice) : "Loading..."}
                    </div>
                    <div
                      className={crypto?.priceChangePercentage24h >= 0 ? "text-green-500" : "text-red-500"}
                    >
                      {crypto?.priceChangePercentage24h != null
                        ? (crypto?.priceChangePercentage24h >= 0 ? "+" : "") +
                          crypto?.priceChangePercentage24h?.toFixed(2) +
                          "% (24h)"
                        : "Loading..."}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Market Cap</div>
                      <div className="text-xl">
                        {crypto?.marketCap ? formatCurrency(crypto?.marketCap) : "Loading..."}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">24h Volume</div>
                      <div className="text-xl">
                        {crypto?.totalVolume ? formatCurrency(crypto?.totalVolume) : "Loading..."}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Circulating Supply</div>
                      <div className="text-xl">
                        {crypto?.circulatingSupply
                          ? Math.round(crypto?.circulatingSupply).toLocaleString() + " " + crypto?.symbol?.toUpperCase()
                          : "Loading..."}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">All-Time High</div>
                      <div className="text-xl">
                        {crypto?.ath ? formatCurrency(crypto?.ath) : "Loading..."}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">All-Time Low</div>
                      <div className="text-xl">
                        {crypto?.atl ? formatCurrency(crypto?.atl) : "Loading..."}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Price Change (7d)</div>
                      <div
                        className={crypto?.priceChangePercentage7d >= 0 ? "text-green-500" : "text-red-500"}
                      >
                        {(crypto?.priceChangePercentage7d != null || crypto?.priceChangePercentage7d != undefined)
                          ? (crypto?.priceChangePercentage7d >= 0 ? "+" : "") +
                            crypto?.priceChangePercentage7d?.toFixed(2) +
                            "%"
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Historical Data</CardTitle>
                <CardDescription>Price and market data over time</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="chart">
                  <TabsList className="mb-4">
                    <TabsTrigger value="chart">Price Chart</TabsTrigger>
                    <TabsTrigger value="metrics">Market Metrics</TabsTrigger>
                  </TabsList>

                  <TabsContent value="chart">
                    <CryptoChart data={history[cryptoId] || []} />
                  </TabsContent>
                  <TabsContent value="metrics">
                    <CryptoMetrics crypto={crypto} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-8 bg-muted rounded w-48 mb-2"></div>
              <div className="h-4 bg-muted rounded w-64"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-24 bg-muted rounded"></div>
                <div className="h-64 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}
