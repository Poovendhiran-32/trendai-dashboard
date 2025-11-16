"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { SettingsSection, SettingsItem } from "@/components/settings/settings-section"
import { SettingsToggleWithStorage } from "@/components/settings/settings-toggle"
import { SettingsInputWithStorage } from "@/components/settings/settings-input"
import { SettingsSelectWithStorage } from "@/components/settings/settings-select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/contexts/auth-context"
import { 
  User, 
  Bell, 
  Palette, 
  BarChart3, 
  Download, 
  RefreshCw, 
  Shield, 
  Database,
  Clock,
  Eye,
  Mail,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Settings as SettingsIcon,
  Key,
  Save
} from "lucide-react"
import { useState, useEffect } from "react"

export default function SettingsPage() {
  const { user: authUser, loading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState("")

  useEffect(() => {
    if (!authLoading) {
      setIsLoading(false)
    }
  }, [authLoading])

  const handleExportData = () => {
    // Implement data export functionality
    console.log("Exporting data...")
  }

  const handleRefreshData = () => {
    // Implement data refresh functionality
    console.log("Refreshing data...")
  }

  const handleChangePassword = async () => {
    setPasswordError("")
    setPasswordSuccess("")

    // Validate passwords
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError("All fields are required")
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match")
      return
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long")
      return
    }

    try {
      // Get the auth token from localStorage
      const authData = localStorage.getItem('trendai_auth')
      const token = authData ? JSON.parse(authData).token : null

      if (!token) {
        setPasswordError("You must be logged in to change your password")
        return
      }

      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      if (response.ok) {
        setPasswordSuccess("Password changed successfully!")
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
        setTimeout(() => {
          setChangePasswordOpen(false)
          setPasswordSuccess("")
        }, 2000)
      } else {
        const errorData = await response.json()
        setPasswordError(errorData.error || "Failed to change password")
      }
    } catch (error) {
      console.error("Password change error:", error)
      setPasswordError("Network error. Please try again.")
    }
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <DashboardHeader />
          <main className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-muted-foreground">Loading settings...</div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
              <SettingsIcon className="w-8 h-8 text-primary" />
              <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
                <p className="text-muted-foreground">Manage your dashboard preferences and account settings</p>
              </div>
            </div>

            {/* User Profile Section */}
            <SettingsSection 
              title="User Profile" 
              description="Manage your account information and preferences"
              className="border-l-4 border-l-blue-500"
            >
              <SettingsItem label="Name" description="Your display name">
                <SettingsInputWithStorage
                  storageKey="user_name"
                  defaultValue={authUser?.name || authUser?.firstName || ""}
                  placeholder="Enter your name"
                />
              </SettingsItem>
              
              <Separator />
              
              <SettingsItem label="Email" description="Your email address">
                <div className="flex items-center gap-2">
                  <SettingsInputWithStorage
                    storageKey="user_email"
                    defaultValue={authUser?.email || ""}
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Badge variant="outline">{authUser?.role || "User"}</Badge>
                </div>
              </SettingsItem>
              
              <Separator />
              
              <SettingsItem label="Password" description="Change your account password">
                <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Key className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input
                          id="current-password"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                          placeholder="Enter current password"
                        />
                      </div>
                      <div>
                        <Label htmlFor="new-password">New Password</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                          placeholder="Enter new password"
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          placeholder="Confirm new password"
                        />
                      </div>
                      {passwordError && (
                        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                          {passwordError}
                        </div>
                      )}
                      {passwordSuccess && (
                        <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                          {passwordSuccess}
                        </div>
                      )}
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setChangePasswordOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleChangePassword}>
                          <Save className="w-4 h-4 mr-2" />
                          Change Password
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </SettingsItem>
              
              <Separator />
              
              <SettingsItem label="Last Login" description="When you last accessed the dashboard">
                <span className="text-sm text-muted-foreground">
                  {authUser?.lastLogin ? new Date(authUser.lastLogin).toLocaleString() : 
                   authUser?.createdAt ? new Date(authUser.createdAt).toLocaleString() : "Unknown"}
                </span>
              </SettingsItem>
            </SettingsSection>

            {/* Dashboard Preferences */}
            <SettingsSection 
              title="Dashboard Preferences" 
              description="Customize how your dashboard looks and behaves"
              className="border-l-4 border-l-green-500"
            >
              <SettingsItem 
                label="Auto-refresh Data" 
                description="Automatically refresh dashboard data every 5 minutes"
              >
                <SettingsToggleWithStorage storageKey="auto_refresh" defaultValue={true} />
              </SettingsItem>
              
              <Separator />
              
              <SettingsItem 
                label="Show Real-time Alerts" 
                description="Display real-time notifications and alerts"
              >
                <SettingsToggleWithStorage storageKey="show_alerts" defaultValue={true} />
              </SettingsItem>
              
              <Separator />
              
              <SettingsItem 
                label="Default Time Range" 
                description="Default time range for charts and analytics"
              >
                <SettingsSelectWithStorage
                  storageKey="default_time_range"
                  defaultValue="30d"
                  options={[
                    { value: "7d", label: "Last 7 days" },
                    { value: "30d", label: "Last 30 days" },
                    { value: "90d", label: "Last 90 days" },
                    { value: "1y", label: "Last year" }
                  ]}
                />
              </SettingsItem>
              
              <Separator />
              
              <SettingsItem 
                label="Chart Animation" 
                description="Enable smooth animations in charts and graphs"
              >
                <SettingsToggleWithStorage storageKey="chart_animation" defaultValue={true} />
              </SettingsItem>
            </SettingsSection>

            {/* Notifications */}
            <SettingsSection 
              title="Notifications" 
              description="Configure how you receive notifications and alerts"
              className="border-l-4 border-l-yellow-500"
            >
              <SettingsItem 
                label="Email Notifications" 
                description="Receive important updates via email"
              >
                <SettingsToggleWithStorage storageKey="email_notifications" defaultValue={true} />
              </SettingsItem>
              
              <Separator />
              
              <SettingsItem 
                label="Browser Notifications" 
                description="Show desktop notifications for alerts"
              >
                <SettingsToggleWithStorage storageKey="browser_notifications" defaultValue={false} />
              </SettingsItem>
              
              <Separator />
              
              <SettingsItem 
                label="Low Stock Alerts" 
                description="Get notified when products are running low"
              >
                <SettingsToggleWithStorage storageKey="low_stock_alerts" defaultValue={true} />
              </SettingsItem>
              
              <Separator />
              
              <SettingsItem 
                label="Trend Alerts" 
                description="Receive alerts about trending products and opportunities"
              >
                <SettingsToggleWithStorage storageKey="trend_alerts" defaultValue={true} />
              </SettingsItem>
            </SettingsSection>

            {/* Data Management */}
            <SettingsSection 
              title="Data Management" 
              description="Control data refresh, export, and storage settings"
              className="border-l-4 border-l-purple-500"
            >
              <SettingsItem 
                label="Data Refresh Interval" 
                description="How often to refresh data from external sources"
              >
                <SettingsSelectWithStorage
                  storageKey="data_refresh_interval"
                  defaultValue="5m"
                  options={[
                    { value: "1m", label: "Every minute" },
                    { value: "5m", label: "Every 5 minutes" },
                    { value: "15m", label: "Every 15 minutes" },
                    { value: "30m", label: "Every 30 minutes" },
                    { value: "1h", label: "Every hour" }
                  ]}
                />
              </SettingsItem>
              
              <Separator />
              
              <SettingsItem 
                label="Auto Export" 
                description="Automatically export data reports"
              >
                <SettingsToggleWithStorage storageKey="auto_export" defaultValue={false} />
              </SettingsItem>
              
              <Separator />
              
              <SettingsItem 
                label="Data Retention" 
                description="How long to keep historical data"
              >
                <SettingsSelectWithStorage
                  storageKey="data_retention"
                  defaultValue="1y"
                  options={[
                    { value: "6m", label: "6 months" },
                    { value: "1y", label: "1 year" },
                    { value: "2y", label: "2 years" },
                    { value: "unlimited", label: "Unlimited" }
                  ]}
                />
              </SettingsItem>
              
              <Separator />
              
              <SettingsItem label="Export Data" description="Download your data in various formats">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleExportData}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleRefreshData}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </SettingsItem>
            </SettingsSection>

            {/* Appearance */}
            <SettingsSection 
              title="Appearance" 
              description="Customize the look and feel of your dashboard"
              className="border-l-4 border-l-pink-500"
            >
              <SettingsItem 
                label="Theme" 
                description="Choose your preferred color scheme"
              >
                <SettingsSelectWithStorage
                  storageKey="theme"
                  defaultValue="system"
                  options={[
                    { value: "light", label: "Light" },
                    { value: "dark", label: "Dark" },
                    { value: "system", label: "System" }
                  ]}
                />
              </SettingsItem>
              
              <Separator />
              
              <SettingsItem 
                label="Compact Mode" 
                description="Use a more compact layout to fit more information"
              >
                <SettingsToggleWithStorage storageKey="compact_mode" defaultValue={false} />
              </SettingsItem>
              
              <Separator />
              
              <SettingsItem 
                label="Sidebar Position" 
                description="Position of the navigation sidebar"
              >
                <SettingsSelectWithStorage
                  storageKey="sidebar_position"
                  defaultValue="left"
                  options={[
                    { value: "left", label: "Left" },
                    { value: "right", label: "Right" },
                    { value: "hidden", label: "Hidden" }
                  ]}
                />
              </SettingsItem>
            </SettingsSection>

            {/* Security */}
            <SettingsSection 
              title="Security" 
              description="Manage your account security and privacy settings"
              className="border-l-4 border-l-red-500"
            >
              <SettingsItem 
                label="Two-Factor Authentication" 
                description="Add an extra layer of security to your account"
              >
                <div className="flex items-center gap-2">
                  <SettingsToggleWithStorage storageKey="two_factor_auth" defaultValue={false} />
                  <Badge variant="outline">Not Enabled</Badge>
                </div>
              </SettingsItem>
              
              <Separator />
              
              <SettingsItem 
                label="Session Timeout" 
                description="Automatically log out after period of inactivity"
              >
                <SettingsSelectWithStorage
                  storageKey="session_timeout"
                  defaultValue="30m"
                  options={[
                    { value: "15m", label: "15 minutes" },
                    { value: "30m", label: "30 minutes" },
                    { value: "1h", label: "1 hour" },
                    { value: "2h", label: "2 hours" },
                    { value: "never", label: "Never" }
                  ]}
                />
              </SettingsItem>
              
              <Separator />
              
              <SettingsItem 
                label="Data Privacy" 
                description="Control how your data is used and shared"
              >
                <SettingsToggleWithStorage storageKey="data_privacy" defaultValue={true} />
              </SettingsItem>
            </SettingsSection>

            {/* Footer */}
            <div className="pt-6 border-t">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div>
                  TrendAI Dashboard v1.0.0 • Last updated: {new Date().toLocaleDateString()}
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm">Reset to Defaults</Button>
                  <Button size="sm">Save All Changes</Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
