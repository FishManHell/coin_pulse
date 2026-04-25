"use client";

import { signIn } from "next-auth/react";
import { GoogleIcon } from "@/shared/ui/google-icon";
import { Button } from "@/shared/ui/button";

export const GoogleSignInButton = ({ callbackUrl }: { callbackUrl: string }) => (
  <Button
    variant="outline"
    onClick={() => signIn("google", { callbackUrl })}
    className="w-full bg-surface-hover gap-3 mb-6"
  >
    <GoogleIcon />
    Continue with Google
  </Button>
);
