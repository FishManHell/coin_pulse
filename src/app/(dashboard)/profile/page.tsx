import { getServerSession } from "next-auth";
import { authOptions } from "@/entities/user/lib/auth-config";
import { Header } from "@/widgets/header";
import { RoleBadge } from "@/entities/user/components/role-badge";
import { EditProfileForm } from "@/features/edit-profile";
import { ChangePasswordForm, GoogleAccountNotice } from "@/features/change-password";

const ProfilePage = async () => {
  const session = await getServerSession(authOptions);

  return (
    <>
      <Header title="Profile" />
      <div className="flex-1 p-6 max-w-2xl space-y-6">
        <RoleBadge />
        <EditProfileForm readOnly={!session?.user.hasPassword} />
        {session?.user.hasPassword ? <ChangePasswordForm /> : <GoogleAccountNotice />}
      </div>
    </>
  );
}

export default ProfilePage;