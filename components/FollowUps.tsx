"use client";

import { FollowUp } from "@/lib/types";

const sourceIcon: Record<string, string> = {
  email: "\u2709\uFE0F",
  slack: "\uD83D\uDCAC",
  jira: "\uD83C\uDFAF",
};

function timeAgo(dateStr: string): string {
  const now = new Date();
  const then = new Date(dateStr);
  const diffDays = Math.floor(
    (now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "1 day ago";
  return `${diffDays}d ago`;
}

export default function FollowUps({ items }: { items: FollowUp[] }) {
  const pending = items.filter((i) => i.status === "pending");
  const done = items.filter((i) => i.status === "done");

  return (
    <section className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-white text-sm font-bold">
            F
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            My Follow-ups
          </h2>
        </div>
        {pending.length > 0 && (
          <span className="bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {pending.length} pending
          </span>
        )}
      </div>
      {pending.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          No pending follow-ups.
        </p>
      ) : (
        <div className="space-y-3">
          {pending.map((item) => (
            <a
              key={item.id}
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="mt-0.5 w-4 h-4 rounded-full border-2 border-cyan-400 dark:border-cyan-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.text}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {sourceIcon[item.sourceType]} To: {item.to}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    &middot;
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {timeAgo(item.date)}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
      {done.length > 0 && (
        <details className="mt-3">
          <summary className="text-xs text-gray-400 cursor-pointer">
            {done.length} completed
          </summary>
          <div className="space-y-2 mt-2">
            {done.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 opacity-50 p-2"
              >
                <div className="mt-0.5 w-4 h-4 rounded-full border-2 border-green-500 bg-green-500 shrink-0 flex items-center justify-center text-white text-[10px]">
                  &#10003;
                </div>
                <p className="text-sm line-through text-gray-500">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </details>
      )}
    </section>
  );
}
