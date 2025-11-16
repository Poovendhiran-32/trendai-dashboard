import { NextResponse } from "next/server"
import connectDB from "@/lib/database/connection"
import DatabaseService from "@/lib/database/database-service"

export async function GET() {
  try {
    const connection = await connectDB()
    
    if (!connection) {
      return NextResponse.json({
        status: "mock",
        message: "Using mock database (no real database connection)",
        connected: false
      })
    }
    
    // Test database operations
    const productCount = await DatabaseService.getProducts({ limit: 1 })
    const salesCount = await DatabaseService.getSales({ limit: 1 })
    
    return NextResponse.json({
      status: "connected",
      message: "Database connected successfully",
      connected: true,
      stats: {
        products: productCount.total,
        sales: salesCount.total
      }
    })
  } catch (error) {
    console.error("Database status check failed:", error)
    return NextResponse.json({
      status: "error",
      message: "Database connection failed",
      connected: false,
      error: error.message
    }, { status: 500 })
  }
}
