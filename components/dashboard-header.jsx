import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Download, Settings, TrendingUp, Database, FileText, LogOut, User } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/contexts/auth-context"
import { useRouter } from "next/navigation"

export function DashboardHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">TrendAI</h1>
                  <p className="text-sm text-muted-foreground">Demand Forecasting Platform</p>
                </div>
              </Link>
            </div>
            <Badge variant="secondary" className="ml-4">
              Live Data
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm">
              <Link href="/data">
                <Database className="w-4 h-4 mr-2" />
                Data Explorer
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/reports">
                <FileText className="w-4 h-4 mr-2" />
                Reports
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/last-30-days">
                <Calendar className="w-4 h-4 mr-2" />
                Last 30 Days
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/export">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/settings">
                <Settings className="w-4 h-4" />
              </Link>
            </Button>
            
            {/* User Menu */}
            <div className="flex items-center gap-2 pl-3 border-l">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {user?.name || user?.email || 'User'}
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
