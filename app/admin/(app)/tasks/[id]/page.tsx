import Link from "next/link";
import { notFound } from "next/navigation";
import { requireMe } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getNames, getTeam } from "@/lib/work/queries";
import { fmtBytes, fmtDate, fmtDateTime } from "@/lib/work/format";
import { priorityLabels, priorityTone, taskStatusLabels, taskStatusTone, type TaskStatus } from "@/lib/work/labels";
import { Badge, Card, EmptyState, PageHeader, btn } from "@/components/admin/ui";
import { ActionForm, AutoSubmitSelect, SubmitButton } from "@/components/admin/forms";
import { TaskFields, type TaskValues } from "@/components/admin/TaskFields";
import { deleteTask, setTaskStatus, updateTask } from "../actions";

export default async function TaskPage({ params }: { params: Promise<{ id: string }> }) {
  const me = await requireMe();
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: task }, { data: files }] = await Promise.all([
    supabase
      .from("tasks")
      .select("id, title, description, assignee_id, created_by, start_date, due_date, status, priority, created_at")
      .eq("id", id)
      .maybeSingle<TaskValues & { id: string; created_by: string; created_at: string }>(),
    supabase.from("files").select("id, name, size_bytes, created_at").eq("task_id", id).order("created_at", { ascending: false }),
  ]);
  if (!task) notFound();

  const canEditAll = me.role === "admin" || me.role === "manager";
  const [team, names] = await Promise.all([canEditAll ? getTeam(me) : Promise.resolve([]), getNames([task.assignee_id, task.created_by])]);

  return (
    <>
      <PageHeader
        title={task.title}
        description={`Үүсгэсэн: ${names.get(task.created_by) ?? "—"} · ${fmtDateTime(task.created_at)}`}
        actions={
          <Link href="/admin/tasks" className={btn.outline}>
            ← Жагсаалт
          </Link>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        {canEditAll ? (
          <Card title="Даалгавар засах">
            <ActionForm action={updateTask} className="grid gap-3.5 sm:grid-cols-2">
              <input type="hidden" name="id" value={task.id} />
              <TaskFields people={team} task={task} />
              <div className="col-span-full">
                <SubmitButton>Хадгалах</SubmitButton>
              </div>
            </ActionForm>
          </Card>
        ) : (
          <Card title="Дэлгэрэнгүй">
            <dl className="grid gap-4 text-sm sm:grid-cols-2">
              <div className="col-span-full">
                <dt className="text-muted">Тайлбар</dt>
                <dd className="pt-1 whitespace-pre-wrap text-ink">{task.description || "—"}</dd>
              </div>
              <div>
                <dt className="text-muted">Хариуцагч</dt>
                <dd className="pt-1 font-semibold text-ink">{task.assignee_id ? names.get(task.assignee_id) ?? "—" : "Оноогоогүй"}</dd>
              </div>
              <div>
                <dt className="text-muted">Эрэмбэ</dt>
                <dd className="pt-1">
                  <Badge tone={priorityTone[task.priority]}>{priorityLabels[task.priority]}</Badge>
                </dd>
              </div>
              <div>
                <dt className="text-muted">Эхлэх</dt>
                <dd className="pt-1 text-ink">{fmtDate(task.start_date)}</dd>
              </div>
              <div>
                <dt className="text-muted">Дуусах</dt>
                <dd className="pt-1 text-ink">{fmtDate(task.due_date)}</dd>
              </div>
            </dl>
          </Card>
        )}

        <div className="flex flex-col gap-6">
          <Card title="Явц" actions={<Badge tone={taskStatusTone[task.status]}>{taskStatusLabels[task.status]}</Badge>}>
            <p className="pb-2 text-sm text-muted">Төлөвийг сонгоход шууд хадгалагдана.</p>
            <AutoSubmitSelect
              action={setTaskStatus}
              hidden={{ id: task.id }}
              name="status"
              label="Төлөв"
              defaultValue={task.status}
              options={(Object.keys(taskStatusLabels) as TaskStatus[]).map((s) => ({ value: s, label: taskStatusLabels[s] }))}
            />
          </Card>

          <Card title="Холбоотой файл" actions={<Link href={`/admin/files?task=${task.id}`} className={btn.link}>+ Файл</Link>}>
            {!files?.length ? (
              <EmptyState title="Файл алга" />
            ) : (
              <ul className="flex flex-col divide-y divide-line-soft">
                {files.map((f) => (
                  <li key={f.id} className="flex items-center justify-between gap-3 py-2">
                    <a href={`/admin/files/${f.id}/download`} className="min-w-0 truncate text-sm font-semibold text-brand hover:underline">
                      {f.name}
                    </a>
                    <span className="shrink-0 text-xs text-muted">{fmtBytes(Number(f.size_bytes))}</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {canEditAll && (
            <ActionForm action={deleteTask} confirm="Энэ даалгаврыг устгах уу? Холбоотой файлууд устахгүй.">
              <input type="hidden" name="id" value={task.id} />
              <SubmitButton variant="danger">Даалгавар устгах</SubmitButton>
            </ActionForm>
          )}
        </div>
      </div>
    </>
  );
}
