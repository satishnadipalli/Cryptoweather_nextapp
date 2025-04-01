export interface CryptoData {
  id: string
  symbol: string
  name: string
  image: string
  currentPrice: number
  marketCap: number
  totalVolume: number
  high24h: number
  low24h: number
  priceChangePercentage24h: number
  priceChangePercentage7d: number
  priceChangePercentage30d: number
  circulatingSupply: number
  totalSupply: number | null
  maxSupply: number | null
  ath: number
  athDate: number
  atl: number
  atlDate: number
}

export interface CryptoHistoryData {
  timestamp: number
  price: number
  volume: number
  marketCap: number
}

