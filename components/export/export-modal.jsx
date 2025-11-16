"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { ExportService } from "@/lib/services/export-service"
import { toast } from "@/hooks/use-toast"
import { format } from "date-fns"

export function ExportModal({ 
  children, 
  dataType = "full",
  defaultFilename = null 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportStatus, setExportStatus] = useState(null)
  const [exportOptions, setExportOptions] = useState({
    format: 'csv',
    filename: defaultFilename || `${dataType}-export-${new Date().toISOString().split('T')[0]}`,
    includeCharts: false,
    dateRange: null,
    dataTypes: dataType === 'full' ? ['metrics', 'forecast', 'products', 'seasonal', 'signals', 'insights'] : [dataType]
  })

  const availableFormats = ExportService.getAvailableFormats()
  const availableDataTypes = ExportService.getAvailableDataTypes()

  const handleExport = async () => {
    setIsExporting(true)
    setExportStatus(null)

    try {
      let result

      if (exportOptions.dataTypes.length === 1 && exportOptions.dataTypes[0] !== 'full') {
        // Single data type export
        const dataType = exportOptions.dataTypes[0]
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
          default:
            throw new Error('Invalid data type selected')
        }
      } else {
        // Full dashboard export
        result = await ExportService.exportFullDashboard()
      }

      if (result.success) {
        setExportStatus('success')
        toast({
          title: "Export Successful",
          description: result.message || "Data exported successfully",
        })
        setTimeout(() => {
          setIsOpen(false)
          setExportStatus(null)
        }, 2000)
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
    }
  }

  const handleDataTypeToggle = (dataType, checked) => {
    if (checked) {
      setExportOptions(prev => ({
        ...prev,
        dataTypes: [...prev.dataTypes, dataType]
      }))
    } else {
      setExportOptions(prev => ({
        ...prev,
        dataTypes: prev.dataTypes.filter(type => type !== dataType)
      }))
    }
  }

  const getStatusIcon = () => {
    if (isExporting) return <Loader2 className="w-4 h-4 animate-spin" />
    if (exportStatus === 'success') return <CheckCircle className="w-4 h-4 text-green-600" />
    if (exportStatus === 'error') return <AlertCircle className="w-4 h-4 text-red-600" />
    return <Download className="w-4 h-4" />
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getStatusIcon()}
            Export Dashboard Data
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Export Format */}
          <div className="space-y-2">
            <Label htmlFor="format">Export Format</Label>
            <Select 
              value={exportOptions.format} 
              onValueChange={(value) => setExportOptions(prev => ({ ...prev, format: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                {availableFormats.map(format => (
                  <SelectItem key={format.value} value={format.value}>
                    <div>
                      <div className="font-medium">{format.label}</div>
                      <div className="text-sm text-muted-foreground">{format.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filename */}
          <div className="space-y-2">
            <Label htmlFor="filename">Filename</Label>
            <input
              id="filename"
              type="text"
              value={exportOptions.filename}
              onChange={(e) => setExportOptions(prev => ({ ...prev, filename: e.target.value }))}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter filename"
            />
          </div>

          {/* Data Types Selection (only for full export) */}
          {dataType === 'full' && (
            <div className="space-y-3">
              <Label>Data to Include</Label>
              <div className="space-y-2">
                {availableDataTypes.filter(dt => dt.value !== 'full').map(dataType => (
                  <div key={dataType.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={dataType.value}
                      checked={exportOptions.dataTypes.includes(dataType.value)}
                      onCheckedChange={(checked) => handleDataTypeToggle(dataType.value, checked)}
                    />
                    <Label htmlFor={dataType.value} className="text-sm">
                      <div className="font-medium">{dataType.label}</div>
                      <div className="text-muted-foreground">{dataType.description}</div>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Date Range (optional) */}
          <div className="space-y-2">
            <Label>Date Range (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {exportOptions.dateRange ? format(exportOptions.dateRange, "PPP") : "Select date range"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={exportOptions.dateRange}
                  onSelect={(date) => setExportOptions(prev => ({ ...prev, dateRange: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isExporting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleExport}
              disabled={isExporting || exportOptions.dataTypes.length === 0}
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
