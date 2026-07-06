"use client";

import { ROLE_DISPATCHER, ROLE_FIELD_LEAD } from "@/lib/roles";

const ROLES = [ROLE_DISPATCHER, ROLE_FIELD_LEAD];

export default function RoleSwitcher({ role, onChange }) {
  return (
    <div className="inline-flex rounded-lg border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-950">
      {ROLES.map((roleOption) => {
        const selected = role === roleOption;
        return (
          <button
            key={roleOption}
            type="button"
            onClick={() => onChange(roleOption)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              selected
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
            }`}
          >
            {roleOption}
          </button>
        );
      })}
    </div>
  );
}
