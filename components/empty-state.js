export default function EmptyState({
  title = "No reports found",
  description = "There are currently no emergency reports to display.",
}) {
  return (
    <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center dark:border-zinc-700 dark:bg-zinc-900/40">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{description}</p>
    </div>
  );
}
