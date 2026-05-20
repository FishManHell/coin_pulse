"use client";

import { type SubmitEvent } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { apiFetch } from "@/shared/lib/api-fetch";
import { useFormState } from "@/shared/hooks/useFormState";
import { useApiErrorTranslator } from "@/shared/lib/use-api-error-translator";

interface EditProfileInitial {
  name: string;
  email: string;
}

export const useEditProfile = (initial: EditProfileInitial) => {
  const { update } = useSession();
  const t = useTranslations("profile.edit");
  const translateError = useApiErrorTranslator();
  const { values, setField, loading, setLoading, feedback, setFeedback } = useFormState(initial);

  const submit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);
    try {
      const res = await apiFetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const body = await res.json();
      if (!res.ok) {
        setFeedback({ message: translateError(body.error), kind: "error" });
        return;
      }
      await update({ name: values.name, email: values.email });
      setFeedback({ message: t("success"), kind: "success" });
    } finally {
      setLoading(false);
    }
  };

  return { values, setField, submit, loading, feedback };
};
