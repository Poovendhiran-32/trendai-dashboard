import { DashboardHeader } from "@/components/dashboard-header"

export default function LinksPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-foreground">Links</h1>
        <p className="text-muted-foreground">External links and resources coming soon...</p>
      </main>
    </div>
  )
}
