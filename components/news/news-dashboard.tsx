"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import Link from "next/link"
import { ArrowRight, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { NewsCard } from "@/components/news/news-card"
import { setNewsData, setLoading, setError } from "@/redux/features/newsSlice"
import type { RootState, AppDispatch } from "@/redux/store"

interface NewsDashboardProps {
  fullView?: boolean
}

export function NewsDashboard({ fullView = false }: NewsDashboardProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { data, status, error } = useSelector((state: RootState) => state.news)
  const [refreshing, setRefreshing] = useState(false)

  // Function to fetch news
  const fetchNews = async () => {
    try {
      console.log("Fetching news...")
      const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY
      if (!apiKey) {
        throw new Error("API key is missing.")
      }

      const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&language=en`
      dispatch(setLoading()) 

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error("Failed to fetch news data.")
      }

      const data = await response.json()
      dispatch(setNewsData(data.results)) // Use "results" for NewsData.io
    } catch (error) {
      dispatch(setError(error.message || "Failed to load news data"))
    }
  }

  useEffect(() => {
    if (status === "idle") {
      fetchNews()
    }
    const interval = setInterval(() => {
      fetchNews()
    }, 300000)
    return () => clearInterval(interval)
  }, [dispatch, status])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchNews()
    setTimeout(() => setRefreshing(false), 1000)
  }

  if (status === "loading" && !data.length) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Latest News</h2>
          <div className="animate-pulse h-8 w-24 bg-muted rounded"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="animate-pulse p-4">
              <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-full mb-1"></div>
              <div className="h-4 bg-muted rounded w-5/6 mb-1"></div>
              <div className="h-4 bg-muted rounded w-2/3 mb-2"></div>
              <div className="h-3 bg-muted rounded w-24"></div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (status === "failed") {
    return (
      <Card className="border-destructive p-6">
        <h3 className="text-lg font-semibold mb-2">Error Loading News</h3>
        <p className="mb-4">{error || "Failed to load news data. Please try again later."}</p>
        <Button onClick={fetchNews}>Retry</Button>
      </Card>
    )
  }

  const newsToDisplay = fullView ? data : data.slice(0, 5)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Latest News</h2>
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
              <Link href="/news">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {newsToDisplay.map((article, index) => (
          <div key={index}>
            <NewsCard id={index} articled={article} />
          </div>
        ))}
      </div>
    </div>
  )
}
