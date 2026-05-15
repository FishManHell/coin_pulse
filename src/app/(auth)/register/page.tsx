"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/button";
import { LabeledField } from "@/shared/ui/labeled-field";
import { useAuthForm } from "../_hooks/use-auth-form";
import { REGISTER_FIELDS } from "../_fields";
import { registerAndSignIn } from "../_api";
import { GoogleSignInButton } from "../_components/google-sign-in-button";
import { AuthRedirectLink } from "../_components/auth-redirect-link";
import { AuthDivider } from "../_components/auth-divider";
import { ROUTES } from "@/shared/config/routes";

const RegisterPage = () => {
  const router = useRouter();

  const { form, error, loading, handleChange, handleSubmit } = useAuthForm(
    { name: "", email: "", password: "" },
    async (values) => {
      const result = await registerAndSignIn(values.name, values.email, values.password);
      if (result?.error) return result;
      router.push(ROUTES.dashboard);
    }
  );

  return (
    <div className="bg-surface border border-border-base rounded-2xl p-8">
      <div className="mb-8 text-center">
        <span className="text-2xl font-bold gradient-accent-text">CoinPulse</span>
        <p className="text-text-secondary text-sm mt-1">Create your account</p>
      </div>
      <GoogleSignInButton callbackUrl={ROUTES.dashboard} />
      <AuthDivider />
      <form onSubmit={handleSubmit} className="space-y-4">
        {REGISTER_FIELDS.map(({ key, label, type, placeholder }) => (
          <LabeledField
            key={key}
            label={label}
            type={type}
            placeholder={placeholder}
            required
            value={form[key]}
            onChange={handleChange(key)}
            labelClassName="text-sm text-text-secondary"
          />
        ))}

        {error && <p className="text-price-down text-sm">{error}</p>}
        <Button type="submit" variant="gradient" disabled={loading} className="w-full">
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>
      <AuthRedirectLink text="Already have an account?" linkText="Sign in" href={ROUTES.login} />
    </div>
  );
}

export default RegisterPage;