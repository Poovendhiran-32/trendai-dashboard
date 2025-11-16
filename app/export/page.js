"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Download, FileText, Calendar, Database, BarChart3, Filter, Settings } from "lucide-react"
import { DataService } from "@/lib/data/data-service"
import { ExportButton, SimpleExportButton } from "@/components/export/export-button"
import { ExportModal } from "@/components/export/export-modal"
import { useState } from "react"

export default function ExportPage() {
  const [selectedData, setSelectedData] = useState({
    products: true,
    sales: true,
    forecasts: false,
    metrics: true,
    categories: false
  })
  const [selectedFormat, setSelectedFormat] = useState("csv")
  const [dateRange, setDateRange] = useState("30")
  const [isExporting, setIsExporting] = useState(false)

  const exportOptions = [
    {
      id: "products",
      name: "Products Data",
      description: "Product catalog with inventory and performance data",
      icon: Database,
      size: "2.3 MB",
      records: "500+ products"
    },
    {
      id: "sales",
      name: "Sales Data",
      description: "Historical sales transactions and revenue data",
      icon: BarChart3,
      size: "15.7 MB",
      records: "10,000+ transactions"
    },
    {
      id: "forecasts",
      name: "Forecast Data",
      description: "AI-generated demand predictions and trends",
      icon: Calendar,
      size: "1.2 MB",
      records: "600+ forecasts"
    },
    {
      id: "metrics",
      name: "Metrics & KPIs",
      description: "Key performance indicators and analytics",
      icon: FileText,
      size: "0.5 MB",
      records: "50+ metrics"
    },
    {
      id: "categories",
      name: "Category Analysis",
      description: "Category performance and trend analysis",
      icon: Filter,
      size: "0.8 MB",
      records: "10 categories"
    }
  ]

  const formatOptions = [
    { id: "csv", name: "CSV", description: "Comma-separated values" },
    { id: "json", name: "JSON", description: "JavaScript Object Notation" },
    { id: "xlsx", name: "Excel", description: "Microsoft Excel format" },
    { id: "pdf", name: "PDF", description: "Portable Document Format" }
  ]

  const handleDataToggle = (dataId) => {
    setSelectedData(prev => ({
      ...prev,
      [dataId]: !prev[dataId]
    }))
  }

  const handleExport = async () => {
    setIsExporting(true)
    
    try {
      // Get the selected data types
      const selectedTypes = Object.entries(selectedData)
        .filter(([key, value]) => value)
        .map(([key]) => key)

      if (selectedTypes.length === 0) {
        alert("Please select at least one data type to export")
        return
      }

      // For now, we'll export all data as a comprehensive export
      // In a more advanced implementation, you'd filter based on selectedTypes
      const timestamp = new Date().toISOString().split('T')[0]
      const filename = `dashboard-export-${timestamp}`
      
      console.log("Exporting data types:", selectedTypes)
      console.log("Format:", selectedFormat)
      console.log("Date range:", dateRange)
      
      // The actual export will be handled by the ExportButton component
    } catch (error) {
      console.error("Export error:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const selectedCount = Object.values(selectedData).filter(Boolean).length
  const totalSize = exportOptions
    .filter(option => selectedData[option.id])
    .reduce((sum, option) => sum + parseFloat(option.size), 0)

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Export Data</h1>
            <p className="text-muted-foreground">Export your analytics data in various formats</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <ExportModal dataType="full" defaultFilename="dashboard-export">
              <Button disabled={selectedCount === 0}>
                <Download className="w-4 h-4 mr-2" />
                Export {selectedCount} Dataset{selectedCount !== 1 ? 's' : ''}
              </Button>
            </ExportModal>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Data Selection */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select Data to Export</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {exportOptions.map((option) => {
                    const Icon = option.icon
                    return (
                      <div key={option.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50">
                        <Checkbox
                          id={option.id}
                          checked={selectedData[option.id]}
                          onCheckedChange={() => handleDataToggle(option.id)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <label htmlFor={option.id} className="font-medium cursor-pointer">
                                {option.name}
                              </label>
                              <p className="text-sm text-muted-foreground">{option.description}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <div>{option.size}</div>
                          <div>{option.records}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Export History */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Exports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Complete Dataset", date: "2 hours ago", size: "18.5 MB", format: "CSV" },
                    { name: "Sales Data Only", date: "1 day ago", size: "15.7 MB", format: "Excel" },
                    { name: "Product Catalog", date: "3 days ago", size: "2.3 MB", format: "JSON" }
                  ].map((export_item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{export_item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {export_item.date} • {export_item.size} • {export_item.format}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Export Settings */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Export Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Format</label>
                  <div className="mt-2 space-y-2">
                    {formatOptions.map((format) => (
                      <div key={format.id} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={format.id}
                          name="format"
                          value={format.id}
                          checked={selectedFormat === format.id}
                          onChange={(e) => setSelectedFormat(e.target.value)}
                          className="w-4 h-4"
                        />
                        <label htmlFor={format.id} className="text-sm cursor-pointer">
                          <div className="font-medium">{format.name}</div>
                          <div className="text-muted-foreground">{format.description}</div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Date Range</label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="mt-2 w-full p-2 border rounded-md"
                  >
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                    <option value="365">Last year</option>
                    <option value="all">All time</option>
                  </select>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Selected datasets:</span>
                    <span className="font-medium">{selectedCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total size:</span>
                    <span className="font-medium">{totalSize.toFixed(1)} MB</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Format:</span>
                    <Badge variant="outline">{selectedFormat.toUpperCase()}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Date range:</span>
                    <span>{dateRange === "all" ? "All time" : `Last ${dateRange} days`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated time:</span>
                    <span>{totalSize > 10 ? "2-3 minutes" : "30-60 seconds"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
