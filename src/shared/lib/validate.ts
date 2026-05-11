import type { NextResponse } from "next/server";
import { apiError } from "./api-response";

// Type-guard for optional string fields in PATCH/POST bodies.
// Returns null if the value is absent or a string; an error response otherwise.
// Empty strings are NOT rejected here — presence/non-empty semantics are route-specific.
export const requireString = (value: unknown, field: string): NextResponse | null =>
  value !== undefined && typeof value !== "string" ? apiError(`Invalid ${field}`, 400) : null;
