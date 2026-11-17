import Link from "next/link";
import { notFound } from "next/navigation";
import { requireMe } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getDepartments, getPerson } from "@/lib/work/queries";
import { fmtBytes, fmtDate, fmtDateTime, fmtHours } from "@/lib/work/format";
import { roleLabels, roleTone, taskStatusLabels, taskStatusTone, type Role, type TaskStatus } from "@/lib/work/labels";
import { daysUntil, expiryState, getDocuments, getEmployee } from "@/lib/hr/queries";
import { employeeStatusLabels, employeeStatusTone, employmentTypeLabels, isDocCategory } from "@/lib/hr/labels";
import { AField, AInput, ASelect, Badge, Card, EmptyState, Notice, PageHeader, btn } from "@/components/admin/ui";
import { ActionForm, PasswordInput, SubmitButton } from "@/components/admin/forms";
import { HrEmployeeFields } from "@/components/admin/HrEmployeeFields";
import { HrDocFolders } from "@/components/admin/HrDocFolders";
import { HrDocUploadForm } from "@/components/admin/HrDocUploadForm";
import { resetEmployeePassword, setEmployeeActive } from "../actions";
import { createLoginForEmployee, deleteHrEmployee, setLoginRole, updateHrEmployee } from "../hr-actions";

type Tab = "general" | "docs" | "work" | "login";
const tabs: { id: Tab; label: string }[] = [
  { id: "general", label: "Ерөнхий" },
  { id: "docs", label: "Бичиг баримт" },
  { id: "work", label: "Ажил" },
  { id: "login", label: "Нэвтрэх эрх" },
];

/** One employee's personal file: everything about them in one place. Admin only. */
export default async function EmployeeFolderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string; edit?: string; cat?: string }>;
}) {
  const me = await requireMe(["admin"]);
  const { id } = await params;
  const sp = await searchParams;
  const tab: Tab = tabs.some((t) => t.id === sp.tab) ? (sp.tab as Tab) : "docs";

  const [employee, docs, departments] = await Promise.all([getEmployee(id), getDocuments(id), getDepartments()]);
  if (!employee) notFound();

  const alerts = docs.filter((d) => expiryState(d.validUntil)).sort((a, b) => (a.validUntil! < b.validUntil! ? -1 : 1));
  const base = `/admin/employees/${id}`;
  const subtitle = [employee.departmentName, employee.position, employee.hireDate && `${fmtDate(employee.hireDate)}-аас`, employmentTypeLabels[employee.employmentType]]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <PageHeader
        title={employee.fullName}
        description={subtitle}
        actions={
          <Link href="/admin/employees" className={btn.outline}>
            ← Ажилтнууд
          </Link>
        }
      />

      <div className="-mt-3 flex flex-wrap items-center gap-2 pb-5">
        <Badge tone={employeeStatusTone[employee.status]}>{employeeStatusLabels[employee.status]}</Badge>
        {employee.profileId ? <Badge tone="brand">✓ Нэвтрэх эрхтэй</Badge> : <Badge>Нэвтрэх эрхгүй</Badge>}
        <Badge>{docs.length} бичиг баримт</Badge>
        {alerts.slice(0, 2).map((d) => {
          const days = daysUntil(d.validUntil!);
          return (
            <Badge key={d.id} tone={days < 0 ? "red" : "amber"}>
              ⚠ {d.title}: {days < 0 ? "хугацаа дууссан" : `${days} хоногийн дараа дуусна`}
            </Badge>
          );
        })}
      </div>

      <nav aria-label="Хавтасны хэсгүүд" className="mb-6 flex gap-1 overflow-x-auto rounded-full border border-line bg-white p-1">
        {tabs.map((t) => (
          <Link
            key={t.id}
            href={`${base}?tab=${t.id}`}
            aria-current={tab === t.id ? "page" : undefined}
            className={`rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition ${
              tab === t.id ? "bg-brand-gradient text-white" : "text-body hover:bg-cream"
            }`}
          >
            {t.label}
            {t.id === "docs" && <span className="ml-1.5 opacity-70">{docs.length}</span>}
          </Link>
        ))}
      </nav>

      {tab === "general" && (
        <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
          <Card title="Хувийн мэдээлэл">
            <ActionForm action={updateHrEmployee} className="grid gap-3.5 sm:grid-cols-2">
              <input type="hidden" name="id" value={employee.id} />
              <HrEmployeeFields departments={departments} employee={employee} />
              <div className="col-span-full">
                <SubmitButton>Хадгалах</SubmitButton>
              </div>
            </ActionForm>
          </Card>
          <Card title="Хувийн хэрэг устгах">
            <p className="pb-3 text-sm text-muted">Бүх бичиг баримт нь хамт устна. Нэвтрэх эрх (байгаа бол) устахгүй. Ажлаас гарсан бол устгахын оронд төлөвийг «Гарсан» болгохыг зөвлөж байна.</p>
            <ActionForm action={deleteHrEmployee} confirm={`${employee.fullName}-ийн хувийн хэрэг, ${docs.length} бичиг баримтыг бүрмөсөн устгах уу?`}>
              <input type="hidden" name="id" value={employee.id} />
              <SubmitButton variant="danger">Устгах</SubmitButton>
            </ActionForm>
          </Card>
        </div>
      )}

      {tab === "docs" && (
        <div className="flex flex-col gap-6">
          <Card title="Бичиг баримт нэмэх">
            <HrDocUploadForm employeeId={employee.id} defaultCategory={isDocCategory(sp.cat) ? sp.cat : undefined} />
          </Card>
          <HrDocFolders docs={docs} manage employeeId={employee.id} editId={sp.edit} baseHref={`${base}?tab=docs`} />
        </div>
      )}

      {tab === "work" && <WorkTab profileId={employee.profileId} employeeId={employee.id} />}

      {tab === "login" && <LoginTab profileId={employee.profileId} employeeId={employee.id} meId={me.id} email={employee.contactEmail} />}
    </>
  );
}

