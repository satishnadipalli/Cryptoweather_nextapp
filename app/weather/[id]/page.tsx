"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/header"
import { WeatherChart } from "@/components/weather/weather-chart"
import { WeatherTable } from "@/components/weather/weather-table"
import { fetchWeatherData, fetchWeatherHistory } from "@/redux/features/weatherSlice"
import type { RootState, AppDispatch } from "@/redux/store"

export default function WeatherDetailPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { data, history, status, error } = useSelector((state: RootState) => state.weather)
  const [activeTab, setActiveTab] = useState("chart")

  const cityId = params.id as string
  console.log(data.id,"This is form the details page of weatehr");
   // Debugging: Check the structure of `data`
  const city = data ? data?.find(city=>city.id == cityId) : null;


  useEffect(() => {
    if (status === "idle" || data.length === 0) {
      dispatch(fetchWeatherData())
    }

    if (cityId) {
      dispatch(fetchWeatherHistory(cityId))
    }
  }, [dispatch, status, data.length, cityId])

  if (!city && status !== "loading") {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>

          <Card className="border-destructive">
            <CardHeader>
              <CardTitle>City Not Found</CardTitle>
              <CardDescription>The city you are looking for does not exist or could not be loaded.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push("/weather")}>View All Cities</Button>
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

        {city ? (
          <>
            <div className="mb-6">
              <h1 className="text-3xl font-bold">
                {city?.name}, {city?.country}
              </h1>
              <p className="text-muted-foreground">Detailed weather information and forecast</p>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Current Weather</CardTitle>
                <CardDescription>Last updated: {new Date().toLocaleTimeString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex items-center gap-4">
                    <div className="text-6xl font-bold">{Math.round(city?.main?.temp)}°C</div>
                    <div>
                      <div className="text-2xl capitalize">{city?.weather?.description}</div>
                      <div className="text-muted-foreground">Feels like {Math.round(city?.main?.feels_like)}°C</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Humidity</div>
                      <div className="text-xl">{city?.main?.humidity}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Wind</div>
                      <div className="text-xl">{Math.round(city?.wind?.speed)} m/s</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Pressure</div>
                      <div className="text-xl">{city?.main?.pressure} hPa</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Visibility</div>
                      <div className="text-xl">{(city?.visibility / 1000).toFixed(1)} km</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">High</div>
                      <div className="text-xl">{Math.round(city?.main?.temp_max)}°C</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Low</div>
                      <div className="text-xl">{Math.round(city?.main?.temp_min)}°C</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Historical Data</CardTitle>
                <CardDescription>Temperature and conditions over the past 5 days</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="chart">Chart View</TabsTrigger>
                    <TabsTrigger value="table">Table View</TabsTrigger>
                  </TabsList>
                  <TabsContent value="chart">
                    <WeatherChart data={history[cityId] || []} />
                  </TabsContent>
                  <TabsContent value="table">
                    <WeatherTable data={history[cityId] || []} />
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

