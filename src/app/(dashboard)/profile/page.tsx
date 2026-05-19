import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import { authOptions } from "@/entities/user/lib/auth-config";
import { Header } from "@/widgets/header";
import { CurrentUserRoleBadge } from "@/entities/user/ui/current-user-role-badge";
import { EditProfileForm } from "@/features/edit-profile";
import { ChangePasswordForm, GoogleAccountNotice } from "@/features/change-password";

const ProfilePage = async () => {
  const [session, t] = await Promise.all([
    getServerSession(authOptions),
    getTranslations("nav"),
  ]);

  return (
    <>
      <Header title={t("profile")} />
      <div className="flex-1 p-6 max-w-2xl space-y-6">
        <CurrentUserRoleBadge />
        <EditProfileForm
          readOnly={!session?.user.hasPassword}
          initial={{
            name: session?.user.name ?? "",
            email: session?.user.email ?? "",
          }}
        />
        {session?.user.hasPassword ? <ChangePasswordForm /> : <GoogleAccountNotice />}
      </div>
    </>
  );
}

export default ProfilePage;