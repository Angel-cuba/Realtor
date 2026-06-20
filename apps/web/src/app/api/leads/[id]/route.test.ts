import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

vi.mock("@realtor/db", () => ({
  db: { update: vi.fn() },
  leads: {},
}));

vi.mock("@/lib/agent", () => ({
  getAgentForClerkUser: vi.fn(),
}));

import { auth } from "@clerk/nextjs/server";
import { db } from "@realtor/db";
import { getAgentForClerkUser } from "@/lib/agent";
import { PATCH } from "./route";

const VALID_UUID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";

const mockLead = {
  id: VALID_UUID,
  name: "María García",
  email: "maria@example.com",
  status: "contacted",
  score: 35,
};

function makeRequest(body: unknown) {
  return new Request(`http://localhost:3000/api/leads/${VALID_UUID}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function makeParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

function mockAgentLookup(agent: { userProfileId: string; agentId: string } | null) {
  vi.mocked(getAgentForClerkUser).mockResolvedValue(agent);
}

function mockLeadUpdate(rows: unknown[]) {
  const returningMock = vi.fn().mockResolvedValue(rows);
  const whereMock = vi.fn().mockReturnValue({ returning: returningMock });
  const setMock = vi.fn().mockReturnValue({ where: whereMock });
  vi.mocked(db.update).mockReturnValue({ set: setMock } as never);
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("PATCH /api/leads/[id]", () => {
  it("returns 401 when unauthenticated", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as never);
    const res = await PATCH(makeRequest({ status: "contacted" }), makeParams(VALID_UUID));
    expect(res.status).toBe(401);
  });

  it("returns 403 when user has no agent profile", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user_abc" } as never);
    mockAgentLookup(null);
    const res = await PATCH(makeRequest({ status: "contacted" }), makeParams(VALID_UUID));
    expect(res.status).toBe(403);
  });

  it("returns 400 when id is not a valid UUID", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user_abc" } as never);
    mockAgentLookup({ userProfileId: "profile-1", agentId: "agent-1" });
    const res = await PATCH(makeRequest({ status: "contacted" }), makeParams("not-a-uuid"));
    expect(res.status).toBe(400);
  });

  it("returns 400 when status is not a valid enum value", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user_abc" } as never);
    mockAgentLookup({ userProfileId: "profile-1", agentId: "agent-1" });
    const res = await PATCH(makeRequest({ status: "invalid_status" }), makeParams(VALID_UUID));
    expect(res.status).toBe(400);
  });

  it("returns 200 with updated lead on valid request", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user_abc" } as never);
    mockAgentLookup({ userProfileId: "profile-1", agentId: "agent-1" });
    mockLeadUpdate([mockLead]);
    const res = await PATCH(makeRequest({ status: "contacted" }), makeParams(VALID_UUID));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.lead.id).toBe(VALID_UUID);
  });

  it("returns 404 when lead does not exist", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user_abc" } as never);
    mockAgentLookup({ userProfileId: "profile-1", agentId: "agent-1" });
    mockLeadUpdate([]);
    const res = await PATCH(makeRequest({ status: "contacted" }), makeParams(VALID_UUID));
    expect(res.status).toBe(404);
  });

  it("returns 500 when DB update throws", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user_abc" } as never);
    mockAgentLookup({ userProfileId: "profile-1", agentId: "agent-1" });
    const whereMock = vi.fn().mockReturnValue({
      returning: vi.fn().mockRejectedValue(new Error("DB failure")),
    });
    vi.mocked(db.update).mockReturnValue({ set: vi.fn().mockReturnValue({ where: whereMock }) } as never);
    const res = await PATCH(makeRequest({ status: "contacted" }), makeParams(VALID_UUID));
    expect(res.status).toBe(500);
  });
});
