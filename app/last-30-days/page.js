"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { TrendingUp, TrendingDown, Calendar, DollarSign, ShoppingCart, Users, Target } from "lucide-react"
import { DataService } from "@/lib/data/data-service"
import { useState, useEffect } from "react"

export default function Last30DaysPage() {
  const [timeRange, setTimeRange] = useState("30")
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      console.log('Loading data for time range:', timeRange)
      
      try {
        // Load data from APIs
        const [salesResponse, categoryResponse, productResponse, metricsResponse] = await Promise.all([
          fetch(`/api/sales?days=${timeRange}`),
          fetch('/api/dashboard/category-performance'),
          fetch('/api/dashboard/product-performance?limit=5'),
          fetch('/api/dashboard/metrics-overview')
        ])

        const salesData = await salesResponse.json()
        const categoryPerformance = await categoryResponse.json()
        const productPerformance = await productResponse.json()
        const metrics = await metricsResponse.json()

        console.log('Real data loaded:', {
          sales: salesData.sales?.length || 0,
          categories: categoryPerformance?.length || 0,
          products: productPerformance?.length || 0
        })
        
        setData({
          salesData: salesData.sales || [],
          categoryPerformance: categoryPerformance || [],
          productPerformance: productPerformance || [],
          metrics: metrics || {}
        })
      } catch (error) {
        console.error('Error loading data:', error)
        // Fallback to mock data
        const mockSalesData = []
        for (let i = 0; i < parseInt(timeRange) * 5; i++) {
          mockSalesData.push({
            date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            productId: `PROD${i % 10 + 1}`,
            quantity: Math.floor(Math.random() * 50 + 1),
            revenue: Math.floor(Math.random() * 1000 + 100),
            channel: ["online", "retail", "wholesale"][i % 3],
            region: ["North America", "Europe", "Asia Pacific"][i % 3]
          })
        }
        
        console.log('Mock sales data created:', mockSalesData.length, 'records')
        
        const mockCategoryPerformance = [
          { category: "Electronics", revenue: 125000, growth: 12.5, products: 45 },
          { category: "Clothing", revenue: 89000, growth: 8.3, products: 32 },
          { category: "Home & Garden", revenue: 67000, growth: 15.2, products: 28 },
          { category: "Sports", revenue: 54000, growth: 6.7, products: 22 },
          { category: "Books", revenue: 32000, growth: 4.1, products: 18 }
        ]
        
        const mockProductPerformance = [
          { id: "PROD1", name: "Wireless Headphones", category: "Electronics", sales: 245, revenue: 12500, trend: "up", trendScore: 8.5, stock: 45, stockStatus: "high" },
          { id: "PROD2", name: "Fitness Tracker", category: "Electronics", sales: 189, revenue: 9800, trend: "up", trendScore: 9.2, stock: 32, stockStatus: "medium" },
          { id: "PROD3", name: "Running Shoes", category: "Sports", sales: 156, revenue: 7800, trend: "stable", trendScore: 7.8, stock: 28, stockStatus: "high" },
          { id: "PROD4", name: "Coffee Maker", category: "Home & Garden", sales: 134, revenue: 6700, trend: "up", trendScore: 8.1, stock: 15, stockStatus: "low" },
          { id: "PROD5", name: "Yoga Mat", category: "Sports", sales: 98, revenue: 4900, trend: "down", trendScore: 6.5, stock: 42, stockStatus: "high" }
        ]
        
        const mockMetrics = {
          forecastAccuracy: "87.3%",
          forecastAccuracyChange: "+2.1%",
          predictedDemand: "15,420",
          predictedDemandChange: "+18.3%",
          stockRisk: "3 Products",
          stockRiskChange: "-2",
          revenueImpact: "$125K",
          revenueImpactChange: "+12.7%"
        }
        
        setData({
          salesData: mockSalesData,
          categoryPerformance: mockCategoryPerformance,
          productPerformance: mockProductPerformance,
          metrics: mockMetrics
        })
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [timeRange])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading data...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const totalRevenue = data?.salesData.reduce((sum, sale) => sum + sale.revenue, 0) || 0
  const totalOrders = data?.salesData.length || 0
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  // Generate daily sales data for the chart
  const dailySales = []
  for (let i = parseInt(timeRange) - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]
    
    const daySales = data?.salesData.filter(sale => sale.date === dateStr) || []
    const dayRevenue = daySales.reduce((sum, sale) => sum + sale.revenue, 0)
    const dayOrders = daySales.length
    
    dailySales.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      revenue: Math.round(dayRevenue),
      orders: dayOrders,
      avgOrder: dayOrders > 0 ? Math.round(dayRevenue / dayOrders) : 0
    })
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Last {timeRange} Days Analysis</h1>
            <p className="text-muted-foreground">Detailed performance metrics and trends</p>
          </div>
          <div className="flex gap-2">
            {["7", "30", "90"].map((days) => (
              <Button
                key={days}
                variant={timeRange === days ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(days)}
              >
                {days} Days
              </Button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${Math.round(totalRevenue / 1000)}K</div>
              <p className="text-xs text-muted-foreground">
                +12.5% from previous period
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +8.3% from previous period
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${Math.round(avgOrderValue)}</div>
              <p className="text-xs text-muted-foreground">
                +2.1% from previous period
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.2%</div>
              <p className="text-xs text-muted-foreground">
                +0.5% from previous period
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailySales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Category Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data?.categoryPerformance.slice(0, 5).map((category, index) => (
                  <div key={category.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <span className="text-sm font-medium">{category.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">${Math.round(category.revenue / 1000)}K</div>
                      <div className="text-xs text-muted-foreground">
                        {category.growth > 0 ? "+" : ""}{category.growth}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data?.productPerformance.slice(0, 5).map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{index + 1}</Badge>
                      <div>
                        <div className="text-sm font-medium">{product.name}</div>
                        <div className="text-xs text-muted-foreground">{product.category}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{product.sales} units</div>
                      <div className="text-xs text-muted-foreground">
                        ${Math.round(product.revenue / 1000)}K
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
