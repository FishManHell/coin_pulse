import { NextResponse } from "next/server";

export const apiError = (message: string, status: number) =>
  NextResponse.json({ error: message }, { status });

// Common HTTP errors. Domain-specific messages stay inline via `apiError`.
export const ERRORS = {
  unauthorized: () => apiError("Unauthorized", 401),
  forbidden: () => apiError("Forbidden", 403),
  notFound: () => apiError("Not found", 404),
  serverError: () => apiError("Server error", 500),
} as const;
