"use client";

import { useEffect, useState } from "react";
import EmptyState from "@/components/empty-state";
import LoadingState from "@/components/loading-state";
import ReportCard from "@/components/report-card";
import { fetchReports } from "@/lib/api-client";

export default function ReportList() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadReports() {
      setIsLoading(true);
      setError("");

      try {
        const data = await fetchReports();
        if (isMounted) {
          setReports(Array.isArray(data) ? data : []);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || "Unable to load reports.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadReports();
    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <EmptyState
        title="Unable to load reports"
        description={error}
      />
    );
  }

  if (reports.length === 0) {
    return <EmptyState />;
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {reports.map((report) => (
        <ReportCard key={report.id} report={report} />
      ))}
    </section>
  );
}
