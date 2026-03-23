"use client";

import { GoalsData } from "@/lib/types";

function progressPercent(current: string, target: string): number {
  const c = parseFloat(current);
  const t = parseFloat(target);
  if (t === 0) return 0;
  return Math.min(100, Math.round((c / t) * 100));
}

function progressColor(pct: number): string {
  if (pct >= 80) return "bg-green-500";
  if (pct >= 50) return "bg-amber-500";
  return "bg-red-500";
}

export default function OkrTracker({ goals }: { goals: GoalsData }) {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white text-xs font-bold">
          OKR
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          OKRs & Targets
        </h2>
      </div>

      <div className="space-y-6">
        {goals.objectives.map((obj, oi) => (
          <div key={oi}>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">
              {obj.title}
            </h3>
            <div className="space-y-3">
              {obj.keyResults.map((kr, ki) => {
                const pct = progressPercent(kr.current, kr.target);
                return (
                  <div
                    key={ki}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {kr.title}
                      </span>
                      <span className="text-sm font-mono font-medium text-gray-900 dark:text-white">
                        {kr.current}
                        {kr.unit} / {kr.target}
                        {kr.unit}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${progressColor(pct)}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {goals.notes.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Notes
          </p>
          <ul className="space-y-1">
            {goals.notes.map((note, i) => (
              <li
                key={i}
                className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2"
              >
                <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 shrink-0" />
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
