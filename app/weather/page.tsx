import { Header } from "@/components/header"
import { WeatherDashboard } from "@/components/weather/weather-dashboard"

export const metadata = {
  title: "Weather - CryptoWeather Nexus",
  description: "Weather information for cities around the world",
}

export default function WeatherPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <WeatherDashboard fullView />
      </div>
    </main>
  )
}

