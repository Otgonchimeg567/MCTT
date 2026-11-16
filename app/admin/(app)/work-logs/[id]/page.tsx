import Link from "next/link";
import { notFound } from "next/navigation";
import { requireMe } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { todayISO } from "@/lib/work/format";
import { Card, Notice, PageHeader, btn } from "@/components/admin/ui";
import { ActionForm, SubmitButton } from "@/components/admin/forms";
import { WorkLogFields, type WorkLogValues } from "@/components/admin/WorkLogFields";
import { deleteWorkLog, updateWorkLog } from "../actions";

export default async function WorkLogEditPage({ params }: { params: Promise<{ id: string }> }) {
  const me = await requireMe();
  const { id } = await params;
  const supabase = await createClient();
  const { data: log } = await supabase
    .from("work_logs")
    .select("id, profile_id, log_date, title, description, hours, status, note")
    .eq("id", id)
    .maybeSingle<WorkLogValues & { id: string; profile_id: string }>();
  if (!log) notFound();
  const editable = log.profile_id === me.id || me.role === "admin";

  return (
    <>
      <PageHeader
        title="Бүртгэл засах"
        actions={
          <Link href="/admin/work-logs" className={btn.outline}>
            ← Жагсаалт
          </Link>
        }
      />
      <Card className="max-w-[760px]">
        {!editable && (
          <div className="pb-4">
            <Notice tone="amber">Энэ бол өөр ажилтны бүртгэл. Та зөвхөн харах эрхтэй.</Notice>
          </div>
        )}
        <ActionForm action={updateWorkLog} className="grid gap-3.5 sm:grid-cols-2">
          <input type="hidden" name="id" value={log.id} />
          <fieldset disabled={!editable} className="contents">
            <WorkLogFields today={todayISO()} log={{ ...log, hours: Number(log.hours) }} />
          </fieldset>
          {editable && (
            <div className="col-span-full">
              <SubmitButton>Хадгалах</SubmitButton>
            </div>
          )}
        </ActionForm>
        {editable && (
          <div className="mt-5 border-t border-line-soft pt-4">
            <ActionForm action={deleteWorkLog} confirm="Энэ бүртгэлийг устгах уу?">
              <input type="hidden" name="id" value={log.id} />
              <input type="hidden" name="back" value="1" />
              <SubmitButton variant="danger">Бүртгэлийг устгах</SubmitButton>
            </ActionForm>
          </div>
        )}
      </Card>
    </>
  );
}
