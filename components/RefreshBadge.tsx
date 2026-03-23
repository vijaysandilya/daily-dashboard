"use client";

export default function RefreshBadge({
  lastRefreshed,
}: {
  lastRefreshed: string;
}) {
  const d = new Date(lastRefreshed);
  const formatted = d.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  });

  return (
    <span className="text-xs text-gray-500 dark:text-gray-400">
      Last refreshed: {formatted} IST
    </span>
  );
}
