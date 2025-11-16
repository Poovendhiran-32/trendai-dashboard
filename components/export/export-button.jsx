"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu"
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  FileJson,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { ExportService } from "@/lib/services/export-service"
import { toast } from "@/hooks/use-toast"

export function ExportButton({ 
  dataType, 
  data = null, 
  filename = null, 
  className = "",
  variant = "outline",
  size = "sm"
}) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportStatus, setExportStatus] = useState(null)

  const handleExport = async (format) => {
    setIsExporting(true)
    setExportStatus(null)

    try {
      let result

      // Determine which export function to call based on dataType
      switch (dataType) {
        case 'metrics':
          result = await ExportService.exportMetricsData()
          break
        case 'forecast':
          result = await ExportService.exportDemandForecastData()
          break
        case 'products':
          result = await ExportService.exportProductPerformanceData()
          break
        case 'seasonal':
          result = await ExportService.exportSeasonalTrendsData()
          break
        case 'signals':
          result = await ExportService.exportExternalSignalsData()
          break
        case 'insights':
          result = await ExportService.exportActionableInsightsData()
          break
        case 'full':
          result = await ExportService.exportFullDashboard()
          break
        default:
          if (data) {
            const exportFilename = filename || `${dataType}-${new Date().toISOString().split('T')[0]}`
            if (format === 'csv') {
              result = await ExportService.exportToCSV(data, exportFilename)
            } else if (format === 'json') {
              result = await ExportService.exportToJSON(data, exportFilename)
            } else if (format === 'excel') {
              result = await ExportService.exportToExcel(data, exportFilename)
            }
          } else {
            throw new Error('No data provided for export')
          }
      }

      if (result.success) {
        setExportStatus('success')
        toast({
          title: "Export Successful",
          description: result.message || "Data exported successfully",
        })
      } else {
        throw new Error(result.error || 'Export failed')
      }
    } catch (error) {
      console.error('Export error:', error)
      setExportStatus('error')
      toast({
        title: "Export Failed",
        description: error.message || "Failed to export data",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
      // Reset status after 3 seconds
      setTimeout(() => setExportStatus(null), 3000)
    }
  }

  const getIcon = () => {
    if (isExporting) return <Loader2 className="w-4 h-4 animate-spin" />
    if (exportStatus === 'success') return <CheckCircle className="w-4 h-4 text-green-600" />
    if (exportStatus === 'error') return <AlertCircle className="w-4 h-4 text-red-600" />
    return <Download className="w-4 h-4" />
  }

  const getButtonText = () => {
    if (isExporting) return "Exporting..."
    if (exportStatus === 'success') return "Exported!"
    if (exportStatus === 'error') return "Failed"
    return "Export"
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={className}
          disabled={isExporting}
        >
          {getIcon()}
          <span className="ml-2">{getButtonText()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          <FileText className="w-4 h-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('json')}>
          <FileJson className="w-4 h-4 mr-2" />
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport('excel')}>
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Export as Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Simple export button for quick exports
export function SimpleExportButton({ 
  data, 
  filename, 
  format = 'csv',
  className = "",
  variant = "outline",
  size = "sm"
}) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)

    try {
      let result
      const exportFilename = filename || `export-${new Date().toISOString().split('T')[0]}`

      if (format === 'csv') {
        result = await ExportService.exportToCSV(data, exportFilename)
      } else if (format === 'json') {
        result = await ExportService.exportToJSON(data, exportFilename)
      } else if (format === 'excel') {
        result = await ExportService.exportToExcel(data, exportFilename)
      }

      if (result.success) {
        toast({
          title: "Export Successful",
          description: result.message || "Data exported successfully",
        })
      } else {
        throw new Error(result.error || 'Export failed')
      }
    } catch (error) {
      console.error('Export error:', error)
      toast({
        title: "Export Failed",
        description: error.message || "Failed to export data",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button 
      variant={variant} 
      size={size} 
      className={className}
      onClick={handleExport}
      disabled={isExporting || !data}
    >
      {isExporting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      <span className="ml-2">
        {isExporting ? "Exporting..." : "Export"}
      </span>
    </Button>
  )
}
