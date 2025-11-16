"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Minus, Cloud, DollarSign, Users, Calendar, Zap } from "lucide-react"
import { DataService } from "@/lib/data/data-service"
import { useState, useEffect } from "react"

export function ExternalSignals() {
  const [signals, setSignals] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const data = await DataService.getExternalSignalsData()
        const processedSignals = data.map((signal) => ({
          name: signal.type.charAt(0).toUpperCase() + signal.type.slice(1) + " Signal",
          value: Math.round(signal.strength * 10),
          trend: signal.impact === "positive" ? "up" : signal.impact === "negative" ? "down" : "neutral",
          change:
            signal.impact === "positive"
              ? `+${Math.round(signal.strength)}%`
              : signal.impact === "negative"
                ? `-${Math.round(signal.strength)}%`
                : "0%",
          icon:
            signal.type === "weather"
              ? Cloud
              : signal.type === "economic"
                ? DollarSign
                : signal.type === "social"
                  ? Users
                  : signal.type === "event"
                    ? Calendar
                    : Zap,
          description: signal.description,
          source: signal.source,
        }))
        setSignals(processedSignals)
      } catch (error) {
        console.error('Error fetching external signals:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSignals()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">External Signals</CardTitle>
          <p className="text-sm text-muted-foreground">Market factors influencing demand predictions</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-sm text-muted-foreground">Loading signals...</div>
          </div>
        </CardContent>
      </Card>
    )
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">External Signals</CardTitle>
        <p className="text-sm text-muted-foreground">Market factors influencing demand predictions</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {signals.map((signal) => {
          const Icon = signal.icon
          const TrendIcon = signal.trend === "up" ? TrendingUp : signal.trend === "down" ? TrendingDown : Minus

          return (
            <div key={signal.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">{signal.name}</span>
                </div>
                <Badge
                  variant={signal.trend === "up" ? "default" : signal.trend === "down" ? "destructive" : "secondary"}
                  className="text-xs"
                >
                  <TrendIcon className="w-3 h-3 mr-1" />
                  {signal.change}
                </Badge>
              </div>

              <Progress value={signal.value} className="h-2" />

              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">{signal.description}</p>
                <span className="text-xs text-muted-foreground">via {signal.source}</span>
              </div>
            </div>
          )
        })}

        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">Signal Strength:</strong> External factors show{" "}
            {signals.filter((s) => s.trend === "up").length > signals.filter((s) => s.trend === "down").length
              ? "positive"
              : "mixed"}{" "}
            influence on demand with multiple data sources providing real-time insights.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
