import { NextResponse } from "next/server"
import DatabaseService from "@/lib/database/database-service"

export async function GET(request) {
  try {
    const metricsOverview = await DatabaseService.getMetricsOverview()
    
    return NextResponse.json(metricsOverview)
  } catch (error) {
    console.error("[API] Error in metrics overview API:", error)
    return NextResponse.json({ error: "Failed to fetch metrics overview" }, { status: 500 })
  }
}
