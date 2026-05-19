"use client";

import { useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { Trash2, Shield } from "lucide-react";
import { ROLE_PERMISSIONS, type UserRole } from "@/shared/types/roles";
import { Button } from "@/shared/ui/button";
import { ConfirmDialog } from "@/shared/ui/confirm-dialog";
import { styles } from "./styles";
import { RoleBadge } from "./RoleBadge";
import { RoleSelect } from "./RoleSelect";
import type { AdminUser } from "@/entities/user/types";

interface UserRowProps {
  user: AdminUser;
  actorId: string;
  actorRole: UserRole;
  isLoading: boolean;
  onChangeRole: (id: string, role: UserRole) => void;
  onDelete: (id: string) => void;
}

export const UserRow = ({ user, actorId, actorRole, isLoading, onChangeRole, onDelete }: UserRowProps) => {
  const isSelf = user.id === actorId;
  const canEditRole = !isSelf && ROLE_PERMISSIONS.canChangeRole(actorRole, user.role);
  const canDelete = !isSelf && ROLE_PERMISSIONS.canDeleteUser(actorRole);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const tConfirm = useTranslations("confirms.deleteUser");
  const tActions = useTranslations("admin.actions");
  const format = useFormatter();

  const handleRoleChange = (role: UserRole) => onChangeRole(user.id, role);
  const joined = format.dateTime(new Date(user.createdAt), {
    month: "short", day: "numeric", year: "numeric",
  });

  return (
    <div className={styles.row}>
      <div className={styles.userBlock}>
        <div className={styles.avatar}>{user.name[0]?.toUpperCase()}</div>
        <p className={styles.userName}>{user.name}</p>
      </div>

      <span className={styles.email}>{user.email}</span>

      <div className={styles.roleCell}>
        {canEditRole ? (
          <RoleSelect
            value={user.role}
            actorRole={actorRole}
            disabled={isLoading}
            onChange={handleRoleChange}
          />
        ) : (
          <RoleBadge role={user.role} />
        )}
      </div>

      <span className={styles.joined}>{joined}</span>

      <div className={styles.deleteCell}>
        {canDelete ? (
          <>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setConfirmOpen(true)}
              disabled={isLoading}
              aria-label={tActions("deleteUser")}
              className="text-text-muted hover:text-price-down hover:bg-price-down/10"
            >
              <Trash2 />
            </Button>
            <ConfirmDialog
              open={confirmOpen}
              onOpenChange={setConfirmOpen}
              title={tConfirm("title")}
              description={tConfirm("description")}
              confirmLabel={tConfirm("confirm")}
              cancelLabel={tConfirm("cancel")}
              destructive
              onConfirm={() => onDelete(user.id)}
            />
          </>
        ) : (
          <Shield size={14} className={styles.shield} />
        )}
      </div>
    </div>
  );
};
