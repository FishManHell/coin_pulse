import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireApiUser } from "@/entities/user/lib/require-api-user";
import connectDB, { isDuplicateKeyError } from "@/shared/lib/db";
import User from "@/entities/user/model/user";
import { apiError, ERRORS } from "@/shared/lib/api-response";
import { requireString } from "@/shared/lib/validate";

export async function PATCH(req: Request) {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;

  try {
    const { name, email, currentPassword, newPassword } = await req.json();

    const typeError =
      requireString(name, "name") ??
      requireString(email, "email") ??
      requireString(currentPassword, "current password") ??
      requireString(newPassword, "new password");
    if (typeError) return typeError;

    if (name === undefined && email === undefined && newPassword === undefined) {
      return apiError("No changes provided", 400);
    }

    await connectDB();
    const user = await User.findById(auth.user.id);
    if (!user) return ERRORS.notFound();

    if (!user.password && (name !== undefined || email !== undefined)) {
      return apiError("Name and email are managed by your Google account", 400);
    }

    if (newPassword) {
      if (!user.password) {
        return apiError("Google accounts cannot set a password here", 400);
      }
      if (newPassword.length < 8) {
        return apiError("Password must be at least 8 characters", 400);
      }
      if (!currentPassword) {
        return apiError("Current password required", 400);
      }
      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) return apiError("Current password is incorrect", 400);
    }

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    if (newPassword) user.password = await bcrypt.hash(newPassword, 10);

    await user.save();
    return NextResponse.json({ message: "Profile updated" });
  } catch (err) {
    if (isDuplicateKeyError(err)) return apiError("Email already in use", 400);
    console.error("profile PATCH error:", err);
    return ERRORS.serverError();
  }
}
