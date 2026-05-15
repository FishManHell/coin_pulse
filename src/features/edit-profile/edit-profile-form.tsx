"use client";

import { Button } from "@/shared/ui/button";
import { LabeledField } from "@/shared/ui/labeled-field";
import { useEditProfile } from "./use-edit-profile";

interface EditProfileFormProps {
  readOnly?: boolean;
  initial: { name: string; email: string };
}

export const EditProfileForm = ({ readOnly = false, initial }: EditProfileFormProps) => {
  const { values, setField, submit, loading, feedback } = useEditProfile(initial);

  return (
    <div className="bg-surface border border-border-base rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-text-primary mb-5">Profile information</h3>
      <form onSubmit={readOnly ? (e) => e.preventDefault() : submit} className="space-y-4">
        <LabeledField
          label="Full name"
          type="text"
          required
          disabled={readOnly}
          value={values.name}
          onChange={(e) => setField("name", e.target.value)}
        />
        <LabeledField
          label="Email"
          type="email"
          required
          disabled={readOnly}
          value={values.email}
          onChange={(e) => setField("email", e.target.value)}
        />
        {readOnly ? (
          <p className="text-xs text-text-muted">
            Name and email are managed by your Google account.
          </p>
        ) : (
          <>
            {feedback && (
              <p className={feedback.kind === "success" ? "text-sm text-price-up" : "text-sm text-price-down"}>
                {feedback.message}
              </p>
            )}
            <Button type="submit" variant="gradient" disabled={loading}>
              {loading ? "Saving…" : "Save changes"}
            </Button>
          </>
        )}
      </form>
    </div>
  );
};
