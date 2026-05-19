"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import type { UserRole } from "@/shared/types/roles";
import type { AdminUser } from "@/entities/user/types";
import { useApiErrorTranslator } from "@/shared/lib/use-api-error-translator";
import { updateUserRole, deleteUser } from "./api";

interface RoleVars {
  id: string;
  role: UserRole;
}

export const useAdminUsers = (initial: AdminUser[]) => {
  const [users, setUsers] = useState(initial);
  const t = useTranslations("toasts.admin");
  const translateError = useApiErrorTranslator();

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: RoleVars) => updateUserRole(id, role),
    onSuccess: (_, { id, role }) => {
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
      toast.success(t("roleUpdated"));
    },
    onError: (err) => {
      toast.error(t("roleUpdateFailed"), { description: translateError(err.message) });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: (_, id) => {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success(t("userDeleted"));
    },
    onError: (err) => {
      toast.error(t("userDeleteFailed"), { description: translateError(err.message) });
    },
  });

  const busy = roleMutation.isPending || deleteMutation.isPending;

  const changeRole = (id: string, role: UserRole) => {
    if (busy) return;
    roleMutation.mutate({ id, role });
  };

  const removeUser = (id: string) => {
    if (busy) return;
    deleteMutation.mutate(id);
  };

  const loadingId = roleMutation.isPending
    ? roleMutation.variables.id
    : deleteMutation.isPending
      ? deleteMutation.variables
      : null;

  return { users, loadingId, changeRole, removeUser };
};
