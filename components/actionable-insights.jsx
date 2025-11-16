"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, TrendingUp, Package, ArrowRight, Signal, DollarSign } from "lucide-react"
import { DataService } from "@/lib/data/data-service"
import { useState, useEffect } from "react"

export function ActionableInsights() {
  const [insights, setInsights] = useState([])
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [insightsData, metricsData] = await Promise.all([
          DataService.getActionableInsights(),
          DataService.getMetricsOverview()
        ])
        
        const processedInsights = insightsData.map((insight) => ({
          ...insight,
          icon:
            insight.type === "alert"
              ? AlertTriangle
              : insight.type === "opportunity"
                ? TrendingUp
                : insight.type === "warning"
                  ? Signal
                  : insight.priority === "high"
                    ? DollarSign
                    : Package,
        }))
        
        setInsights(processedInsights)
        setMetrics(metricsData)
      } catch (error) {
        console.error('Error fetching actionable insights:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Actionable Insights</CardTitle>
          <p className="text-sm text-muted-foreground">AI-generated recommendations based on forecast analysis</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-sm text-muted-foreground">Loading insights...</div>
          </div>
        </CardContent>
      </Card>
    )
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Actionable Insights</CardTitle>
        <p className="text-sm text-muted-foreground">AI-generated recommendations based on forecast analysis</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon

          return (
            <div key={index} className="p-4 border rounded-lg space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Icon
                    className={`w-4 h-4 ${
                      insight.type === "alert" || insight.type === "warning"
                        ? "text-destructive"
                        : insight.type === "opportunity"
                          ? "text-chart-1"
                          : "text-primary"
                    }`}
                  />
                  <span className="font-medium text-sm">{insight.title}</span>
                </div>
                <Badge
                  variant={
                    insight.priority === "high"
                      ? "destructive"
                      : insight.priority === "medium"
                        ? "default"
                        : "secondary"
                  }
                  className="text-xs"
                >
                  {insight.priority}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">{insight.description}</p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Impact: {insight.impact}</span>
                <Button variant={insight.priority === "high" ? "default" : "outline"} size="sm">
                  {insight.action}
                  <ArrowRight className="w-3 h-3 ml-2" />
                </Button>
              </div>
            </div>
          )
        })}

        <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-xs text-primary">
            <strong>AI Confidence:</strong> These recommendations are based on{" "}
            {metrics?.forecastAccuracy || "87.3%"} forecast accuracy and historical pattern analysis.
            Review and adjust based on business context.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
