"use client";

import { useState } from "react";
import ActivityLog from "@/components/activity-log";
import RoleSwitcher from "@/components/role-switcher";
import StatusControls from "@/components/status-controls";
import TeamAssignment from "@/components/team-assignment";
import {
  assignTeamToReport,
  createActivity,
  fetchActivitiesByReportId,
  fetchReportById,
  fetchTeams,
  updateReportStatus,
} from "@/lib/api-client";
import { ROLE_DISPATCHER } from "@/lib/roles";

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

function getAssignedTeamLabel(report, teams) {
  if (!report.assignedTeamId) {
    return "Unassigned";
  }

  const team = teams.find((item) => item.id === report.assignedTeamId);
  return team?.name || `Unknown team (${report.assignedTeamId})`;
}

export default function ReportDetail({
  reportId,
  initialReport,
  initialTeams = [],
  initialActivities = [],
}) {
  const [role, setRole] = useState(ROLE_DISPATCHER);
  const [report, setReport] = useState(initialReport);
  const [teams, setTeams] = useState(initialTeams);
  const [activities, setActivities] = useState(initialActivities);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [loadError, setLoadError] = useState("");

  const assignedTeamLabel = getAssignedTeamLabel(report, teams);

  async function refreshDetailData() {
    const [nextReport, nextTeams, nextActivities] = await Promise.all([
      fetchReportById(reportId),
      fetchTeams(),
      fetchActivitiesByReportId(reportId),
    ]);

    if (!nextReport) {
      throw new Error("Report not found.");
    }

    setReport(nextReport);
    setTeams(nextTeams);
    setActivities(nextActivities);
    setLoadError("");
  }

  async function handleTeamAssignment(teamId) {
    if (!teamId) {
      setFeedback({ type: "error", message: "Select a team before assigning." });
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const selectedTeam = teams.find((team) => team.id === teamId);
      await assignTeamToReport(reportId, teamId, role);
      await createActivity({
        reportId,
        type: "team_assigned",
        message: `${role} assigned ${selectedTeam?.name || teamId} to this report.`,
        actorRole: role,
      });
      await refreshDetailData();
      setFeedback({ type: "success", message: "Team assigned successfully." });
    } catch (error) {
      setFeedback({ type: "error", message: error.message || "Failed to assign team." });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleStatusAdvance(nextStatus) {
    if (!nextStatus) {
      return;
    }

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const previousStatus = report.status;
      await updateReportStatus(reportId, nextStatus, role);
      await createActivity({
        reportId,
        type: "status_updated",
        message: `${role} changed status from ${previousStatus} to ${nextStatus}.`,
        actorRole: role,
      });
      await refreshDetailData();
      setFeedback({ type: "success", message: "Status updated successfully." });
    } catch (error) {
      setFeedback({ type: "error", message: error.message || "Failed to update status." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
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
            <dd className="text-zinc-700 dark:text-zinc-200">
              {report.description || "No description provided."}
            </dd>
          </div>
          <div>
            <dt className="font-semibold">Assigned Team</dt>
            <dd className="text-zinc-700 dark:text-zinc-200">{assignedTeamLabel}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Active role: <span className="font-semibold">{role}</span>
        </p>
        <div className="mt-3">
          <RoleSwitcher role={role} onChange={setRole} />
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <TeamAssignment
          role={role}
          report={report}
          teams={teams}
          onAssign={handleTeamAssignment}
          isSubmitting={isSubmitting}
        />
        <StatusControls
          role={role}
          report={report}
          onAdvanceStatus={handleStatusAdvance}
          isSubmitting={isSubmitting}
        />
      </div>

      {loadError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
          {loadError}
        </div>
      ) : null}

      {feedback ? (
        <div
          className={`rounded-lg border p-4 text-sm ${
            feedback.type === "success"
              ? "border-green-200 bg-green-50 text-green-900 dark:border-green-900/40 dark:bg-green-950/30 dark:text-green-200"
              : "border-red-200 bg-red-50 text-red-900 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200"
          }`}
        >
          {feedback.message}
        </div>
      ) : null}

      <ActivityLog activities={activities} />
    </div>
  );
}
