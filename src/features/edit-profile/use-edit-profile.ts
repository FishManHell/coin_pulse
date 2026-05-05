"use client";

import { useEffect, useRef, type SubmitEvent } from "react";
import { useSession } from "next-auth/react";
import { apiFetch } from "@/shared/lib/api-fetch";
import { useFormState } from "@/shared/hooks/useFormState";

export const useEditProfile = () => {
  const bootstrappedRef = useRef(false);
  const { data, update } = useSession();
  const user = data?.user;
  const { values, setValues, setField, loading, setLoading, feedback, setFeedback } = useFormState({
    name: user?.name ?? "",
    email: user?.email ?? "",
  });

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

  useEffect(() => {
    if (!user || bootstrappedRef.current) return;
    setValues({
      name: user.name ?? "",
      email: user.email ?? "",
    });
    bootstrappedRef.current = true;
  }, [user, setValues]);

  return { values, setField, submit, loading, feedback };
};
