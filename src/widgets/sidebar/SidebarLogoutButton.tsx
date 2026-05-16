import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { ROUTES } from "@/shared/config/routes";
import { styles } from "./styles";

export const SidebarLogoutButton = () => (
  <Button
    variant="ghost"
    onClick={() => signOut({ callbackUrl: ROUTES.login })}
    title="Sign out"
    className={styles.logoutButton}
  >
    <LogOut size={16} className="shrink-0" />
    <span className={styles.navLinkLabel}>Sign out</span>
  </Button>
);
