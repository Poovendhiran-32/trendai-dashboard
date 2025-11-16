import { NextResponse } from "next/server"
import DatabaseService from "@/lib/database/database-service"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const limit = Number.parseInt(searchParams.get("limit") || "100")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    // Get products from database
    const result = await DatabaseService.getProducts({
      category,
      limit,
      offset
    })

    // Transform to API format
    const apiProducts = result.products.map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.currentStock,
      sales_velocity: product.salesVelocity || Math.round(product.trendScore * 10),
      trend_score: product.trendScore * 10,
      last_updated: product.updatedAt || new Date().toISOString(),
    }))

    return NextResponse.json({
      products: apiProducts,
      total: result.total,
      limit: result.limit,
      offset: result.offset,
    })
  } catch (error) {
    console.error("[API] Error in products API:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
