"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/shared/ui/button";
import { LabeledField } from "@/shared/ui/labeled-field";
import { useEditProfile } from "./use-edit-profile";

interface EditProfileFormProps {
  readOnly?: boolean;
  initial: { name: string; email: string };
}

export const EditProfileForm = ({ readOnly = false, initial }: EditProfileFormProps) => {
  const t = useTranslations("profile.edit");
  const { values, setField, submit, loading, feedback } = useEditProfile(initial);

  return (
    <div className="bg-surface border border-border-base rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-text-primary mb-5">{t("title")}</h3>
      <form onSubmit={readOnly ? (e) => e.preventDefault() : submit} className="space-y-4">
        <LabeledField
          label={t("fullName")}
          type="text"
          required
          disabled={readOnly}
          value={values.name}
          onChange={(e) => setField("name", e.target.value)}
        />
        <LabeledField
          label={t("email")}
          type="email"
          required
          disabled={readOnly}
          value={values.email}
          onChange={(e) => setField("email", e.target.value)}
        />
        {readOnly ? (
          <p className="text-xs text-text-muted">{t("googleManagedNote")}</p>
        ) : (
          <>
            {feedback && (
              <p className={feedback.kind === "success" ? "text-sm text-price-up" : "text-sm text-price-down"}>
                {feedback.message}
              </p>
            )}
            <Button type="submit" variant="gradient" disabled={loading}>
              {loading ? t("saving") : t("submit")}
            </Button>
          </>
        )}
      </form>
    </div>
  );
};
