"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, TrendingUp, Activity, X } from "lucide-react"
import { useRealTimeData } from "@/lib/hooks/use-real-time-data"

export function RealTimeAlerts() {
  const { alerts, clearAlerts, dismissAlert } = useRealTimeData()

  const getAlertIcon = (type) => {
    switch (type) {
      case "inventory_alert":
        return AlertTriangle
      case "trend_update":
        return TrendingUp
      case "external_signal":
        return Activity
      default:
        return AlertTriangle
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "default"
    }
  }

  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Real-time Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No recent alerts</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium">Real-time Alerts</CardTitle>
        <Button variant="ghost" size="sm" onClick={clearAlerts}>
          Clear All
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.slice(0, 5).map((alert) => {
          const Icon = getAlertIcon(alert.type)

          return (
            <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
              <Icon className="w-4 h-4 mt-0.5 text-muted-foreground" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{alert.title}</p>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => dismissAlert(alert.id)}>
                    <X className="w-3 h-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">{alert.message}</p>
                <div className="flex items-center justify-between">
                  <Badge variant={getSeverityColor(alert.severity)} className="text-xs">
                    {alert.severity}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
