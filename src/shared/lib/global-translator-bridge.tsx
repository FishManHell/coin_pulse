"use client";

import { useTranslations } from "next-intl";
import { setGlobalTranslator } from "./global-translator";

// Bridges next-intl's React translator to the non-React `translateGlobal` singleton.
// Sets during render (not in useEffect) so the singleton is populated BEFORE any
// child effect runs — child effects fire before parent effects in React, so a
// useEffect here would lose the race against descendants that call apiFetch on
// mount. Module-level writes during render are acceptable when idempotent.
export const GlobalTranslatorBridge = () => {
  const t = useTranslations();
  type AnyKey = Parameters<typeof t>[0];
  setGlobalTranslator((key) => t(key as AnyKey));
  return null;
};
