import Link from "next/link";
import type { EmployeeDoc } from "@/lib/hr/queries";
import { daysUntil, expiryState } from "@/lib/hr/queries";
import { docCategories, docCategoryLabels, type DocCategory } from "@/lib/hr/labels";
import { fmtBytes, fmtDate } from "@/lib/work/format";
import { deleteDocument, updateDocument } from "@/app/admin/(app)/employees/hr-actions";
import { AField, AInput, ASelect, ATextarea, Badge, EmptyState, btn } from "./ui";
import { ActionForm, SubmitButton } from "./forms";

function FolderIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px] shrink-0" fill="none" stroke="currentColor" strokeWidth={1.9} aria-hidden>
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </svg>
  );
}

function ExpiryBadge({ validUntil }: { validUntil: string | null }) {
  const state = expiryState(validUntil);
  if (!validUntil || !state) return null;
  const days = daysUntil(validUntil);
  return state === "expired" ? <Badge tone="red">Хугацаа дууссан</Badge> : <Badge tone="amber">{days === 0 ? "Өнөөдөр дуусна" : `${days} хоногийн дараа дуусна`}</Badge>;
}

const typeLabel = (d: EmployeeDoc) => {
  const ext = d.name.includes(".") ? d.name.split(".").pop()!.toUpperCase() : "";
  return ext && ext.length <= 5 ? ext : (d.mimeType?.split("/")[1]?.toUpperCase().slice(0, 5) ?? "ФАЙЛ");
};

/**
 * A personal file's documents grouped into category folders (empty folders are listed too, so it's obvious what's
 * missing). `manage` adds edit/delete for admins; `editId` opens the inline editor for one document.
 */
export function HrDocFolders({ docs, manage = false, employeeId, editId, baseHref }: { docs: EmployeeDoc[]; manage?: boolean; employeeId: string; editId?: string; baseHref: string }) {
  if (docs.length === 0 && !manage) return <EmptyState title="Бичиг баримт алга" description="Таны хувийн хэрэгт одоогоор файл оруулаагүй байна." />;

  const groups = new Map<DocCategory, EmployeeDoc[]>(docCategories.map((c) => [c, []]));
  for (const d of docs) groups.get(d.category)?.push(d);

  return (
    <div className="flex flex-col gap-3">
      {docCategories.map((c) => {
        const items = groups.get(c)!;
        if (!manage && items.length === 0) return null;
        return (
          <details key={c} open={items.length > 0} className="group rounded-[18px] border border-line bg-white">
            <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
              <span className={items.length ? "text-brand" : "text-faint"}>
                <FolderIcon />
              </span>
              <span className={`font-semibold ${items.length ? "text-ink" : "text-muted"}`}>{docCategoryLabels[c]}</span>
              <span className="rounded-full bg-track px-2 py-0.5 text-xs font-bold text-body">{items.length}</span>
              {items.some((d) => expiryState(d.validUntil)) && <span className="size-2 rounded-full bg-amber-500" aria-label="Анхааруулга" />}
              <span aria-hidden className="ml-auto text-muted transition group-open:rotate-90">›</span>
            </summary>

            {items.length === 0 ? (
              <p className="border-t border-line-soft px-4 py-3 text-sm text-faint">Хоосон</p>
            ) : (
              <ul className="divide-y divide-line-soft border-t border-line-soft">
                {items.map((d) =>
                  manage && editId === d.id ? (
                    <li key={d.id} className="px-4 py-4">
                      <ActionForm action={updateDocument} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <input type="hidden" name="id" value={d.id} />
                        <input type="hidden" name="employee_id" value={employeeId} />
                        <AField label="Ангилал">
                          <ASelect name="category" defaultValue={d.category}>
                            {docCategories.map((x) => (
                              <option key={x} value={x}>
                                {docCategoryLabels[x]}
                              </option>
                            ))}
                          </ASelect>
                        </AField>
                        <AField label="Гарчиг" className="lg:col-span-2">
                          <AInput name="title" required maxLength={200} defaultValue={d.title} />
                        </AField>
                        <AField label="Дугаар">
                          <AInput name="doc_number" maxLength={60} defaultValue={d.docNumber ?? ""} />
                        </AField>
                        <AField label="Огноо">
                          <AInput name="issued_on" type="date" defaultValue={d.issuedOn ?? ""} />
                        </AField>
                        <AField label="Хүчинтэй хугацаа">
                          <AInput name="valid_until" type="date" defaultValue={d.validUntil ?? ""} />
                        </AField>
                        <AField label="Тэмдэглэл" className="col-span-full">
                          <ATextarea name="note" rows={2} maxLength={1000} defaultValue={d.note ?? ""} />
                        </AField>
                        <span className="col-span-full flex gap-2">
                          <SubmitButton>Хадгалах</SubmitButton>
                          <Link href={baseHref} className={btn.outline}>
                            Болих
                          </Link>
                        </span>
                      </ActionForm>
                    </li>
                  ) : (
                    <li key={d.id} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
                      <span className="w-12 shrink-0 rounded bg-track px-1.5 py-0.5 text-center text-[11px] font-bold text-body">{typeLabel(d)}</span>
                      <div className="min-w-0 flex-1">
                        <a href={`/admin/hr-files/${d.id}/download`} className="font-semibold text-ink hover:text-brand">
                          {d.docNumber && <span className="text-muted">№ {d.docNumber} · </span>}
                          {d.title}
                        </a>
                        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-0.5 text-xs text-muted">
                          <span>{fmtDate(d.issuedOn)}</span>
                          {d.validUntil && <span>→ {fmtDate(d.validUntil)}</span>}
                          <span>· {fmtBytes(d.sizeBytes)}</span>
                          <ExpiryBadge validUntil={d.validUntil} />
                        </p>
                        {d.note && <p className="pt-1 text-xs text-body">{d.note}</p>}
                      </div>
                      <span className="flex shrink-0 items-center gap-3">
                        <a href={`/admin/hr-files/${d.id}/download`} className={btn.link}>
                          Татах
                        </a>
                        {manage && (
                          <>
                            <Link href={`${baseHref}&edit=${d.id}`} className={btn.link}>
                              Засах
                            </Link>
                            <ActionForm action={deleteDocument} confirm={`"${d.title}" бичиг баримтыг устгах уу?`}>
                              <input type="hidden" name="id" value={d.id} />
                              <input type="hidden" name="employee_id" value={employeeId} />
                              <SubmitButton variant="danger" pendingText="…">
                                Устгах
                              </SubmitButton>
                            </ActionForm>
                          </>
                        )}
                      </span>
                    </li>
                  ),
                )}
              </ul>
            )}
          </details>
        );
      })}
    </div>
  );
}
