"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock, TrendingUp, BarChart3 } from "lucide-react"
import { format, subDays, subWeeks, subMonths, subYears } from "date-fns"

export function PeriodSelector({ 
  selectedPeriod, 
  onPeriodChange, 
  className = "",
  size = "sm"
}) {
  const [isOpen, setIsOpen] = useState(false)

  const predefinedPeriods = [
    {
      id: "7d",
      label: "Last 7 days",
      description: "Past week",
      icon: Clock,
      days: 7
    },
    {
      id: "30d",
      label: "Last 30 days", 
      description: "Past month",
      icon: TrendingUp,
      days: 30
    },
    {
      id: "90d",
      label: "Last 90 days",
      description: "Past quarter", 
      icon: BarChart3,
      days: 90
    },
    {
      id: "1y",
      label: "Last year",
      description: "Past 12 months",
      icon: CalendarIcon,
      days: 365
    }
  ]

  const handlePeriodSelect = (period) => {
    onPeriodChange(period)
    setIsOpen(false)
  }

  const getCurrentPeriodLabel = () => {
    const period = predefinedPeriods.find(p => p.id === selectedPeriod?.id)
    return period ? period.label : "Select Period"
  }

  const getCurrentPeriodIcon = () => {
    const period = predefinedPeriods.find(p => p.id === selectedPeriod?.id)
    return period ? period.icon : CalendarIcon
  }

  const CurrentIcon = getCurrentPeriodIcon()

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size={size}
          className={className}
        >
          <CurrentIcon className="w-4 h-4 mr-2" />
          {getCurrentPeriodLabel()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Select Time Period</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {predefinedPeriods.map((period) => {
          const Icon = period.icon
          return (
            <DropdownMenuItem 
              key={period.id}
              onClick={() => handlePeriodSelect(period)}
              className="flex items-center gap-3"
            >
              <Icon className="w-4 h-4" />
              <div>
                <div className="font-medium">{period.label}</div>
                <div className="text-xs text-muted-foreground">{period.description}</div>
              </div>
            </DropdownMenuItem>
          )
        })}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => setIsOpen(false)}
          className="text-muted-foreground"
        >
          <CalendarIcon className="w-4 h-4 mr-3" />
          Custom Range
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Custom period selector with date picker
export function CustomPeriodSelector({ 
  selectedPeriod, 
  onPeriodChange, 
  className = "",
  size = "sm",
  useRangePicker = false
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [dateRange, setDateRange] = useState({ from: null, to: null })

  const handleCustomPeriod = () => {
    if (useRangePicker) {
      if (dateRange.from && dateRange.to) {
        const daysDiff = Math.ceil((dateRange.to - dateRange.from) / (1000 * 60 * 60 * 24))
        onPeriodChange({
          id: "custom",
          label: `${format(dateRange.from, "MMM dd")} - ${format(dateRange.to, "MMM dd")}`,
          description: `${daysDiff} days`,
          startDate: dateRange.from,
          endDate: dateRange.to,
          days: daysDiff
        })
        setIsOpen(false)
      }
    } else {
      if (startDate && endDate) {
        const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
        onPeriodChange({
          id: "custom",
          label: `${format(startDate, "MMM dd")} - ${format(endDate, "MMM dd")}`,
          description: `${daysDiff} days`,
          startDate,
          endDate,
          days: daysDiff
        })
        setIsOpen(false)
      }
    }
  }

  const getCurrentPeriodLabel = () => {
    if (selectedPeriod?.id === "custom") {
      return selectedPeriod.label
    }
    return "Custom Range"
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size={size}
          className={className}
        >
          <CalendarIcon className="w-4 h-4 mr-2" />
          {getCurrentPeriodLabel()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 max-h-[80vh] overflow-y-auto" align="start" side="bottom" sideOffset={8}>
        <div className="p-4">
          <h4 className="font-medium mb-4">Select Custom Period</h4>
          
          {useRangePicker ? (
            /* Single calendar with range selection - most compact */
            <div className="space-y-4">
              <div className="border rounded-md">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  className="rounded-md"
                  numberOfMonths={1}
                />
              </div>
            </div>
          ) : (
            /* Side-by-side layout for better space usage */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Start Date</label>
                <div className="border rounded-md">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    className="rounded-md"
                    numberOfMonths={1}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">End Date</label>
                <div className="border rounded-md">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    className="rounded-md"
                    numberOfMonths={1}
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Action buttons */}
          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              size="sm"
              onClick={handleCustomPeriod}
              disabled={useRangePicker ? (!dateRange.from || !dateRange.to) : (!startDate || !endDate)}
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Combined period selector with both predefined and custom options
export function AdvancedPeriodSelector({ 
  selectedPeriod, 
  onPeriodChange, 
  className = "",
  size = "sm",
  showCustom = true
}) {
  const [isOpen, setIsOpen] = useState(false)

  const predefinedPeriods = [
    {
      id: "7d",
      label: "Last 7 days",
      description: "Past week",
      icon: Clock,
      days: 7
    },
    {
      id: "30d",
      label: "Last 30 days", 
      description: "Past month",
      icon: TrendingUp,
      days: 30
    },
    {
      id: "90d",
      label: "Last 90 days",
      description: "Past quarter", 
      icon: BarChart3,
      days: 90
    },
    {
      id: "1y",
      label: "Last year",
      description: "Past 12 months",
      icon: CalendarIcon,
      days: 365
    }
  ]

  const handlePeriodSelect = (period) => {
    onPeriodChange(period)
    setIsOpen(false)
  }

  const getCurrentPeriodLabel = () => {
    if (selectedPeriod?.id === "custom") {
      return selectedPeriod.label
    }
    const period = predefinedPeriods.find(p => p.id === selectedPeriod?.id)
    return period ? period.label : "Select Period"
  }

  const getCurrentPeriodIcon = () => {
    if (selectedPeriod?.id === "custom") {
      return CalendarIcon
    }
    const period = predefinedPeriods.find(p => p.id === selectedPeriod?.id)
    return period ? period.icon : CalendarIcon
  }

  const CurrentIcon = getCurrentPeriodIcon()

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size={size}
          className={className}
        >
          <CurrentIcon className="w-4 h-4 mr-2" />
          {getCurrentPeriodLabel()}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Select Time Period</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {predefinedPeriods.map((period) => {
          const Icon = period.icon
          return (
            <DropdownMenuItem 
              key={period.id}
              onClick={() => handlePeriodSelect(period)}
              className="flex items-center gap-3"
            >
              <Icon className="w-4 h-4" />
              <div>
                <div className="font-medium">{period.label}</div>
                <div className="text-xs text-muted-foreground">{period.description}</div>
              </div>
            </DropdownMenuItem>
          )
        })}
        
        {showCustom && (
          <>
            <DropdownMenuSeparator />
            <CustomPeriodSelector
              selectedPeriod={selectedPeriod}
              onPeriodChange={onPeriodChange}
              size="sm"
              useRangePicker={true}
            />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
