"use client";

import { toast } from "sonner";
import { signOut } from "next-auth/react";
import { ROUTES } from "@/shared/config/routes";

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
