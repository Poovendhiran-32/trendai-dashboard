"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Calendar, TrendingUp, BarChart3, PieChart } from "lucide-react"
import { DataService } from "@/lib/data/data-service"
import { ExportButton, SimpleExportButton } from "@/components/export/export-button"
import { ExportModal } from "@/components/export/export-modal"
import { useState } from "react"

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState(null)
  const [generatedReports, setGeneratedReports] = useState({})
  
  const reports = [
    {
      id: "sales-summary",
      title: "Sales Summary Report",
      description: "Comprehensive overview of sales performance",
      icon: BarChart3,
      type: "summary",
      lastGenerated: "2 hours ago",
      status: "ready"
    },
    {
      id: "product-performance",
      title: "Product Performance Analysis",
      description: "Detailed analysis of individual product performance",
      icon: TrendingUp,
      type: "analysis",
      lastGenerated: "1 day ago",
      status: "ready"
    },
    {
      id: "demand-forecast",
      title: "Demand Forecasting Report",
      description: "AI-powered demand predictions and trends",
      icon: PieChart,
      type: "forecast",
      lastGenerated: "3 hours ago",
      status: "ready"
    },
    {
      id: "inventory-alert",
      title: "Inventory Alert Report",
      description: "Stock levels and reorder recommendations",
      icon: FileText,
      type: "alert",
      lastGenerated: "30 minutes ago",
      status: "ready"
    }
  ]

  const generateReport = async (reportId) => {
    setSelectedReport(reportId)
    try {
      // Generate the actual report data based on reportId
      let data
      switch (reportId) {
        case "sales-summary":
          data = await DataService.getMetricsOverview()
          break
        case "product-performance":
          data = await DataService.getProductPerformanceData(100)
          break
        case "demand-forecast":
          data = await DataService.getDemandForecastData()
          break
        case "inventory-alert":
          data = await DataService.getActionableInsightsData()
          break
        default:
          data = []
      }
      
      // Store the generated data for download
      setGeneratedReports(prev => ({
        ...prev,
        [reportId]: data
      }))
    } catch (error) {
      console.error("Error generating report:", error)
    } finally {
      setTimeout(() => {
        setSelectedReport(null)
      }, 2000)
    }
  }

  const downloadReport = (reportId) => {
    const reportData = generatedReports[reportId]
    if (reportData) {
      // Use the export service to download
      const filename = reports.find(r => r.id === reportId)?.title.toLowerCase().replace(/\s+/g, '-')
      // This will be handled by the ExportButton component
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reports</h1>
            <p className="text-muted-foreground">Generate and download comprehensive analytics reports</p>
          </div>
          <ExportModal dataType="full" defaultFilename="dashboard-full-export">
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
          </ExportModal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => {
            const Icon = report.icon
            return (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{report.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{report.description}</p>
                      </div>
                    </div>
                    <Badge variant={report.status === "ready" ? "default" : "secondary"}>
                      {report.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2" />
                      Last generated: {report.lastGenerated}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => generateReport(report.id)}
                        disabled={selectedReport === report.id}
                        className="flex-1"
                      >
                        {selectedReport === report.id ? "Generating..." : "Generate"}
                      </Button>
                      {generatedReports[report.id] ? (
                        <SimpleExportButton
                          data={generatedReports[report.id]}
                          filename={report.title.toLowerCase().replace(/\s+/g, '-')}
                          format="csv"
                          size="sm"
                        />
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          disabled
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Recent Reports Section */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reports.slice(0, 3).map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{report.title}</div>
                      <div className="text-sm text-muted-foreground">
                        Generated {report.lastGenerated}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        </main>
      </div>
    </ProtectedRoute>
  )
}
