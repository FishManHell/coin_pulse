"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import { LabeledField } from "@/shared/ui/labeled-field";
import { useChangePassword } from "./use-change-password";
import { PASSWORD_FIELDS, PASSWORD_PLACEHOLDER_MASK } from "./password-fields";

export const ChangePasswordForm = () => {
  const t = useTranslations("profile.password");
  const { values, setField, submit, loading, feedback } = useChangePassword();

  return (
    <div className="bg-surface border border-border-base rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-text-primary mb-5">{t("title")}</h3>
      <form onSubmit={submit} className="space-y-4">
        {PASSWORD_FIELDS.map(({ key, labelKey, placeholderKey }) => (
          <LabeledField
            key={key}
            label={t(labelKey)}
            type="password"
            required
            placeholder={placeholderKey ? t(placeholderKey) : PASSWORD_PLACEHOLDER_MASK}
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
          {loading ? t("updating") : t("submit")}
        </Button>
      </form>
    </div>
  );
};
