import { NextResponse } from "next/server"
import DatabaseService from "@/lib/database/database-service"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period')
    const days = searchParams.get('days')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Create period object if parameters are provided
    const periodObj = period ? {
      id: period,
      days: days ? parseInt(days) : null,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null
    } : null

    const forecastData = await DatabaseService.getDemandForecastData(periodObj)
    
    return NextResponse.json(forecastData)
  } catch (error) {
    console.error("[API] Error in demand forecast API:", error)
    return NextResponse.json({ error: "Failed to fetch demand forecast" }, { status: 500 })
  }
}
