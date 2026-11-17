import type { Tone } from "@/lib/work/labels";

export type DocCategory = "contract" | "order" | "identity" | "education" | "training" | "medical" | "other";
export type EmploymentType = "permanent" | "contract" | "hourly";
export type EmployeeStatus = "active" | "leave" | "left";

/** Folder order inside a personal file. */
export const docCategories: DocCategory[] = ["contract", "order", "identity", "education", "training", "medical", "other"];

export const docCategoryLabels: Record<DocCategory, string> = {
  contract: "Хөдөлмөрийн гэрээ",
  order: "Тушаал",
  identity: "Иргэний бичиг баримт",
  education: "Боловсрол",
  training: "Сургалт / ХАБЭА",
  medical: "Эрүүл мэнд",
  other: "Бусад",
};

export const docCategoryHints: Record<DocCategory, string> = {
  contract: "Хөдөлмөрийн гэрээ, нэмэлт гэрээ",
  order: "Томилгоо, шилжүүлэг, цалин, шагнал, сахилга, чөлөөлөх",
  identity: "Иргэний үнэмлэх, НДД, жолооны үнэмлэх",
  education: "Диплом, сертификат",
  training: "ХАБЭА болон мэргэжлийн сургалтын гэрчилгээ",
  medical: "Эрүүл мэндийн үзлэг, магадлагаа",
  other: "Анкет, тодорхойлолт гэх мэт",
};

export const employmentTypeLabels: Record<EmploymentType, string> = {
  permanent: "Үндсэн",
  contract: "Гэрээт",
  hourly: "Цагийн",
};

export const employeeStatusLabels: Record<EmployeeStatus, string> = {
  active: "Ажиллаж байгаа",
  leave: "Чөлөөтэй",
  left: "Гарсан",
};
export const employeeStatusTone: Record<EmployeeStatus, Tone> = { active: "green", leave: "amber", left: "neutral" };

export const isDocCategory = (v: unknown): v is DocCategory => typeof v === "string" && v in docCategoryLabels;
export const isEmploymentType = (v: unknown): v is EmploymentType => typeof v === "string" && v in employmentTypeLabels;
export const isEmployeeStatus = (v: unknown): v is EmployeeStatus => typeof v === "string" && v in employeeStatusLabels;

/** Documents whose `valid_until` falls within this many days are flagged. */
export const EXPIRY_WARN_DAYS = 30;
