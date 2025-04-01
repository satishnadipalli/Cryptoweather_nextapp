export interface WeatherData {
  id: string
  name: string
  country: string
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
  }
  weather: {
    main: string
    description: string
  }
  wind: {
    speed: number
    deg: number
  }
  visibility: number
  dt: number
}

export interface WeatherHistoryData {
  date: string
  temperature: number
  condition: string
  humidity: number
  windSpeed: number
}

