"use client";

import { useState } from "react";
import { PullStats } from "@/lib/types";

function hoursAgo(dateStr: string): number {
  return Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60)
  );
}

export default function RefreshBadge({
  lastRefreshed,
  pullStats,
}: {
  lastRefreshed: string;
  pullStats?: PullStats;
}) {
  const [showStats, setShowStats] = useState(false);
  const d = new Date(lastRefreshed);
  const formatted = d.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });
  const hours = hoursAgo(lastRefreshed);
  const isStale = hours >= 12;

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <button
          onClick={() => pullStats && setShowStats(!showStats)}
          className={`text-xs transition-colors cursor-pointer ${
            isStale
              ? "text-amber-600 dark:text-amber-400 font-medium"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          {isStale && "⚠️ "}Last refreshed: {formatted} IST
          {isStale && ` (${hours}h ago)`}
          {pullStats && (
            <span className="ml-1">{showStats ? "▲" : "▼"}</span>
          )}
        </button>
        {showStats && pullStats && (
          <div className="absolute top-6 left-0 z-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg text-xs text-gray-600 dark:text-gray-400 min-w-[220px]">
            <p className="font-semibold text-gray-900 dark:text-white mb-2">
              Data Pull Stats
            </p>
            <div className="space-y-1">
              <Row label="Gmail searched" value={pullStats.gmailSearched} />
              <Row label="Unreplied emails" value={pullStats.gmailUnreplied} />
              <Row
                label="Transcripts read"
                value={pullStats.gmailTranscriptsRead}
              />
              <Row
                label="Jira tickets checked"
                value={pullStats.jiraTicketsChecked}
              />
              <Row
                label="Jira comments read"
                value={pullStats.jiraCommentsRead}
              />
              <Row label="Jira active" value={pullStats.jiraActive} />
              <Row
                label="Slack channels scanned"
                value={pullStats.slackChannelsScanned}
              />
              <Row label="Slack DMs checked" value={pullStats.slackDmsChecked} />
              <Row
                label="Slack mentions found"
                value={pullStats.slackMentionsFound}
              />
              <Row
                label="Follow-ups extracted"
                value={pullStats.followUpsExtracted}
              />
            </div>
          </div>
        )}
      </div>
      {isStale && (
        <span className="text-[10px] bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full">
          Say &quot;refresh my dashboard&quot; in Claude
        </span>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span className="font-mono font-medium text-gray-900 dark:text-white">
        {value}
      </span>
    </div>
  );
}
