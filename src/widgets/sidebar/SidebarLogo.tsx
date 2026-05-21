import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { ROUTES } from "@/shared/config/routes";
import { styles, type SidebarVariant } from "./styles";

export const SidebarLogo = ({ variant }: { variant: SidebarVariant }) => {
  const s = styles[variant];
  return (
    <div className={s.logoSection}>
      <Link href={ROUTES.dashboard} className={s.logoLink}>
        <div className={s.logoBadge}>
          <TrendingUp size={16} className="text-white" />
        </div>
        <span className={s.logoText}>CoinPulse</span>
      </Link>
    </div>
  );
};
