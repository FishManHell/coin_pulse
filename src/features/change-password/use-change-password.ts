"use client";

import { type SubmitEvent } from "react";
import { apiFetch } from "@/shared/lib/api-fetch";
import { useFormState } from "@/shared/hooks/useFormState";
import { initialPasswordValues } from "./password-fields";

export const useChangePassword = () => {
  const { values, setValues, setField, loading, setLoading, feedback, setFeedback } =
    useFormState(initialPasswordValues);

  const submit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (values.newPassword !== values.confirm) {
      setFeedback({ message: "Passwords do not match", kind: "error" });
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
        setFeedback({ message: body.error, kind: "error" });
        return;
      }
      setFeedback({ message: "Password changed.", kind: "success" });
      setValues(initialPasswordValues);
    } finally {
      setLoading(false);
    }
  };

  return { values, setField, submit, loading, feedback };
};
