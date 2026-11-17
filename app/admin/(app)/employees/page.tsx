import Link from "next/link";
import { requireMe, type Me } from "@/lib/auth";
import { getDepartments, getTeam, type Department } from "@/lib/work/queries";
import { roleLabels, roleTone } from "@/lib/work/labels";
import { fmtDate } from "@/lib/work/format";
import { daysUntil, getEmployees, type EmployeeListItem } from "@/lib/hr/queries";
import { employeeStatusLabels, employeeStatusTone, employmentTypeLabels, isEmployeeStatus } from "@/lib/hr/labels";
import { AField, AInput, ASelect, Badge, Card, EmptyState, FilterBar, Notice, PageHeader, Table, Td, Th, btn } from "@/components/admin/ui";
import { ActionForm, SubmitButton } from "@/components/admin/forms";
import { HrEmployeeFields } from "@/components/admin/HrEmployeeFields";
import { createHrEmployee } from "./hr-actions";

type SP = Promise<{ q?: string; dept?: string; status?: string; login?: string; alert?: string }>;

/** Admins: every personal file (HR). Managers: their department's logins, as before (no HR data). */
export default async function EmployeesPage({ searchParams }: { searchParams: SP }) {
  const me = await requireMe(["admin", "manager"]);
  const sp = await searchParams;
  return me.role === "admin" ? <HrList sp={sp} /> : <TeamList me={me} q={sp.q} />;
}

