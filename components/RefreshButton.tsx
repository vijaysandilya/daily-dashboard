"use client";

import { useState } from "react";

function hoursAgo(dateStr: string): number {
  return Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60)
  );
}

export default function RefreshButton({
  lastRefreshed,
}: {
  lastRefreshed: string;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const hours = hoursAgo(lastRefreshed);
  const isStale = hours >= 12;

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
        title={isStale ? `Data is ${hours}h old — needs refresh` : "Refresh dashboard"}
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
        <div className="absolute top-11 right-0 z-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg min-w-[240px]">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            {isStale ? "⚠️ Dashboard data is stale" : "Refresh Dashboard"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            {isStale
              ? `Last refreshed ${hours} hours ago. Open Claude Code and say:`
              : "To refresh now, open Claude Code and say:"}
          </p>
          <button
            onClick={() => {
              navigator.clipboard.writeText("refresh my dashboard");
              setShowTooltip(false);
            }}
            className="w-full text-left bg-gray-100 dark:bg-gray-700 rounded-md px-3 py-2 text-sm font-mono text-indigo-600 dark:text-indigo-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
          >
            refresh my dashboard
            <span className="float-right text-[10px] text-gray-400 mt-0.5">
              click to copy
            </span>
          </button>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2">
            Auto-refreshes daily at 7:00 AM IST
          </p>
        </div>
      )}
    </div>
  );
}
