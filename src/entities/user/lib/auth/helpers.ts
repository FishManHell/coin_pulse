import type { User as NextAuthUser } from "next-auth";
import connectDB from "@/shared/lib/db";
import User, { type UserDocument } from "@/models/User";
import type { UserRole } from "@/shared/types/roles";

export interface UserClaims {
  id: string;
  role: UserRole;
  hasPassword: boolean;
}

const toClaims = (
  doc: Pick<UserDocument, "_id" | "role" | "password">
): UserClaims => ({
  id: String(doc._id),
  role: doc.role,
  hasPassword: !!doc.password,
});

export const SESSION_MAX_AGE = 7 * 24 * 60 * 60

export async function loadUserClaimsById(id: string): Promise<UserClaims | null> {
  await connectDB();
  const doc = await User.findById(id).select("role password").lean();
  return doc ? toClaims(doc) : null;
}

export async function loadUserClaimsByEmail(email: string): Promise<UserClaims | null> {
  await connectDB();
  const doc = await User.findOne({ email: email.toLowerCase() })
    .select("role password")
    .lean();
  return doc ? toClaims(doc) : null;
}

export async function ensureGoogleUser(user: NextAuthUser): Promise<void> {
  if (!user.email) return;
  const email = user.email.toLowerCase();
  await connectDB();
  const existing = await User.findOne({ email });
  if (existing) return;
  await User.create({
    name: user.name ?? "User",
    email,
    password: null,
    image: user.image ?? null,
  });
}
