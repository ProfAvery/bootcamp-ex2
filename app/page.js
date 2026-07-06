"use client";

import { useState } from "react";
import ReportList from "@/components/report-list";
import RoleSwitcher from "@/components/role-switcher";
import { ROLE_DISPATCHER } from "@/lib/roles";

export default function Home() {
  const [role, setRole] = useState(ROLE_DISPATCHER);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6 space-y-3">
        <h1 className="text-2xl font-bold tracking-tight">Emergency Request Queue</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Active role: <span className="font-semibold">{role}</span>
        </p>
        <RoleSwitcher role={role} onChange={setRole} />
      </header>

      <ReportList />
    </main>
  );
}
