export async function fetchReports() {
  const response = await fetch("/api/reports", { cache: "no-store" });

  if (!response.ok) {
    let message = "Failed to fetch reports.";

    try {
      const payload = await response.json();
      if (payload?.error) {
        message = payload.error;
      }
    } catch {}

    throw new Error(message);
  }

  return response.json();
}
