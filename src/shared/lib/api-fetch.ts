"use client";

import { toast } from "sonner";
import { signOut } from "next-auth/react";
import { ROUTES } from "@/shared/config/routes";

// TODO(i18n): these two toasts stay English — apiFetch is a plain helper called
// from non-React contexts, so useTranslations isn't available here. Translating
// requires either hoisting the 401/403 auto-toast into a React layer (e.g. a
// QueryClient onError handler) or threading a translator through callers.
export async function apiFetch(input: RequestInfo | URL, init?: RequestInit) {
  const res = await fetch(input, init);

  if (res.status === 401) {
    toast.error("Session expired", { description: "Please sign in again." });
    await signOut({ callbackUrl: ROUTES.login });
    throw new Error("Unauthorized");
  }

  if (res.status === 403) {
    toast.error("Permission denied", { description: "You don't have access to this action." });
  }

  return res;
}
