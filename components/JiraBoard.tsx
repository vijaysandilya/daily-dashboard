"use client";

import { JiraTicket } from "@/lib/types";

const priorityColors: Record<string, string> = {
  Critical: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  High: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  Medium:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  Low: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
};

const statusColors: Record<string, string> = {
  "In Progress":
    "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  "To Do": "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  Blocked: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  Done: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
};

function isOverdue(dueDate: string | null): boolean {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
}

export default function JiraBoard({ tickets }: { tickets: JiraTicket[] }) {
  const overdue = tickets.filter(
    (t) => isOverdue(t.dueDate) && t.status !== "Done"
  );
  const rest = tickets.filter(
    (t) => !isOverdue(t.dueDate) || t.status === "Done"
  );

  return (
    <section className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
            J
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Jira Tickets
          </h2>
        </div>
        <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {tickets.length}
        </span>
      </div>

      {overdue.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider mb-2">
            Overdue
          </p>
          <div className="space-y-2">
            {overdue.map((t) => (
              <TicketCard key={t.key} ticket={t} isOverdue />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        {rest.map((t) => (
          <TicketCard key={t.key} ticket={t} />
        ))}
      </div>
    </section>
  );
}

function TicketCard({
  ticket,
  isOverdue,
}: {
  ticket: JiraTicket;
  isOverdue?: boolean;
}) {
  return (
    <a
      href={ticket.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`block bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow ${isOverdue ? "border-l-4 border-l-red-500" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
              {ticket.key}
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${statusColors[ticket.status] || "bg-gray-100 text-gray-700"}`}
            >
              {ticket.status}
            </span>
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {ticket.summary}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${priorityColors[ticket.priority] || ""}`}
          >
            {ticket.priority}
          </span>
          {ticket.dueDate && (
            <span
              className={`text-[10px] ${isOverdue ? "text-red-500 font-semibold" : "text-gray-400"}`}
            >
              {isOverdue ? "Due " : ""}
              {ticket.dueDate}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
