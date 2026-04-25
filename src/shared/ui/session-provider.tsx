"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import {ReactNode} from "react";

export const SessionProvider = ({ children }: { children: ReactNode }) => (
  <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
);
