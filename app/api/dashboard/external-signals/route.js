import { NextResponse } from "next/server"
import DatabaseService from "@/lib/database/database-service"

export async function GET(request) {
  try {
    const externalSignals = await DatabaseService.getExternalSignalsData()
    
    return NextResponse.json(externalSignals)
  } catch (error) {
    console.error("[API] Error in external signals API:", error)
    return NextResponse.json({ error: "Failed to fetch external signals" }, { status: 500 })
  }
}
