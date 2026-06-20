import { type ListingStatus } from "@realtor/domain";

const statusClass: Record<ListingStatus, string> = {
  draft: "bg-black/[0.05] text-black/55",
  pending_review: "bg-gold/15 text-gold",
  published: "bg-moss text-white",
  reserved: "bg-moss/15 text-moss",
  under_contract: "bg-ink text-gold",
  sold: "bg-ink text-white",
  rented: "bg-ink text-white",
  archived: "bg-black/[0.05] text-black/40",
};

export function listingStatusClass(status: ListingStatus) {
  return statusClass[status];
}
