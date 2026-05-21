"use client";

import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/shared/lib/utils";
import { useMobileNavStore } from "@/shared/store";
import { styles } from "./styles";

export const MobileNavTrigger = () => {
  const t = useTranslations("nav");
  return (
    <button
      type="button"
      aria-label={t("openMenu")}
      onClick={() => useMobileNavStore.getState().toggle()}
      className={cn(styles.iconButton, "md:hidden")}
    >
      <Menu size={18} />
    </button>
  );
};
