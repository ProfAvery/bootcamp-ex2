import Link from "next/link";

function getStatusClasses(status) {
  if (status === "Closed") {
    return "border-zinc-300 bg-zinc-50 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300";
  }

  return "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-200";
}

function getPriorityClasses(priority) {
  if (priority === "High") {
    return "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300";
  }

  if (priority === "Medium") {
    return "bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-300";
  }

  return "bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200";
}

export default function ReportCard({ report }) {
  return (
    <Link
      href={`/reports/${report.id}`}
      className={`block rounded-lg border p-4 transition hover:shadow-sm ${getStatusClasses(report.status)}`}
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-base font-semibold">{report.title}</h2>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${getPriorityClasses(
            report.priority,
          )}`}
        >
          {report.priority}
        </span>
      </div>
      <p className="mt-2 text-sm">Location: {report.location}</p>
      <p className="mt-2 text-sm font-medium">Status: {report.status}</p>
    </Link>
  );
}
