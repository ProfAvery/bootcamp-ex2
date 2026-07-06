"use client";

import { useState } from "react";
import { canAssignTeam } from "@/lib/roles";

export default function TeamAssignment({ role, report, teams, onAssign, isSubmitting }) {
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const isClosed = report.status === "Closed";
  const canAssign = canAssignTeam(role) && !isClosed;
  const availableTeams = teams.filter((team) => team.availability === "Available");

  if (!canAssignTeam(role)) {
    return (
      <section className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-sm font-semibold">Team Assignment</h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Field Lead cannot assign teams.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <h2 className="text-sm font-semibold">Team Assignment</h2>

      {isClosed ? (
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Closed reports cannot be reassigned.
        </p>
      ) : (
        <>
          <label htmlFor="team-select" className="mt-3 block text-xs font-medium text-zinc-700 dark:text-zinc-300">
            Assign available team
          </label>
          <select
            id="team-select"
            value={selectedTeamId}
            onChange={(event) => setSelectedTeamId(event.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
            disabled={isSubmitting || teams.length === 0}
          >
            <option value="">Select a team</option>
            {teams.map((team) => (
              <option
                key={team.id}
                value={team.id}
                disabled={team.availability !== "Available"}
              >
                {team.availability === "Available"
                  ? `${team.name} (Available)`
                  : `${team.name} (Busy - unavailable)`}
              </option>
            ))}
          </select>

          {availableTeams.length === 0 ? (
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              No teams are currently available.
            </p>
          ) : null}

          <button
            type="button"
            onClick={() => onAssign(selectedTeamId)}
            disabled={!canAssign || !selectedTeamId || isSubmitting}
            className="mt-3 inline-flex rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
          >
            {isSubmitting ? "Assigning..." : "Assign Team"}
          </button>
        </>
      )}
    </section>
  );
}
