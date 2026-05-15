import { redirect } from "next/navigation";
import { requireUser } from "@/entities/user/lib/require-user";
import { ROLE_PERMISSIONS, type UserRole } from "@/shared/types/roles";
import { Header } from "@/widgets/header";
import { AdminUsersTable } from "@/widgets/admin-users-table";
import connectDB from "@/shared/lib/db";
import User from "@/models/User";
import { ROUTES } from "@/shared/config/routes";

const SettingsPage = async () => {
  const actor = await requireUser();
  if (!ROLE_PERMISSIONS.canAccessSettings(actor.role)) redirect(ROUTES.dashboard);

  await connectDB();
  const rawUsers = await User.find({}).select("-password").sort({ createdAt: -1 }).lean();

  const users = rawUsers.map((u) => ({
    id: u._id.toString(),
    name: u.name,
    email: u.email,
    role: u.role as UserRole,
    image: u.image ?? null,
    createdAt: u.createdAt.toISOString(),
  }));

  return (
    <>
      <Header title="Settings" />
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-text-primary">User management</h2>
          <p className="text-text-muted text-sm mt-1">{users.length} registered users</p>
        </div>
        <AdminUsersTable users={users} actorId={actor.id} actorRole={actor.role} />
      </div>
    </>
  );
}

export default SettingsPage;