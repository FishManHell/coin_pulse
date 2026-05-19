export const LOCALES = ["en", "uk"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_COOKIE = "NEXT_LOCALE";

export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  uk: "Українська",
};

export const isLocale = (value: string | undefined | null): value is Locale =>
  !!value && (LOCALES as readonly string[]).includes(value);
