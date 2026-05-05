"use client";

import { useState } from "react";

export type FormFeedback = { message: string; kind: "success" | "error" } | null;

export const useFormState = <T extends Record<string, unknown>>(initial: T) => {
  const [values, setValues] = useState<T>(initial);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<FormFeedback>(null);

  const setField = <K extends keyof T>(key: K, value: T[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
  };

  return { values, setValues, setField, loading, setLoading, feedback, setFeedback };
};
