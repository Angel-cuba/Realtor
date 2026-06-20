import { eq } from "drizzle-orm";
import { db, agents, userProfiles } from "@realtor/db";

export type AgentContext = {
  userProfileId: string;
  agentId: string;
};

export async function getAgentForClerkUser(clerkUserId: string): Promise<AgentContext | null> {
  const [row] = await db
    .select({ userProfileId: userProfiles.id, agentId: agents.id })
    .from(userProfiles)
    .innerJoin(agents, eq(agents.userProfileId, userProfiles.id))
    .where(eq(userProfiles.clerkUserId, clerkUserId))
    .limit(1);

  return row ?? null;
}
