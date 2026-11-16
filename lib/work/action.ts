/** Result returned by admin server actions and shown by <ActionForm>. */
export type ActionState = { ok: boolean; message: string } | null;

export const ok = (message: string): ActionState => ({ ok: true, message });
export const fail = (message: string): ActionState => ({ ok: false, message });

/** Trimmed string field, or "" when missing. */
export const field = (fd: FormData, name: string) => String(fd.get(name) ?? "").trim();
export const optional = (fd: FormData, name: string) => field(fd, name) || null;

/** Turns a Supabase/Postgres error into a message for the user (our own triggers already raise Mongolian text). */
export function dbError(error: { code?: string; message?: string } | null | undefined): string {
  if (!error) return "Алдаа гарлаа. Дахин оролдоно уу.";
  if (error.message && /[А-Яа-яӨөҮүЁё]/.test(error.message)) return error.message;
  if (error.code === "42501" || /row-level security/i.test(error.message ?? "")) return "Танд энэ үйлдлийг хийх эрх байхгүй.";
  if (error.code === "23505") return "Ийм нэртэй бичлэг аль хэдийн байна.";
  if (error.code === "23514") return "Оруулсан утга шаардлага хангахгүй байна.";
  return "Алдаа гарлаа. Дахин оролдоно уу.";
}
