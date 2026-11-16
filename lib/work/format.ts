const TZ = "Asia/Ulaanbaatar";

/** Today's date (YYYY-MM-DD) in Ulaanbaatar time. */
export function todayISO(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date());
}

export function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

const dateFmt = new Intl.DateTimeFormat("mn-MN", { year: "numeric", month: "2-digit", day: "2-digit", timeZone: "UTC" });
const dateTimeFmt = new Intl.DateTimeFormat("mn-MN", { dateStyle: "short", timeStyle: "short", timeZone: TZ });

export const fmtDate = (iso: string | null | undefined) => (iso ? dateFmt.format(new Date(`${iso.slice(0, 10)}T00:00:00Z`)) : "—");
export const fmtDateTime = (iso: string | null | undefined) => (iso ? dateTimeFmt.format(new Date(iso)) : "—");

export function fmtBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

export const fmtHours = (n: number) => `${Number.isInteger(n) ? n : n.toFixed(1)} ц`;

export const isISODate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v);
