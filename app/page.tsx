import dashboardData from "@/data/dashboard-data.json";
import goalsData from "@/data/goals.json";
import type { DashboardData, GoalsData } from "@/lib/types";
import AiBriefing from "@/components/AiBriefing";
import UnrepliedEmails from "@/components/UnrepliedEmails";
import ActionItems from "@/components/ActionItems";
import FollowUps from "@/components/FollowUps";
import FinanceApprovals from "@/components/FinanceApprovals";
import JiraBoard from "@/components/JiraBoard";
import SlackAttention from "@/components/SlackAttention";
import OkrTracker from "@/components/OkrTracker";
import ThemeToggle from "@/components/ThemeToggle";
import RefreshBadge from "@/components/RefreshBadge";

export default function Home() {
  const data = dashboardData as DashboardData;
  const goals = goalsData as GoalsData;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Good Morning, Vijay
            </h1>
            <RefreshBadge
              lastRefreshed={data.lastRefreshed}
              pullStats={data.pullStats}
            />
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <AiBriefing data={data.aiBriefing} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UnrepliedEmails emails={data.unrepliedEmails} />
          <SlackAttention items={data.slackAttention} />
        </div>

        <FinanceApprovals
          approvals={data.financeApprovals || []}
          clarifications={data.financeNeedsClarification || []}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActionItems items={data.actionItems} />
          <FollowUps items={data.followUps || []} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <JiraBoard tickets={data.jiraTickets} />
          <OkrTracker goals={goals} />
        </div>
      </main>

      <footer className="max-w-4xl mx-auto px-4 sm:px-6 py-6 text-center text-xs text-gray-400 dark:text-gray-600">
        Powered by Claude &middot; Auto-refreshed daily at 7:00 AM IST
      </footer>
    </div>
  );
}
