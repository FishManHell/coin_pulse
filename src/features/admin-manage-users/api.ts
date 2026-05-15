import { apiFetch } from "@/shared/lib/api-fetch";
import type { UserRole } from "@/shared/types/roles";

export const updateUserRole = async (id: string, role: UserRole): Promise<void> => {
  const res = await apiFetch(`/api/admin/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Failed to update role");
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  const res = await apiFetch(`/api/admin/users/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Failed to delete user");
  }
};
