"use client"

import { DataService } from "@/lib/data/data-service"

export class ExportService {
  // CSV Export Functions
  static async exportToCSV(data, filename, headers = null) {
    try {
      let csvContent = ""
      
      if (headers) {
        csvContent += headers.join(",") + "\n"
      } else if (data.length > 0) {
        // Auto-generate headers from first object
        const firstRow = data[0]
        const autoHeaders = Object.keys(firstRow)
        csvContent += autoHeaders.join(",") + "\n"
      }
      
      // Add data rows
      data.forEach(row => {
        const values = Object.values(row).map(value => {
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value
        })
        csvContent += values.join(",") + "\n"
      })
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `${filename}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      return { success: true, message: "CSV exported successfully" }
    } catch (error) {
      console.error("CSV export error:", error)
      return { success: false, error: "Failed to export CSV" }
    }
  }

  // JSON Export Functions
  static async exportToJSON(data, filename) {
    try {
      const jsonContent = JSON.stringify(data, null, 2)
      const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `${filename}.json`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      return { success: true, message: "JSON exported successfully" }
    } catch (error) {
      console.error("JSON export error:", error)
      return { success: false, error: "Failed to export JSON" }
    }
  }

  // Excel Export Functions (using CSV format for simplicity)
  static async exportToExcel(data, filename, sheetName = "Sheet1") {
    try {
      // For now, we'll use CSV format which can be opened in Excel
      // In a production app, you'd use a library like xlsx
      return await this.exportToCSV(data, filename)
    } catch (error) {
      console.error("Excel export error:", error)
      return { success: false, error: "Failed to export Excel file" }
    }
  }

  // Dashboard Data Exports
  static async exportMetricsData() {
    try {
      const metrics = await DataService.getMetricsOverview()
      const timestamp = new Date().toISOString().split('T')[0]
      
      const exportData = [
        {
          metric: "Total Revenue",
          value: metrics.revenueImpact,
          change: metrics.revenueImpactChange,
          period: "Last 30 days"
        },
        {
          metric: "Forecast Accuracy",
          value: metrics.forecastAccuracy,
          change: metrics.forecastAccuracyChange,
          period: "Current"
        },
        {
          metric: "Predicted Demand",
          value: metrics.predictedDemand,
          change: metrics.predictedDemandChange,
          period: "Next 6 weeks"
        },
        {
          metric: "Stock Risk",
          value: metrics.stockRisk,
          change: metrics.stockRiskChange,
          period: "Current"
        }
      ]
      
      return await this.exportToCSV(exportData, `metrics-${timestamp}`)
    } catch (error) {
      console.error("Metrics export error:", error)
      return { success: false, error: "Failed to export metrics data" }
    }
  }

  static async exportDemandForecastData() {
    try {
      const forecastData = await DataService.getDemandForecastData()
      const timestamp = new Date().toISOString().split('T')[0]
      
      const exportData = forecastData.map(item => ({
        date: item.date,
        historical: item.historical || "",
        forecast: item.forecast || "",
        confidence_upper: item.confidence?.upper || "",
        confidence_lower: item.confidence?.lower || ""
      }))
      
      return await this.exportToCSV(exportData, `demand-forecast-${timestamp}`)
    } catch (error) {
      console.error("Demand forecast export error:", error)
      return { success: false, error: "Failed to export demand forecast data" }
    }
  }

  static async exportProductPerformanceData() {
    try {
      const productData = await DataService.getProductPerformanceData(100) // Get more products
      const timestamp = new Date().toISOString().split('T')[0]
      
      const exportData = productData.map(product => ({
        id: product.id,
        name: product.name,
        category: product.category,
        sales: product.sales,
        revenue: product.revenue,
        trend: product.trend,
        trend_score: product.trendScore,
        stock: product.stock,
        stock_status: product.stockStatus
      }))
      
      return await this.exportToCSV(exportData, `product-performance-${timestamp}`)
    } catch (error) {
      console.error("Product performance export error:", error)
      return { success: false, error: "Failed to export product performance data" }
    }
  }

  static async exportSeasonalTrendsData() {
    try {
      const seasonalData = await DataService.getSeasonalTrendsData()
      const timestamp = new Date().toISOString().split('T')[0]
      
      const exportData = seasonalData.map(item => ({
        month: item.month,
        demand: item.demand,
        forecast: item.forecast,
        confidence: item.confidence
      }))
      
      return await this.exportToCSV(exportData, `seasonal-trends-${timestamp}`)
    } catch (error) {
      console.error("Seasonal trends export error:", error)
      return { success: false, error: "Failed to export seasonal trends data" }
    }
  }

  static async exportExternalSignalsData() {
    try {
      const signalsData = await DataService.getExternalSignalsData()
      const timestamp = new Date().toISOString().split('T')[0]
      
      const exportData = signalsData.map(signal => ({
        date: signal.date,
        type: signal.type,
        impact: signal.impact,
        strength: signal.strength,
        description: signal.description,
        source: signal.source
      }))
      
      return await this.exportToCSV(exportData, `external-signals-${timestamp}`)
    } catch (error) {
      console.error("External signals export error:", error)
      return { success: false, error: "Failed to export external signals data" }
    }
  }

  static async exportActionableInsightsData() {
    try {
      const insightsData = await DataService.getActionableInsightsData()
      const timestamp = new Date().toISOString().split('T')[0]
      
      const exportData = insightsData.map(insight => ({
        type: insight.type,
        priority: insight.priority,
        title: insight.title,
        description: insight.description,
        action: insight.action,
        impact: insight.impact
      }))
      
      return await this.exportToCSV(exportData, `actionable-insights-${timestamp}`)
    } catch (error) {
      console.error("Actionable insights export error:", error)
      return { success: false, error: "Failed to export actionable insights data" }
    }
  }

  // Comprehensive Dashboard Export
  static async exportFullDashboard() {
    try {
      const timestamp = new Date().toISOString().split('T')[0]
      
      // Get all dashboard data
      const [
        metrics,
        forecastData,
        productData,
        seasonalData,
        signalsData,
        insightsData
      ] = await Promise.all([
        DataService.getMetricsOverview(),
        DataService.getDemandForecastData(),
        DataService.getProductPerformanceData(50),
        DataService.getSeasonalTrendsData(),
        DataService.getExternalSignalsData(),
        DataService.getActionableInsightsData()
      ])

      // Create comprehensive export data
      const fullExport = {
        export_info: {
          timestamp: new Date().toISOString(),
          version: "1.0.0",
          data_types: ["metrics", "forecast", "products", "seasonal", "signals", "insights"]
        },
        metrics,
        demand_forecast: forecastData,
        product_performance: productData,
        seasonal_trends: seasonalData,
        external_signals: signalsData,
        actionable_insights: insightsData
      }
      
      return await this.exportToJSON(fullExport, `dashboard-full-export-${timestamp}`)
    } catch (error) {
      console.error("Full dashboard export error:", error)
      return { success: false, error: "Failed to export full dashboard data" }
    }
  }

  // Utility function to format data for different export types
  static formatDataForExport(data, format = 'csv') {
    switch (format) {
      case 'csv':
        return data
      case 'json':
        return JSON.stringify(data, null, 2)
      case 'excel':
        return data // Will be converted to CSV
      default:
        return data
    }
  }

  // Get available export formats
  static getAvailableFormats() {
    return [
      { value: 'csv', label: 'CSV', description: 'Comma-separated values' },
      { value: 'json', label: 'JSON', description: 'JavaScript Object Notation' },
      { value: 'excel', label: 'Excel', description: 'Microsoft Excel format' }
    ]
  }

  // Get available data types for export
  static getAvailableDataTypes() {
    return [
      { value: 'metrics', label: 'Metrics Overview', description: 'Key performance metrics' },
      { value: 'forecast', label: 'Demand Forecast', description: 'AI-powered demand predictions' },
      { value: 'products', label: 'Product Performance', description: 'Product sales and trends' },
      { value: 'seasonal', label: 'Seasonal Trends', description: 'Seasonal demand patterns' },
      { value: 'signals', label: 'External Signals', description: 'Market signals and events' },
      { value: 'insights', label: 'Actionable Insights', description: 'AI-generated recommendations' },
      { value: 'full', label: 'Full Dashboard', description: 'Complete dashboard data' }
    ]
  }
}
