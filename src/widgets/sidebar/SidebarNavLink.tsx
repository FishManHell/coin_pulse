import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { styles, type SidebarVariant } from "./styles";

interface SidebarNavLinkProps {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  variant: SidebarVariant;
}

export const SidebarNavLink = ({
  href,
  label,
  icon: Icon,
  active,
  variant,
}: SidebarNavLinkProps) => {
  const s = styles[variant];
  return (
    <Link
      href={href}
      title={label}
      className={cn(s.navLinkBase, active ? s.navLinkActive : s.navLinkInactive)}
    >
      <Icon size={18} className="shrink-0" />
      <span className={s.navLinkLabel}>{label}</span>
    </Link>
  );
};
