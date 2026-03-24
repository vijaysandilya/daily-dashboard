"use client";

import { useState } from "react";

function hoursAgo(dateStr: string): number {
  return Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60)
  );
}

function nextRefreshTime(): string {
  const now = new Date();
  const ist = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
  const hour = ist.getHours();
  // Refresh schedule: 7am, 1pm, 7pm IST
  let nextHour: number;
  if (hour < 7) nextHour = 7;
  else if (hour < 13) nextHour = 13;
  else if (hour < 19) nextHour = 19;
  else nextHour = 7; // tomorrow

  if (nextHour <= hour) {
    return `7:00 AM tomorrow`;
  }
  const ampm = nextHour >= 12 ? "PM" : "AM";
  const displayHour = nextHour > 12 ? nextHour - 12 : nextHour;
  return `${displayHour}:00 ${ampm} today`;
}

export default function RefreshButton({
  lastRefreshed,
}: {
  lastRefreshed: string;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [copied, setCopied] = useState(false);
  const hours = hoursAgo(lastRefreshed);
  const isStale = hours >= 6;

  const terminalCmd = "cd ~/Projects/daily-dashboard && ./refresh.sh";

  function handleCopy() {
    navigator.clipboard.writeText(terminalCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowTooltip(!showTooltip)}
        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
          isStale
            ? "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900 animate-pulse"
            : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
        }`}
        aria-label="Refresh dashboard"
        title={
          isStale
            ? `Data is ${hours}h old — needs refresh`
            : "Refresh dashboard"
        }
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
          <path d="M21 21v-5h-5" />
        </svg>
      </button>

      {showTooltip && (
        <div className="absolute top-11 right-0 z-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-lg min-w-[280px]">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            {isStale ? "Dashboard data is stale" : "Refresh Dashboard"}
          </p>

          {/* Auto schedule info */}
          <div className="flex items-center gap-2 mb-3 bg-gray-50 dark:bg-gray-900 rounded-md px-3 py-2">
            <span className="text-green-500 text-sm">&#9679;</span>
            <div>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                Auto-refreshes 3x daily
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">
                7 AM &middot; 1 PM &middot; 7 PM IST &mdash; Next:{" "}
                {nextRefreshTime()}
              </p>
            </div>
          </div>

          {/* Manual refresh */}
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            For immediate refresh, run in Terminal:
          </p>
          <button
            onClick={handleCopy}
            className="w-full text-left bg-gray-900 dark:bg-gray-950 rounded-md px-3 py-2.5 text-xs font-mono text-green-400 hover:bg-gray-800 dark:hover:bg-black transition-colors cursor-pointer"
          >
            <span className="text-gray-500">$ </span>
            ./refresh.sh
            <span className="float-right text-[10px] text-gray-500 mt-0.5">
              {copied ? "Copied!" : "click to copy"}
            </span>
          </button>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2">
            Takes 3-5 min. Runs in background, auto-deploys when done.
          </p>
        </div>
      )}
    </div>
  );
}
