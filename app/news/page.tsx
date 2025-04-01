import { Header } from "@/components/header"
import { NewsDashboard } from "@/components/news/news-dashboard"

export const metadata = {
  title: "News - CryptoWeather Nexus",
  description: "Latest cryptocurrency and blockchain news",
}

export default function NewsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <NewsDashboard fullView />
      </div>
    </main>
  )
}

