import { Header } from "@/components/header"
import { CryptoDashboard } from "@/components/crypto/crypto-dashboard"

export const metadata = {
  title: "Cryptocurrency - CryptoWeather Nexus",
  description: "Cryptocurrency prices, market cap, and more",
}

export default function CryptoPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <CryptoDashboard fullView />
      </div>
    </main>
  )
}

