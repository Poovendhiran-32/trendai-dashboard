"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { DemandForecastChart } from "@/components/demand-forecast-chart"
import { MetricsOverview } from "@/components/metrics-overview"
import { SeasonalTrends } from "@/components/seasonal-trends"
import { ExternalSignals } from "@/components/external-signals"
import { ActionableInsights } from "@/components/actionable-insights"
import { ProductPerformance } from "@/components/product-performance"
import { RealTimeAlerts } from "@/components/real-time-alerts"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <DashboardHeader />

        <main className="container mx-auto px-4 py-6 space-y-6">
          {/* Key Metrics Overview */}
          <MetricsOverview />

          {/* Main Forecasting Chart */}
          <DemandForecastChart />

          {/* Secondary Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SeasonalTrends />
            <ExternalSignals />
          </div>

          {/* Product Performance and Insights */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <ProductPerformance />
            </div>
            <div className="space-y-6">
              <ActionableInsights />
              <RealTimeAlerts />
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}