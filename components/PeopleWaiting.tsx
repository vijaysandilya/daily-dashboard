"use client";

import { PersonWaiting } from "@/lib/types";

const urgencyStyles: Record<string, { bg: string; dot: string }> = {
  high: {
    bg: "border-l-red-500",
    dot: "bg-red-500",
  },
  medium: {
    bg: "border-l-amber-500",
    dot: "bg-amber-500",
  },
  low: {
    bg: "border-l-gray-400",
    dot: "bg-gray-400",
  },
};

const channelIcons: Record<string, string> = {
  email: "\u2709\uFE0F",
  slack: "\uD83D\uDCAC",
  jira: "\uD83C\uDFAF",
};

export default function PeopleWaiting({
  people,
}: {
  people: PersonWaiting[];
}) {
  if (!people || people.length === 0) return null;

  return (
    <section className="bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center text-white text-sm font-bold">
            !
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            People Waiting on You
          </h2>
        </div>
        <span className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {people.length}
        </span>
      </div>
      <div className="space-y-3">
        {people.map((person, i) => {
          const style = urgencyStyles[person.urgency] || urgencyStyles.medium;
          return (
            <a
              key={i}
              href={person.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`block border-l-4 ${style.bg} bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${style.dot} shrink-0`}
                  />
                  <span className="font-medium text-sm text-gray-900 dark:text-white">
                    {person.name}
                  </span>
                  <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                    {person.waitDays}d
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {person.channels.map((ch, j) => (
                    <span
                      key={j}
                      className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-1.5 py-0.5 rounded"
                    >
                      {channelIcons[ch] || ""} {ch}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                {person.need}
              </p>
            </a>
          );
        })}
      </div>
    </section>
  );
}
