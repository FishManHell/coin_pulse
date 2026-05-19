"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import type { UserRole } from "@/shared/types/roles";

export const CurrentUserRoleBadge = () => {
  const { data } = useSession();
  const tLabel = useTranslations("admin.currentUserRole");
  const tRoles = useTranslations("admin.roles");
  const role = (data?.user as { role?: UserRole } | undefined)?.role;
  if (!role) return null;
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-text-muted">{tLabel("label")}</span>
      <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-accent-indigo/10 text-accent-cyan">
        {tRoles(role)}
      </span>
    </div>
  );
};
