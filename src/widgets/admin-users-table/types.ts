import type { UserRole } from "@/shared/types/roles";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image: string | null;
  createdAt: string;
};
