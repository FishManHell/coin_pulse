import type { UserRole } from "@/shared/types/roles";

export const updateUserRole = async (id: string, role: UserRole): Promise<boolean> => {
  const res = await fetch(`/api/admin/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });
  return res.ok;
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
  return res.ok;
};
