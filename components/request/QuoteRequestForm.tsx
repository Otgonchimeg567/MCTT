"use client";

import { useState, type FormEvent } from "react";
import type { Product } from "@/lib/types";
import { validateQuoteRequest, type FieldErrors } from "@/lib/validation";
import { Field, fieldErrorId } from "@/components/ui/Field";
import { Input, Select, Textarea } from "@/components/ui/Input";

type Status = { kind: "idle" } | { kind: "submitting" } | { kind: "success" } | { kind: "error"; message: string };

export function QuoteRequestForm({
  products,
  initialProductId,
  onDone,
}: {
  products: Product[];
  /** Product to preselect, e.g. when opened from that product's card. */
  initialProductId?: string;
  onDone: () => void;
}) {
  const defaultProductId =
    products.find((p) => p.id === initialProductId)?.id ?? products.find((p) => p.highlighted)?.id ?? products[0]?.id;
  const [requestType, setRequestType] = useState<"buy" | "supply">("buy");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  /** Marks a control invalid and links it to its error message for screen readers. */
  const a11y = (name: keyof FieldErrors) => ({
    invalid: Boolean(errors[name]),
    "aria-describedby": errors[name] ? fieldErrorId(name) : undefined,
  });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const payload = { ...Object.fromEntries(new FormData(form)), requestType };

    const check = validateQuoteRequest(payload);
    if (!check.ok) {
      setErrors(check.errors);
      return;
    }

    setErrors({});
    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(check.data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrors(json.fields ?? {});
        setStatus({ kind: "error", message: json.error ?? "Алдаа гарлаа." });
        return;
      }
      form.reset();
      setStatus({ kind: "success" });
    } catch {
      setStatus({ kind: "error", message: "Сүлжээний алдаа. Дахин оролдоно уу." });
    }
  }

  if (status.kind === "success") {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <span className="flex size-14 items-center justify-center rounded-full bg-mint text-2xl text-leaf">✓</span>
        <h3 className="font-display text-2xl font-extrabold text-ink">Хүсэлт хүлээн авлаа</h3>
        <p className="max-w-[360px] text-muted">Манай менежер тантай удахгүй холбогдоно. Баярлалаа!</p>
        <button
          type="button"
          onClick={() => {
            setStatus({ kind: "idle" });
            onDone();
          }}
          className="mt-2 rounded-full bg-brand-gradient px-[22px] py-3 text-[15px] font-semibold text-white"
        >
          Хаах
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div role="radiogroup" aria-label="Хүсэлтийн төрөл" className="grid grid-cols-2 gap-1 rounded-full bg-sand p-1">
        {(
          [
            ["buy", "Баяжмал худалдан авах"],
            ["supply", "Хүдэр нийлүүлэх"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={requestType === value}
            onClick={() => setRequestType(value)}
            className={`rounded-full px-3 py-2.5 text-sm font-semibold transition ${
              requestType === value ? "bg-white text-brand shadow-sm" : "text-muted hover:text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {requestType === "buy" && (
        <Field label="Бүтээгдэхүүн" name="productId" error={errors.productId}>
          <Select name="productId" defaultValue={defaultProductId} {...a11y("productId")}>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.grade} — {p.purityLabel} CaF₂
              </option>
            ))}
          </Select>
        </Field>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Байгууллага" name="company" error={errors.company}>
          <Input name="company" autoComplete="organization" {...a11y("company")} />
        </Field>
        <Field label="Холбогдох хүн" name="contactName" error={errors.contactName}>
          <Input name="contactName" autoComplete="name" {...a11y("contactName")} />
        </Field>
        <Field label="Утас" name="phone" error={errors.phone}>
          <Input name="phone" type="tel" autoComplete="tel" placeholder="9999 8208" {...a11y("phone")} />
        </Field>
        <Field label="Имэйл" name="email" error={errors.email} optional>
          <Input name="email" type="email" autoComplete="email" {...a11y("email")} />
        </Field>
      </div>

      <Field
        label={requestType === "buy" ? "Хэмжээ (тн)" : "Нийлүүлэх хүдрийн хэмжээ (тн)"}
        name="quantityTons"
        error={errors.quantityTons}
        optional
      >
        <Input name="quantityTons" type="number" min="0" step="any" inputMode="decimal" {...a11y("quantityTons")} />
      </Field>

      <Field label="Нэмэлт мэдээлэл" name="message" error={errors.message} optional>
        <Textarea name="message" rows={3} {...a11y("message")} />
      </Field>

      {status.kind === "error" && (
        <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {status.message}
        </p>
      )}

      <button
        type="submit"
        disabled={status.kind === "submitting"}
        className="mt-1 rounded-full bg-brand-gradient px-[22px] py-3 text-[15px] font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
      >
        {status.kind === "submitting" ? "Илгээж байна…" : "Хүсэлт илгээх"}
      </button>
    </form>
  );
}
