import { getSession } from "@/lib/auth";
import { getProfileStats } from "@/lib/db/profiles";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { PerformanceChart } from "@/components/dashboard/performance-chart";

export default async function DashboardPage() {
  const session = await getSession();
  
  let stats = null;
  try {
    if (session?.user.id) {
      stats = await getProfileStats(session.user.id);
    }
  } catch {
    // Stats will be null if there's an error
  }

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          Welcome back, {session?.user.name.split(" ")[0]}
        </h2>
        <p className="text-muted-foreground">
          {"Here's what's happening with your profiles today."}
        </p>
      </div>

      {/* Stats cards */}
      <StatsCards stats={stats} />

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Performance chart */}
        <div className="lg:col-span-4">
          <PerformanceChart />
        </div>

        {/* Quick actions */}
        <div className="lg:col-span-3">
          <QuickActions />
        </div>
      </div>

      {/* Recent activity */}
      <RecentActivity />
    </div>
  );
}
