import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex min-h-[calc(100svh-4rem)] items-center justify-center bg-linen px-4">
      <SignUp />
    </main>
  );
}
