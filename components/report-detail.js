function getPriorityClasses(priority) {
  if (priority === "High") {
    return "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300";
  }

  if (priority === "Medium") {
    return "bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-300";
  }

  return "bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200";
}

function getStatusClasses(status) {
  if (status === "Closed") {
    return "bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200";
  }

  return "bg-amber-100 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200";
}

export default function ReportDetail({ report, teams = [] }) {
  const assignedTeamId = report.assignedTeamId;
  const matchedTeam = teams.find((team) => team.id === assignedTeamId);

  let assignedTeamLabel = "Unassigned";
  if (assignedTeamId) {
    assignedTeamLabel = matchedTeam?.name || `Unknown team (${assignedTeamId})`;
  }

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight">{report.title}</h1>
        <div className="flex gap-2">
          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${getPriorityClasses(report.priority)}`}>
            Priority: {report.priority}
          </span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${getStatusClasses(report.status)}`}>
            Status: {report.status}
          </span>
        </div>
      </div>

      <dl className="mt-5 space-y-3 text-sm">
        <div>
          <dt className="font-semibold">Location</dt>
          <dd className="text-zinc-700 dark:text-zinc-200">{report.location}</dd>
        </div>
        <div>
          <dt className="font-semibold">Description</dt>
          <dd className="text-zinc-700 dark:text-zinc-200">{report.description || "No description provided."}</dd>
        </div>
        <div>
          <dt className="font-semibold">Assigned Team</dt>
          <dd className="text-zinc-700 dark:text-zinc-200">
            {assignedTeamLabel}
          </dd>
        </div>
      </dl>
    </section>
  );
}
