"use client";

import { useSession } from "next-auth/react";
import { ROLE_LABELS, type UserRole } from "@/shared/types/roles";

export const RoleBadge = () => {
  const { data } = useSession();
  const role = (data?.user as { role?: UserRole } | undefined)?.role;
  if (!role) return null;
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-text-muted">Your role:</span>
      <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-accent-indigo/10 text-accent-cyan">
        {ROLE_LABELS[role]}
      </span>
    </div>
  );
};
