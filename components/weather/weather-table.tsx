import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { WeatherHistoryData } from "@/types/weather"

interface WeatherTableProps {
  data: WeatherHistoryData[]
}

export function WeatherTable({ data }: WeatherTableProps) {
  if (data.length === 0) {
    return <Card className="p-6 text-center text-muted-foreground">No historical data available</Card>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Temperature</TableHead>
          <TableHead>Condition</TableHead>
          <TableHead>Humidity</TableHead>
          <TableHead>Wind Speed</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.date}>
            <TableCell>
              {new Date(item.date).toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </TableCell>
            <TableCell>{Math.round(item.temperature)}°C</TableCell>
            <TableCell className="capitalize">{item.condition}</TableCell>
            <TableCell>{item.humidity}%</TableCell>
            <TableCell>{item.windSpeed} m/s</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

