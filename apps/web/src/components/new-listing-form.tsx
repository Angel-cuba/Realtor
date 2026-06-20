"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { listingTypes, propertyTypes, propertyTypeLabel } from "@realtor/domain";
import { useLocale } from "@/contexts/locale-context";

type Currency = "USD" | "EUR";

export function NewListingForm() {
  const router = useRouter();
  const { messages: m } = useLocale();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldIssues, setFieldIssues] = useState<Record<string, string[]>>({});

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    setError(null);
    setFieldIssues({});

    const get = (key: string) => (formData.get(key) as string | null)?.toString().trim() ?? "";
    const splitList = (raw: string) =>
      raw
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);

    const lotSqftRaw = get("lotSqft");

    const payload = {
      title: get("title"),
      listingType: get("listingType"),
      propertyType: get("propertyType"),
      price: Number(get("price")),
      currency: (get("currency") || "USD") as Currency,
      summary: get("summary"),
      tags: splitList(get("tags")),
      highlights: splitList(get("highlights")),
      addressLine1: get("addressLine1"),
      addressLine2: get("addressLine2") || undefined,
      city: get("city"),
      neighborhood: get("neighborhood"),
      region: get("region") || undefined,
      postalCode: get("postalCode") || undefined,
      country: get("country"),
      beds: Number(get("beds")),
      baths: Number(get("baths")),
      areaSqft: Number(get("areaSqft")),
      ...(lotSqftRaw ? { lotSqft: Number(lotSqftRaw) } : {}),
    };

    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error ?? m.dashboard.createListingError);
        if (data?.issues?.fieldErrors) setFieldIssues(data.issues.fieldErrors);
        setSubmitting(false);
        return;
      }

      router.push("/dashboard/listings");
      router.refresh();
    } catch {
      setError(m.dashboard.networkError);
      setSubmitting(false);
    }
  }

  return (
    <form action={handleSubmit} className="grid gap-6 rounded bg-white p-6 shadow-soft md:p-8">
      <Section title={m.dashboard.summary}>
        <Field label={m.dashboard.title} name="title" required issues={fieldIssues.title} />
        <div className="grid gap-4 md:grid-cols-2">
          <SelectField label={m.dashboard.operation} name="listingType" options={listingTypes.map((t) => ({ value: t, label: t === "sale" ? m.listing.saleLabel : m.listing.rentLabel }))} placeholder={m.dashboard.select} required />
          <SelectField label={m.dashboard.propertyType} name="propertyType" options={propertyTypes.map((t) => ({ value: t, label: propertyTypeLabel(t) }))} placeholder={m.dashboard.select} required />
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_120px]">
          <Field label={m.dashboard.price} name="price" type="number" min={1} required issues={fieldIssues.price} />
          <SelectField label={m.dashboard.currency} name="currency" options={[{ value: "USD", label: "USD" }, { value: "EUR", label: "EUR" }]} defaultValue="USD" placeholder={m.dashboard.select} />
        </div>
        <TextAreaField label={m.dashboard.summary} name="summary" required minLength={10} maxLength={2000} issues={fieldIssues.summary} />
      </Section>

      <Section title={m.dashboard.address}>
        <Field label={m.dashboard.addressLine1} name="addressLine1" required issues={fieldIssues.addressLine1} />
        <Field label={m.dashboard.addressLine2} name="addressLine2" issues={fieldIssues.addressLine2} />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label={m.dashboard.city} name="city" required issues={fieldIssues.city} />
          <Field label={m.dashboard.neighborhood} name="neighborhood" required issues={fieldIssues.neighborhood} />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label={m.dashboard.region} name="region" />
          <Field label={m.dashboard.postalCode} name="postalCode" />
          <Field label={m.dashboard.country} name="country" required issues={fieldIssues.country} />
        </div>
      </Section>

      <Section title={m.dashboard.specifications}>
        <div className="grid gap-4 md:grid-cols-4">
          <Field label={m.dashboard.beds} name="beds" type="number" min={0} required />
          <Field label={m.dashboard.baths} name="baths" type="number" min={0} required />
          <Field label={m.dashboard.area} name="areaSqft" type="number" min={1} required />
          <Field label={m.dashboard.lot} name="lotSqft" type="number" min={1} />
        </div>
      </Section>

      <Section title={m.dashboard.marketing}>
        <Field label={m.dashboard.tags} name="tags" placeholder="Pool, Sea view, Recently renovated" />
        <Field label={m.dashboard.highlights} name="highlights" placeholder="Walk-in closet, Chef kitchen" />
      </Section>

      {error ? <p className="text-sm font-medium text-red-700">{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded bg-ink px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:opacity-60"
        >
          {submitting ? m.dashboard.saving : m.dashboard.createListing}
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard/listings")}
          className="inline-flex items-center justify-center gap-2 rounded border border-black/15 px-6 py-3 font-semibold transition-colors hover:bg-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        >
          {m.dashboard.cancel}
        </button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="grid gap-4">
      <legend className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">{title}</legend>
      {children}
    </fieldset>
  );
}

type FieldProps = {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  min?: number;
  placeholder?: string;
  issues?: string[];
};

function Field({ label, name, required, type = "text", min, placeholder, issues }: FieldProps) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-medium">{label}{required && <span className="text-red-700"> *</span>}</span>
      <input
        name={name}
        type={type}
        min={min}
        required={required}
        placeholder={placeholder}
        className="rounded border border-black/10 px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
      />
      {issues?.length ? <span className="text-xs text-red-700">{issues.join(" · ")}</span> : null}
    </label>
  );
}

type TextAreaProps = {
  label: string;
  name: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  issues?: string[];
};

function TextAreaField({ label, name, required, minLength, maxLength, issues }: TextAreaProps) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-medium">{label}{required && <span className="text-red-700"> *</span>}</span>
      <textarea
        name={name}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        className="min-h-32 rounded border border-black/10 px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
      />
      {issues?.length ? <span className="text-xs text-red-700">{issues.join(" · ")}</span> : null}
    </label>
  );
}

type SelectProps = {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  required?: boolean;
  defaultValue?: string;
  placeholder: string;
};

function SelectField({ label, name, options, required, defaultValue, placeholder }: SelectProps) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-medium">{label}{required && <span className="text-red-700"> *</span>}</span>
      <select
        name={name}
        required={required}
        defaultValue={defaultValue}
        className="rounded border border-black/10 bg-white px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}
