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
      requireString(name) ??
      requireString(email) ??
      requireString(currentPassword) ??
      requireString(newPassword);
    if (typeError) return typeError;

    if (name === undefined && email === undefined && newPassword === undefined) {
      return apiError("profile.noChanges", 400);
    }

    await connectDB();
    const user = await User.findById(auth.user.id);
    if (!user) return ERRORS.notFound();

    if (!user.password && (name !== undefined || email !== undefined)) {
      return apiError("profile.googleManaged", 400);
    }

    if (newPassword) {
      if (!user.password) {
        return apiError("profile.googleNoPassword", 400);
      }
      if (newPassword.length < 8) {
        return apiError("auth.weakPassword", 400);
      }
      if (!currentPassword) {
        return apiError("profile.currentPasswordRequired", 400);
      }
      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) return apiError("profile.currentPasswordIncorrect", 400);
    }

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();
    if (newPassword) user.password = await bcrypt.hash(newPassword, 10);

    await user.save();
    return NextResponse.json({ message: "Profile updated" });
  } catch (err) {
    if (isDuplicateKeyError(err)) return apiError("auth.emailTaken", 400);
    console.error("profile PATCH error:", err);
    return ERRORS.serverError();
  }
}
