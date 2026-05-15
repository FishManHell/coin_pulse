"use client";

import { type SubmitEvent } from "react";
import { useSession } from "next-auth/react";
import { apiFetch } from "@/shared/lib/api-fetch";
import { useFormState } from "@/shared/hooks/useFormState";

interface EditProfileInitial {
  name: string;
  email: string;
}

export const useEditProfile = (initial: EditProfileInitial) => {
  const { update } = useSession();
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
        setFeedback({ message: body.error, kind: "error" });
        return;
      }
      await update({ name: values.name, email: values.email });
      setFeedback({ message: "Profile updated.", kind: "success" });
    } finally {
      setLoading(false);
    }
  };

  return { values, setField, submit, loading, feedback };
};
