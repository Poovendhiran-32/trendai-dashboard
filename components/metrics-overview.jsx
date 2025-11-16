"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, AlertTriangle, Target, Wifi, WifiOff } from "lucide-react"
import { useRealTimeData } from "@/lib/hooks/use-real-time-data"
import { Badge } from "@/components/ui/badge"

export function MetricsOverview() {
  // DEBUG: Log metrics to inspect their values
  const { metrics, isConnected } = useRealTimeData();
  console.log('DEBUG MetricsOverview metrics:', metrics);

  const metricsData = [
    {
      title: "Total Revenue",
      value: metrics ? `$${(metrics.total_revenue / 1000).toFixed(1)}K` : "Loading...",
      change: "+12.7%", // This would come from historical comparison
      trend: "up",
      icon: Target,
      description: "last 24 hours",
    },
    {
      title: "Total Orders",
      value: metrics ? metrics.total_orders.toLocaleString() : "Loading...",
      change: "+18.3%",
      trend: "up",
      icon: TrendingUp,
      description: "orders placed",
    },
    {
      title: "Avg Order Value",
      value: metrics ? `$${metrics.avg_order_value.toFixed(2)}` : "Loading...",
      change: "-2.1%",
      trend: "down",
      icon: AlertTriangle,
      description: "per order",
    },
    {
      title: "Conversion Rate",
      value: metrics ? `${metrics.conversion_rate.toFixed(1)}%` : "Loading...",
      change: "+0.8%",
      trend: "up",
      icon: TrendingUp,
      description: "conversion rate",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Real-time Metrics</h2>
        <Badge variant={isConnected ? "default" : "destructive"} className="flex items-center gap-1">
          {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
          {isConnected ? "Live" : "Offline"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricsData.map((metric) => {
          const Icon = metric.icon
          const isPositive = metric.trend === "up"

          return (
            <Card key={metric.title} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
                <Icon
                  className={`w-4 h-4 ${metric.title === "Avg Order Value" ? "text-destructive" : "text-primary"}`}
                />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground mb-1">{metric.value}</div>
                <div className="flex items-center text-xs">
                  <span className={`flex items-center ${isPositive ? "text-chart-1" : "text-chart-4"}`}>
                    {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {metric.change}
                  </span>
                  <span className="text-muted-foreground ml-2">{metric.description}</span>
                </div>
                {metrics && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Updated: {new Date(metrics.lastUpdate).toLocaleTimeString()}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
