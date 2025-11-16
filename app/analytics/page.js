import { DashboardHeader } from "@/components/dashboard-header"

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Advanced analytics and insights coming soon...</p>
      </main>
    </div>
  )
}
