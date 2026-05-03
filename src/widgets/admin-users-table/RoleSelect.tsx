"use client";

import {
  ALL_ROLES,
  ROLE_LABELS,
  ROLE_PERMISSIONS,
  type UserRole,
} from "@/shared/types/roles";
import { cn } from "@/shared/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { ROLE_COLORS, styles } from "./styles";

interface RoleSelectProps {
  value: UserRole;
  actorRole: UserRole;
  disabled?: boolean;
  onChange: (role: UserRole) => void;
}

export const RoleSelect = ({ value, actorRole, disabled, onChange }: RoleSelectProps) => {
  const assignable = ALL_ROLES.filter((role) => {
    return ROLE_PERMISSIONS.canChangeRole(actorRole, role)
  });

  const handleChange = (role: UserRole) => onChange(role);

  return (
    <Select value={value} disabled={disabled} onValueChange={handleChange}>
      <SelectTrigger className={cn(styles.roleSelectTrigger, ROLE_COLORS[value])}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-surface border-border-base">
        {assignable.map((r) => (
          <SelectItem key={r} value={r} className="text-xs cursor-pointer">
            {ROLE_LABELS[r]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
