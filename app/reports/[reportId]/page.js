import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import ReportDetail from "@/components/report-detail";
import {
  fetchActivitiesByReportId,
  fetchReportById,
  fetchTeams,
} from "@/lib/api-client";

function getBaseUrl(headersList) {
  const host = headersList.get("x-forwarded-host") || headersList.get("host");
  if (!host) {
    return "";
  }

  const protocol = headersList.get("x-forwarded-proto") || "http";
  return `${protocol}://${host}`;
}

export default async function ReportPage({ params }) {
  const { reportId } = await params;
  const baseUrl = getBaseUrl(await headers());

  const report = await fetchReportById(reportId, baseUrl);
  if (!report) {
    notFound();
  }

  let activities = [];
  let teams = [];
  let pageError = "";
  try {
    [activities, teams] = await Promise.all([
      fetchActivitiesByReportId(reportId, baseUrl),
      fetchTeams(baseUrl),
    ]);
  } catch (error) {
    pageError = error.message || "Failed to load report details.";
  }

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/"
        className="inline-flex text-sm font-medium text-zinc-700 hover:text-zinc-900 dark:text-zinc-200 dark:hover:text-white"
      >
        ← Back to report list
      </Link>

      {pageError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-900 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
          {pageError}
        </div>
      ) : (
        <ReportDetail
          reportId={reportId}
          initialReport={report}
          initialTeams={teams}
          initialActivities={activities}
        />
      )}
    </main>
  );
}
