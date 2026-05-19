"use client";

import { useTranslations } from "next-intl";

// Resolves an API error code (e.g. "auth.emailTaken") to a localized human string.
// Falls back to a generic server-error message when the code is unknown or missing —
// shields users from raw codes if the server adds a code before messages catch up.
//
// Cast: next-intl narrows t-keys to known unions, but API codes arrive at runtime
// from the wire. `t.has` is the runtime gate.
export const useApiErrorTranslator = () => {
  const t = useTranslations("errors");
  type ErrorKey = Parameters<typeof t>[0];
  return (code: string | undefined | null): string => {
    if (!code) return t("common.serverError");
    const key = code as ErrorKey;
    return t.has(key) ? t(key) : t("common.serverError");
  };
};
