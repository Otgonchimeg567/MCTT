"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { finishDocUpload, prepareDocUpload } from "@/app/admin/(app)/employees/hr-actions";
import { docCategories, docCategoryHints, docCategoryLabels, type DocCategory } from "@/lib/hr/labels";
import { AField, AInput, ASelect, btn } from "./ui";

const MAX = 50 * 1024 * 1024;

/** PUT the file to the signed Storage URL with progress (same flow as the work-files UploadForm). */
function send(url: string, file: File, onProgress: (pct: number) => void): Promise<boolean> {
  return new Promise((resolve) => {
    const body = new FormData();
    body.append("cacheControl", "3600");
    body.append("", file);
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("x-upsert", "false");
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => resolve(xhr.status >= 200 && xhr.status < 300);
    xhr.onerror = () => resolve(false);
    xhr.onabort = () => resolve(false);
    xhr.send(body);
  });
}

export function HrDocUploadForm({ employeeId, defaultCategory }: { employeeId: string; defaultCategory?: DocCategory }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [category, setCategory] = useState<DocCategory>(defaultCategory ?? "contract");
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const file = fd.get("file");
    if (!(file instanceof File) || file.size === 0) return setMessage({ ok: false, text: "Файлаа сонгоно уу." });
    if (file.size > MAX) return setMessage({ ok: false, text: "Файлын хэмжээ 50 MB-аас ихгүй байна." });
    const s = (k: string) => String(fd.get(k) ?? "").trim() || null;

    setBusy(true);
    setProgress(0);
    setMessage(null);
    try {
      const prep = await prepareDocUpload({
        employeeId,
        name: file.name,
        size: file.size,
        type: file.type,
        category,
        title: s("title") ?? "",
        docNumber: s("doc_number"),
        issuedOn: s("issued_on"),
        validUntil: s("valid_until"),
        note: s("note"),
      });
      if (!prep.ok) return setMessage({ ok: false, text: prep.message });

      const uploaded = await send(prep.signedUrl, file, setProgress);
      await finishDocUpload(prep.id, employeeId, uploaded);
      if (!uploaded) return setMessage({ ok: false, text: "Файл илгээхэд алдаа гарлаа. Интернэт холболтоо шалгаад дахин оролдоно уу." });

      formRef.current?.reset();
      setMessage({ ok: true, text: `"${file.name}" — ${docCategoryLabels[category]} хавтсанд нэмэгдлээ.` });
      router.refresh();
    } catch {
      setMessage({ ok: false, text: "Алдаа гарлаа. Хуудсаа сэргээгээд дахин оролдоно уу." });
    } finally {
      setBusy(false);
    }
  }

  const hasExpiry = category === "contract" || category === "training" || category === "medical" || category === "identity";

  return (
    <form ref={formRef} onSubmit={onSubmit} className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
      <AField label="Ангилал (хавтас)" hint={docCategoryHints[category]}>
        <ASelect name="category" value={category} onChange={(e) => setCategory(e.target.value as DocCategory)} disabled={busy}>
          {docCategories.map((c) => (
            <option key={c} value={c}>
              {docCategoryLabels[c]}
            </option>
          ))}
        </ASelect>
      </AField>
      <AField label="Гарчиг" className="xl:col-span-2">
        <AInput name="title" maxLength={200} placeholder={category === "order" ? "Ажилд томилох тушаал" : "Хоосон бол файлын нэрээр"} disabled={busy} />
      </AField>
      <AField label={category === "order" ? "Тушаалын дугаар" : "Дугаар"}>
        <AInput name="doc_number" maxLength={60} placeholder={category === "order" ? "Б/23" : "HR-2026/041"} disabled={busy} />
      </AField>
      <AField label="Огноо">
        <AInput name="issued_on" type="date" disabled={busy} />
      </AField>
      <AField label="Хүчинтэй хугацаа" hint={hasExpiry ? "Дуусахаас 30 хоногийн өмнө анхааруулна" : "Заавал биш"}>
        <AInput name="valid_until" type="date" disabled={busy} />
      </AField>
      <AField label="Файл" hint="PDF, зураг… дээд тал нь 50 MB" className="sm:col-span-2">
        <input
          type="file"
          name="file"
          required
          disabled={busy}
          className="w-full rounded-xl border border-dashed border-lavender-muted bg-cream/60 px-3 py-2 text-sm text-body file:mr-3 file:rounded-full file:border-0 file:bg-lilac file:px-3 file:py-1 file:text-xs file:font-semibold file:text-brand"
        />
      </AField>
      <div className="flex flex-col justify-end">
        <button type="submit" disabled={busy} aria-busy={busy} className={btn.primary}>
          {busy ? `Байршуулж байна… ${progress}%` : "Хавтсанд нэмэх"}
        </button>
      </div>

      {busy && (
        <div className="col-span-full h-2 overflow-hidden rounded-full bg-track" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full rounded-full bg-gradient-to-r from-brand-blue to-brand-violet transition-[width]" style={{ width: `${progress}%` }} />
        </div>
      )}
      {message && (
        <p role={message.ok ? "status" : "alert"} className={`col-span-full rounded-xl px-3.5 py-2.5 text-sm font-medium ${message.ok ? "bg-mint text-leaf" : "bg-red-50 text-red-700"}`}>
          {message.text}
        </p>
      )}
    </form>
  );
}
