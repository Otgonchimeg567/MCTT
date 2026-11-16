import type { Department, Person } from "@/lib/work/queries";
import { roleLabels, type Role } from "@/lib/work/labels";
import { AField, AInput, ASelect } from "./ui";

/** Profile fields shared by the "add" and "edit" employee forms. */
export function EmployeeFields({ departments, person }: { departments: Department[]; person?: Person }) {
  return (
    <>
      <AField label="Овог нэр">
        <AInput name="full_name" required minLength={2} maxLength={120} defaultValue={person?.fullName} placeholder="Б. Болд" />
      </AField>
      <AField label="Утас">
        <AInput name="phone" type="tel" maxLength={40} defaultValue={person?.phone ?? ""} placeholder="9911 2233" />
      </AField>
      <AField label="Хэлтэс">
        <ASelect name="department_id" defaultValue={person?.departmentId ?? ""}>
          <option value="">Хэлтэсгүй</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </ASelect>
      </AField>
      <AField label="Албан тушаал">
        <AInput name="position" maxLength={120} defaultValue={person?.position ?? ""} placeholder="Инженер" />
      </AField>
      <AField label="Эрх">
        <ASelect name="role" defaultValue={person?.role ?? "employee"}>
          {(Object.keys(roleLabels) as Role[]).map((r) => (
            <option key={r} value={r}>
              {roleLabels[r]}
            </option>
          ))}
        </ASelect>
      </AField>
    </>
  );
}
