import type { Department } from "@/lib/work/queries";
import type { Employee } from "@/lib/hr/queries";
import { employeeStatusLabels, employmentTypeLabels, type EmployeeStatus, type EmploymentType } from "@/lib/hr/labels";
import { AField, AInput, ASelect, ATextarea } from "./ui";

/** Personal-file fields shared by the "add" and "edit" forms. `compact` shows only what's needed to start a file. */
export function HrEmployeeFields({ departments, employee, compact = false }: { departments: Department[]; employee?: Employee; compact?: boolean }) {
  return (
    <>
      <AField label="Овог нэр">
        <AInput name="full_name" required minLength={2} maxLength={120} defaultValue={employee?.fullName} placeholder="Батбаярын Болд" />
      </AField>
      <AField label="Албан тушаал">
        <AInput name="position" maxLength={120} defaultValue={employee?.position ?? ""} placeholder="Бутлагч оператор" />
      </AField>
      <AField label="Хэлтэс">
        <ASelect name="department_id" defaultValue={employee?.departmentId ?? ""}>
          <option value="">Хэлтэсгүй</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </ASelect>
      </AField>
      <AField label="Ажилд орсон огноо">
        <AInput name="hire_date" type="date" defaultValue={employee?.hireDate ?? ""} />
      </AField>
      <AField label="Ажлын төрөл">
        <ASelect name="employment_type" defaultValue={employee?.employmentType ?? "permanent"}>
          {(Object.keys(employmentTypeLabels) as EmploymentType[]).map((t) => (
            <option key={t} value={t}>
              {employmentTypeLabels[t]}
            </option>
          ))}
        </ASelect>
      </AField>
      <AField label="Утас">
        <AInput name="phone" type="tel" maxLength={40} defaultValue={employee?.phone ?? ""} placeholder="9911 2233" />
      </AField>

      {!compact && (
        <>
          <AField label="Регистрийн дугаар">
            <AInput name="register_no" maxLength={20} defaultValue={employee?.registerNo ?? ""} placeholder="УБ90010112" />
          </AField>
          <AField label="Төрсөн огноо">
            <AInput name="birth_date" type="date" defaultValue={employee?.birthDate ?? ""} />
          </AField>
          <AField label="Имэйл (холбоо барих)">
            <AInput name="contact_email" type="email" maxLength={160} defaultValue={employee?.contactEmail ?? ""} />
          </AField>
          <AField label="Яаралтай үед холбоо барих">
            <AInput name="emergency_contact" maxLength={200} defaultValue={employee?.emergencyContact ?? ""} placeholder="Эхнэр — 9900 1122" />
          </AField>
          <AField label="Төлөв">
            <ASelect name="status" defaultValue={employee?.status ?? "active"}>
              {(Object.keys(employeeStatusLabels) as EmployeeStatus[]).map((s) => (
                <option key={s} value={s}>
                  {employeeStatusLabels[s]}
                </option>
              ))}
            </ASelect>
          </AField>
          <AField label="Ажлаас гарсан огноо">
            <AInput name="left_on" type="date" defaultValue={employee?.leftOn ?? ""} />
          </AField>
          <AField label="Гэрийн хаяг" className="sm:col-span-2">
            <AInput name="address" maxLength={300} defaultValue={employee?.address ?? ""} />
          </AField>
          <AField label="Тэмдэглэл" className="col-span-full">
            <ATextarea name="note" maxLength={2000} defaultValue={employee?.note ?? ""} />
          </AField>
        </>
      )}
    </>
  );
}
