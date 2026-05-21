"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Sheet } from "@/shared/ui/sheet";
import { useMobileNavStore } from "@/shared/store";
import { SidebarContent } from "./SidebarContent";
import { styles } from "./styles";

export const Sidebar = () => {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const open = useMobileNavStore((s) => s.open);

  // Sync to external system (URL): auto-close drawer on route change.
  useEffect(() => {
    useMobileNavStore.getState().close();
  }, [pathname]);

  return (
    <>
      <aside className={styles.rail.aside}>
        <SidebarContent variant="rail" />
      </aside>

      <Sheet
        open={open}
        onOpenChange={(next) => useMobileNavStore.getState().setOpen(next)}
        title={t("menu")}
      >
        <SidebarContent variant="drawer" />
      </Sheet>
    </>
  );
};
