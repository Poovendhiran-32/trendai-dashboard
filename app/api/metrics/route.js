import { NextResponse } from "next/server"
import DatabaseService from "@/lib/database/database-service"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const hours = Number.parseInt(searchParams.get("hours") || "24")

    // Get metrics from database
    const metrics = await DatabaseService.getMetrics(hours)

    return NextResponse.json(metrics)
  } catch (error) {
    console.error("[API] Error in metrics API:", error)
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 })
  }
}
