import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = { title: "Нэвтрэх — MCTT ажлын систем", robots: { index: false } };

const errors: Record<string, string> = {
  session: "Нэвтрэх хугацаа дууссан эсвэл эрх идэвхгүй байна. Дахин нэвтэрнэ үү.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; next?: string }> }) {
  const { error, next } = await searchParams;

  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-cream px-4 py-10">
      <div aria-hidden className="absolute -top-32 -right-24 -z-10 size-[420px] rounded-full bg-brand-violet/15 blur-3xl" />
      <div aria-hidden className="absolute -bottom-32 -left-24 -z-10 size-[420px] rounded-full bg-brand-blue/15 blur-3xl" />

      <div className="w-full max-w-[400px] rounded-[28px] border border-line bg-white p-8 shadow-[0_24px_48px_-28px_rgba(20,20,43,0.25)]">
        <Image src="/images/logo.png" alt="Эм Си Ти Ти ХХК" width={59} height={44} className="h-11 w-auto" priority />
        <h1 className="pt-5 font-display text-2xl font-extrabold text-ink">Ажлын системд нэвтрэх</h1>
        <p className="pt-1 text-sm text-muted">Ажлын бүртгэл, даалгавар, файлаа нэг дороос удирдана.</p>
        <LoginForm next={next ?? "/admin"} initialError={error ? errors[error] : undefined} />
      </div>
    </main>
  );
}
