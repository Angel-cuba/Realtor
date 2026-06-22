import { eq } from "drizzle-orm";
import { db, agents, userProfiles, listings } from "@realtor/db";
import { hasPermission, type UserRole } from "@realtor/domain";

export type UserContext = {
  userProfileId: string;
  role: UserRole;
  agentId: string | null;
};

export async function getUserContext(clerkUserId: string): Promise<UserContext | null> {
  const [row] = await db
    .select({
      userProfileId: userProfiles.id,
      role: userProfiles.role,
      agentId: agents.id,
    })
    .from(userProfiles)
    .leftJoin(agents, eq(agents.userProfileId, userProfiles.id))
    .where(eq(userProfiles.clerkUserId, clerkUserId))
    .limit(1);

  return row ?? null;
}

export function canManageAllListings(ctx: UserContext): boolean {
  return hasPermission(ctx.role, "listing:edit:any");
}

export function canManageAssignedListings(ctx: UserContext): ctx is UserContext & { role: "agent"; agentId: string } {
  return ctx.role === "agent" && Boolean(ctx.agentId);
}

export function isListingOwner(ctx: UserContext, listingAgentId: string | null | undefined): boolean {
  if (canManageAllListings(ctx)) return true;
  if (!canManageAssignedListings(ctx) || !listingAgentId) return false;
  return ctx.agentId === listingAgentId;
}

export async function canMutateListing(ctx: UserContext, listingId: string): Promise<boolean> {
  if (canManageAllListings(ctx)) return true;
  if (!canManageAssignedListings(ctx)) return false;

  const [listing] = await db
    .select({ agentId: listings.agentId })
    .from(listings)
    .where(eq(listings.id, listingId))
    .limit(1);

  return listing != null && listing.agentId === ctx.agentId;
}
