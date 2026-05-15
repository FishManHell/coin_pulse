import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./auth-config";
import { ROUTES } from "@/shared/config/routes";
import type { UserRole } from "@/shared/types/roles";

export interface SessionUser {
  id: string;
  role: UserRole;
  name?: string;
  email?: string;
  image?: string;
}

export async function requireUser(): Promise<SessionUser> {
  const session = await getServerSession(authOptions);
  const user = session?.user as Partial<SessionUser> | undefined;
  if (!user?.id || !user.role) redirect(ROUTES.login);
  return user as SessionUser;
}
