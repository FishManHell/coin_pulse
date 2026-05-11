import { NextResponse } from "next/server";
import { requireApiUser } from "@/entities/user/lib/require-api-user";
import connectDB from "@/shared/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function PATCH(req: Request) {
  const auth = await requireApiUser();
  if ("error" in auth) return auth.error;

  const { name, email, currentPassword, newPassword } = await req.json();

  await connectDB();
  const user = await User.findById(auth.user.id);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (!user.password && (name !== undefined || email !== undefined)) {
    return NextResponse.json(
      { error: "Name and email are managed by your Google account" },
      { status: 400 }
    );
  }

  if (name) user.name = name;
  if (email) user.email = email.toLowerCase();

  if (newPassword) {
    if (!user.password) {
      return NextResponse.json(
        { error: "Google accounts cannot set a password here" },
        { status: 400 }
      );
    }
    if (!currentPassword) {
      return NextResponse.json({ error: "Current password required" }, { status: 400 });
    }
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }
    user.password = await bcrypt.hash(newPassword, 10);
  }

  await user.save();
  return NextResponse.json({ message: "Profile updated" });
}
