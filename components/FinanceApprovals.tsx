"use client";

import { FinanceApproval, FinanceClarification } from "@/lib/types";

function ageBadge(days: number): { text: string; color: string } {
  if (days > 300) return { text: `${days}d`, color: "bg-red-600 text-white" };
  if (days > 90)
    return {
      text: `${days}d`,
      color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    };
  if (days > 30)
    return {
      text: `${days}d`,
      color:
        "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    };
  return {
    text: `${days}d`,
    color:
      "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  };
}

export default function FinanceApprovals({
  approvals,
  clarifications,
}: {
  approvals: FinanceApproval[];
  clarifications: FinanceClarification[];
}) {
  const totalAmount = approvals.reduce((sum, a) => {
    if (!a.amount) return sum;
    const match = a.amount.replace(/[₹£,]/g, "").match(/[\d.]+/);
    return sum + (match ? parseFloat(match[0]) : 0);
  }, 0);

  return (
    <section className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 col-span-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white text-xs font-bold">
            ₹
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Finance Approvals Pending
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {approvals.length} unapproved
          </span>
          {clarifications.length > 0 && (
            <span className="bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {clarifications.length} need follow-up
            </span>
          )}
        </div>
      </div>

      {totalAmount > 0 && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          Combined identifiable amount:{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            ₹{totalAmount.toLocaleString("en-IN")}+
          </span>{" "}
          (some tickets have no amount listed)
        </p>
      )}

      {/* Unapproved tickets */}
      <div className="space-y-2 mb-4">
        {approvals.map((a) => {
          const badge = ageBadge(a.daysPending);
          return (
            <a
              key={a.key}
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 mt-0.5 ${badge.color}`}
              >
                {badge.text}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                    {a.key}
                  </span>
                  {a.amount && (
                    <span className="text-xs font-semibold text-gray-900 dark:text-white">
                      {a.amount}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {a.whatToApprove}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Requested by {a.requestedBy} &middot; {a.summary}
                </p>
              </div>
            </a>
          );
        })}
      </div>

      {/* Needs clarification */}
      {clarifications.length > 0 && (
        <details className="mt-4">
          <summary className="text-xs font-semibold text-amber-600 dark:text-amber-400 cursor-pointer uppercase tracking-wider">
            {clarifications.length} tickets where you asked a question but
            didn&apos;t approve
          </summary>
          <div className="space-y-2 mt-2">
            {clarifications.map((c) => (
              <a
                key={c.key}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                    {c.key}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {c.summary}
                  </span>
                </div>
                <p className="text-xs text-amber-700 dark:text-amber-300 mb-1">
                  You asked: &ldquo;{c.vijayQuestion}&rdquo;
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Reply: {c.lastReply}
                </p>
              </a>
            ))}
          </div>
        </details>
      )}
    </section>
  );
}
