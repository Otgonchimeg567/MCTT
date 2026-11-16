import Link from "next/link";
import { requireMe } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getNames, getTeam } from "@/lib/work/queries";
import { fmtDate, todayISO } from "@/lib/work/format";
import {
  isTaskStatus,
  priorityLabels,
  priorityTone,
  taskStatusLabels,
  type Priority,
  type TaskStatus,
} from "@/lib/work/labels";
import { AField, AInput, ASelect, Badge, Card, EmptyState, FilterBar, PageHeader, Table, Td, Th } from "@/components/admin/ui";
import { ActionForm, AutoSubmitSelect, SubmitButton } from "@/components/admin/forms";
import { TaskFields } from "@/components/admin/TaskFields";
import { createTask, setTaskStatus } from "./actions";

type SP = Promise<{ q?: string; status?: string; emp?: string; overdue?: string; mine?: string }>;

type Row = {
  id: string;
  title: string;
  description: string | null;
  assignee_id: string | null;
  created_by: string;
  start_date: string | null;
  due_date: string | null;
  status: TaskStatus;
  priority: Priority;
};

const statusOptions = (Object.keys(taskStatusLabels) as TaskStatus[]).map((s) => ({ value: s, label: taskStatusLabels[s] }));
const priorityRank: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

export default async function TasksPage({ searchParams }: { searchParams: SP }) {
  const me = await requireMe();
  const sp = await searchParams;
  const today = todayISO();
  const canCreate = me.role !== "employee";

  const supabase = await createClient();
  let query = supabase
    .from("tasks")
    .select("id, title, description, assignee_id, created_by, start_date, due_date, status, priority")
    .order("due_date", { ascending: true, nullsFirst: false })
    .limit(500);
  if (sp.status && isTaskStatus(sp.status)) query = query.eq("status", sp.status);
  if (sp.emp) query = query.eq("assignee_id", sp.emp);
  if (sp.mine) query = query.eq("assignee_id", me.id);
  if (sp.overdue) query = query.lt("due_date", today).neq("status", "done");
  if (sp.q?.trim()) {
    const term = sp.q.trim().replace(/[%,()]/g, " ");
    query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%`);
  }

  const [{ data, error }, team] = await Promise.all([query.returns<Row[]>(), getTeam(me)]);
  if (error) throw error;
  const rows = [...data].sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority] || (a.due_date ?? "9").localeCompare(b.due_date ?? "9"));
  const names = await getNames(rows.flatMap((r) => [r.assignee_id, r.created_by]));

  const counts = (Object.keys(taskStatusLabels) as TaskStatus[]).map((s) => ({ s, n: data.filter((r) => r.status === s).length }));

  return (
    <>
      <PageHeader
        title="Даалгавар"
        description={me.role === "employee" ? "Танд оноогдсон даалгаврууд" : me.role === "manager" ? "Багийн даалгаврууд" : "Байгууллагын бүх даалгавар"}
      />

      <div className="flex flex-wrap gap-2 pb-4">
        {counts.map(({ s, n }) => (
          <Link
            key={s}
            href={`/admin/tasks?status=${s}`}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${
              sp.status === s ? "border-brand bg-lilac text-brand" : "border-line bg-white text-body hover:border-brand/30"
            }`}
          >
            {taskStatusLabels[s]} <span className="text-muted">{n}</span>
          </Link>
        ))}
        <Link
          href="/admin/tasks?overdue=1"
          className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${
            sp.overdue ? "border-red-300 bg-red-50 text-red-700" : "border-line bg-white text-body hover:border-red-200"
          }`}
        >
          Хугацаа хэтэрсэн
        </Link>
      </div>

      <div className={`grid gap-6 ${canCreate ? "xl:grid-cols-[1fr_380px]" : ""}`}>
        <div className="min-w-0">
          <FilterBar resetHref="/admin/tasks">
            <AField label="Хайх">
              <AInput name="q" defaultValue={sp.q} placeholder="Нэр, тайлбар" />
            </AField>
            <AField label="Төлөв">
              <ASelect name="status" defaultValue={sp.status ?? ""}>
                <option value="">Бүгд</option>
                {statusOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </ASelect>
            </AField>
            {me.role !== "employee" && (
              <AField label="Хариуцагч">
                <ASelect name="emp" defaultValue={sp.emp ?? ""}>
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

          <Card title={`${rows.length} даалгавар`}>
            {rows.length === 0 ? (
              <EmptyState
                title="Даалгавар алга"
                description={canCreate ? "Баруун талын формоор шинэ даалгавар үүсгэнэ үү." : "Танд одоогоор оноогдсон даалгавар байхгүй."}
              />
            ) : (
              <Table minWidth={760}>
                <thead>
                  <tr>
                    <Th>Даалгавар</Th>
                    <Th>Хариуцагч</Th>
                    <Th>Хугацаа</Th>
                    <Th>Эрэмбэ</Th>
                    <Th>Төлөв</Th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((t) => {
                    const overdue = !!t.due_date && t.due_date < today && t.status !== "done";
                    return (
                      <tr key={t.id}>
                        <Td>
                          <Link href={`/admin/tasks/${t.id}`} className="font-semibold text-ink hover:text-brand">
                            {t.title}
                          </Link>
                          {t.description && <p className="line-clamp-1 text-xs text-muted">{t.description}</p>}
                        </Td>
                        <Td className="whitespace-nowrap">{t.assignee_id ? names.get(t.assignee_id) ?? "—" : <span className="text-faint">Оноогоогүй</span>}</Td>
                        <Td className="whitespace-nowrap">
                          <span className={overdue ? "font-semibold text-red-600" : ""}>{fmtDate(t.due_date)}</span>
                          {overdue && <p className="text-xs text-red-600">Хугацаа хэтэрсэн</p>}
                        </Td>
                        <Td>
                          <Badge tone={priorityTone[t.priority]}>{priorityLabels[t.priority]}</Badge>
                        </Td>
                        <Td className="w-[150px]">
                          <AutoSubmitSelect
                            action={setTaskStatus}
                            hidden={{ id: t.id }}
                            name="status"
                            label={`${t.title} — төлөв`}
                            defaultValue={t.status}
                            options={statusOptions}
                          />
                        </Td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            )}
          </Card>
        </div>

        {canCreate && (
          <Card title="Шинэ даалгавар" className="h-fit xl:sticky xl:top-6">
            <ActionForm action={createTask} resetOnSuccess className="grid grid-cols-2 gap-3.5">
              <TaskFields people={team} />
              <div className="col-span-full">
                <SubmitButton>Үүсгэх</SubmitButton>
              </div>
            </ActionForm>
          </Card>
        )}
      </div>
    </>
  );
}
