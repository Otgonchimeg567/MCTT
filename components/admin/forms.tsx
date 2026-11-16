"use client";

import { useActionState, useEffect, useRef, useState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import type { ActionState } from "@/lib/work/action";
import { btn } from "./ui";

type Action = (state: ActionState, formData: FormData) => Promise<ActionState>;

/** Form bound to a server action: shows the action's success/error message and resets on success if asked. */
export function ActionForm({
  action,
  children,
  className = "",
  resetOnSuccess = false,
  confirm: confirmText,
}: {
  action: Action;
  children: ReactNode;
  className?: string;
  resetOnSuccess?: boolean;
  /** Ask before submitting (e.g. deletes). */
  confirm?: string;
}) {
  const [state, formAction] = useActionState(action, null);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok && resetOnSuccess) ref.current?.reset();
  }, [state, resetOnSuccess]);

  return (
    <form
      ref={ref}
      action={formAction}
      className={className}
      onSubmit={(e) => {
        if (confirmText && !window.confirm(confirmText)) e.preventDefault();
      }}
    >
      {children}
      {state?.message && (
        <p
          role={state.ok ? "status" : "alert"}
          className={`col-span-full mt-1 rounded-xl px-3.5 py-2.5 text-sm font-medium ${state.ok ? "bg-mint text-leaf" : "bg-red-50 text-red-700"}`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}

export function SubmitButton({ children, variant = "primary", pendingText = "Түр хүлээнэ үү…" }: { children: ReactNode; variant?: keyof typeof btn; pendingText?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} aria-busy={pending} className={btn[variant]}>
      {pending ? pendingText : children}
    </button>
  );
}

/** Small form with one select that submits as soon as the value changes (e.g. task status). */
export function AutoSubmitSelect({
  action,
  hidden,
  name,
  defaultValue,
  options,
  label,
}: {
  action: Action;
  hidden: Record<string, string>;
  name: string;
  defaultValue: string;
  options: { value: string; label: string }[];
  label: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  return (
    <form action={formAction} className="flex flex-col gap-1">
      {Object.entries(hidden).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <select
        name={name}
        aria-label={label}
        defaultValue={defaultValue}
        disabled={pending}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded-lg border border-line bg-white px-2 py-1 text-xs font-semibold text-body outline-none focus:border-brand-blue"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {state && !state.ok && <span className="text-xs text-red-600">{state.message}</span>}
    </form>
  );
}

export function PasswordInput({ name, autoComplete, placeholder, minLength }: { name: string; autoComplete: string; placeholder?: string; minLength?: number }) {
  const [shown, setShown] = useState(false);
  return (
    <div className="relative">
      <input
        name={name}
        type={shown ? "text" : "password"}
        autoComplete={autoComplete}
        placeholder={placeholder}
        minLength={minLength}
        required
        className="w-full rounded-xl border border-line bg-white py-2.5 pr-20 pl-3.5 text-[14px] text-ink outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
      />
      <button
        type="button"
        onClick={() => setShown((s) => !s)}
        aria-pressed={shown}
        className="absolute inset-y-0 right-1.5 my-1.5 rounded-lg px-2.5 text-xs font-semibold text-brand hover:bg-lilac"
      >
        {shown ? "Нуух" : "Харах"}
      </button>
    </div>
  );
}
