import { requireMe } from "@/lib/auth";
import { getDepartments, getPerson } from "@/lib/work/queries";
import { roleLabels } from "@/lib/work/labels";
import { AField, AInput, Card, EmptyState, PageHeader } from "@/components/admin/ui";
import { ActionForm, PasswordInput, SubmitButton } from "@/components/admin/forms";
import { changeMyPassword, createDepartment, deleteDepartment, renameDepartment, updateMyProfile } from "./actions";

export default async function SettingsPage() {
  const me = await requireMe();
  const [person, departments] = await Promise.all([getPerson(me.id), me.role === "admin" ? getDepartments() : Promise.resolve([])]);

  return (
    <>
      <PageHeader title="Тохиргоо" description="Хувийн мэдээлэл, нууц үг" />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Миний мэдээлэл">
          <ActionForm action={updateMyProfile} className="grid gap-3.5 sm:grid-cols-2">
            <AField label="Овог нэр">
              <AInput name="full_name" required minLength={2} maxLength={120} defaultValue={person?.fullName} />
            </AField>
            <AField label="Утас">
              <AInput name="phone" type="tel" maxLength={40} defaultValue={person?.phone ?? ""} />
            </AField>
            <AField label="Имэйл">
              <AInput value={me.email} disabled readOnly />
            </AField>
            <AField label="Эрх · хэлтэс" hint="Эрх, хэлтэс, албан тушаалыг зөвхөн админ өөрчилнө.">
              <AInput value={`${roleLabels[me.role]} · ${me.departmentName ?? "Хэлтэсгүй"}${me.position ? ` · ${me.position}` : ""}`} disabled readOnly />
            </AField>
            <div className="col-span-full">
              <SubmitButton>Хадгалах</SubmitButton>
            </div>
          </ActionForm>
        </Card>

        <Card title="Нууц үг солих">
          <ActionForm action={changeMyPassword} resetOnSuccess className="flex flex-col gap-3.5">
            <AField label="Шинэ нууц үг" hint="Дор хаяж 8 тэмдэгт">
              <PasswordInput name="password" autoComplete="new-password" minLength={8} />
            </AField>
            <AField label="Шинэ нууц үг давтах">
              <PasswordInput name="confirm" autoComplete="new-password" minLength={8} />
            </AField>
            <div>
              <SubmitButton>Солих</SubmitButton>
            </div>
          </ActionForm>
        </Card>

        {me.role === "admin" && (
          <Card title="Хэлтсүүд" className="xl:col-span-2">
            <ActionForm action={createDepartment} resetOnSuccess className="flex flex-col gap-2 pb-5 sm:flex-row">
              <AInput name="name" required maxLength={120} placeholder="Шинэ хэлтсийн нэр" aria-label="Шинэ хэлтсийн нэр" className="sm:max-w-[360px]" />
              <SubmitButton>+ Нэмэх</SubmitButton>
            </ActionForm>
            {departments.length === 0 ? (
              <EmptyState title="Хэлтэс алга" description="Хэлтэс нэмээд ажилтнуудаа оноогоорой. Менежер зөвхөн өөрийн хэлтсийн ажилтнуудыг харна." />
            ) : (
              <ul className="grid gap-2 md:grid-cols-2">
                {departments.map((d) => (
                  <li key={d.id} className="flex flex-col gap-2 rounded-xl border border-line p-3 sm:flex-row sm:items-start">
                    <ActionForm action={renameDepartment} className="flex flex-1 gap-2">
                      <input type="hidden" name="id" value={d.id} />
                      <AInput name="name" required maxLength={120} defaultValue={d.name} aria-label="Хэлтсийн нэр" />
                      <SubmitButton variant="outline">Хадгалах</SubmitButton>
                    </ActionForm>
                    <ActionForm action={deleteDepartment} confirm={`"${d.name}" хэлтсийг устгах уу? Ажилтнууд нь хэлтэсгүй болно.`}>
                      <input type="hidden" name="id" value={d.id} />
                      <SubmitButton variant="danger">Устгах</SubmitButton>
                    </ActionForm>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        )}
      </div>
    </>
  );
}
