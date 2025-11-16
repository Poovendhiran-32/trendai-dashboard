import { NextResponse } from "next/server"
import DatabaseService from "@/lib/database/database-service"

export async function GET(request) {
  try {
    const seasonalTrends = await DatabaseService.getSeasonalTrendsData()
    
    return NextResponse.json(seasonalTrends)
  } catch (error) {
    console.error("[API] Error in seasonal trends API:", error)
    return NextResponse.json({ error: "Failed to fetch seasonal trends" }, { status: 500 })
  }
}
