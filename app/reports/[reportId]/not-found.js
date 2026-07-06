import Link from "next/link";

export default function ReportNotFound() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-2xl font-bold tracking-tight">Report not found</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          We couldn&apos;t find a report with that ID.
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Back to report list
        </Link>
      </div>
    </main>
  );
}
