import { type LeadStatus } from "@realtor/domain";

const statusClass: Record<LeadStatus, string> = {
  new: "bg-gold/15 text-gold",
  contacted: "bg-ink/[0.08] text-ink/70",
  qualified: "bg-moss/15 text-moss",
  tour_scheduled: "bg-moss/15 text-moss",
  offer_intent: "bg-ink text-gold",
  negotiating: "bg-ink text-gold",
  won: "bg-moss text-white",
  lost: "bg-black/[0.05] text-black/40",
};

export function leadStatusClass(status: LeadStatus) {
  return statusClass[status];
}
