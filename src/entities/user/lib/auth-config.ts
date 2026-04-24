import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import connectDB from "@/shared/lib/db";
import User from "../../../../models/User";
import type { UserRole } from "@/shared/types/roles";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectDB();
        const user = await User.findOne({ email: credentials.email.toLowerCase() });
        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: (user._id as { toString(): string }).toString(),
          name: user.name,
          email: user.email,
          image: user.image ?? undefined,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectDB();
        const existing = await User.findOne({ email: user.email!.toLowerCase() });
        if (!existing) {
          await User.create({
            name: user.name ?? "User",
            email: user.email!.toLowerCase(),
            password: null,
            image: user.image ?? null,
          });
        }
      }
      return true;
    },

    async jwt({ token, user, account }) {
      // On sign-in — fetch id + role from DB
      if (user) {
        await connectDB();
        const dbUser = await User.findOne(
          account?.provider === "google"
            ? { email: user.email?.toLowerCase() }
            : { _id: user.id }
        ).lean();
        if (dbUser) {
          token.id = (dbUser._id as { toString(): string }).toString();
          token.role = dbUser.role as UserRole;
        }
      }

      // Fallback: token exists but role missing (old token before role was added)
      if (!token.role && token.id) {
        await connectDB();
        const dbUser = await User.findById(token.id).select("role").lean();
        if (dbUser) token.role = dbUser.role as UserRole;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as typeof session.user & { id: string; role: UserRole }).id =
          token.id as string;
        (session.user as typeof session.user & { id: string; role: UserRole }).role =
          token.role as UserRole;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },
};
