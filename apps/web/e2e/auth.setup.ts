import { test as setup } from "@playwright/test";
import { clerk } from "@clerk/testing/playwright";

setup("authenticate as agent", async ({ page }) => {
  await page.goto("/");
  await clerk.signIn({
    page,
    signInParams: {
      strategy: "password",
      identifier: process.env.E2E_AGENT_EMAIL!,
      password: process.env.E2E_AGENT_PASSWORD!,
    },
  });

  await page.waitForURL("/dashboard");
  await page.context().storageState({ path: "e2e/.auth/agent.json" });
});
