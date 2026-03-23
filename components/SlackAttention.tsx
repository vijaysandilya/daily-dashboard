"use client";

import { SlackItem } from "@/lib/types";

const typeLabels: Record<string, { label: string; color: string }> = {
  dm: {
    label: "DM",
    color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  },
  mention: {
    label: "@mention",
    color:
      "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  },
  thread: {
    label: "Thread",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
};

function formatTime(ts: string): string {
  const d = new Date(ts);
  const now = new Date();
  const diffHours = Math.floor(
    (now.getTime() - d.getTime()) / (1000 * 60 * 60)
  );
  if (diffHours < 1) return "just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

export default function SlackAttention({ items }: { items: SlackItem[] }) {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#4A154B] flex items-center justify-center text-white text-xs font-bold">
            S
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Slack Attention
          </h2>
        </div>
        {items.length > 0 && (
          <span className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {items.length}
          </span>
        )}
      </div>
      {items.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          No pending Slack items.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const typeInfo = typeLabels[item.type];
            return (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm text-gray-900 dark:text-white">
                      {item.from}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${typeInfo.color}`}
                    >
                      {typeInfo.label}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTime(item.timestamp)}
                  </span>
                </div>
                {item.channel !== "DM" && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {item.channel}
                  </p>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {item.preview}
                </p>
              </a>
            );
          })}
        </div>
      )}
    </section>
  );
}
