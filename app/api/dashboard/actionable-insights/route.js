import { NextResponse } from "next/server"
import DatabaseService from "@/lib/database/database-service"

export async function GET(request) {
  try {
    const actionableInsights = await DatabaseService.getActionableInsights()
    
    return NextResponse.json(actionableInsights)
  } catch (error) {
    console.error("[API] Error in actionable insights API:", error)
    return NextResponse.json({ error: "Failed to fetch actionable insights" }, { status: 500 })
  }
}
