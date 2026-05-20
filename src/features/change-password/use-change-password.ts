"use client";

import { type SubmitEvent } from "react";
import { useTranslations } from "next-intl";
import { apiFetch } from "@/shared/lib/api-fetch";
import { useFormState } from "@/shared/hooks/useFormState";
import { useApiErrorTranslator } from "@/shared/lib/use-api-error-translator";
import { initialPasswordValues } from "./password-fields";

export const useChangePassword = () => {
  const t = useTranslations("profile.password");
  const translateError = useApiErrorTranslator();
  const { values, setValues, setField, loading, setLoading, feedback, setFeedback } =
    useFormState(initialPasswordValues);

  const submit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (values.newPassword !== values.confirm) {
      setFeedback({ message: t("mismatch"), kind: "error" });
      return;
    }
    setLoading(true);
    setFeedback(null);
    try {
      const res = await apiFetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      });
      const body = await res.json();
      if (!res.ok) {
        setFeedback({ message: translateError(body.error), kind: "error" });
        return;
      }
      setFeedback({ message: t("success"), kind: "success" });
      setValues(initialPasswordValues);
    } finally {
      setLoading(false);
    }
  };

  return { values, setField, submit, loading, feedback };
};
