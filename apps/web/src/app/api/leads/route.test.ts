import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@realtor/db", () => ({
  db: { insert: vi.fn() },
  leads: {},
}));

vi.mock("@/lib/email", () => ({
  sendNewLeadEmail: vi.fn().mockResolvedValue({ sent: false, reason: "not-configured" }),
}));

import { POST } from "./route";
import { db } from "@realtor/db";
import { sendNewLeadEmail } from "@/lib/email";

const validPayload = {
  name: "María García",
  email: "maria@example.com",
  intent: "buy",
  message: "Looking for a 3-bedroom house in the city center.",
};

const mockLead = { id: "lead-uuid-1", ...validPayload, score: 35, status: "new" };

function makeRequest(body: unknown) {
  return new Request("http://localhost:3000/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function mockInsert(returnValue: unknown[]) {
  const returningMock = vi.fn().mockResolvedValue(returnValue);
  const valuesMock = vi.fn().mockReturnValue({ returning: returningMock });
  vi.mocked(db.insert).mockReturnValue({ values: valuesMock } as never);
  return { valuesMock, returningMock };
}

beforeEach(() => {
  vi.clearAllMocks();
  mockInsert([mockLead]);
});

describe("POST /api/leads", () => {
  it("returns 201 with lead on valid payload", async () => {
    const res = await POST(makeRequest(validPayload));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.lead.id).toBe("lead-uuid-1");
  });

  it("assigns score=55 when listingSlug is provided", async () => {
    const { valuesMock } = mockInsert([{ ...mockLead, score: 55 }]);
    await POST(makeRequest({ ...validPayload, listingSlug: "hillcrest-villa" }));
    expect(valuesMock.mock.calls[0][0].score).toBe(55);
  });

  it("assigns score=35 when listingSlug is absent", async () => {
    const { valuesMock } = mockInsert([mockLead]);
    await POST(makeRequest(validPayload));
    expect(valuesMock.mock.calls[0][0].score).toBe(35);
  });

  it("returns 400 when name is missing", async () => {
    const { name: _n, ...rest } = validPayload;
    const res = await POST(makeRequest(rest));
    expect(res.status).toBe(400);
  });

  it("returns 400 when email is invalid", async () => {
    const res = await POST(makeRequest({ ...validPayload, email: "not-an-email" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when intent is not a valid enum value", async () => {
    const res = await POST(makeRequest({ ...validPayload, intent: "unknown" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when message is too short", async () => {
    const res = await POST(makeRequest({ ...validPayload, message: "Hi" }));
    expect(res.status).toBe(400);
  });

  it("returns 500 when DB insert throws", async () => {
    const valuesMock = vi.fn().mockReturnValue({
      returning: vi.fn().mockRejectedValue(new Error("DB failure")),
    });
    vi.mocked(db.insert).mockReturnValue({ values: valuesMock } as never);

    const res = await POST(makeRequest(validPayload));
    expect(res.status).toBe(500);
  });

  it("dispatches the new-lead email after a successful insert", async () => {
    await POST(makeRequest({ ...validPayload, listingSlug: "hillcrest-villa" }));
    expect(sendNewLeadEmail).toHaveBeenCalledTimes(1);
    expect(vi.mocked(sendNewLeadEmail).mock.calls[0][0]).toMatchObject({
      leadId: "lead-uuid-1",
      name: validPayload.name,
      email: validPayload.email,
      listingSlug: "hillcrest-villa",
    });
  });

  it("still returns 201 when the email helper resolves with sent=false", async () => {
    vi.mocked(sendNewLeadEmail).mockResolvedValueOnce({ sent: false, reason: "not-configured" });
    const res = await POST(makeRequest(validPayload));
    expect(res.status).toBe(201);
  });

  it("does not call the email helper when the insert fails", async () => {
    const valuesMock = vi.fn().mockReturnValue({
      returning: vi.fn().mockRejectedValue(new Error("DB failure")),
    });
    vi.mocked(db.insert).mockReturnValue({ values: valuesMock } as never);

    await POST(makeRequest(validPayload));
    expect(sendNewLeadEmail).not.toHaveBeenCalled();
  });
});
