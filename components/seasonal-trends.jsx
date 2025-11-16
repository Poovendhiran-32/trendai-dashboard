"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Calendar } from "lucide-react"
import { DataService } from "@/lib/data/data-service"
import { useState, useEffect } from "react"

export function SeasonalTrends() {
  const [seasonalData, setSeasonalData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSeasonalData = async () => {
      try {
        const data = await DataService.getSeasonalTrendsData()
        setSeasonalData(data)
      } catch (error) {
        console.error('Error fetching seasonal trends data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSeasonalData()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Seasonal Trends</CardTitle>
            <Badge variant="secondary">
              <Calendar className="w-3 h-3 mr-1" />
              12 Months
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">Historical seasonal patterns and demand multipliers</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-sm text-muted-foreground">Loading seasonal trends...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!seasonalData || seasonalData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Seasonal Trends</CardTitle>
            <Badge variant="secondary">
              <Calendar className="w-3 h-3 mr-1" />
              12 Months
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">Historical seasonal patterns and demand multipliers</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-sm text-muted-foreground">No seasonal data available</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const maxDemand = Math.max(...seasonalData.map((d) => d.forecast))
  const minDemand = Math.min(...seasonalData.map((d) => d.forecast))
  const peakMonth = seasonalData.find((d) => d.forecast === maxDemand)
  const lowMonth = seasonalData.find((d) => d.forecast === minDemand)
  const peakIncrease = Math.round(((maxDemand - minDemand) / minDemand) * 100)
  const lowDecrease = Math.round(((minDemand - maxDemand) / maxDemand) * 100)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Seasonal Trends</CardTitle>
          <Badge variant="secondary">
            <Calendar className="w-3 h-3 mr-1" />
            12 Months
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">Historical seasonal patterns and demand multipliers</p>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={seasonalData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={{ stroke: "hsl(var(--border))" }} />
              <YAxis tick={{ fontSize: 12 }} tickLine={{ stroke: "hsl(var(--border))" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--card-foreground))",
                }}
                formatter={(value, name) => [
                  name === "demand" ? `${value} units` : `${value} units`,
                  name === "demand" ? "Historical Demand" : "Forecasted Demand",
                ]}
              />
              <Area
                type="monotone"
                dataKey="demand"
                stroke="hsl(var(--chart-1))"
                fill="hsl(var(--chart-1))"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="forecast"
                stroke="hsl(var(--chart-3))"
                fill="hsl(var(--chart-3))"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Peak Season:</span>
            <div className="font-medium text-chart-3">
              {peakMonth?.month} (+{peakIncrease}%)
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Low Season:</span>
            <div className="font-medium text-chart-4">
              {lowMonth?.month} ({lowDecrease}%)
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