async function WorkTab({ profileId, employeeId }: { profileId: string | null; employeeId: string }) {
  if (!profileId) {
    return (
      <EmptyState title="Ажлын мэдээлэл алга" description="Даалгавар, ажлын бүртгэл, файл нь нэвтрэх эрхтэй холбогддог. Энэ ажилтанд нэвтрэх эрх үүсгэвэл энд харагдана.">
        <Link href={`/admin/employees/${employeeId}?tab=login`} className={btn.outline}>
          Нэвтрэх эрх үүсгэх
        </Link>
      </EmptyState>
    );
  }
  const supabase = await createClient();
  const [tasksRes, logsRes, filesRes] = await Promise.all([
    supabase.from("tasks").select("id, title, status, due_date").eq("assignee_id", profileId).order("created_at", { ascending: false }).limit(20),
    supabase.from("work_logs").select("id, title, log_date, hours").eq("profile_id", profileId).order("log_date", { ascending: false }).limit(10),
    supabase.from("files").select("id, name, size_bytes, created_at").eq("owner_id", profileId).order("created_at", { ascending: false }).limit(10),
  ]);
  const tasks = (tasksRes.data ?? []) as { id: string; title: string; status: TaskStatus; due_date: string | null }[];
  const logs = (logsRes.data ?? []) as { id: string; title: string; log_date: string; hours: number }[];
  const files = (filesRes.data ?? []) as { id: string; name: string; size_bytes: number; created_at: string }[];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card title={`Даалгавар · ${tasks.length}`}>
        {tasks.length === 0 ? (
          <p className="text-sm text-faint">Оноогдсон даалгавар алга.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-line-soft">
            {tasks.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-2 py-2">
                <Link href={`/admin/tasks/${t.id}`} className="min-w-0 truncate text-sm font-semibold text-ink hover:text-brand">
                  {t.title}
                </Link>
                <Badge tone={taskStatusTone[t.status]}>{taskStatusLabels[t.status]}</Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>
      <Card title={`Сүүлийн ажлын бүртгэл · ${logs.length}`}>
        {logs.length === 0 ? (
          <p className="text-sm text-faint">Бүртгэл алга.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-line-soft">
            {logs.map((l) => (
              <li key={l.id} className="flex items-center justify-between gap-2 py-2 text-sm">
                <Link href={`/admin/work-logs/${l.id}`} className="min-w-0 truncate font-semibold text-ink hover:text-brand">
                  {l.title}
                </Link>
                <span className="shrink-0 text-xs text-muted">
                  {fmtDate(l.log_date)} · {fmtHours(Number(l.hours))}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
      <Card title={`Оруулсан файл · ${files.length}`}>
        {files.length === 0 ? (
          <p className="text-sm text-faint">Файл алга.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-line-soft">
            {files.map((f) => (
              <li key={f.id} className="py-2 text-sm">
                <a href={`/admin/files/${f.id}/download`} className="block truncate font-semibold text-ink hover:text-brand">
                  {f.name}
                </a>
                <span className="text-xs text-muted">
                  {fmtDateTime(f.created_at)} · {fmtBytes(Number(f.size_bytes))}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

async function LoginTab({ profileId, employeeId, meId, email }: { profileId: string | null; employeeId: string; meId: string; email: string | null }) {
  if (!profileId) {
    return (
      <Card title="Нэвтрэх эрх үүсгэх" className="max-w-[560px]">
        <p className="pb-4 text-sm text-muted">
          Ажилтан системд нэвтэрч ажлын бүртгэл хөтлөх, даалгавар авах, өөрийн хувийн хэргийг (зөвхөн унших) харах боломжтой болно.
        </p>
        <ActionForm action={createLoginForEmployee} resetOnSuccess className="flex flex-col gap-3.5">
          <input type="hidden" name="id" value={employeeId} />
          <AField label="Имэйл (нэвтрэх нэр)">
            <AInput name="email" type="email" required autoComplete="off" defaultValue={email ?? ""} placeholder="name@company.mn" />
          </AField>
          <AField label="Түр нууц үг" hint="Дор хаяж 8 тэмдэгт">
            <PasswordInput name="password" autoComplete="new-password" minLength={8} />
          </AField>
          <AField label="Эрх">
            <ASelect name="role" defaultValue="employee">
              {(Object.keys(roleLabels) as Role[]).map((r) => (
                <option key={r} value={r}>
                  {roleLabels[r]}
                </option>
              ))}
            </ASelect>
          </AField>
          <div>
            <SubmitButton>Үүсгэх</SubmitButton>
          </div>
        </ActionForm>
      </Card>
    );
  }

  const person = await getPerson(profileId);
  if (!person) return <Notice tone="amber">Холбогдсон нэвтрэх эрх олдсонгүй.</Notice>;
  const self = person.id === meId;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card title="Нэвтрэх эрх" actions={person.isActive ? <Badge tone="green">Идэвхтэй</Badge> : <Badge>Идэвхгүй</Badge>}>
        <p className="text-sm text-muted">Нэвтрэх нэр</p>
        <p className="pb-4 font-semibold text-ink">{person.email}</p>
        <ActionForm action={setLoginRole} className="flex flex-col gap-3">
          <input type="hidden" name="profile_id" value={person.id} />
          <input type="hidden" name="employee_id" value={employeeId} />
          <AField label="Эрх">
            <ASelect name="role" defaultValue={person.role} disabled={self}>
              {(Object.keys(roleLabels) as Role[]).map((r) => (
                <option key={r} value={r}>
                  {roleLabels[r]}
                </option>
              ))}
            </ASelect>
          </AField>
          {self ? <Badge tone={roleTone[person.role]}>Өөрийн эрхийг өөрчлөхгүй</Badge> : <div><SubmitButton variant="outline">Эрх хадгалах</SubmitButton></div>}
        </ActionForm>
      </Card>

      <Card title="Төлөв">
        <p className="pb-3 text-sm text-muted">Идэвхгүй ажилтан нэвтэрч чадахгүй, мэдээлэл нь устахгүй.</p>
        {self ? (
          <p className="text-sm text-faint">Өөрийгөө идэвхгүй болгох боломжгүй.</p>
        ) : (
          <ActionForm action={setEmployeeActive} confirm={person.isActive ? `${person.fullName}-г идэвхгүй болгох уу?` : undefined}>
            <input type="hidden" name="id" value={person.id} />
            <input type="hidden" name="active" value={person.isActive ? "false" : "true"} />
            <SubmitButton variant={person.isActive ? "danger" : "primary"}>{person.isActive ? "Идэвхгүй болгох" : "Идэвхжүүлэх"}</SubmitButton>
          </ActionForm>
        )}
      </Card>

      <Card title="Нууц үг шинэчлэх">
        <ActionForm action={resetEmployeePassword} resetOnSuccess className="flex flex-col gap-3">
          <input type="hidden" name="id" value={person.id} />
          <AField label="Шинэ нууц үг" hint="Дор хаяж 8 тэмдэгт">
            <PasswordInput name="password" autoComplete="new-password" minLength={8} />
          </AField>
          <div>
            <SubmitButton variant="outline">Солих</SubmitButton>
          </div>
        </ActionForm>
      </Card>
    </div>
  );
}
