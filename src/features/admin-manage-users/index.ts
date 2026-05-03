"use client";

import { useState } from "react";
import type { UserRole } from "@/shared/types/roles";
import type { AdminUser } from "@/widgets/admin-users-table/types";
import { updateUserRole, deleteUser } from "./api";

export const useAdminUsers = (initial: AdminUser[]) => {
  const [users, setUsers] = useState(initial);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const changeRole = async (id: string, role: UserRole) => {
    setLoadingId(id);
    try {
      const ok = await updateUserRole(id, role);
      if (!ok) return;
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    } finally {
      setLoadingId(null);
    }
  };

  const removeUser = async (id: string) => {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    setLoadingId(id);
    try {
      const ok = await deleteUser(id);
      if (!ok) return;
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } finally {
      setLoadingId(null);
    }
  };

  return { users, loadingId, changeRole, removeUser };
};
