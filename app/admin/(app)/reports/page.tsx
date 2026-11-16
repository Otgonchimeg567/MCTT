import { requireMe } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getDepartments, getTeam } from "@/lib/work/queries";
import { addDays, fmtDate, fmtHours, isISODate, todayISO } from "@/lib/work/format";
import { logStatusLabels, taskStatusLabels, type LogStatus, type TaskStatus } from "@/lib/work/labels";
import { AField, AInput, ASelect, Card, EmptyState, FilterBar, PageHeader, Progress, Table, Td, Th, btn } from "@/components/admin/ui";

type SP = Promise<{ from?: string; to?: string; dept?: string }>;

export default async function ReportsPage({ searchParams }: { searchParams: SP }) {
  const me = await requireMe();
  const sp = await searchParams;
  const today = todayISO();
  const from = sp.from && isISODate(sp.from) ? sp.from : `${today.slice(0, 8)}01`;
  const to = sp.to && isISODate(sp.to) ? sp.to : today;

  const [team, departments] = await Promise.all([getTeam(me), getDepartments()]);
  const scoped = team.filter((p) => !sp.dept || p.departmentId === sp.dept);
  const ids = scoped.map((p) => p.id);

  const supabase = await createClient();
  const [logsRes, tasksRes] = await Promise.all([
    ids.length
      ? supabase.from("work_logs").select("profile_id, log_date, hours, status").in("profile_id", ids).gte("log_date", from).lte("log_date", to)
      : Promise.resolve({ data: [], error: null }),
    ids.length ? supabase.from("tasks").select("assignee_id, status, due_date").in("assignee_id", ids) : Promise.resolve({ data: [], error: null }),
  ]);
  if (logsRes.error || tasksRes.error) throw logsRes.error ?? tasksRes.error;
  const logs = (logsRes.data ?? []) as { profile_id: string; log_date: string; hours: number; status: LogStatus }[];
  const tasks = (tasksRes.data ?? []) as { assignee_id: string; status: TaskStatus; due_date: string | null }[];

  const days = new Set(logs.map((l) => l.log_date)).size;
  const rows = scoped
    .map((p) => {
      const l = logs.filter((x) => x.profile_id === p.id);
      const t = tasks.filter((x) => x.assignee_id === p.id);
      const byStatus = Object.fromEntries((Object.keys(taskStatusLabels) as TaskStatus[]).map((s) => [s, t.filter((x) => x.status === s).length])) as Record<TaskStatus, number>;
      return {
        p,
        hours: l.reduce((s, x) => s + Number(x.hours), 0),
        logDays: new Set(l.map((x) => x.log_date)).size,
        byStatus,
        total: t.length,
        overdue: t.filter((x) => x.due_date && x.due_date < today && x.status !== "done").length,
      };
    })
    .sort((a, b) => b.hours - a.hours);
  const maxHours = Math.max(1, ...rows.map((r) => r.hours));
  const logByStatus = (Object.keys(logStatusLabels) as LogStatus[]).map((s) => ({ s, n: logs.filter((l) => l.status === s).length }));

  const exportHref = `/admin/reports/export?${new URLSearchParams({ from, to, ...(sp.dept ? { dept: sp.dept } : {}) })}`;

  return (
    <>
      <PageHeader
        title="Тайлан"
        description={`${fmtDate(from)} – ${fmtDate(to)} · ${logs.length} бүртгэл · ${days} ажлын өдөр`}
        actions={
          <a href={exportHref} className={btn.outline}>
            CSV татах
          </a>
        }
      />

      <FilterBar resetHref="/admin/reports">
        <AField label="Эхлэх">
          <AInput type="date" name="from" defaultValue={from} />
        </AField>
        <AField label="Дуусах">
          <AInput type="date" name="to" defaultValue={to} />
        </AField>
        {me.role === "admin" && (
          <AField label="Хэлтэс">
            <ASelect name="dept" defaultValue={sp.dept ?? ""}>
              <option value="">Бүгд</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </ASelect>
          </AField>
        )}
      </FilterBar>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card title="Ажилтны цаг ба даалгавар">
          {rows.length === 0 ? (
            <EmptyState title="Мэдээлэл алга" />
          ) : (
            <Table minWidth={720}>
              <thead>
                <tr>
                  <Th>Ажилтан</Th>
                  <Th className="w-[220px]">Цаг</Th>
                  <Th>Өдөр</Th>
                  {(Object.keys(taskStatusLabels) as TaskStatus[]).map((s) => (
                    <Th key={s}>{taskStatusLabels[s]}</Th>
                  ))}
                  <Th>Хэтэрсэн</Th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.p.id}>
                    <Td>
                      <p className="font-semibold text-ink">{r.p.fullName}</p>
                      <p className="text-xs text-muted">{r.p.departmentName ?? "—"}</p>
                    </Td>
                    <Td>
                      <p className="pb-1 text-xs font-semibold text-ink">{fmtHours(r.hours)}</p>
                      <Progress value={(r.hours / maxHours) * 100} />
                    </Td>
                    <Td>{r.logDays}</Td>
                    {(Object.keys(taskStatusLabels) as TaskStatus[]).map((s) => (
                      <Td key={s}>{r.byStatus[s]}</Td>
                    ))}
                    <Td className={r.overdue ? "font-semibold text-red-600" : ""}>{r.overdue}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>

        <Card title="Бүртгэлийн төлөв">
          <ul className="flex flex-col gap-3">
            {logByStatus.map(({ s, n }) => (
              <li key={s}>
                <p className="flex justify-between pb-1 text-sm">
                  <span className="text-body">{logStatusLabels[s]}</span>
                  <span className="font-semibold text-ink">{n}</span>
                </p>
                <Progress value={logs.length ? (n / logs.length) * 100 : 0} />
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
