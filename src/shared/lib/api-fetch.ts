"use client";

import { signOut } from "next-auth/react";

export async function apiFetch(input: RequestInfo | URL, init?: RequestInit) {
  const res = await fetch(input, init);

  if (res.status === 401) {
    await signOut({ callbackUrl: "/login" });
    throw new Error("Unauthorized");
  }

  return res;
}
