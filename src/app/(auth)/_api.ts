import { signIn } from "next-auth/react";

export const loginWithCredentials = async (email: string, password: string) => {
  const result = await signIn("credentials", { email, password, redirect: false });
  if (result?.error) return { error: "Invalid email or password" };
};

export const registerAndSignIn = async (name: string, email: string, password: string) => {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) return { error: data.error ?? "Registration failed" };
  await signIn("credentials", { email, password, callbackUrl: "/dashboard" });
};
