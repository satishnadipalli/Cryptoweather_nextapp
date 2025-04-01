"use client"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Link from "next/link"
import { ArrowRight, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { WeatherCard } from "@/components/weather/weather-card"
import { fetchWeatherData } from "@/redux/features/weatherSlice"
import { toggleFavoriteCity } from "@/redux/features/userPreferencesSlice"
import type { RootState, AppDispatch } from "@/redux/store"

interface WeatherDashboardProps {
  fullView?: boolean
}

export function WeatherDashboard({ fullView = false }: WeatherDashboardProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { data, status, error } = useSelector((state: RootState) => state.weather)
  const { favoriteCities } = useSelector((state: RootState) => state.userPreferences)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchWeatherData())
    }

    // Refresh weather data every 60 seconds
    const interval = setInterval(() => {
      dispatch(fetchWeatherData())
    }, 60000)

    return () => clearInterval(interval)
  }, [dispatch, status])

  const handleToggleFavorite = (cityId: string) => {
    dispatch(toggleFavoriteCity(cityId))
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await dispatch(fetchWeatherData())
    setTimeout(() => setRefreshing(false), 1000) // Ensure animation plays fully
  }

  // Filter cities based on search query and ensure all cities are shown
  const filteredData = Array.isArray(data) ? data : [data] // Always show all cities

  const filteredCities = filteredData.filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (status === "loading" && !data.length) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Weather</h2>
          <div className="animate-pulse h-8 w-24 bg-muted rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-6 bg-muted rounded w-24"></div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="h-12 bg-muted rounded w-20 mb-2"></div>
                <div className="h-4 bg-muted rounded w-full mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardContent>
              <CardFooter>
                <div className="h-9 bg-muted rounded w-full"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (status === "failed") {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle>Error Loading Weather Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error || "Failed to load weather data. Please try again later."}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => dispatch(fetchWeatherData())}>Retry</Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Weather</h2>
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
              <Link href="/weather">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search city..."
          className="border p-2 rounded-md max-w-[300px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCities.map((city) => (
          <WeatherCard
            key={city.id}
            city={city}
            isFavorite={favoriteCities.includes(city.id)}
            onToggleFavorite={() => handleToggleFavorite(city.id)}
          />
        ))}
      </div>
    </div>
  )
}
