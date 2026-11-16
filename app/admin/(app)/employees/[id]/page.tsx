import Link from "next/link";
import { notFound } from "next/navigation";
import { requireMe } from "@/lib/auth";
import { getDepartments, getPerson } from "@/lib/work/queries";
import { AField, Badge, Card, PageHeader, btn } from "@/components/admin/ui";
import { ActionForm, PasswordInput, SubmitButton } from "@/components/admin/forms";
import { EmployeeFields } from "@/components/admin/EmployeeFields";
import { resetEmployeePassword, setEmployeeActive, updateEmployee } from "../actions";

export default async function EmployeeEditPage({ params }: { params: Promise<{ id: string }> }) {
  const me = await requireMe(["admin"]);
  const { id } = await params;
  const [person, departments] = await Promise.all([getPerson(id), getDepartments()]);
  if (!person) notFound();
  const self = person.id === me.id;

  return (
    <>
      <PageHeader
        title={person.fullName}
        description={person.email}
        actions={
          <Link href="/admin/employees" className={btn.outline}>
            ← Жагсаалт
          </Link>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card title="Мэдээлэл">
          <ActionForm action={updateEmployee} className="grid gap-3.5 sm:grid-cols-2">
            <input type="hidden" name="id" value={person.id} />
            <EmployeeFields departments={departments} person={person} />
            <div className="col-span-full">
              <SubmitButton>Хадгалах</SubmitButton>
            </div>
          </ActionForm>
        </Card>

        <div className="flex flex-col gap-6">
          <Card title="Төлөв" actions={person.isActive ? <Badge tone="green">Идэвхтэй</Badge> : <Badge>Идэвхгүй</Badge>}>
            <p className="pb-3 text-sm text-muted">
              Идэвхгүй ажилтан нэвтэрч чадахгүй, түүний мэдээлэл устахгүй хадгалагдана.
            </p>
            {self ? (
              <p className="text-sm text-faint">Өөрийгөө идэвхгүй болгох боломжгүй.</p>
            ) : (
              <ActionForm
                action={setEmployeeActive}
                confirm={person.isActive ? `${person.fullName}-г идэвхгүй болгох уу?` : undefined}
              >
                <input type="hidden" name="id" value={person.id} />
                <input type="hidden" name="active" value={person.isActive ? "false" : "true"} />
                <SubmitButton variant={person.isActive ? "danger" : "primary"}>
                  {person.isActive ? "Идэвхгүй болгох" : "Идэвхжүүлэх"}
                </SubmitButton>
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
      </div>
    </>
  );
}
