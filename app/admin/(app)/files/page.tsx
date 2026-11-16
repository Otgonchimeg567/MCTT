import Link from "next/link";
import { requireMe } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getNames, getTeam } from "@/lib/work/queries";
import { fmtBytes, fmtDate, fmtDateTime } from "@/lib/work/format";
import { AField, AInput, ASelect, Card, EmptyState, FilterBar, PageHeader, Table, Td, Th, btn } from "@/components/admin/ui";
import { ActionForm, SubmitButton } from "@/components/admin/forms";
import { UploadForm } from "@/components/admin/UploadForm";
import { createFolder, deleteFile, deleteFolder, renameFolder, updateFile } from "./actions";

type SP = Promise<{ q?: string; folder?: string; task?: string; owner?: string; edit?: string }>;

type FileRow = {
  id: string;
  name: string;
  mime_type: string | null;
  size_bytes: number;
  folder_id: string | null;
  owner_id: string;
  task_id: string | null;
  work_log_id: string | null;
  project: string | null;
  created_at: string;
};
type Folder = { id: string; name: string; created_by: string };

function typeLabel(mime: string | null, name: string) {
  const ext = name.includes(".") ? name.split(".").pop()!.toUpperCase() : "";
  if (ext && ext.length <= 5) return ext;
  return mime?.split("/")[1]?.toUpperCase().slice(0, 5) ?? "ФАЙЛ";
}

