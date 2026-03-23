"use client";

import { AiBriefing as AiBriefingType } from "@/lib/types";

export default function AiBriefing({ data }: { data: AiBriefingType }) {
  return (
    <section className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white text-sm font-bold">
          AI
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Morning Briefing
        </h2>
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
        {data.summary}
      </p>
      {data.highlights.length > 0 && (
        <ul className="space-y-2">
          {data.highlights.map((h, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
            >
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
              {h}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
