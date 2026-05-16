import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { styles } from "./styles";

interface SidebarNavLinkProps {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
}

export const SidebarNavLink = ({ href, label, icon: Icon, active }: SidebarNavLinkProps) => (
  <Link
    href={href}
    title={label}
    className={cn(styles.navLinkBase, active ? styles.navLinkActive : styles.navLinkInactive)}
  >
    <Icon size={18} className="shrink-0" />
    <span className={styles.navLinkLabel}>{label}</span>
  </Link>
);
