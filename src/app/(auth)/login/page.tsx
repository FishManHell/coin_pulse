"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/button";
import { AuthInput } from "@/shared/ui/auth-input";
import { useAuthForm } from "../_hooks/use-auth-form";
import { loginWithCredentials } from "../_api";
import { GoogleSignInButton } from "../_components/google-sign-in-button";
import { AuthRedirectLink } from "../_components/auth-redirect-link";
import { AuthDivider } from "../_components/auth-divider";

const LoginPage = () => {
  const router = useRouter();

  const { form, error, loading, handleChange, handleSubmit } = useAuthForm(
    { email: "", password: "" },
    async (values) => {
      const result = await loginWithCredentials(values.email, values.password);
      if (result?.error) return result;
      router.push("/dashboard");
    }
  );

  return (
    <div className="bg-surface border border-border-base rounded-2xl p-8">
      <div className="mb-8 text-center">
        <span className="text-2xl font-bold gradient-accent-text">CoinPulse</span>
        <p className="text-text-secondary text-sm mt-1">Sign in to your account</p>
      </div>

      <GoogleSignInButton callbackUrl="/dashboard" />

      <AuthDivider />

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          label="Email"
          type="email"
          placeholder="you@example.com"
          required
          value={form.email}
          onChange={handleChange("email")}
        />
        <AuthInput
          label="Password"
          type="password"
          placeholder="••••••••"
          required
          value={form.password}
          onChange={handleChange("password")}
        />

        {error && <p className="text-price-down text-sm">{error}</p>}

        <Button type="submit" variant="gradient" disabled={loading} className="w-full">
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>
      <AuthRedirectLink text="No account?" linkText="Create one" href="/register" />
    </div>
  );
}

export default LoginPage;