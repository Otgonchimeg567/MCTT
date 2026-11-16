"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { finishUpload, prepareUpload } from "@/app/admin/(app)/files/actions";
import { AField, AInput, ASelect, btn } from "./ui";

type Option = { id: string; label: string };

const MAX = 50 * 1024 * 1024;

/** PUT the file to the signed Storage URL with progress (fetch has no upload progress). */
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

export function UploadForm({
  folders,
  tasks,
  logs,
  defaultFolder,
  defaultTask,
}: {
  folders: Option[];
  tasks: Option[];
  logs: Option[];
  defaultFolder?: string;
  defaultTask?: string;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const file = fd.get("file");
    if (!(file instanceof File) || file.size === 0) return setMessage({ ok: false, text: "Файлаа сонгоно уу." });
    if (file.size > MAX) return setMessage({ ok: false, text: "Файлын хэмжээ 50 MB-аас ихгүй байна." });

    setBusy(true);
    setProgress(0);
    setMessage(null);
    try {
      const prep = await prepareUpload({
        name: file.name,
        size: file.size,
        type: file.type,
        folderId: String(fd.get("folder_id") || "") || null,
        taskId: String(fd.get("task_id") || "") || null,
        workLogId: String(fd.get("work_log_id") || "") || null,
        project: String(fd.get("project") || "") || null,
      });
      if (!prep.ok) return setMessage({ ok: false, text: prep.message });

      const uploaded = await send(prep.signedUrl, file, setProgress);
      await finishUpload(prep.id, uploaded);
      if (!uploaded) return setMessage({ ok: false, text: "Файл илгээхэд алдаа гарлаа. Интернэт холболтоо шалгаад дахин оролдоно уу." });

      formRef.current?.reset();
      setMessage({ ok: true, text: `"${file.name}" байршлаа.` });
      router.refresh();
    } catch {
      setMessage({ ok: false, text: "Алдаа гарлаа. Хуудсаа сэргээгээд дахин оролдоно уу." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
      <AField label="Файл" hint="Дээд тал нь 50 MB" className="sm:col-span-2 xl:col-span-1">
        <input
          type="file"
          name="file"
          required
          disabled={busy}
          className="w-full rounded-xl border border-dashed border-lavender-muted bg-cream/60 px-3 py-2 text-sm text-body file:mr-3 file:rounded-full file:border-0 file:bg-lilac file:px-3 file:py-1 file:text-xs file:font-semibold file:text-brand"
        />
      </AField>
      <AField label="Хавтас">
        <ASelect name="folder_id" defaultValue={defaultFolder ?? ""} disabled={busy}>
          <option value="">Хавтасгүй</option>
          {folders.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </ASelect>
      </AField>
      <AField label="Төсөл">
        <AInput name="project" maxLength={120} placeholder="Заавал биш" disabled={busy} />
      </AField>
      <AField label="Даалгавар">
        <ASelect name="task_id" defaultValue={defaultTask ?? ""} disabled={busy}>
          <option value="">Холбохгүй</option>
          {tasks.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </ASelect>
      </AField>
      <AField label="Ажлын бүртгэл">
        <ASelect name="work_log_id" defaultValue="" disabled={busy}>
          <option value="">Холбохгүй</option>
          {logs.map((l) => (
            <option key={l.id} value={l.id}>
              {l.label}
            </option>
          ))}
        </ASelect>
      </AField>
      <div className="flex flex-col justify-end gap-2">
        <button type="submit" disabled={busy} aria-busy={busy} className={btn.primary}>
          {busy ? `Байршуулж байна… ${progress}%` : "Байршуулах"}
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
