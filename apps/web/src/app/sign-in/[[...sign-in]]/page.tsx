import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex min-h-[calc(100svh-4rem)] items-center justify-center bg-linen px-4">
      <SignIn />
    </main>
  );
}
