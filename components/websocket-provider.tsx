"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useToast } from "@/hooks/use-toast"
import { addNotification } from "@/redux/features/notificationsSlice"
import { updateCryptoPrice } from "@/redux/features/cryptoSlice"

interface WebSocketProviderProps {
  children: React.ReactNode
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const dispatch = useDispatch()
  const { toast } = useToast()
  const [wsConnected, setWsConnected] = useState(false)

  useEffect(() => {
    // Connect to CoinCap WebSocket for real-time price updates
    let ws: WebSocket | null = null
    let reconnectAttempts = 0
    const maxReconnectAttempts = 5

    const connectWebSocket = () => {
      ws = new WebSocket("wss://ws.coincap.io/prices?assets=bitcoin,ethereum,dogecoin,cardano,solana")

      ws.onopen = () => {
        console.log("WebSocket connection established")
        setWsConnected(true)
        reconnectAttempts = 0

        // Send a notification that connection is established
        toast({
          title: "Real-time Updates",
          description: "Connected to cryptocurrency price feed",
        })
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)

          // Update crypto prices in Redux store
          Object.entries(data).forEach(([crypto, price]) => {
            dispatch(
              updateCryptoPrice({
                id: crypto,
                price: Number.parseFloat(price as string),
              }),
            )

            // Create notification for significant price changes (simulated threshold)
            const priceChange = Math.random() // Simulated for demo purposes
            if (priceChange > 0.95) {
              const direction = Math.random() > 0.5 ? "increased" : "decreased"
              const changePercent = (Math.random() * 5).toFixed(2)

              const notification = {
                id: `price-${crypto}-${Date.now()}`,
                type: "price_alert",
                title: `${crypto.charAt(0).toUpperCase() + crypto.slice(1)} Price Alert`,
                message: `Price has ${direction} by ${changePercent}% in the last hour`,
                timestamp: Date.now(),
              }

              dispatch(addNotification(notification))

              toast({
                title: notification.title,
                description: notification.message,
                variant: direction === "increased" ? "default" : "destructive",
              })
            }
          })
        } catch (error) {
          console.error("Error parsing WebSocket message:", error)
        }
      }

      ws.onerror = (error) => {
        console.log("WebSocket error:", error)
        setWsConnected(false)
      }

      ws.onclose = () => {
        console.log("WebSocket connection closed")
        setWsConnected(false)

        // Try to reconnect
        if (reconnectAttempts < maxReconnectAttempts) {
          reconnectAttempts++
          console.log(`Attempting to reconnect (${reconnectAttempts}/${maxReconnectAttempts})...`)
          setTimeout(connectWebSocket, 3000 * reconnectAttempts)
        } else {
          toast({
            title: "Connection Error",
            description: "Failed to connect to real-time updates. Please refresh the page.",
            variant: "destructive",
          })
        }
      }
    }

    connectWebSocket()

    // Simulate weather alerts
    const weatherAlertInterval = setInterval(() => {
      if (Math.random() > 0.9) {
        const cities = ["New York", "London", "Tokyo", "Sydney", "Paris"]
        const alertTypes = [
          "Heavy Rain Warning",
          "High Temperature Alert",
          "Storm Warning",
          "Snow Advisory",
          "Wind Advisory",
        ]

        const city = cities[Math.floor(Math.random() * cities.length)]
        const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)]

        const notification = {
          id: `weather-${city}-${Date.now()}`,
          type: "weather_alert",
          title: `${alertType} for ${city}`,
          message: `Weather conditions in ${city} may be severe in the next 24 hours.`,
          timestamp: Date.now(),
        }

        dispatch(addNotification(notification))

        toast({
          title: notification.title,
          description: notification.message,
        })
      }
    }, 30000) // Check every 30 seconds

    // Cleanup function
    return () => {
      if (ws) {
        ws.close()
      }
      clearInterval(weatherAlertInterval)
    }
  }, [dispatch, toast])

  return (
    <>
      {!wsConnected && (
        <div className="fixed bottom-4 right-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-md shadow-md z-50 text-sm">
          Connecting to real-time updates...
        </div>
      )}
      {children}
    </>
  )
}

