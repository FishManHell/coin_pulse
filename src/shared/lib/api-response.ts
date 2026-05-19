import { NextResponse } from "next/server";

// `code` is a dot-path that maps to a key under `errors.*` in messages files.
// Client resolves the human string via useApiErrorTranslator.
export const apiError = (code: string, status: number) =>
  NextResponse.json({ error: code }, { status });

export const ERRORS = {
  unauthorized: () => apiError("common.unauthorized", 401),
  forbidden: () => apiError("common.forbidden", 403),
  notFound: () => apiError("common.notFound", 404),
  serverError: () => apiError("common.serverError", 500),
};
