"use client";

import { DeadlineItem } from "@/lib/types";

function isToday(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

function isTomorrow(dateStr: string): boolean {
  const d = new Date(dateStr);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return d.toDateString() === tomorrow.toDateString();
}

function formatDate(dateStr: string): string {
  if (isToday(dateStr)) return "Today";
  if (isTomorrow(dateStr)) return "Tomorrow";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function DeadlinesThisWeek({
  items,
}: {
  items: DeadlineItem[];
}) {
  if (!items || items.length === 0) return null;

  return (
    <section className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-white text-sm font-bold">
            D
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Deadlines This Week
          </h2>
        </div>
        <span className="bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {items.length}
        </span>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div
            key={i}
            className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm ${
              isToday(item.date)
                ? "border-l-4 border-l-red-500"
                : isTomorrow(item.date)
                  ? "border-l-4 border-l-amber-500"
                  : "border-l-4 border-l-gray-300 dark:border-l-gray-600"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {item.title}
              </span>
              <div className="flex items-center gap-2">
                {item.prepNeeded && (
                  <span className="text-[10px] bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-1.5 py-0.5 rounded font-medium">
                    PREP NEEDED
                  </span>
                )}
                <span
                  className={`text-xs font-medium ${
                    isToday(item.date)
                      ? "text-red-600 dark:text-red-400"
                      : isTomorrow(item.date)
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {formatDate(item.date)}
                  {item.time ? ` ${item.time}` : ""}
                </span>
              </div>
            </div>
            {item.note && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {item.note}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
