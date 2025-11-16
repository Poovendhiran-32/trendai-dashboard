"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Search, Database, TrendingUp, Package, DollarSign, Users, Download } from "lucide-react"
import { DataService } from "@/lib/data/data-service"
import { products, salesData } from "@/lib/data/dataset"
import { DashboardHeader } from "@/components/dashboard-header"

export default function DataExplorerPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedSupplier, setSelectedSupplier] = useState("all")
  const [categoryPerformance, setCategoryPerformance] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [lowStockProducts, setLowStockProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryData, topProductsData, lowStockData] = await Promise.all([
          DataService.getCategoryPerformance(),
          DataService.getTopPerformingProducts(20),
          DataService.getLowStockProducts()
        ])
        
        setCategoryPerformance(categoryData || [])
        setTopProducts(topProductsData || [])
        setLowStockProducts(lowStockData || [])
      } catch (error) {
        console.error('Error fetching data:', error)
        // Fallback to mock data
        setCategoryPerformance([])
        setTopProducts([])
        setLowStockProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter products based on search and filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.supplier.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    const matchesSupplier = selectedSupplier === "all" || product.supplier === selectedSupplier
    return matchesSearch && matchesCategory && matchesSupplier
  })

  // Get unique categories and suppliers for filters
  const categories = [...new Set(products.map((p) => p.category))]
  const suppliers = [...new Set(products.map((p) => p.supplier))]

  // Sales data aggregations
  const recentSales = salesData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 100)

  const salesByChannel = salesData.reduce(
    (acc, sale) => {
      acc[sale.channel] = (acc[sale.channel] || 0) + sale.revenue
      return acc
    },
    {}
  )

  const channelData = Object.entries(salesByChannel).map(([channel, revenue]) => ({
    channel: channel.charAt(0).toUpperCase() + channel.slice(1),
    revenue: Math.round(revenue),
    percentage: Math.round((revenue / Object.values(salesByChannel).reduce((a, b) => a + b, 0)) * 100),
  }))

  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"]

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading data explorer...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Data Explorer</h1>
            <p className="text-muted-foreground">
              Comprehensive view of your dataset with {products.length.toLocaleString()} products and{" "}
              {salesData.length.toLocaleString()} sales records
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button>
              <Database className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Dataset Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Across {categories.length} categories</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales Records</CardTitle>
              <TrendingUp className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{salesData.length.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Historical transactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${Math.round(salesData.reduce((sum, sale) => sum + sale.revenue, 0) / 1000)}K
              </div>
              <p className="text-xs text-muted-foreground">From all channels</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Suppliers</CardTitle>
              <Users className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{suppliers.length}</div>
              <p className="text-xs text-muted-foreground">Active partnerships</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Data Explorer */}
        <Tabs defaultValue="products" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="sales">Sales Data</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Product Database</CardTitle>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search products, categories, or suppliers..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Suppliers</SelectItem>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier} value={supplier}>
                          {supplier}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-4">
                  Showing {filteredProducts.length} of {products.length} products
                </div>
                <div className="max-h-96 overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Trend Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.slice(0, 50).map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{product.category}</Badge>
                          </TableCell>
                          <TableCell>${product.price}</TableCell>
                          <TableCell>
                            <span className={product.currentStock <= product.reorderPoint ? "text-destructive" : ""}>
                              {product.currentStock}
                            </span>
                          </TableCell>
                          <TableCell>{product.supplier}</TableCell>
                          <TableCell>
                            <Badge variant={product.trendScore >= 8 ? "default" : "secondary"}>
                              {product.trendScore}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sales by Channel</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={channelData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="revenue"
                          label={({ channel, percentage }) => `${channel} ${percentage}%`}
                        >
                          {channelData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Sales Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-64 overflow-auto space-y-2">
                    {recentSales.slice(0, 10).map((sale, index) => {
                      const product = products.find((p) => p.id === sale.productId)
                      return (
                        <div key={index} className="flex justify-between items-center p-2 bg-muted/30 rounded">
                          <div>
                            <div className="font-medium text-sm">{product?.name || sale.productId}</div>
                            <div className="text-xs text-muted-foreground">
                              {sale.quantity} units • {sale.channel} • {sale.region}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">${sale.revenue.toFixed(2)}</div>
                            <div className="text-xs text-muted-foreground">{sale.date}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Category Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryPerformance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]} />
                        <Bar dataKey="revenue" fill="hsl(var(--chart-1))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {(topProducts || []).slice(0, 8).map((product, index) => (
                      <div key={product.id} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                            {index + 1}
                          </Badge>
                          <div>
                            <div className="font-medium text-sm">{product.name}</div>
                            <div className="text-xs text-muted-foreground">{product.category}</div>
                          </div>
                        </div>
                        <Badge variant={product.trendScore >= 9 ? "default" : "secondary"}>{product.trendScore}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Stock Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {(lowStockProducts || []).slice(0, 10).map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-2 bg-destructive/10 border border-destructive/20 rounded"
                      >
                        <div>
                          <div className="font-medium text-sm">{product.name}</div>
                          <div className="text-xs text-muted-foreground">{product.category}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-destructive">{product.currentStock} units</div>
                          <div className="text-xs text-muted-foreground">Reorder at {product.reorderPoint}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Dataset Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted/30 rounded">
                      <div className="text-2xl font-bold text-primary">{categories.length}</div>
                      <div className="text-xs text-muted-foreground">Categories</div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded">
                      <div className="text-2xl font-bold text-primary">{suppliers.length}</div>
                      <div className="text-xs text-muted-foreground">Suppliers</div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded">
                      <div className="text-2xl font-bold text-primary">
                        ${Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length)}
                      </div>
                      <div className="text-xs text-muted-foreground">Avg Price</div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded">
                      <div className="text-2xl font-bold text-primary">
                        {Math.round(products.reduce((sum, p) => sum + p.currentStock, 0) / products.length)}
                      </div>
                      <div className="text-xs text-muted-foreground">Avg Stock</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Data Quality Metrics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Products with high trend scores (8+):</span>
                        <span className="font-medium">
                          {products.filter((p) => p.trendScore >= 8).length} (
                          {Math.round((products.filter((p) => p.trendScore >= 8).length / products.length) * 100)}%)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Products below reorder point:</span>
                        <span className="font-medium text-destructive">
                          {lowStockProducts.length} ({Math.round((lowStockProducts.length / products.length) * 100)}%)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sales data coverage:</span>
                        <span className="font-medium text-chart-1">365 days</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
