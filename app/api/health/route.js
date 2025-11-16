import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    connections: { active: 0, total: 0 }, // Mock connection stats
  })
}
