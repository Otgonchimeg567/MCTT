import Link from "next/link";
import { requireMe } from "@/lib/auth";
import { getDepartments, getTeam } from "@/lib/work/queries";
import { roleLabels, roleTone, isRole } from "@/lib/work/labels";
import { AField, AInput, ASelect, Badge, Card, EmptyState, FilterBar, PageHeader, Table, Td, Th, btn } from "@/components/admin/ui";
import { ActionForm, PasswordInput, SubmitButton } from "@/components/admin/forms";
import { EmployeeFields } from "@/components/admin/EmployeeFields";
import { createEmployee } from "./actions";

type SP = Promise<{ q?: string; dept?: string; role?: string; status?: string }>;

export default async function EmployeesPage({ searchParams }: { searchParams: SP }) {
  const me = await requireMe(["admin", "manager"]);
  const sp = await searchParams;
  const [team, departments] = await Promise.all([getTeam(me), getDepartments()]);

  const q = (sp.q ?? "").trim().toLowerCase();
  const rows = team.filter(
    (p) =>
      (!q || [p.fullName, p.email, p.phone ?? "", p.position ?? ""].some((v) => v.toLowerCase().includes(q))) &&
      (!sp.dept || p.departmentId === sp.dept) &&
      (!sp.role || !isRole(sp.role) || p.role === sp.role) &&
      (!sp.status || (sp.status === "active" ? p.isActive : !p.isActive)),
  );
  const isAdmin = me.role === "admin";

  return (
    <>
      <PageHeader
        title="Ажилтнууд"
        description={isAdmin ? `Байгууллагын нийт ${team.length} ажилтан` : `${me.departmentName ?? "Таны"} багийн ${team.length} ажилтан`}
      />

      <FilterBar resetHref="/admin/employees">
        <AField label="Хайх">
          <AInput name="q" defaultValue={sp.q} placeholder="Нэр, имэйл, утас…" />
        </AField>
        {isAdmin && (
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
        <AField label="Эрх">
          <ASelect name="role" defaultValue={sp.role ?? ""}>
            <option value="">Бүгд</option>
            {Object.entries(roleLabels).map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </ASelect>
        </AField>
        <AField label="Төлөв">
          <ASelect name="status" defaultValue={sp.status ?? ""}>
            <option value="">Бүгд</option>
            <option value="active">Идэвхтэй</option>
            <option value="inactive">Идэвхгүй</option>
          </ASelect>
        </AField>
      </FilterBar>

      <div className={`grid gap-6 ${isAdmin ? "xl:grid-cols-[1fr_360px]" : ""}`}>
        <Card title={`Жагсаалт (${rows.length})`}>
          {rows.length === 0 ? (
            <EmptyState title="Ажилтан олдсонгүй" description={team.length ? "Шүүлтүүрээ өөрчилж үзнэ үү." : "Баруун талын формоор эхний ажилтнаа нэмнэ үү."} />
          ) : (
            <Table minWidth={720}>
              <thead>
                <tr>
                  <Th>Нэр</Th>
                  <Th>Утас</Th>
                  <Th>Хэлтэс / албан тушаал</Th>
                  <Th>Эрх</Th>
                  <Th>Төлөв</Th>
                  {isAdmin && <Th />}
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
                    <Td>
                      <p>{p.departmentName ?? "—"}</p>
                      <p className="text-xs text-muted">{p.position ?? ""}</p>
                    </Td>
                    <Td>
                      <Badge tone={roleTone[p.role]}>{roleLabels[p.role]}</Badge>
                    </Td>
                    <Td>{p.isActive ? <Badge tone="green">Идэвхтэй</Badge> : <Badge>Идэвхгүй</Badge>}</Td>
                    {isAdmin && (
                      <Td className="text-right">
                        <Link href={`/admin/employees/${p.id}`} className={btn.link}>
                          Засах
                        </Link>
                      </Td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>

        {isAdmin && (
          <Card title="Ажилтан нэмэх">
            <ActionForm action={createEmployee} resetOnSuccess className="flex flex-col gap-3.5">
              <EmployeeFields departments={departments} />
              <AField label="Имэйл (нэвтрэх нэр)">
                <AInput name="email" type="email" required autoComplete="off" placeholder="name@company.mn" />
              </AField>
              <AField label="Түр нууц үг" hint="Дор хаяж 8 тэмдэгт. Ажилтан нэвтэрсний дараа Тохиргоо хэсгээс сольж болно.">
                <PasswordInput name="password" autoComplete="new-password" minLength={8} />
              </AField>
              <div>
                <SubmitButton>Нэмэх</SubmitButton>
              </div>
            </ActionForm>
          </Card>
        )}
      </div>
    </>
  );
}
