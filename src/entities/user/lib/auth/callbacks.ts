import type { NextAuthOptions } from "next-auth";
import {
  ensureGoogleUser,
  loadUserClaimsByEmail,
  loadUserClaimsById,
} from "./helpers";

export const callbacks: NextAuthOptions["callbacks"] = {
  async signIn({ user, account }) {
    if (account?.provider === "google") {
      await ensureGoogleUser(user);
    }
    return true;
  },

  async jwt({ token, user, account, trigger, session }) {
    if (user) {
      const claims =
        account?.provider === "google" && user.email
          ? await loadUserClaimsByEmail(user.email)
          : await loadUserClaimsById(user.id);
      if (claims) {
        token.id = claims.id;
        token.role = claims.role;
        token.hasPassword = claims.hasPassword;
      }
    }

    if (trigger === "update" && session) {
      if (typeof session.name === "string") token.name = session.name;
      if (typeof session.email === "string") token.email = session.email;
    }

    if (!token.role && token.id) {
      const claims = await loadUserClaimsById(token.id);
      if (claims) {
        token.role = claims.role;
        token.hasPassword = claims.hasPassword;
      }
    }

    return token;
  },

  async session({ session, token }) {
    if (session.user) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.hasPassword = token.hasPassword;
    }
    return session;
  },
};
