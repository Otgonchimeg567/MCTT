"use client";

export default function AdminError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto max-w-[520px] rounded-[22px] border border-line bg-white p-8 text-center">
      <p className="font-display text-xl font-extrabold text-ink">Мэдээлэл ачаалахад алдаа гарлаа</p>
      <p className="pt-2 text-sm text-muted">Интернэт холболтоо шалгаад дахин оролдоно уу. Асуудал давтагдвал админд хандана уу.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-5 rounded-full bg-brand-gradient px-5 py-2 text-sm font-semibold text-white transition hover:brightness-110"
      >
        Дахин оролдох
      </button>
    </div>
  );
}
