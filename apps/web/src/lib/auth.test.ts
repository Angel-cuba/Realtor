import { describe, expect, it, vi } from "vitest";
import type { UserContext } from "./auth";

vi.mock("@realtor/db", () => ({
  agents: {},
  db: {},
  listings: {},
  userProfiles: {},
}));

import { canManageAllListings, canManageAssignedListings, isListingOwner } from "./auth";

function ctx(role: UserContext["role"], agentId: string | null = null): UserContext {
  return { agentId, role, userProfileId: `profile-${role}` };
}

describe("authorization helpers", () => {
  it("allows admins and managers to manage every listing", () => {
    expect(canManageAllListings(ctx("admin"))).toBe(true);
    expect(canManageAllListings(ctx("manager"))).toBe(true);
    expect(isListingOwner(ctx("admin"), "agent-1")).toBe(true);
    expect(isListingOwner(ctx("manager"), null)).toBe(true);
  });

  it("allows agents to manage only their assigned listings", () => {
    const agent = ctx("agent", "agent-1");
    expect(canManageAssignedListings(agent)).toBe(true);
    expect(isListingOwner(agent, "agent-1")).toBe(true);
    expect(isListingOwner(agent, "agent-2")).toBe(false);
  });

  it("does not treat buyer or owner roles as listing managers without a dedicated ownership model", () => {
    expect(canManageAssignedListings(ctx("buyer", "agent-1"))).toBe(false);
    expect(canManageAssignedListings(ctx("owner", "agent-1"))).toBe(false);
    expect(isListingOwner(ctx("buyer", "agent-1"), "agent-1")).toBe(false);
    expect(isListingOwner(ctx("owner", "agent-1"), "agent-1")).toBe(false);
  });
});
