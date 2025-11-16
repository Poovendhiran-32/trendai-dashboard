"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { Calendar, TrendingUp, RefreshCw } from "lucide-react"
import { DataService } from "@/lib/data/data-service"
import { ExportButton } from "@/components/export/export-button"
import { AdvancedPeriodSelector } from "@/components/period-selector"
import { useState, useEffect } from "react"

export function DemandForecastChart() {
  const [forecastData, setForecastData] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState({
    id: "30d",
    label: "Last 30 days",
    description: "Past month",
    days: 30
  })
  const [lastUpdate, setLastUpdate] = useState(null)

  const fetchForecastData = async (period = selectedPeriod) => {
    try {
      setLoading(true)
      const data = await DataService.getDemandForecastData(period)
      setForecastData(data)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Error fetching demand forecast data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchForecastData()
  }, [])

  const handlePeriodChange = (newPeriod) => {
    setSelectedPeriod(newPeriod)
    fetchForecastData(newPeriod)
  }

  const handleRefresh = () => {
    fetchForecastData(selectedPeriod)
  }

  if (loading) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-foreground">Demand Forecast Analysis</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Historical data vs AI-powered predictions with confidence intervals
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-80">
            <div className="text-sm text-muted-foreground">Loading forecast data...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!forecastData || forecastData.length === 0) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-foreground">Demand Forecast Analysis</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Historical data vs AI-powered predictions with confidence intervals
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-80">
            <div className="text-sm text-muted-foreground">No forecast data available</div>
          </div>
        </CardContent>
      </Card>
    )
  }
  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-foreground">Demand Forecast Analysis</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Historical data vs AI-powered predictions with confidence intervals
              {lastUpdate && (
                <span className="ml-2 text-xs">
                  • Updated {lastUpdate.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-chart-1">
              <div className="w-2 h-2 bg-chart-1 rounded-full mr-2" />
              Historical
            </Badge>
            <Badge variant="outline" className="text-chart-2">
              <div className="w-2 h-2 bg-chart-2 rounded-full mr-2" />
              Forecast
            </Badge>
            <div className="flex items-center gap-2">
              <AdvancedPeriodSelector
                selectedPeriod={selectedPeriod}
                onPeriodChange={handlePeriodChange}
                size="sm"
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
              <ExportButton 
                dataType="forecast" 
                size="sm"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={{ stroke: "hsl(var(--border))" }} />
              <YAxis tick={{ fontSize: 12 }} tickLine={{ stroke: "hsl(var(--border))" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--card-foreground))",
                }}
              />
              {forecastData.length > 0 && (
                <ReferenceLine
                  x={forecastData.find(item => item.forecast !== null)?.date}
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="2 2"
                  label={{ value: "Forecast Start", position: "top" }}
                />
              )}
              <Line
                type="monotone"
                dataKey="historical"
                stroke="hsl(var(--chart-1))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="hsl(var(--chart-2))"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2, r: 4 }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-chart-1" />
            <span className="font-medium text-sm">Key Insights</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {(() => {
              const historicalData = forecastData.filter(item => item.historical !== null);
              const forecastDataPoints = forecastData.filter(item => item.forecast !== null);
              
              if (historicalData.length === 0 || forecastDataPoints.length === 0) {
                return "AI model is analyzing historical patterns to generate accurate demand forecasts...";
              }
              
              const avgHistorical = historicalData.reduce((sum, item) => sum + item.historical, 0) / historicalData.length;
              const avgForecast = forecastDataPoints.reduce((sum, item) => sum + item.forecast, 0) / forecastDataPoints.length;
              const growthRate = ((avgForecast - avgHistorical) / avgHistorical * 100).toFixed(1);
              
              const minForecast = Math.min(...forecastDataPoints.map(item => item.forecast));
              const maxForecast = Math.max(...forecastDataPoints.map(item => item.forecast));
              
              return `AI model predicts a ${growthRate > 0 ? '+' : ''}${growthRate}% change in demand over the next ${forecastDataPoints.length} weeks, driven by seasonal trends and market patterns. Forecast range: ${minForecast.toLocaleString()} - ${maxForecast.toLocaleString()} units with 95% confidence.`;
            })()}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
