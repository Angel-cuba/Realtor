import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

vi.mock("@realtor/db", () => ({
  db: { delete: vi.fn() },
  savedListings: {},
}));

import { DELETE } from "./route";
import { auth } from "@clerk/nextjs/server";
import { db } from "@realtor/db";

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";

function mockDeleteChain() {
  const whereMock = vi.fn().mockResolvedValue([]);
  vi.mocked(db.delete).mockReturnValue({ where: whereMock } as never);
}

function makeCtx(listingId: string) {
  return { params: Promise.resolve({ listingId }) };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("DELETE /api/saved/[listingId]", () => {
  it("returns 401 when not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as never);
    const res = await DELETE(new Request("http://localhost"), makeCtx(VALID_UUID));
    expect(res.status).toBe(401);
  });

  it("returns 400 on invalid UUID", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user_123" } as never);
    const res = await DELETE(new Request("http://localhost"), makeCtx("not-a-uuid"));
    expect(res.status).toBe(400);
  });

  it("returns 204 on valid delete", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user_123" } as never);
    mockDeleteChain();
    const res = await DELETE(new Request("http://localhost"), makeCtx(VALID_UUID));
    expect(res.status).toBe(204);
  });
});
