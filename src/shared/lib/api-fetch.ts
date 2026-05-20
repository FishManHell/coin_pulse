"use client";

import { toast } from "sonner";
import { signOut } from "next-auth/react";
import { ROUTES } from "@/shared/config/routes";
import { translateGlobal } from "./global-translator";

export async function apiFetch(input: RequestInfo | URL, init?: RequestInit) {
  const res = await fetch(input, init);

  if (res.status === 401) {
    toast.error(translateGlobal("errors.session.expiredTitle", "Session expired"), {
      description: translateGlobal("errors.session.expiredDescription", "Please sign in again."),
    });
    await signOut({ callbackUrl: ROUTES.login });
    throw new Error("Unauthorized");
  }

  if (res.status === 403) {
    toast.error(translateGlobal("errors.session.forbiddenTitle", "Permission denied"), {
      description: translateGlobal("errors.session.forbiddenDescription", "You don't have access to this action."),
    });
  }

  return res;
}
