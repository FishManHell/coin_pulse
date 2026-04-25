"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

type SubmitFn<T> = (values: T) => Promise<{ error?: string } | void>;

export function useAuthForm<T extends Record<string, string>>(
  initialValues: T,
  onSubmit: SubmitFn<T>
) {
  const [form, setForm] = useState<T>(initialValues);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange =
    (key: keyof T) =>
    (e: ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await onSubmit(form);
      if (result?.error) setError(result.error);
    } finally {
      setLoading(false);
    }
  };

  return { form, error, loading, handleChange, handleSubmit };
}
