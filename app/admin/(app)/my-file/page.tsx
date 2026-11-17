import { requireMe } from "@/lib/auth";
import { fmtDate } from "@/lib/work/format";
import { getDocuments, getMyEmployee } from "@/lib/hr/queries";
import { employeeStatusLabels, employeeStatusTone, employmentTypeLabels } from "@/lib/hr/labels";
import { Badge, Card, EmptyState, PageHeader } from "@/components/admin/ui";
import { HrDocFolders } from "@/components/admin/HrDocFolders";

/** The signed-in user's own personal file, read-only. RLS returns only their own row and documents. */
export default async function MyFilePage() {
  const me = await requireMe();
  const employee = await getMyEmployee(me.id).catch(() => null); // HR tables may not exist yet

  if (!employee) {
    return (
      <>
        <PageHeader title="Миний хувийн хэрэг" />
        <EmptyState title="Хувийн хэрэг холбогдоогүй байна" description="Таны нэвтрэх эрхтэй хувийн хэрэг холбогдоогүй байна. Хүний нөөц / админд хандана уу." />
      </>
    );
  }

  const docs = await getDocuments(employee.id);
  const facts: [string, string | null][] = [
    ["Хэлтэс", employee.departmentName],
    ["Албан тушаал", employee.position],
    ["Ажилд орсон", employee.hireDate ? fmtDate(employee.hireDate) : null],
    ["Ажлын төрөл", employmentTypeLabels[employee.employmentType]],
    ["Утас", employee.phone],
    ["Регистрийн дугаар", employee.registerNo],
  ];

  return (
    <>
      <PageHeader title="Миний хувийн хэрэг" description="Таны хөдөлмөрийн гэрээ, тушаал болон бусад бичиг баримт. Өөрчлөлт хэрэгтэй бол хүний нөөцөд хандана уу." />
      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <Card title={employee.fullName} actions={<Badge tone={employeeStatusTone[employee.status]}>{employeeStatusLabels[employee.status]}</Badge>}>
          <dl className="flex flex-col divide-y divide-line-soft">
            {facts.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-3 py-2 text-sm">
                <dt className="text-muted">{label}</dt>
                <dd className="text-right font-semibold text-ink">{value || "—"}</dd>
              </div>
            ))}
          </dl>
        </Card>
        <div>
          <HrDocFolders docs={docs} employeeId={employee.id} baseHref="/admin/my-file?" />
        </div>
      </div>
    </>
  );
}
