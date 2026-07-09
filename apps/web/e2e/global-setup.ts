import { clerkSetup } from "@clerk/testing/playwright";
import { execSync } from "child_process";
import { existsSync } from "fs";

export default async function globalSetup() {
  await clerkSetup();

  if (process.env.E2E_SEED !== "false") {
    const root = new URL("../../..", import.meta.url).pathname;
    execSync("npm run db:seed", { cwd: root, stdio: "inherit" });
  }

  if (!existsSync("e2e/.auth")) {
    const { mkdirSync } = await import("fs");
    mkdirSync("e2e/.auth", { recursive: true });
  }
}
