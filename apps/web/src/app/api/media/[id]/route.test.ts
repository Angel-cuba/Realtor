import { beforeEach, describe, expect, it, vi } from "vitest";

const { deleteFilesMock } = vi.hoisted(() => ({
  deleteFilesMock: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

vi.mock("uploadthing/server", () => ({
  UTApi: vi.fn(function () {
    return { deleteFiles: deleteFilesMock };
  }),
}));

vi.mock("@realtor/db", () => ({
  db: { delete: vi.fn(), select: vi.fn() },
  listings: {},
  propertyMedia: {},
}));

vi.mock("@/lib/auth", () => ({
  getUserContext: vi.fn(),
  isListingOwner: vi.fn(),
}));

import { auth } from "@clerk/nextjs/server";
import { db } from "@realtor/db";
import { getUserContext, isListingOwner } from "@/lib/auth";
import { DELETE } from "./route";

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";
const POSTGRES_UUID = "3673ec8d-70e3-77ab-f9d6-5ca0c02d3dcf";
const AGENT_ID = "agent-abc-123";

function makeCtx(id: string) {
  return { params: Promise.resolve({ id }) };
}

function selectChain(rows: unknown[]) {
  const limit = vi.fn().mockResolvedValue(rows);
  const where = vi.fn().mockReturnValue({ limit });
  const chain = { from: vi.fn(), innerJoin: vi.fn(), limit, where };
  chain.innerJoin.mockReturnValue({ where });
  chain.from.mockReturnValue({ innerJoin: chain.innerJoin, where });
  return chain;
}

function mockMediaRows(mediaRows: unknown[]) {
  vi.mocked(db.select).mockReturnValueOnce(selectChain(mediaRows) as never);
}

function mockDelete() {
  const where = vi.fn().mockResolvedValue([]);
  vi.mocked(db.delete).mockReturnValue({ where } as never);
  return where;
}

const DEFAULT_CTX = { userProfileId: "profile-1", role: "agent" as const, agentId: AGENT_ID };

beforeEach(() => {
  vi.mocked(auth).mockReset();
  vi.mocked(db.delete).mockReset();
  vi.mocked(db.select).mockReset();
  deleteFilesMock.mockReset();
  deleteFilesMock.mockResolvedValue({ deletedCount: 1, success: true });
  vi.mocked(getUserContext).mockResolvedValue(DEFAULT_CTX);
  vi.mocked(isListingOwner).mockReturnValue(true);
});

describe("DELETE /api/media/[id]", () => {
  it("returns 401 when unauthenticated", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as never);
    const res = await DELETE(new Request("http://localhost"), makeCtx(VALID_UUID));
    expect(res.status).toBe(401);
  });

  it("returns 400 on invalid UUID", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user_123" } as never);
    const res = await DELETE(new Request("http://localhost"), makeCtx("not-a-uuid"));
    expect(res.status).toBe(400);
    expect(db.select).not.toHaveBeenCalled();
  });

  it("returns 403 when user has no profile", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user_123" } as never);
    vi.mocked(getUserContext).mockResolvedValue(null);
    const res = await DELETE(new Request("http://localhost"), makeCtx(VALID_UUID));
    expect(res.status).toBe(403);
    expect(db.select).not.toHaveBeenCalled();
  });

  it("returns 404 when media does not exist", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user_123" } as never);
    mockMediaRows([]);
    const res = await DELETE(new Request("http://localhost"), makeCtx(VALID_UUID));
    expect(res.status).toBe(404);
  });

  it("returns 403 when user does not own the listing", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user_123" } as never);
    vi.mocked(isListingOwner).mockReturnValue(false);
    mockMediaRows([{ id: VALID_UUID, uploadThingKey: null, url: "https://ufs.sh/f/key", listingAgentId: "other-agent" }]);
    const res = await DELETE(new Request("http://localhost"), makeCtx(VALID_UUID));
    expect(res.status).toBe(403);
    expect(db.delete).not.toHaveBeenCalled();
  });

  it("deletes UploadThing file and DB row when media has a stored key", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user_123" } as never);
    mockMediaRows([{ id: VALID_UUID, uploadThingKey: "file-key", url: "https://ufs.sh/f/file-key", listingAgentId: AGENT_ID }]);
    const deleteWhere = mockDelete();
    const res = await DELETE(new Request("http://localhost"), makeCtx(VALID_UUID));
    expect(res.status).toBe(204);
    expect(deleteFilesMock).toHaveBeenCalledWith("file-key");
    expect(deleteWhere).toHaveBeenCalledTimes(1);
  });

  it("accepts UUID-shaped ids that Postgres stores even when they are not RFC versioned UUIDs", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user_123" } as never);
    mockMediaRows([{ id: POSTGRES_UUID, uploadThingKey: null, url: "https://images.unsplash.com/photo.jpg", listingAgentId: AGENT_ID }]);
    mockDelete();
    const res = await DELETE(new Request("http://localhost"), makeCtx(POSTGRES_UUID));
    expect(res.status).toBe(204);
    expect(db.delete).toHaveBeenCalledTimes(1);
  });

  it("deletes only the DB row for non-UploadThing media", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user_123" } as never);
    mockMediaRows([{ id: VALID_UUID, uploadThingKey: null, url: "https://images.unsplash.com/photo.jpg", listingAgentId: AGENT_ID }]);
    mockDelete();
    const res = await DELETE(new Request("http://localhost"), makeCtx(VALID_UUID));
    expect(res.status).toBe(204);
    expect(deleteFilesMock).not.toHaveBeenCalled();
    expect(db.delete).toHaveBeenCalledTimes(1);
  });

  it("does not delete DB row when remote deletion fails", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "user_123" } as never);
    deleteFilesMock.mockRejectedValueOnce(new Error("UploadThing unavailable"));
    mockMediaRows([{ id: VALID_UUID, uploadThingKey: "file-key", url: "https://ufs.sh/f/file-key", listingAgentId: AGENT_ID }]);
    const res = await DELETE(new Request("http://localhost"), makeCtx(VALID_UUID));
    expect(res.status).toBe(502);
    expect(db.delete).not.toHaveBeenCalled();
  });
});
