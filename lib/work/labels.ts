export type Role = "admin" | "manager" | "employee";
export type TaskStatus = "pending" | "in_progress" | "done" | "postponed";
export type LogStatus = "in_progress" | "done" | "blocked";
export type Priority = "low" | "medium" | "high";

export const roleLabels: Record<Role, string> = { admin: "Админ", manager: "Менежер", employee: "Ажилтан" };

export const taskStatusLabels: Record<TaskStatus, string> = {
  pending: "Хүлээгдэж буй",
  in_progress: "Хийгдэж буй",
  done: "Дууссан",
  postponed: "Хойшилсон",
};

export const logStatusLabels: Record<LogStatus, string> = {
  in_progress: "Хийгдэж буй",
  done: "Дууссан",
  blocked: "Саатсан",
};

export const priorityLabels: Record<Priority, string> = { low: "Бага", medium: "Дунд", high: "Өндөр" };

export type Tone = "neutral" | "brand" | "green" | "amber" | "red";

export const taskStatusTone: Record<TaskStatus, Tone> = {
  pending: "neutral",
  in_progress: "brand",
  done: "green",
  postponed: "amber",
};
export const logStatusTone: Record<LogStatus, Tone> = { in_progress: "brand", done: "green", blocked: "red" };
export const priorityTone: Record<Priority, Tone> = { low: "neutral", medium: "amber", high: "red" };
export const roleTone: Record<Role, Tone> = { admin: "brand", manager: "amber", employee: "neutral" };

export const isTaskStatus = (v: unknown): v is TaskStatus => typeof v === "string" && v in taskStatusLabels;
export const isLogStatus = (v: unknown): v is LogStatus => typeof v === "string" && v in logStatusLabels;
export const isPriority = (v: unknown): v is Priority => typeof v === "string" && v in priorityLabels;
export const isRole = (v: unknown): v is Role => typeof v === "string" && v in roleLabels;
