import type { UserRole } from "@/shared/types/roles";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image: string | null;
  createdAt: string;
}
