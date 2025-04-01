import { Suspense } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WeatherDashboard } from "@/components/weather/weather-dashboard"
import { CryptoDashboard } from "@/components/crypto/crypto-dashboard"
import { NewsDashboard } from "@/components/news/news-dashboard"
import { DashboardSkeleton } from "@/components/dashboard-skeleton"
import { Header } from "@/components/header"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">CryptoWeather Nexus Dashboard</h1>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="weather">Weather</TabsTrigger>
            <TabsTrigger value="crypto">Cryptocurrency</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-8">
            <Suspense
              fallback={
                <div className="flex items-center justify-center p-12">
                  <LoadingSpinner size="lg" />
                  <span className="ml-2 text-lg">Loading weather data...</span>
                </div>
              }
            >
              <WeatherDashboard />
            </Suspense>

            <Suspense
              fallback={
                <div className="flex items-center justify-center p-12">
                  <LoadingSpinner size="lg" />
                  <span className="ml-2 text-lg">Loading cryptocurrency data...</span>
                </div>
              }
            >
              <CryptoDashboard />
            </Suspense>

            <Suspense
              fallback={
                <div className="flex items-center justify-center p-12">
                  <LoadingSpinner size="lg" />
                  <span className="ml-2 text-lg">Loading news data...</span>
                </div>
              }
            >
              <NewsDashboard />
            </Suspense>
          </TabsContent>

          <TabsContent value="weather">
            <Suspense fallback={<DashboardSkeleton type="weather" />}>
              <WeatherDashboard fullView />
            </Suspense>
          </TabsContent>

          <TabsContent value="crypto">
            <Suspense fallback={<DashboardSkeleton type="crypto" />}>
              <CryptoDashboard fullView />
            </Suspense>
          </TabsContent>

          <TabsContent value="news">
            <Suspense fallback={<DashboardSkeleton type="news" />}>
              <NewsDashboard fullView />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

