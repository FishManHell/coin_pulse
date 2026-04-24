"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/shared/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  };

  const handleGoogle = () => signIn("google", { callbackUrl: "/dashboard" });

  return (
    <div className="bg-surface border border-border-base rounded-2xl p-8">
      {/* Logo */}
      <div className="mb-8 text-center">
        <span className="text-2xl font-bold gradient-accent-text">CoinPulse</span>
        <p className="text-text-secondary text-sm mt-1">Sign in to your account</p>
      </div>

      {/* Google */}
      <button
        onClick={handleGoogle}
        className="w-full flex items-center justify-center gap-3 bg-surface-hover border border-border-base rounded-xl py-3 text-text-primary text-sm font-medium hover:bg-surface-hover/80 transition-all mb-6"
      >
        <GoogleIcon />
        Continue with Google
      </button>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-px bg-border-base" />
        <span className="text-text-muted text-xs">or</span>
        <div className="flex-1 h-px bg-border-base" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-text-secondary mb-1.5">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="you@example.com"
            required
            className={cn(
              "w-full bg-bg border border-border-base rounded-xl px-4 py-3 text-text-primary text-sm",
              "placeholder:text-text-muted outline-none",
              "focus:border-accent-indigo transition-colors"
            )}
          />
        </div>

        <div>
          <label className="block text-sm text-text-secondary mb-1.5">Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            placeholder="••••••••"
            required
            className={cn(
              "w-full bg-bg border border-border-base rounded-xl px-4 py-3 text-text-primary text-sm",
              "placeholder:text-text-muted outline-none",
              "focus:border-accent-indigo transition-colors"
            )}
          />
        </div>

        {error && (
          <p className="text-price-down text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full gradient-accent text-white font-semibold rounded-xl py-3 text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="text-center text-text-muted text-sm mt-6">
        No account?{" "}
        <Link href="/register" className="text-accent-cyan hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
  </svg>
);
