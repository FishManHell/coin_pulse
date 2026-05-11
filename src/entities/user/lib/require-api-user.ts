import type { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth-config";
import type { SessionUser } from "./require-user";
import type { UserRole } from "@/shared/types/roles";
import { ERRORS } from "@/shared/lib/api-response";

type ApiAuthResult = { user: SessionUser } | { error: NextResponse };

export async function requireApiUser(): Promise<ApiAuthResult> {
  const session = await getServerSession(authOptions);
  const user = session?.user as Partial<SessionUser> | undefined;
  if (!user?.id || !user.role) return { error: ERRORS.unauthorized() };
  return { user: user as SessionUser };
}

export async function requireApiRole(
  check: (role: UserRole) => boolean,
): Promise<ApiAuthResult> {
  const auth = await requireApiUser();
  if ("error" in auth) return auth;
  if (!check(auth.user.role)) return { error: ERRORS.forbidden() };
  return auth;
}
