"use client";

import { ConfluenceItem } from "@/lib/types";

function daysAgo(dateStr: string): string {
  const now = new Date();
  const then = new Date(dateStr);
  const diff = Math.floor(
    (now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diff === 0) return "today";
  if (diff === 1) return "1d ago";
  return `${diff}d ago`;
}

export default function ConfluenceWatch({
  items,
}: {
  items: ConfluenceItem[];
}) {
  if (!items || items.length === 0) return null;

  return (
    <section className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
            C
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Docs & PRDs
          </h2>
        </div>
        <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {items.length}
        </span>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <a
            key={i}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <span className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                {item.title}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {daysAgo(item.lastModified)}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              by {item.author}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
              {item.actionNeeded}
            </p>
          </a>
        ))}
      </div>
    </section>
  );
}
