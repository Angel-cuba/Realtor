"use client";

import { useMemo, useState, useTransition } from "react";
import { leadStatuses, type LeadStatus } from "@realtor/domain";

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
  allLeads: DashboardLead[];
};

const intentLabel: Record<string, string> = {
  buy: "Compra",
  rent: "Renta",
  sell: "Venta",
  lease_out: "Alquilar propiedad",
  general: "General"
};

const statusLabel: Record<LeadStatus, string> = {
  new: "Nuevo",
  contacted: "Contactado",
  qualified: "Calificado",
  tour_scheduled: "Tour agendado",
  offer_intent: "Intencion de oferta",
  negotiating: "Negociando",
  won: "Ganado",
  lost: "Perdido"
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("es", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

export function LeadsTable({ allLeads }: LeadsTableProps) {
  const [leads, setLeads] = useState(allLeads);
  const [pendingLeadId, setPendingLeadId] = useState<string | null>(null);
  const [failedLeadId, setFailedLeadId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const pendingId = isPending ? pendingLeadId : null;

  const leadRows = useMemo(
    () =>
      leads.map((lead) => ({
        ...lead,
        formattedDate: formatDate(lead.createdAt)
      })),
    [leads]
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

  if (allLeads.length === 0) {
    return <p className="px-6 py-12 text-center text-black/45">Aun no hay leads registrados.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-black/10 text-left text-xs font-semibold uppercase tracking-[0.14em] text-black/45">
            <th className="px-6 py-3">Nombre</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">Intencion</th>
            <th className="px-6 py-3">Estado</th>
            <th className="px-6 py-3">Score</th>
            <th className="px-6 py-3">Fecha</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-black/[0.06]">
          {leadRows.map((lead) => {
            const isUpdating = pendingId === lead.id;
            const didFail = failedLeadId === lead.id;

            return (
              <tr key={lead.id} className="hover:bg-black/[0.02]">
                <td className="px-6 py-4 font-medium">{lead.name}</td>
                <td className="px-6 py-4 text-black/60">{lead.email}</td>
                <td className="px-6 py-4">
                  <span className="rounded bg-linen px-2 py-1 text-xs font-medium">{intentLabel[lead.intent] ?? lead.intent}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="grid gap-1">
                    <select
                      value={lead.status}
                      disabled={isUpdating}
                      onChange={(event) => handleStatusChange(lead.id, event.target.value as LeadStatus)}
                      className="w-44 rounded border border-black/10 bg-transparent px-2 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-gold disabled:opacity-50"
                    >
                      {leadStatuses.map((status) => (
                        <option key={status} value={status}>
                          {statusLabel[status]}
                        </option>
                      ))}
                    </select>
                    {isUpdating ? <span className="text-xs text-black/45">Guardando...</span> : null}
                    {didFail ? <span className="text-xs font-medium text-red-700">No se pudo actualizar.</span> : null}
                  </div>
                </td>
                <td className="px-6 py-4 font-semibold text-moss">{lead.score}</td>
                <td className="px-6 py-4 text-black/45">{lead.formattedDate}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
