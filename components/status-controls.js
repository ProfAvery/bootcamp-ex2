"use client";

import { getAllowedTransitions } from "@/lib/report-workflow";
import { canUpdateStatus } from "@/lib/roles";

export default function StatusControls({ role, report, onAdvanceStatus, isSubmitting }) {
  const nextStatus = getAllowedTransitions(report.status)[0];
  const showAdvanceButton =
    report.status === "Assigned" || report.status === "In Progress";

  if (!canUpdateStatus(role)) {
    return (
      <section className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-sm font-semibold">Status</h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          This role cannot update status.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="text-sm font-semibold">Status</h2>
      {report.status === "New" ? (
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Assign a team to move this report to Assigned.
        </p>
      ) : !nextStatus || !showAdvanceButton ? (
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          No further status updates are allowed.
        </p>
      ) : (
        <button
          type="button"
          onClick={() => onAdvanceStatus(nextStatus)}
          disabled={isSubmitting}
          className="mt-3 inline-flex rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 hover:bg-blue-500"
        >
          {isSubmitting ? "Updating..." : `Move to ${nextStatus}`}
        </button>
      )}
    </section>
  );
}
