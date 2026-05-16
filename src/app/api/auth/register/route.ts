import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB, { isDuplicateKeyError } from "@/shared/lib/db";
import User from "@/entities/user/model/user";
import { apiError, ERRORS } from "@/shared/lib/api-response";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return apiError("All fields are required", 400);
    }

    if (password.length < 8) {
      return apiError("Password must be at least 8 characters", 400);
    }

    await connectDB();

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, email: email.toLowerCase(), password: hashed });

    return NextResponse.json({ message: "Account created" }, { status: 201 });
  } catch (err) {
    if (isDuplicateKeyError(err)) return apiError("Email already in use", 400);
    console.error("register error:", err);
    return ERRORS.serverError();
  }
}
