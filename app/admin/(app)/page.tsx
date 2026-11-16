import Link from "next/link";
import { requireMe } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getDepartments, getTeam } from "@/lib/work/queries";
import { addDays, fmtDate, fmtHours, isISODate, todayISO } from "@/lib/work/format";
import { roleLabels, taskStatusLabels, taskStatusTone, type TaskStatus } from "@/lib/work/labels";
import { AField, AInput, ASelect, Badge, Card, EmptyState, FilterBar, Notice, PageHeader, Progress, StatCard, Table, Td, Th, btn } from "@/components/admin/ui";

type SP = Promise<{ from?: string; to?: string; dept?: string; emp?: string; denied?: string }>;

type LogRow = { profile_id: string; log_date: string; hours: number };
type TaskRow = { id: string; title: string; assignee_id: string | null; status: TaskStatus; due_date: string | null };

export default async function DashboardPage({ searchParams }: { searchParams: SP }) {
  const me = await requireMe();
  const sp = await searchParams;
  const today = todayISO();
  const from = sp.from && isISODate(sp.from) ? sp.from : addDays(today, -6);
  const to = sp.to && isISODate(sp.to) ? sp.to : today;

  const [team, departments] = await Promise.all([getTeam(me), getDepartments()]);
  const scoped = team.filter((p) => (!sp.dept || p.departmentId === sp.dept) && (!sp.emp || p.id === sp.emp));
  const ids = scoped.map((p) => p.id);

  const supabase = await createClient();
  const [logsRes, todayRes, tasksRes] = await Promise.all([
    ids.length
      ? supabase.from("work_logs").select("profile_id, log_date, hours").in("profile_id", ids).gte("log_date", from).lte("log_date", to).returns<LogRow[]>()
      : Promise.resolve({ data: [] as LogRow[], error: null }),
    ids.length
      ? supabase.from("work_logs").select("id", { count: "exact", head: true }).in("profile_id", ids).eq("log_date", today)
      : Promise.resolve({ count: 0, error: null }),
    ids.length
      ? supabase.from("tasks").select("id, title, assignee_id, status, due_date").in("assignee_id", ids).returns<TaskRow[]>()
      : Promise.resolve({ data: [] as TaskRow[], error: null }),
  ]);
  if (logsRes.error || tasksRes.error || todayRes.error) throw logsRes.error ?? tasksRes.error ?? todayRes.error;

  const logs = logsRes.data ?? [];
  const tasks = tasksRes.data ?? [];
  const isOverdue = (t: TaskRow) => !!t.due_date && t.due_date < today && t.status !== "done";
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  const overdue = tasks.filter(isOverdue);
  const totalHours = logs.reduce((s, l) => s + Number(l.hours), 0);

  const perPerson = scoped.map((p) => {
    const mine = tasks.filter((t) => t.assignee_id === p.id);
    const done = mine.filter((t) => t.status === "done").length;
    return {
      person: p,
      hours: logs.filter((l) => l.profile_id === p.id).reduce((s, l) => s + Number(l.hours), 0),
      logCount: logs.filter((l) => l.profile_id === p.id).length,
      total: mine.length,
      done,
      overdue: mine.filter(isOverdue).length,
      progress: mine.length ? (done / mine.length) * 100 : 0,
    };
  });

  const perDept =
    me.role === "admin"
      ? departments
          .map((d) => {
            const rows = perPerson.filter((r) => r.person.departmentId === d.id);
            const total = rows.reduce((s, r) => s + r.total, 0);
            const done = rows.reduce((s, r) => s + r.done, 0);
            return { name: d.name, people: rows.length, hours: rows.reduce((s, r) => s + r.hours, 0), total, done, progress: total ? (done / total) * 100 : 0 };
          })
          .filter((d) => d.people > 0)
      : [];

  const scopeLabel = me.role === "admin" ? "Байгууллага" : me.role === "manager" ? "Миний баг" : "Миний ажил";

  return (
    <>
      <PageHeader
        title={`Сайн байна уу, ${me.fullName.split(" ")[0]}`}
        description={`${scopeLabel} · ${roleLabels[me.role]} · ${fmtDate(from)} – ${fmtDate(to)}`}
        actions={
          <>
            <Link href="/admin/work-logs" className={btn.primary}>
              + Ажлын бүртгэл
            </Link>
            {me.role !== "employee" && (
              <Link href="/admin/tasks" className={btn.outline}>
                + Даалгавар
              </Link>
            )}
          </>
        }
      />

      {sp.denied && (
        <div className="pb-5">
          <Notice tone="amber">Танд тэр хуудсыг үзэх эрх байхгүй байна.</Notice>
        </div>
      )}

      <FilterBar resetHref="/admin">
        <AField label="Эхлэх огноо">
          <AInput type="date" name="from" defaultValue={from} />
        </AField>
        <AField label="Дуусах огноо">
          <AInput type="date" name="to" defaultValue={to} />
        </AField>
        {me.role === "admin" && (
          <AField label="Хэлтэс">
            <ASelect name="dept" defaultValue={sp.dept ?? ""}>
              <option value="">Бүх хэлтэс</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </ASelect>
          </AField>
        )}
        {me.role !== "employee" && (
          <AField label="Ажилтан">
            <ASelect name="emp" defaultValue={sp.emp ?? ""}>
              <option value="">Бүх ажилтан</option>
              {team.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName}
                </option>
              ))}
            </ASelect>
          </AField>
        )}
      </FilterBar>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Өнөөдрийн бүртгэл" value={todayRes.count ?? 0} hint={fmtDate(today)} />
        <StatCard label="Хийгдэж буй даалгавар" value={inProgress} tone="amber" />
        <StatCard label="Хугацаа хэтэрсэн" value={overdue.length} tone={overdue.length ? "red" : "green"} />
        <StatCard label="Зарцуулсан цаг" value={fmtHours(totalHours)} hint="Сонгосон хугацаанд" tone="green" />
      </div>

      <div className="grid gap-6 pt-6 xl:grid-cols-[1.6fr_1fr]">
        <Card title={me.role === "employee" ? "Миний явц" : "Ажилтны явц"}>
          {perPerson.length === 0 ? (
            <EmptyState title="Ажилтан олдсонгүй" description="Шүүлтүүрээ өөрчилж үзнэ үү." />
          ) : (
            <Table minWidth={640}>
              <thead>
                <tr>
                  <Th>Ажилтан</Th>
                  <Th>Бүртгэл</Th>
                  <Th>Цаг</Th>
                  <Th>Даалгавар</Th>
                  <Th className="w-[200px]">Гүйцэтгэл</Th>
                </tr>
              </thead>
              <tbody>
                {perPerson.map((r) => (
                  <tr key={r.person.id}>
                    <Td>
                      <p className="font-semibold text-ink">{r.person.fullName}</p>
                      <p className="text-xs text-muted">{r.person.departmentName ?? "Хэлтэсгүй"}</p>
                    </Td>
                    <Td>{r.logCount}</Td>
                    <Td>{fmtHours(r.hours)}</Td>
                    <Td>
                      {r.done}/{r.total}
                      {r.overdue > 0 && (
                        <span className="ml-2">
                          <Badge tone="red">{r.overdue} хэтэрсэн</Badge>
                        </span>
                      )}
                    </Td>
                    <Td>
                      <Progress value={r.progress} />
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>

        <Card title="Хугацаа хэтэрсэн даалгавар" actions={<Link href="/admin/tasks?overdue=1" className={btn.link}>Бүгд</Link>}>
          {overdue.length === 0 ? (
            <EmptyState title="Хугацаа хэтэрсэн даалгавар алга" description="Бүх ажил хугацаандаа явж байна." />
          ) : (
            <ul className="flex flex-col divide-y divide-line-soft">
              {overdue.slice(0, 8).map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-3 py-2.5">
                  <Link href={`/admin/tasks/${t.id}`} className="min-w-0 truncate text-sm font-semibold text-ink hover:text-brand">
                    {t.title}
                  </Link>
                  <span className="flex shrink-0 items-center gap-2">
                    <Badge tone={taskStatusTone[t.status]}>{taskStatusLabels[t.status]}</Badge>
                    <span className="text-xs font-semibold text-red-600">{fmtDate(t.due_date)}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {perDept.length > 0 && (
        <div className="pt-6">
          <Card title="Хэлтсийн явц">
            <Table minWidth={560}>
              <thead>
                <tr>
                  <Th>Хэлтэс</Th>
                  <Th>Ажилтан</Th>
                  <Th>Цаг</Th>
                  <Th>Даалгавар</Th>
                  <Th className="w-[200px]">Гүйцэтгэл</Th>
                </tr>
              </thead>
              <tbody>
                {perDept.map((d) => (
                  <tr key={d.name}>
                    <Td className="font-semibold text-ink">{d.name}</Td>
                    <Td>{d.people}</Td>
                    <Td>{fmtHours(d.hours)}</Td>
                    <Td>
                      {d.done}/{d.total}
                    </Td>
                    <Td>
                      <Progress value={d.progress} />
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </div>
      )}
    </>
  );
}
