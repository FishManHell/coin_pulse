"use client";

import { Button } from "@/shared/ui/button";
import { LabeledField } from "@/shared/ui/labeled-field";
import { useChangePassword } from "./use-change-password";
import { PASSWORD_FIELDS } from "./password-fields";

export const ChangePasswordForm = () => {
  const { values, setField, submit, loading, feedback } = useChangePassword();

  return (
    <div className="bg-surface border border-border-base rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-text-primary mb-5">Change password</h3>
      <form onSubmit={submit} className="space-y-4">
        {PASSWORD_FIELDS.map(({ key, label, placeholder }) => (
          <LabeledField
            key={key}
            label={label}
            type="password"
            required
            placeholder={placeholder}
            value={values[key]}
            onChange={(e) => setField(key, e.target.value)}
          />
        ))}
        {feedback && (
          <p className={feedback.kind === "success" ? "text-sm text-price-up" : "text-sm text-price-down"}>
            {feedback.message}
          </p>
        )}
        <Button type="submit" variant="gradient" disabled={loading}>
          {loading ? "Updating…" : "Update password"}
        </Button>
      </form>
    </div>
  );
};
