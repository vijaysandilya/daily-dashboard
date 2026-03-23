"use client";

import { UnrepliedEmail } from "@/lib/types";

function timeAgo(dateStr: string): string {
  const now = new Date();
  const then = new Date(dateStr);
  const diffMs = now.getTime() - then.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return "just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}

function urgencyColor(dateStr: string): string {
  const now = new Date();
  const then = new Date(dateStr);
  const diffDays = (now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24);
  if (diffDays > 3) return "border-l-red-500";
  if (diffDays > 1) return "border-l-amber-500";
  return "border-l-green-500";
}

export default function UnrepliedEmails({
  emails,
}: {
  emails: UnrepliedEmail[];
}) {
  if (emails.length === 0) {
    return (
      <Section title="Unreplied Emails" icon="envelope" count={0}>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          All caught up!
        </p>
      </Section>
    );
  }

  return (
    <Section title="Unreplied Emails" icon="envelope" count={emails.length}>
      <div className="space-y-3">
        {emails.map((email) => (
          <a
            key={email.id}
            href={email.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`block border-l-4 ${urgencyColor(email.receivedAt)} bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
          >
            <div className="flex justify-between items-start mb-1">
              <span className="font-medium text-gray-900 dark:text-white text-sm">
                {email.from}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                {timeAgo(email.receivedAt)}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {email.subject}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
              {email.snippet}
            </p>
          </a>
        ))}
      </div>
    </Section>
  );
}

function Section({
  title,
  icon,
  count,
  children,
}: {
  title: string;
  icon: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white text-xs">
            {icon === "envelope" ? "\u2709" : "\u2709"}
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
        </div>
        {count > 0 && (
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}
