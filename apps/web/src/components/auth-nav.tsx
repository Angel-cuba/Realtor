"use client";

import { useAuth, SignInButton, UserButton } from "@clerk/nextjs";
import { UserRound } from "lucide-react";
import { useLocale } from "@/contexts/locale-context";

export function AuthNav() {
  const { isSignedIn, isLoaded } = useAuth();
  const { messages: m } = useLocale();

  if (!isLoaded) {
    return <div className="h-10 w-10 rounded bg-ink/20" />;
  }

  if (isSignedIn) {
    return (
      <UserButton
        appearance={{
          elements: {
            avatarBox: "h-10 w-10 rounded",
          },
        }}
      />
    );
  }

  return (
    <SignInButton>
      <button
        className="grid h-10 w-10 place-items-center rounded bg-ink text-white"
        type="button"
        aria-label={m.nav.signIn}
      >
        <UserRound size={18} aria-hidden />
      </button>
    </SignInButton>
  );
}
