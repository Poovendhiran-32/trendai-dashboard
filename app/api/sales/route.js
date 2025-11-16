import { NextResponse } from "next/server"
import DatabaseService from "@/lib/database/database-service"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("product_id")
    const region = searchParams.get("region")
    const channel = searchParams.get("channel")
    const days = Number.parseInt(searchParams.get("days") || "30")
    const limit = Number.parseInt(searchParams.get("limit") || "1000")

    // Calculate date filter
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    const startDateStr = startDate.toISOString().split("T")[0]

    // Get sales from database
    const result = await DatabaseService.getSales({
      productId,
      region,
      channel,
      startDate: startDateStr,
      limit
    })

    // Transform to API format
    const apiSales = result.sales.map((sale) => ({
      id: sale._id || `sale_${Math.random().toString(36).substr(2, 9)}`,
      product_id: sale.productId,
      quantity: sale.quantity,
      unit_price: sale.revenue / sale.quantity,
      revenue: sale.revenue,
      date: sale.date.toISOString().split("T")[0],
      region: sale.region,
      channel: sale.channel,
    }))

    return NextResponse.json({
      sales: apiSales,
      total: result.total,
      limit,
    })
  } catch (error) {
    console.error("[API] Error in sales API:", error)
    return NextResponse.json({ error: "Failed to fetch sales" }, { status: 500 })
  }
}
