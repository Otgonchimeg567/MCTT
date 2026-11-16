import { NextResponse } from "next/server";
import { getMe } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { getTeam } from "@/lib/work/queries";
import { isISODate, todayISO } from "@/lib/work/format";
import { logStatusLabels, type LogStatus } from "@/lib/work/labels";

const cell = (v: unknown) => {
  const s = String(v ?? "");
  // Quote, and neutralise spreadsheet formulas.
  return `"${(/^[=+\-@]/.test(s) ? `'${s}` : s).replace(/"/g, '""')}"`;
};

/** CSV of work logs in range, scoped exactly like the reports page (and by RLS). */
export async function GET(request: Request) {
  const me = await getMe();
  if (!me) return new NextResponse("Нэвтэрнэ үү.", { status: 401 });

  const sp = new URL(request.url).searchParams;
  const today = todayISO();
  const from = isISODate(sp.get("from") ?? "") ? sp.get("from")! : `${today.slice(0, 8)}01`;
  const to = isISODate(sp.get("to") ?? "") ? sp.get("to")! : today;
  const dept = sp.get("dept");

  const team = (await getTeam(me)).filter((p) => !dept || p.departmentId === dept);
  const names = new Map(team.map((p) => [p.id, p]));
  const supabase = await createClient();
  const { data, error } = team.length
    ? await supabase
        .from("work_logs")
        .select("log_date, profile_id, title, description, hours, status, note")
        .in("profile_id", team.map((p) => p.id))
        .gte("log_date", from)
        .lte("log_date", to)
        .order("log_date")
    : { data: [], error: null };
  if (error) return new NextResponse("Алдаа гарлаа.", { status: 500 });

  const lines = [
    ["Огноо", "Ажилтан", "Хэлтэс", "Ажил", "Тайлбар", "Цаг", "Төлөв", "Нэмэлт"].map(cell).join(","),
    ...(data ?? []).map((r) => {
      const p = names.get(r.profile_id);
      return [r.log_date, p?.fullName, p?.departmentName, r.title, r.description, r.hours, logStatusLabels[r.status as LogStatus], r.note].map(cell).join(",");
    }),
  ];
  return new NextResponse("﻿" + lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="work-logs_${from}_${to}.csv"`,
    },
  });
}
