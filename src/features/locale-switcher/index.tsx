"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Select } from "radix-ui";
import { Check, ChevronDown, Globe } from "lucide-react";
import { LOCALES, LOCALE_LABELS, isLocale } from "@/i18n/config";
import { setLocaleAction } from "./set-locale-action";
import { styles } from "./styles";

export const LocaleSwitcher = () => {
  const locale = useLocale();
  const t = useTranslations("common");
  const [isPending, startTransition] = useTransition();

  const onValueChange = (value: string) => {
    if (!isLocale(value) || value === locale) return;
    startTransition(() => {
      setLocaleAction(value);
    });
  };

  return (
    <Select.Root value={locale} onValueChange={onValueChange} disabled={isPending}>
      <Select.Trigger aria-label={t("changeLanguage")} className={styles.trigger}>
        <Globe size={16} className="sm:hidden" />
        <span className="hidden sm:inline">{locale.toUpperCase()}</span>
        <Select.Icon className="hidden sm:flex">
          <ChevronDown size={12} />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content position="popper" align="end" sideOffset={8} className={styles.content}>
          <Select.Viewport>
            {LOCALES.map((option) => (
              <Select.Item key={option} value={option} className={styles.item}>
                <Select.ItemText>{LOCALE_LABELS[option]}</Select.ItemText>
                <Select.ItemIndicator>
                  <Check size={14} />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};
