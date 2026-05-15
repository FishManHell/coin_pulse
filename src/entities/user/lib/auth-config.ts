import type { NextAuthOptions } from "next-auth";
import { ROUTES } from "@/shared/config/routes";
import { providers } from "./auth/providers";
import { callbacks } from "./auth/callbacks";
import { SESSION_MAX_AGE } from "./auth/helpers";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: SESSION_MAX_AGE },
  secret: process.env.NEXTAUTH_SECRET,
  providers,
  callbacks,
  pages: {
    signIn: ROUTES.login,
    error: ROUTES.login,
  },
};
