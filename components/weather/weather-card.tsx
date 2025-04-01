"use client"

import Link from "next/link"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { WeatherData } from "@/types/weather"

interface WeatherCardProps {
  city: WeatherData
  isFavorite: boolean
  onToggleFavorite: () => void
}

export function WeatherCard({ city, isFavorite, onToggleFavorite }: WeatherCardProps) {
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "clear":
        return "☀️"
      case "clouds":
        return "☁️"
      case "rain":
        return "🌧️"
      case "snow":
        return "❄️"
      case "thunderstorm":
        return "⛈️"
      case "drizzle":
        return "🌦️"
      case "mist":
      case "fog":
        return "🌫️"
      default:
        return "🌤️"
    }
  }

  console.log(city,"here is the city that you are looking for ")

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>{city.name}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleFavorite}
            className={isFavorite ? "text-yellow-500" : "text-muted-foreground"}
          >
            <Star className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
          </Button>
        </div>
        <CardDescription>{city.country}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center gap-2">
          <span className="text-4xl">{getWeatherIcon(city.weather.main)}</span>
          <div className="text-3xl font-bold">{Math.round(city.main.temp)}°C</div>
        </div>
        <p className="text-sm capitalize">{city.weather.description}</p>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div className="text-xs">
            <span className="text-muted-foreground">Humidity:</span> {city.main.humidity}%
          </div>
          <div className="text-xs">
            <span className="text-muted-foreground">Wind:</span> {Math.round(city.wind.speed)} m/s
          </div>
          <div className="text-xs">
            <span className="text-muted-foreground">High:</span> {Math.round(city.main.temp_max)}°C
          </div>
          <div className="text-xs">
            <span className="text-muted-foreground">Low:</span> {Math.round(city.main.temp_min)}°C
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
          <Link href={`/weather/${city.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

