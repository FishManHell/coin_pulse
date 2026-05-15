"use client";

import { signOut } from "next-auth/react";
import { ROUTES } from "@/shared/config/routes";

export async function apiFetch(input: RequestInfo | URL, init?: RequestInit) {
  const res = await fetch(input, init);

  if (res.status === 401) {
    await signOut({ callbackUrl: ROUTES.login });
    throw new Error("Unauthorized");
  }

  return res;
}
