import { logStatusLabels, type LogStatus } from "@/lib/work/labels";
import { AField, AInput, ASelect, ATextarea } from "./ui";

export type WorkLogValues = {
  log_date: string;
  title: string;
  description: string | null;
  hours: number;
  status: LogStatus;
  note: string | null;
};

export function WorkLogFields({ today, log }: { today: string; log?: WorkLogValues }) {
  return (
    <>
      <AField label="Огноо">
        <AInput type="date" name="log_date" required defaultValue={log?.log_date ?? today} max={today} />
      </AField>
      <AField label="Зарцуулсан цаг">
        <AInput type="number" name="hours" min={0} max={24} step={0.25} required defaultValue={log?.hours ?? ""} placeholder="2.5" />
      </AField>
      <AField label="Ажлын нэр" className="col-span-full">
        <AInput name="title" required maxLength={200} defaultValue={log?.title} placeholder="Жишээ: Флотацийн цехийн тоног төхөөрөмжийн үзлэг" />
      </AField>
      <AField label="Тайлбар" className="col-span-full">
        <ATextarea name="description" maxLength={4000} defaultValue={log?.description ?? ""} placeholder="Юу хийсэн, үр дүн" />
      </AField>
      <AField label="Төлөв">
        <ASelect name="status" defaultValue={log?.status ?? "done"}>
          {(Object.keys(logStatusLabels) as LogStatus[]).map((s) => (
            <option key={s} value={s}>
              {logStatusLabels[s]}
            </option>
          ))}
        </ASelect>
      </AField>
      <AField label="Нэмэлт тайлбар">
        <AInput name="note" maxLength={2000} defaultValue={log?.note ?? ""} placeholder="Заавал биш" />
      </AField>
    </>
  );
}
