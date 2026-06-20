import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

vi.mock("@realtor/db", () => ({
  db: {
    insert: vi.fn(),
    select: vi.fn(),
  },
  savedListings: {},
  listings: {},
  properties: {},
  agents: {},
  userProfiles: {},
}));

vi.mock("@/lib/listings", () => ({
  mapListingRows: vi.fn().mockResolvedValue([]),
  getSavedListingsForUser: vi.fn().mockResolvedValue([]),
}));

import { GET, POST } from "./route";
import { auth } from "@clerk/nextjs/server";
import { db } from "@realtor/db";

function req(body?: unknown) {
  return new Request("http://localhost:3000/api/saved", {
    method: body ? "POST" : "GET",
    headers: { "Content-Type": "application/json" },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
}

function mockInsertChain() {
  const onConflictMock = vi.fn().mockResolvedValue([]);
  const valuesMock = vi.fn().mockReturnValue({ onConflictDoNothing: onConflictMock });
  vi.mocked(db.insert).mockReturnValue({ values: valuesMock } as never);
  return { valuesMock, onConflictMock };
}

function mockSelectChain(rows: unknown[] = []) {
  const whereMock = vi.fn().mockReturnValue({ orderBy: vi.fn().mockResolvedValue(rows) });
  const joinMocks = {
    innerJoin: vi.fn(),
    leftJoin: vi.fn(),
  };
  joinMocks.innerJoin.mockReturnValue({ innerJoin: joinMocks.innerJoin, leftJoin: joinMocks.leftJoin, where: whereMock });
  joinMocks.leftJoin.mockReturnValue({ innerJoin: joinMocks.innerJoin, leftJoin: joinMocks.leftJoin, where: whereMock });
  const fromMock = vi.fn().mockReturnValue({ innerJoin: joinMocks.innerJoin });
  const selectMock = vi.fn().mockReturnValue({ from: fromMock });
  vi.mocked(db.select).mockImplementation(selectMock as never);
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/saved", () => {
  it("returns 401 when not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as never);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("returns 200 with listings array for authenticated user", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user_123" } as never);
    mockSelectChain([]);
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.listings)).toBe(true);
  });
});

describe("POST /api/saved", () => {
  it("returns 401 when not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as never);
    const res = await POST(req({ listingId: "550e8400-e29b-41d4-a716-446655440000" }));
    expect(res.status).toBe(401);
  });

  it("returns 400 on invalid body", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user_123" } as never);
    const res = await POST(req({ listingId: "not-a-uuid" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when body is missing", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user_123" } as never);
    const badReq = new Request("http://localhost:3000/api/saved", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "invalid-json",
    });
    const res = await POST(badReq);
    expect(res.status).toBe(400);
  });

  it("returns 201 on valid payload", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user_123" } as never);
    mockInsertChain();
    const res = await POST(req({ listingId: "550e8400-e29b-41d4-a716-446655440000" }));
    expect(res.status).toBe(201);
  });
});
