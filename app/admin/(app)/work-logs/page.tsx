import Link from "next/link";
import { requireMe } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getTeam } from "@/lib/work/queries";
import { addDays, fmtDate, fmtHours, isISODate, todayISO } from "@/lib/work/format";
import { isLogStatus, logStatusLabels, logStatusTone, type LogStatus } from "@/lib/work/labels";
import { AField, AInput, ASelect, Badge, Card, EmptyState, FilterBar, PageHeader, Table, Td, Th, btn } from "@/components/admin/ui";
import { ActionForm, SubmitButton } from "@/components/admin/forms";
import { WorkLogFields } from "@/components/admin/WorkLogFields";
import { createWorkLog, deleteWorkLog } from "./actions";

type SP = Promise<{ from?: string; to?: string; emp?: string; status?: string; q?: string }>;

type Row = {
  id: string;
  profile_id: string;
  log_date: string;
  title: string;
  description: string | null;
  hours: number;
  status: LogStatus;
  note: string | null;
};

export default async function WorkLogsPage({ searchParams }: { searchParams: SP }) {
  const me = await requireMe();
  const sp = await searchParams;
  const today = todayISO();
  const from = sp.from && isISODate(sp.from) ? sp.from : addDays(today, -13);
  const to = sp.to && isISODate(sp.to) ? sp.to : today;

  const team = await getTeam(me);
  const names = new Map(team.map((p) => [p.id, p.fullName]));

  const supabase = await createClient();
  let query = supabase
    .from("work_logs")
    .select("id, profile_id, log_date, title, description, hours, status, note")
    .gte("log_date", from)
    .lte("log_date", to)
    .order("log_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(500);
  if (sp.emp) query = query.eq("profile_id", sp.emp);
  if (sp.status && isLogStatus(sp.status)) query = query.eq("status", sp.status);
  if (sp.q?.trim()) {
    const term = sp.q.trim().replace(/[%,()]/g, " ");
    query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%`);
  }
  const { data, error } = await query.returns<Row[]>();
  if (error) throw error;

  const total = data.reduce((s, r) => s + Number(r.hours), 0);
  const canEdit = (r: Row) => r.profile_id === me.id || me.role === "admin";

  return (
    <>
      <PageHeader
        title="Ажлын бүртгэл"
        description={me.role === "employee" ? "Өдөр бүрийн хийсэн ажлаа бүртгэнэ." : me.role === "manager" ? "Багийн ажлын бүртгэл" : "Бүх ажилтны ажлын бүртгэл"}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="min-w-0">
          <FilterBar resetHref="/admin/work-logs">
            <AField label="Эхлэх">
              <AInput type="date" name="from" defaultValue={from} />
            </AField>
            <AField label="Дуусах">
              <AInput type="date" name="to" defaultValue={to} />
            </AField>
            {me.role !== "employee" && (
              <AField label="Ажилтан">
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
            <AField label="Төлөв">
              <ASelect name="status" defaultValue={sp.status ?? ""}>
                <option value="">Бүгд</option>
                {Object.entries(logStatusLabels).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </ASelect>
            </AField>
            <AField label="Хайх">
              <AInput name="q" defaultValue={sp.q} placeholder="Ажлын нэр, тайлбар" />
            </AField>
          </FilterBar>

          <Card title={`${data.length} бүртгэл · ${fmtHours(total)}`}>
            {data.length === 0 ? (
              <EmptyState title="Бүртгэл алга" description="Энэ хугацаанд бүртгэл олдсонгүй. Шүүлтүүрээ өөрчлөх эсвэл шинэ бүртгэл нэмнэ үү." />
            ) : (
              <Table minWidth={760}>
                <thead>
                  <tr>
                    <Th>Огноо</Th>
                    {me.role !== "employee" && <Th>Ажилтан</Th>}
                    <Th>Ажил</Th>
                    <Th>Цаг</Th>
                    <Th>Төлөв</Th>
                    <Th />
                  </tr>
                </thead>
                <tbody>
                  {data.map((r) => (
                    <tr key={r.id}>
                      <Td className="whitespace-nowrap">{fmtDate(r.log_date)}</Td>
                      {me.role !== "employee" && <Td className="whitespace-nowrap">{names.get(r.profile_id) ?? "—"}</Td>}
                      <Td>
                        <p className="font-semibold text-ink">{r.title}</p>
                        {r.description && <p className="line-clamp-2 text-xs text-muted">{r.description}</p>}
                        {r.note && <p className="pt-0.5 text-xs text-faint">Тайлбар: {r.note}</p>}
                      </Td>
                      <Td className="whitespace-nowrap">{fmtHours(Number(r.hours))}</Td>
                      <Td>
                        <Badge tone={logStatusTone[r.status]}>{logStatusLabels[r.status]}</Badge>
                      </Td>
                      <Td className="text-right whitespace-nowrap">
                        {canEdit(r) && (
                          <span className="inline-flex items-center gap-3">
                            <Link href={`/admin/work-logs/${r.id}`} className={btn.link}>
                              Засах
                            </Link>
                            <ActionForm action={deleteWorkLog} confirm="Энэ бүртгэлийг устгах уу?">
                              <input type="hidden" name="id" value={r.id} />
                              <SubmitButton variant="danger" pendingText="…">
                                Устгах
                              </SubmitButton>
                            </ActionForm>
                          </span>
                        )}
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        </div>

        <Card title="Шинэ бүртгэл" className="h-fit xl:sticky xl:top-6">
          <ActionForm action={createWorkLog} resetOnSuccess className="grid grid-cols-2 gap-3.5">
            <WorkLogFields today={today} />
            <div className="col-span-full">
              <SubmitButton>Бүртгэх</SubmitButton>
            </div>
          </ActionForm>
        </Card>
      </div>
    </>
  );
}
