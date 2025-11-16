import { NextResponse } from "next/server"
import DatabaseService from "@/lib/database/database-service"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    
    const productPerformance = await DatabaseService.getProductPerformanceData(limit)
    
    return NextResponse.json(productPerformance)
  } catch (error) {
    console.error("[API] Error in product performance API:", error)
    return NextResponse.json({ error: "Failed to fetch product performance" }, { status: 500 })
  }
}
