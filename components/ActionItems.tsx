"use client";

import { ActionItem } from "@/lib/types";

const sourceIcon: Record<string, string> = {
  email: "\u2709\uFE0F",
  slack: "\uD83D\uDCAC",
  jira: "\uD83C\uDFAF",
};

export default function ActionItems({ items }: { items: ActionItem[] }) {
  const pending = items.filter((i) => !i.done);
  const done = items.filter((i) => i.done);

  return (
    <section className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white text-sm">
            !
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Action Items
          </h2>
        </div>
        {pending.length > 0 && (
          <span className="bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {pending.length} pending
          </span>
        )}
      </div>
      <div className="space-y-3">
        {pending.map((item) => (
          <a
            key={item.id}
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="mt-0.5 w-4 h-4 rounded border-2 border-gray-300 dark:border-gray-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {item.text}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {sourceIcon[item.sourceType]} {item.source} &middot; {item.date}
              </p>
            </div>
          </a>
        ))}
        {done.length > 0 && (
          <details className="mt-2">
            <summary className="text-xs text-gray-400 cursor-pointer">
              {done.length} completed
            </summary>
            <div className="space-y-2 mt-2">
              {done.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 opacity-50 p-2"
                >
                  <div className="mt-0.5 w-4 h-4 rounded border-2 border-green-500 bg-green-500 shrink-0 flex items-center justify-center text-white text-[10px]">
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
      </div>
    </section>
  );
}
