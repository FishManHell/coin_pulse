"use client";

import { useTranslations } from "next-intl";

export const GoogleAccountNotice = () => {
  const t = useTranslations("profile.googleNotice");
  return (
    <div className="bg-surface border border-border-base rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-text-primary mb-1">{t("title")}</h3>
      <p className="text-xs text-text-muted">{t("description")}</p>
    </div>
  );
};
