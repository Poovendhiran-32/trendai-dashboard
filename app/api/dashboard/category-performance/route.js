import { NextResponse } from "next/server"
import DatabaseService from "@/lib/database/database-service"

export async function GET(request) {
  try {
    const categoryPerformance = await DatabaseService.getCategoryPerformance()
    
    return NextResponse.json(categoryPerformance)
  } catch (error) {
    console.error("[API] Error in category performance API:", error)
    return NextResponse.json({ error: "Failed to fetch category performance" }, { status: 500 })
  }
}
