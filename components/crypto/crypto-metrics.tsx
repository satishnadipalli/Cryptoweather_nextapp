import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { CryptoData } from "@/types/crypto"

interface CryptoMetricsProps {
  crypto: CryptoData
}

export function CryptoMetrics({ crypto }: CryptoMetricsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value?.toFixed(2)}%`
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp)?.toLocaleDateString()
  }

  const metrics = [
    { name: "Current Price", value: formatCurrency(crypto?.currentPrice) },
    { name: "Market Cap", value: formatCurrency(crypto?.marketCap) },
    { name: "Trading Volume (24h)", value: formatCurrency(crypto?.totalVolume) },
    { name: "24h High", value: formatCurrency(crypto?.high24h) },
    { name: "24h Low", value: formatCurrency(crypto?.low24h) },
    {
      name: "Price Change (24h)",
      value: formatPercentage(crypto?.priceChangePercentage24h),
      className: crypto?.priceChangePercentage24h >= 0 ? "text-green-500" : "text-red-500",
    },
    {
      name: "Price Change (7d)",
      value: crypto?.priceChangePercentage7d != null ? formatPercentage(crypto?.priceChangePercentage7d) : "Free Tier is no able to access History",
      className: crypto?.priceChangePercentage7d >= 0 ? "text-green-500" : "text-red-500",
    },
    {
      name: "Price Change (30d)",
      value:  crypto?.priceChangePercentage30d != null ? formatPercentage(crypto?.priceChangePercentage30d) : "Free Tier is no able to access History",
      className: crypto?.priceChangePercentage30d >= 0 ? "text-green-500" : "text-red-500",
    },
    { name: "All-Time High", value: formatCurrency(crypto?.ath) },
    { name: "All-Time High Date", value: formatDate(crypto?.athDate) },
    { name: "All-Time Low", value: formatCurrency(crypto?.atl) },
    { name: "All-Time Low Date", value: formatDate(crypto?.atlDate) },
    {
      name: "Circulating Supply",
      value: `${Math.round(crypto?.circulatingSupply)?.toLocaleString()} ${crypto?.symbol?.toUpperCase()}`,
    },
    {
      name: "Total Supply",
      value: crypto?.totalSupply
        ? `${Math.round(crypto?.totalSupply).toLocaleString()} ${crypto?.symbol?.toUpperCase()}`
        : "N/A",
    },
    {
      name: "Max Supply",
      value: crypto?.maxSupply
        ? `${Math.round(crypto?.maxSupply).toLocaleString()} ${crypto?.symbol?.toUpperCase()}`
        : "N/A",
    },
  ]

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Metric</TableHead>
          <TableHead>Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {metrics.map((metric) => (
          <TableRow key={metric.name}>
            <TableCell>{metric.name}</TableCell>
            <TableCell className={metric.className}>
             { (metric?.value == undefined) ? "subscribe api" : metric?.value}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

