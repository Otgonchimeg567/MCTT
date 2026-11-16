"use client";

import { useActionState } from "react";
import { signIn } from "@/app/admin/login/actions";
import { PasswordInput } from "./forms";

export function LoginForm({ next, initialError }: { next: string; initialError?: string }) {
  const [state, action, pending] = useActionState(signIn, null);
  const error = state?.message ?? initialError;

  return (
    <form action={action} className="flex flex-col gap-4 pt-6" noValidate={false}>
      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
      <input type="hidden" name="next" value={next} />
      <label className="flex flex-col gap-1.5 text-[13px] font-semibold text-body">
        Имэйл
        <input
          name="email"
          type="email"
          autoComplete="username"
          required
          autoFocus
          placeholder="name@company.mn"
          className="w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[14px] font-normal text-ink outline-none transition placeholder:text-faint focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
        />
      </label>
      <label className="flex flex-col gap-1.5 text-[13px] font-semibold text-body">
        Нууц үг
        <span className="font-normal">
          <PasswordInput name="password" autoComplete="current-password" />
        </span>
      </label>
      <button
        type="submit"
        disabled={pending}
        aria-busy={pending}
        className="mt-2 w-full rounded-full bg-brand-gradient py-3 text-[15px] font-semibold text-white transition hover:brightness-110 active:scale-[0.98] disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
      >
        {pending ? "Нэвтэрч байна…" : "Нэвтрэх"}
      </button>
    </form>
  );
}
