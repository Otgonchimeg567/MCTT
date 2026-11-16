import type { Person } from "@/lib/work/queries";
import { priorityLabels, taskStatusLabels, type Priority, type TaskStatus } from "@/lib/work/labels";
import { AField, AInput, ASelect, ATextarea } from "./ui";

export type TaskValues = {
  title: string;
  description: string | null;
  assignee_id: string | null;
  start_date: string | null;
  due_date: string | null;
  status: TaskStatus;
  priority: Priority;
};

export function TaskFields({ people, task }: { people: Person[]; task?: TaskValues }) {
  return (
    <>
      <AField label="Даалгаврын нэр" className="col-span-full">
        <AInput name="title" required maxLength={200} defaultValue={task?.title} placeholder="Жишээ: Сарын үйлдвэрлэлийн тайлан бэлтгэх" />
      </AField>
      <AField label="Дэлгэрэнгүй" className="col-span-full">
        <ATextarea name="description" rows={4} maxLength={8000} defaultValue={task?.description ?? ""} />
      </AField>
      <AField label="Хариуцах ажилтан" className="col-span-full">
        <ASelect name="assignee_id" defaultValue={task?.assignee_id ?? ""}>
          <option value="">Оноогоогүй</option>
          {people
            .filter((p) => p.isActive || p.id === task?.assignee_id)
            .map((p) => (
              <option key={p.id} value={p.id}>
                {p.fullName}
                {p.departmentName ? ` — ${p.departmentName}` : ""}
              </option>
            ))}
        </ASelect>
      </AField>
      <AField label="Эхлэх огноо">
        <AInput type="date" name="start_date" defaultValue={task?.start_date ?? ""} />
      </AField>
      <AField label="Дуусах огноо">
        <AInput type="date" name="due_date" defaultValue={task?.due_date ?? ""} />
      </AField>
      <AField label="Төлөв">
        <ASelect name="status" defaultValue={task?.status ?? "pending"}>
          {(Object.keys(taskStatusLabels) as TaskStatus[]).map((s) => (
            <option key={s} value={s}>
              {taskStatusLabels[s]}
            </option>
          ))}
        </ASelect>
      </AField>
      <AField label="Эрэмбэ">
        <ASelect name="priority" defaultValue={task?.priority ?? "medium"}>
          {(Object.keys(priorityLabels) as Priority[]).map((p) => (
            <option key={p} value={p}>
              {priorityLabels[p]}
            </option>
          ))}
        </ASelect>
      </AField>
    </>
  );
}
