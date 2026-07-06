function formatTimestamp(value) {
  if (!value) {
    return "Unknown time";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString();
}

export default function ActivityLog({ activities }) {
  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="text-lg font-semibold">Activity Log</h2>
      <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">
        Showing oldest to newest.
      </p>

      {activities.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300">
          No activity entries yet.
        </p>
      ) : (
        <ol className="mt-4 space-y-3">
          {activities.map((entry) => (
            <li
              key={entry.id ?? `${entry.reportId}-${entry.timestamp}-${entry.type}`}
              className="rounded-md border border-zinc-200 p-3 dark:border-zinc-800"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-medium">{entry.message}</p>
                <span className="text-xs text-zinc-600 dark:text-zinc-300">
                  {formatTimestamp(entry.timestamp)}
                </span>
              </div>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-300">
                Type: {entry.type} • Actor: {entry.actorRole}
              </p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
