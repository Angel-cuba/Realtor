import { test as base, expect } from "@playwright/test";
import { clerk } from "@clerk/testing/playwright";

type Fixtures = {
  clerkAuth: typeof clerk;
};

export const test = base.extend<Fixtures>({
  clerkAuth: async ({}, use) => {
    await use(clerk);
  },
});

export { expect };