export default async function FilesPage({ searchParams }: { searchParams: SP }) {
  const me = await requireMe();
  const sp = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("files")
    .select("id, name, mime_type, size_bytes, folder_id, owner_id, task_id, work_log_id, project, created_at")
    .order("created_at", { ascending: false })
    .limit(500);
  if (sp.folder === "none") query = query.is("folder_id", null);
  else if (sp.folder) query = query.eq("folder_id", sp.folder);
  if (sp.task) query = query.eq("task_id", sp.task);
  if (sp.owner) query = query.eq("owner_id", sp.owner);
  if (sp.q?.trim()) {
    const term = sp.q.trim().replace(/[%,()]/g, " ");
    query = query.or(`name.ilike.%${term}%,project.ilike.%${term}%`);
  }

  const [filesRes, foldersRes, tasksRes, logsRes, team] = await Promise.all([
    query.returns<FileRow[]>(),
    supabase.from("folders").select("id, name, created_by").order("name").returns<Folder[]>(),
    supabase.from("tasks").select("id, title").neq("status", "done").order("created_at", { ascending: false }).limit(200),
    supabase.from("work_logs").select("id, title, log_date").eq("profile_id", me.id).order("log_date", { ascending: false }).limit(30),
    getTeam(me),
  ]);
  if (filesRes.error) throw filesRes.error;
  const files = filesRes.data;
  const folders = foldersRes.data ?? [];
  const tasks = tasksRes.data ?? [];
  const logs = logsRes.data ?? [];

  const folderName = new Map(folders.map((f) => [f.id, f.name]));
  const taskIds = [...new Set(files.map((f) => f.task_id).filter(Boolean))] as string[];
  const { data: linkedTasks } = taskIds.length ? await supabase.from("tasks").select("id, title").in("id", taskIds) : { data: [] };
  const taskTitle = new Map((linkedTasks ?? []).map((t) => [t.id as string, t.title as string]));
  const owners = await getNames(files.map((f) => f.owner_id));

  const current = sp.folder && sp.folder !== "none" ? folders.find((f) => f.id === sp.folder) : undefined;
  const canManageFolder = current && (me.role === "admin" || current.created_by === me.id);
  const canManageFile = (f: FileRow) => f.owner_id === me.id || me.role === "admin" || (me.role === "manager" && team.some((p) => p.id === f.owner_id));
  const folderHref = (id?: string) => (id ? `/admin/files?folder=${id}` : "/admin/files");

  return (
    <>
      <PageHeader title="Файл ба хавтас" description="Даалгавар, ажлын бүртгэл, төсөлтэй холбосон файлууд. Та зөвхөн эрх бүхий файлаа харна." />

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="flex flex-col gap-4">
          <Card title="Хавтас">
            <nav className="-mx-2 flex flex-col gap-0.5">
              {[{ id: "", name: "Бүх файл" }, { id: "none", name: "Хавтасгүй" }, ...folders].map((f) => {
                const active = (sp.folder ?? "") === f.id;
                return (
                  <Link
                    key={f.id || "all"}
                    href={folderHref(f.id)}
                    className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium transition ${
                      active ? "bg-lilac font-semibold text-brand" : "text-body hover:bg-cream"
                    }`}
                  >
                    <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
                    </svg>
                    <span className="truncate">{f.name}</span>
                  </Link>
                );
              })}
            </nav>
            <ActionForm action={createFolder} resetOnSuccess className="mt-4 flex flex-col gap-2 border-t border-line-soft pt-4">
              <AInput name="name" required maxLength={120} placeholder="Шинэ хавтасны нэр" aria-label="Шинэ хавтасны нэр" />
              <SubmitButton variant="outline">+ Хавтас</SubmitButton>
            </ActionForm>
          </Card>

          {canManageFolder && current && (
            <Card title="Хавтас засах">
              <ActionForm action={renameFolder} className="flex flex-col gap-2">
                <input type="hidden" name="id" value={current.id} />
                <AInput name="name" required maxLength={120} defaultValue={current.name} aria-label="Хавтасны нэр" />
                <SubmitButton variant="outline">Нэр солих</SubmitButton>
              </ActionForm>
              <ActionForm action={deleteFolder} confirm="Хавтсыг устгах уу? Доторх файлууд устахгүй, хавтасгүй болно." className="mt-3">
                <input type="hidden" name="id" value={current.id} />
                <SubmitButton variant="danger">Хавтас устгах</SubmitButton>
              </ActionForm>
            </Card>
          )}
        </aside>

        <div className="flex min-w-0 flex-col gap-6">
          <Card title="Файл байршуулах">
            <UploadForm
              folders={folders.map((f) => ({ id: f.id, label: f.name }))}
              tasks={tasks.map((t) => ({ id: t.id as string, label: t.title as string }))}
              logs={logs.map((l) => ({ id: l.id as string, label: `${fmtDate(l.log_date as string)} — ${l.title}` }))}
              defaultFolder={current?.id}
              defaultTask={sp.task}
            />
          </Card>

          <div>
            <FilterBar resetHref={folderHref(sp.folder)}>
              {sp.folder && <input type="hidden" name="folder" value={sp.folder} />}
              <AField label="Хайх">
                <AInput name="q" defaultValue={sp.q} placeholder="Файлын нэр, төсөл" />
              </AField>
              {me.role !== "employee" && (
                <AField label="Оруулсан хүн">
                  <ASelect name="owner" defaultValue={sp.owner ?? ""}>
                    <option value="">Бүгд</option>
                    {team.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.fullName}
                      </option>
                    ))}
                  </ASelect>
                </AField>
              )}
            </FilterBar>

            <Card title={`${current ? current.name : sp.folder === "none" ? "Хавтасгүй" : "Бүх файл"} · ${files.length}`}>
              {files.length === 0 ? (
                <EmptyState title="Файл алга" description="Дээрх формоор файл байршуулна уу." />
              ) : (
                <Table minWidth={860}>
                  <thead>
                    <tr>
                      <Th>Нэр</Th>
                      <Th>Төрөл / хэмжээ</Th>
                      <Th>Оруулсан</Th>
                      <Th>Холбоос</Th>
                      <Th />
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((f) => (
                      <tr key={f.id}>
                        <Td>
                          {sp.edit === f.id && canManageFile(f) ? (
                            <ActionForm action={updateFile} className="flex min-w-[260px] flex-col gap-2">
                              <input type="hidden" name="id" value={f.id} />
                              <AInput name="name" required maxLength={255} defaultValue={f.name} aria-label="Файлын нэр" />
                              <ASelect name="folder_id" defaultValue={f.folder_id ?? ""} aria-label="Хавтас">
                                <option value="">Хавтасгүй</option>
                                {folders.map((x) => (
                                  <option key={x.id} value={x.id}>
                                    {x.name}
                                  </option>
                                ))}
                              </ASelect>
                              <AInput name="project" maxLength={120} defaultValue={f.project ?? ""} placeholder="Төсөл" aria-label="Төсөл" />
                              <span className="flex gap-2">
                                <SubmitButton>Хадгалах</SubmitButton>
                                <Link href={folderHref(sp.folder)} className={btn.outline}>
                                  Болих
                                </Link>
                              </span>
                            </ActionForm>
                          ) : (
                            <>
                              <a href={`/admin/files/${f.id}/download`} className="font-semibold text-ink hover:text-brand">
                                {f.name}
                              </a>
                              <p className="text-xs text-muted">{f.folder_id ? folderName.get(f.folder_id) : "Хавтасгүй"}</p>
                            </>
                          )}
                        </Td>
                        <Td className="whitespace-nowrap">
                          <span className="rounded bg-track px-1.5 py-0.5 text-[11px] font-bold text-body">{typeLabel(f.mime_type, f.name)}</span>
                          <span className="ml-2 text-muted">{fmtBytes(Number(f.size_bytes))}</span>
                        </Td>
                        <Td className="whitespace-nowrap">
                          <p>{owners.get(f.owner_id) ?? "—"}</p>
                          <p className="text-xs text-muted">{fmtDateTime(f.created_at)}</p>
                        </Td>
                        <Td className="text-xs">
                          {f.task_id && (
                            <Link href={`/admin/tasks/${f.task_id}`} className="block text-brand hover:underline">
                              Даалгавар: {taskTitle.get(f.task_id) ?? "—"}
                            </Link>
                          )}
                          {f.work_log_id && (
                            <Link href={`/admin/work-logs/${f.work_log_id}`} className="block text-brand hover:underline">
                              Ажлын бүртгэл
                            </Link>
                          )}
                          {f.project && <p className="text-muted">Төсөл: {f.project}</p>}
                          {!f.task_id && !f.work_log_id && !f.project && <span className="text-faint">—</span>}
                        </Td>
                        <Td className="text-right whitespace-nowrap">
                          <span className="inline-flex items-center gap-3">
                            <a href={`/admin/files/${f.id}/download`} className={btn.link}>
                              Татах
                            </a>
                            {canManageFile(f) && sp.edit !== f.id && (
                              <>
                                <Link href={`/admin/files?${new URLSearchParams({ ...(sp.folder ? { folder: sp.folder } : {}), edit: f.id })}`} className={btn.link}>
                                  Засах
                                </Link>
                                <ActionForm action={deleteFile} confirm={`"${f.name}" файлыг устгах уу?`}>
                                  <input type="hidden" name="id" value={f.id} />
                                  <SubmitButton variant="danger" pendingText="…">
                                    Устгах
                                  </SubmitButton>
                                </ActionForm>
                              </>
                            )}
                          </span>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
