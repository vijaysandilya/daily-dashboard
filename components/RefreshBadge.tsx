"use client";

import { useState } from "react";
import { PullStats } from "@/lib/types";

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

  return (
    <div className="relative">
      <button
        onClick={() => pullStats && setShowStats(!showStats)}
        className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer"
      >
        Last refreshed: {formatted} IST
        {pullStats && <span className="ml-1">{showStats ? "▲" : "▼"}</span>}
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
            <Row label="Jira comments read" value={pullStats.jiraCommentsRead} />
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
