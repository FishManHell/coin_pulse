import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/entities/user/lib/auth-config";
import { ROUTES } from "@/shared/config/routes";

export default async function RootPage() {
  const session = await getServerSession(authOptions);
  redirect(session ? ROUTES.dashboard : ROUTES.login);
}
