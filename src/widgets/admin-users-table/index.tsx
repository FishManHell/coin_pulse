"use client";

import { useState } from "react";
import { Trash2, Shield, ChevronDown } from "lucide-react";
import {
  USER_ROLES,
  ROLE_LABELS,
  ROLE_PERMISSIONS,
  type UserRole,
} from "@/shared/types/roles";
import { cn } from "@/shared/lib/utils";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image: string | null;
  createdAt: string;
};

type Props = {
  users: UserRow[];
  actorRole: UserRole;
};

const ROLE_COLORS: Record<UserRole, string> = {
  superadmin: "text-accent-cyan bg-accent-cyan/10",
  admin:      "text-accent-indigo bg-accent-indigo/10",
  developer:  "text-price-up bg-price-up/10",
  user:       "text-text-secondary bg-surface-hover",
};

export const AdminUsersTable = ({ users: initialUsers, actorRole }: Readonly<Props>) => {
  const [users, setUsers] = useState(initialUsers);
  const [loading, setLoading] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setLoading(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) return;
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    setLoading(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      if (!res.ok) return;
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-surface border border-border-base rounded-2xl overflow-hidden">
      {/* Head */}
      <div className="grid grid-cols-[1fr_220px_160px_120px_52px] px-5 py-3 border-b border-border-base">
        {["User", "Email", "Role", "Joined", ""].map((h) => (
          <span key={h} className="text-xs font-medium text-text-muted uppercase tracking-wider">
            {h}
          </span>
        ))}
      </div>

      {users.map((user) => {
        const isLoading = loading === user.id;
        const canChangeThisRole = ROLE_PERMISSIONS.canChangeRole(actorRole, user.role);
        const canDelete = ROLE_PERMISSIONS.canDeleteUser(actorRole);

        return (
          <div
            key={user.id}
            className="grid grid-cols-[1fr_220px_160px_120px_52px] items-center px-5 py-4 border-b border-border-base last:border-0 hover:bg-surface-hover transition-colors"
          >
            {/* User */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center text-white text-xs font-bold shrink-0">
                {user.name[0]?.toUpperCase()}
              </div>
              <p className="text-sm font-medium text-text-primary truncate">{user.name}</p>
            </div>

            {/* Email */}
            <span className="text-sm text-text-secondary truncate">{user.email}</span>

            {/* Role selector */}
            <div className="relative w-36">
              {canChangeThisRole ? (
                <div className="relative">
                  <select
                    value={user.role}
                    disabled={isLoading}
                    onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                    className={cn(
                      "w-full appearance-none text-xs font-medium px-3 py-1.5 pr-7 rounded-lg border border-border-base outline-none transition-all cursor-pointer",
                      "bg-surface disabled:opacity-50",
                      ROLE_COLORS[user.role]
                    )}
                  >
                    {Object.values(USER_ROLES)
                      .filter((r) => ROLE_PERMISSIONS.canChangeRole(actorRole, r as UserRole))
                      .map((r) => (
                        <option key={r} value={r} className="bg-surface text-text-primary">
                          {ROLE_LABELS[r as UserRole]}
                        </option>
                      ))}
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                </div>
              ) : (
                <span className={cn("text-xs font-medium px-3 py-1.5 rounded-lg inline-block", ROLE_COLORS[user.role])}>
                  {ROLE_LABELS[user.role]}
                </span>
              )}
            </div>

            {/* Joined */}
            <span className="text-xs text-text-muted">
              {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>

            {/* Delete */}
            <div className="flex justify-center">
              {canDelete ? (
                <button
                  onClick={() => handleDelete(user.id)}
                  disabled={isLoading}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:text-price-down hover:bg-price-down/10 transition-all disabled:opacity-40"
                >
                  <Trash2 size={14} />
                </button>
              ) : (
                <Shield size={14} className="text-text-muted opacity-30" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
