"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { t } from "@realtor/i18n";
import { leadIntentLabel, leadStatusLabel, leadStatuses, type LeadStatus } from "@realtor/domain";
import { leadStatusClass } from "@/components/lead-status-pill";
import { useLocale } from "@/contexts/locale-context";

type DashboardLead = {
  id: string;
  name: string;
  email: string;
  intent: string;
  status: LeadStatus;
  score: number;
  createdAt: string;
};

type LeadsTableProps = {
  leads: DashboardLead[];
  page: number;
  totalPages: number;
  pageHrefBuilder?: (page: number) => string;
};

function formatDate(date: string, locale: string) {
  return new Date(date).toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

export function LeadsTable({ leads: initialLeads, page, totalPages, pageHrefBuilder }: LeadsTableProps) {
  const hrefFor = pageHrefBuilder ?? ((p: number) => `?page=${p}`);
  const { locale, messages: m } = useLocale();
  const [leads, setLeads] = useState(initialLeads);
  const [pendingLeadId, setPendingLeadId] = useState<string | null>(null);
  const [failedLeadId, setFailedLeadId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const pendingId = isPending ? pendingLeadId : null;

  const leadRows = useMemo(
    () =>
      leads.map((lead) => ({
        ...lead,
        formattedDate: formatDate(lead.createdAt, locale)
      })),
    [leads, locale]
  );

  function updateLocalStatus(leadId: string, status: LeadStatus) {
    setLeads((currentLeads) => currentLeads.map((lead) => (lead.id === leadId ? { ...lead, status } : lead)));
  }

  function handleStatusChange(leadId: string, nextStatus: LeadStatus) {
    const currentLead = leads.find((lead) => lead.id === leadId);

    if (!currentLead || currentLead.status === nextStatus) {
      return;
    }

    const previousStatus = currentLead.status;
    setFailedLeadId(null);
    setPendingLeadId(leadId);
    updateLocalStatus(leadId, nextStatus);

    startTransition(async () => {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: nextStatus })
      });

      if (!response.ok) {
        updateLocalStatus(leadId, previousStatus);
        setFailedLeadId(leadId);
      }

      setPendingLeadId(null);
    });
  }

  if (leads.length === 0) {
    return <p className="px-6 py-12 text-center text-black/45">{m.dashboard.noLeads}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-black/10 text-left text-xs font-semibold uppercase tracking-[0.14em] text-black/45">
            <th className="px-6 py-3">{m.dashboard.name}</th>
            <th className="px-6 py-3">{m.dashboard.email}</th>
            <th className="px-6 py-3">{m.dashboard.intent}</th>
            <th className="px-6 py-3">{m.dashboard.status}</th>
            <th className="px-6 py-3">{m.dashboard.score}</th>
            <th className="px-6 py-3">{m.dashboard.date}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/[0.06]">
          {leadRows.map((lead) => {
            const isUpdating = pendingId === lead.id;
            const didFail = failedLeadId === lead.id;

            return (
              <tr key={lead.id} className="hover:bg-black/[0.02]">
                <td className="px-6 py-4 font-medium">
                  <Link
                    href={`/dashboard/leads/${lead.id}`}
                    className="hover:underline focus-visible:underline focus-visible:outline-none"
                  >
                    {lead.name}
                  </Link>
                </td>
                <td className="px-6 py-4 text-black/60">{lead.email}</td>
                <td className="px-6 py-4">
                  <span className="rounded bg-linen px-2 py-1 text-xs font-medium">{leadIntentLabel(lead.intent)}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="grid gap-1">
                    <span className={`inline-flex w-44 rounded px-2 py-1 text-xs font-medium transition-colors ${leadStatusClass(lead.status)} ${isUpdating ? "opacity-60" : ""}`}>
                      <select
                        value={lead.status}
                        disabled={isUpdating}
                        onChange={(event) => handleStatusChange(lead.id, event.target.value as LeadStatus)}
                        aria-label={t(m.dashboard.leadStatusLabel, { name: lead.name })}
                        className="w-full cursor-pointer appearance-none bg-transparent text-inherit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:cursor-not-allowed"
                      >
                        {leadStatuses.map((status) => (
                          <option key={status} value={status} className="bg-white text-ink">
                            {leadStatusLabel(status)}
                          </option>
                        ))}
                      </select>
                    </span>
                    {isUpdating ? <span className="text-xs text-black/55">{m.dashboard.saving}</span> : null}
                    {didFail ? <span className="text-xs font-medium text-red-700">{m.dashboard.updateError}</span> : null}
                  </div>
                </td>
                <td className="px-6 py-4 font-semibold text-moss">{lead.score}</td>
                <td className="px-6 py-4 text-black/45">{lead.formattedDate}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-black/10 px-6 py-4 text-sm">
          {page > 1 ? (
            <Link href={hrefFor(page - 1)} className="font-medium text-gold hover:underline">
              {m.listing.prev}
            </Link>
          ) : (
            <span className="text-black/25">{m.listing.prev}</span>
          )}
          <span className="text-black/45">
            {t(m.listing.pageOf, { page, total: totalPages })}
          </span>
          {page < totalPages ? (
            <Link href={hrefFor(page + 1)} className="font-medium text-gold hover:underline">
              {m.listing.next}
            </Link>
          ) : (
            <span className="text-black/25">{m.listing.next}</span>
          )}
        </div>
      )}
    </div>
  );
}
