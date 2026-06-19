"use client";

import { useState, useTransition } from "react";
import { leadStatuses, type LeadStatus } from "@realtor/domain";

const statusLabel: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  tour_scheduled: "Tour scheduled",
  offer_intent: "Offer intent",
  negotiating: "Negotiating",
  won: "Won",
  lost: "Lost",
};

interface Props {
  leadId: string;
  initialStatus: LeadStatus;
}

export function LeadStatusSelect({ leadId, initialStatus }: Props) {
  const [serverStatus, setServerStatus] = useState<LeadStatus>(initialStatus);
  const [status, setStatus] = useState<LeadStatus>(initialStatus);
  const [isPending, startTransition] = useTransition();

  function handleChange(next: LeadStatus) {
    setStatus(next);

    startTransition(async () => {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });

      if (res.ok) {
        setServerStatus(next);
      } else {
        setStatus(serverStatus);
      }
    });
  }

  return (
    <select
      value={status}
      disabled={isPending}
      onChange={(e) => handleChange(e.target.value as LeadStatus)}
      className="rounded border border-black/10 bg-transparent px-2 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-gold disabled:opacity-50"
    >
      {leadStatuses.map((s) => (
        <option key={s} value={s}>
          {statusLabel[s]}
        </option>
      ))}
    </select>
  );
}