async function HrList({ sp }: { sp: Awaited<SP> }) {
  const [allRes, departments] = await Promise.all([getEmployees().then((v) => ({ v }), (e: unknown) => ({ e })), getDepartments()]);
  if ("e" in allRes) {
    const missing = /PGRST205|employees|schema cache/i.test(String((allRes.e as { code?: string; message?: string })?.code ?? "") + String((allRes.e as { message?: string })?.message ?? ""));
    if (!missing) throw allRes.e;
    return (
      <>
        <PageHeader title="Ажилтнууд" />
        <Notice tone="amber">
          Хувийн хэргийн хүснэгтүүд өгөгдлийн санд хараахан үүсээгүй байна. Supabase Dashboard → SQL Editor дээр
          <code className="mx-1 font-mono">supabase/migrations/20261117090000_hr_records.sql</code>-г ажиллуулна уу.
        </Notice>
      </>
    );
  }
  const all = allRes.v;
  const q = (sp.q ?? "").trim().toLowerCase();
  const rows = all.filter(
    (e) =>
      (!q || [e.fullName, e.position ?? "", e.phone ?? "", e.registerNo ?? ""].some((v) => v.toLowerCase().includes(q))) &&
      (!sp.dept || e.departmentId === sp.dept) &&
      (!sp.status || !isEmployeeStatus(sp.status) || e.status === sp.status) &&
      (!sp.login || (sp.login === "yes" ? !!e.profileId : !e.profileId)) &&
      (!sp.alert || !!e.nextExpiry),
  );
  const active = all.filter((e) => e.status !== "left").length;
  const withAlerts = all.filter((e) => e.nextExpiry && e.status !== "left").length;

  return (
    <>
      <PageHeader
        title="Ажилтнууд"
        description={`${active} ажиллаж байгаа · нийт ${all.length} хувийн хэрэг${withAlerts ? ` · ${withAlerts} анхааруулгатай` : ""}`}
      />

      <FilterBar resetHref="/admin/employees">
        <AField label="Хайх">
          <AInput name="q" defaultValue={sp.q} placeholder="Нэр, тушаал, утас, РД…" />
        </AField>
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
        <AField label="Төлөв">
          <ASelect name="status" defaultValue={sp.status ?? ""}>
            <option value="">Бүгд</option>
            {Object.entries(employeeStatusLabels).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </ASelect>
        </AField>
        <AField label="Нэвтрэх эрх">
          <ASelect name="login" defaultValue={sp.login ?? ""}>
            <option value="">Бүгд</option>
            <option value="yes">Байгаа</option>
            <option value="no">Байхгүй</option>
          </ASelect>
        </AField>
        <AField label="Анхааруулга">
          <ASelect name="alert" defaultValue={sp.alert ?? ""}>
            <option value="">Бүгд</option>
            <option value="1">Гэрээ / гэрчилгээ дуусах</option>
          </ASelect>
        </AField>
      </FilterBar>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card title={`Хувийн хэрэг (${rows.length})`}>
          {rows.length === 0 ? (
            <EmptyState title="Ажилтан олдсонгүй" description={all.length ? "Шүүлтүүрээ өөрчилж үзнэ үү." : "Баруун талын формоор эхний ажилтнаа нэмнэ үү."} />
          ) : (
            <Table minWidth={820}>
              <thead>
                <tr>
                  <Th>Нэр</Th>
                  <Th>Хэлтэс / албан тушаал</Th>
                  <Th>Ажилд орсон</Th>
                  <Th>Бичиг баримт</Th>
                  <Th>Төлөв</Th>
                  <Th />
                </tr>
              </thead>
              <tbody>
                {rows.map((e) => (
                  <HrRow key={e.id} e={e} />
                ))}
              </tbody>
            </Table>
          )}
        </Card>

        <Card title="Ажилтан нэмэх">
          <p className="pb-3 text-sm text-muted">Хувийн хэрэг нээнэ. Нэвтрэх эрх хэрэгтэй бол дараа нь ажилтны хавтаснаас үүсгэнэ.</p>
          <NewEmployeeForm departments={departments} />
        </Card>
      </div>
    </>
  );
}

function HrRow({ e }: { e: EmployeeListItem }) {
  const days = e.nextExpiry ? daysUntil(e.nextExpiry) : null;
  return (
    <tr className={e.status === "left" ? "opacity-60" : ""}>
      <Td>
        <Link href={`/admin/employees/${e.id}`} className="font-semibold text-ink hover:text-brand">
          {e.fullName}
        </Link>
        <p className="text-xs text-muted">{e.profileId ? "✓ Нэвтрэх эрхтэй" : "Нэвтрэх эрхгүй"}</p>
      </Td>
      <Td>
        <p>{e.departmentName ?? "—"}</p>
        <p className="text-xs text-muted">{e.position ?? ""}</p>
      </Td>
      <Td className="whitespace-nowrap">
        <p>{fmtDate(e.hireDate)}</p>
        <p className="text-xs text-muted">{employmentTypeLabels[e.employmentType]}</p>
      </Td>
      <Td className="whitespace-nowrap">
        <span className="font-semibold text-ink">{e.docCount}</span> <span className="text-muted">файл</span>
        {days !== null && (
          <p className="pt-1">
            <Badge tone={days < 0 ? "red" : "amber"}>{days < 0 ? "Хугацаа дууссан" : `${days} хоногт дуусна`}</Badge>
          </p>
        )}
      </Td>
      <Td>
        <Badge tone={employeeStatusTone[e.status]}>{employeeStatusLabels[e.status]}</Badge>
      </Td>
      <Td className="text-right whitespace-nowrap">
        <Link href={`/admin/employees/${e.id}?tab=docs`} className={btn.link}>
          Хавтас →
        </Link>
      </Td>
    </tr>
  );
}

function NewEmployeeForm({ departments }: { departments: Department[] }) {
  return (
    <ActionForm action={createHrEmployee} className="flex flex-col gap-3.5">
      <HrEmployeeFields departments={departments} compact />
      <div>
        <SubmitButton>Хувийн хэрэг нээх</SubmitButton>
      </div>
    </ActionForm>
  );
}

/** Manager view: unchanged department team list (logins only, no HR documents). */
async function TeamList({ me, q: rawQ }: { me: Me; q?: string }) {
  const team = await getTeam(me);
  const q = (rawQ ?? "").trim().toLowerCase();
  const rows = team.filter((p) => !q || [p.fullName, p.email, p.phone ?? "", p.position ?? ""].some((v) => v.toLowerCase().includes(q)));
  return (
    <>
      <PageHeader title="Ажилтнууд" description={`${me.departmentName ?? "Таны"} багийн ${team.length} ажилтан`} />
      <FilterBar resetHref="/admin/employees">
        <AField label="Хайх">
          <AInput name="q" defaultValue={rawQ} placeholder="Нэр, имэйл, утас…" />
        </AField>
      </FilterBar>
      <Card title={`Жагсаалт (${rows.length})`}>
        {rows.length === 0 ? (
          <EmptyState title="Ажилтан олдсонгүй" />
        ) : (
          <Table minWidth={640}>
            <thead>
              <tr>
                <Th>Нэр</Th>
                <Th>Утас</Th>
                <Th>Албан тушаал</Th>
                <Th>Эрх</Th>
                <Th>Төлөв</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className={p.isActive ? "" : "opacity-60"}>
                  <Td>
                    <p className="font-semibold text-ink">{p.fullName}</p>
                    <p className="text-xs text-muted">{p.email}</p>
                  </Td>
                  <Td>{p.phone ? <a href={`tel:${p.phone}`} className="text-brand">{p.phone}</a> : "—"}</Td>
                  <Td>{p.position ?? "—"}</Td>
                  <Td>
                    <Badge tone={roleTone[p.role]}>{roleLabels[p.role]}</Badge>
                  </Td>
                  <Td>{p.isActive ? <Badge tone="green">Идэвхтэй</Badge> : <Badge>Идэвхгүй</Badge>}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </>
  );
}
