// Demo data for the HR personal files: 25 fictional employees in 5 departments, with "Болд Батбаяр" as the
// fully filled-in example (9 documents). Every demo row has a fixed UUID and note = 'DEMO', so `--clean` removes
// exactly these rows and their files — real employees are never touched.
//
//   npm run seed-hr-demo          insert / refresh the demo data
//   npm run seed-hr-demo:clean    remove it again
//
// Needs the hr_records migration (supabase/migrations/20261117090000_hr_records.sql) to be applied first.
import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const { SUPABASE_URL, SUPABASE_SECRET_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error("Set SUPABASE_URL and SUPABASE_SECRET_KEY in .env.local first.");
  process.exit(1);
}
const db = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
const BUCKET = "hr-files";
const MARK = "DEMO";

/** Stable UUID for a demo key, so re-running updates instead of duplicating. */
function demoId(key) {
  const h = createHash("sha256").update(`mctt-hr-demo:${key}`).digest("hex");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-a${h.slice(17, 20)}-${h.slice(20, 32)}`;
}

const today = new Date();
const iso = (d) => d.toISOString().slice(0, 10);
const inDays = (n) => iso(new Date(today.getTime() + n * 86_400_000));

const departments = [
  { key: "crush", name: "Бутлах цех" },
  { key: "flot", name: "Флотацийн цех" },
  { key: "lab", name: "Лаборатори" },
  { key: "admin", name: "Захиргаа" },
  { key: "fleet", name: "Тээвэр, засвар" },
];

// [key, full name, dept key, position, hire date, employment type]
const people = [
  ["bold", "Батбаярын Болд", "crush", "Бутлагч оператор", "2023-04-15", "permanent"],
  ["saraa", "Ганбаатарын Сараа", "admin", "Хүний нөөцийн мэргэжилтэн", "2019-02-01", "permanent"],
  ["tuguldur", "Энхбаярын Төгөлдөр", "crush", "Ээлжийн ахлах", "2018-05-10", "permanent"],
  ["nomin", "Дорждамбын Номин", "lab", "Химич", "2021-03-15", "permanent"],
  ["temuulen", "Баасанжавын Тэмүүлэн", "flot", "Флотацийн оператор", "2022-04-01", "permanent"],
  ["anu", "Мөнхбатын Ану", "admin", "Нягтлан бодогч", "2020-08-17", "permanent"],
  ["erdene", "Чулуунбаатарын Эрдэнэ", "fleet", "Ковшны оператор", "2017-04-20", "permanent"],
  ["khulan", "Отгонбаярын Хулан", "lab", "Лаборант", "2024-04-08", "contract"],
  ["munkh", "Пүрэвдоржийн Мөнх-Очир", "fleet", "Засварчин", "2019-04-12", "permanent"],
  ["oyun", "Нямдоржийн Оюунчимэг", "admin", "Ажлын албаны дарга", "2016-01-11", "permanent"],
  ["bat", "Гантулгын Бат-Эрдэнэ", "crush", "Бутлагч", "2025-04-14", "contract"],
  ["solongo", "Цэрэндоржийн Солонго", "flot", "Флотацийн оператор", "2023-04-03", "permanent"],
  ["ganzorig", "Лхагвасүрэнгийн Ганзориг", "fleet", "Жолооч", "2020-04-06", "permanent"],
  ["enkhjin", "Батсүхийн Энхжин", "lab", "Сорьц бэлтгэгч", "2025-05-02", "hourly"],
  ["dulguun", "Амарсайханы Дөлгөөн", "flot", "Шүүн хатаагч", "2024-04-15", "contract"],
  ["zaya", "Даваасүрэнгийн Заяа", "admin", "Тогооч", "2022-04-18", "permanent"],
  ["byamba", "Сүхбаатарын Бямбадорж", "crush", "Бутлагч", "2021-04-19", "permanent"],
  ["tsetseg", "Жамсрангийн Цэцэгмаа", "admin", "Үйлчлэгч", "2023-05-01", "hourly"],
  ["altai", "Хүрэлбаатарын Алтай", "fleet", "Цахилгаанчин", "2018-03-26", "permanent"],
  ["undrakh", "Ням-Очирын Өндрах", "flot", "Флотацийн ахлах", "2017-04-03", "permanent"],
  ["batsukh", "Төмөрбаатарын Батсүх", "crush", "Туслах ажилтан", "2025-04-21", "contract"],
  ["gerel", "Ганхуягийн Гэрэлмаа", "lab", "Лабораторийн эрхлэгч", "2016-04-04", "permanent"],
  ["naraa", "Болдбаатарын Нарантуяа", "admin", "ХАБЭА-н мэргэжилтэн", "2021-09-01", "permanent"],
  ["tumen", "Сандагийн Түмэн", "fleet", "Ачигчийн жолооч", "2024-05-06", "contract"],
  ["ariun", "Эрдэнэбилэгийн Ариунаа", "flot", "Шүүн хатаагч", "2026-04-13", "hourly"],
];

// Bold's full folder: [key, category, title, doc number, issued, valid until]
const boldDocs = [
  ["contract", "contract", "Хөдөлмөрийн гэрээ", "HR-2023/041", "2023-04-15", inDays(24)],
  ["addendum", "contract", "Нэмэлт гэрээ — цалингийн нөхцөл", "HR-2025/007", "2025-03-01", null],
  ["appoint", "order", "Ажилд томилох тушаал", "Б/23", "2023-04-14", null],
  ["raise", "order", "Цалин нэмэх тушаал", "Б/58", "2024-06-01", null],
  ["award", "order", "Шагнал олгох тушаал", "Б/12", "2025-12-20", null],
  ["idcard", "identity", "Иргэний үнэмлэхний хуулбар", null, "2023-04-10", null],
  ["ndd", "identity", "Нийгмийн даатгалын дэвтэр", null, "2023-04-10", null],
  ["safety", "training", "ХАБЭА «Нийт ажилтны сургалт» гэрчилгээ", "ХАБ-2025/118", "2025-09-25", "2027-09-25"],
  ["medical", "medical", "Урьдчилсан эрүүл мэндийн үзлэгийн хуудас", null, "2025-04-02", null],
];

/** Minimal one-page PDF (ASCII only — the standard PDF fonts have no Cyrillic). */
function demoPdf(lines) {
  const esc = (s) => s.replace(/[\\()]/g, (c) => `\\${c}`);
  const text = ["BT", "/F1 20 Tf", "72 760 Td", `(${esc(lines[0])}) Tj`, "/F1 12 Tf", ...lines.slice(1).flatMap((l) => ["0 -24 Td", `(${esc(l)}) Tj`]), "ET"].join("\n");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${Buffer.byteLength(text)} >>\nstream\n${text}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  let out = "%PDF-1.4\n";
  const offsets = [];
  objects.forEach((o, i) => {
    offsets.push(Buffer.byteLength(out));
    out += `${i + 1} 0 obj\n${o}\nendobj\n`;
  });
  const xref = Buffer.byteLength(out);
  out += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("")}`;
  out += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(out, "latin1");
}

const latin = (s) =>
  s.replace(/[А-Яа-яӨөҮүЁё]/g, (c) => {
    const map = { а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "j", з: "z", и: "i", й: "i", к: "k", л: "l", м: "m", н: "n", о: "o", ө: "u", п: "p", р: "r", с: "s", т: "t", у: "u", ү: "u", ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "sh", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya" };
    const l = map[c.toLowerCase()] ?? "";
    return c === c.toLowerCase() ? l : l.charAt(0).toUpperCase() + l.slice(1);
  });

async function clean() {
  const empIds = people.map(([k]) => demoId(`emp:${k}`));
  const { data: existing, error } = await db.from("employees").select("id").in("id", empIds).eq("note", MARK);
  if (error) throw error;
  for (const { id } of existing) {
    const { data: objs } = await db.storage.from(BUCKET).list(id, { limit: 100 });
    if (objs?.length) await db.storage.from(BUCKET).remove(objs.map((o) => `${id}/${o.name}`));
  }
  if (existing.length) {
    const { error: delErr } = await db.from("employees").delete().in("id", existing.map((e) => e.id));
    if (delErr) throw delErr;
  }
  // Demo departments go only if nothing real points at them.
  let removedDepts = 0;
  for (const d of departments) {
    const id = demoId(`dept:${d.key}`);
    const [{ count: p }, { count: e }] = await Promise.all([
      db.from("profiles").select("id", { count: "exact", head: true }).eq("department_id", id),
      db.from("employees").select("id", { count: "exact", head: true }).eq("department_id", id),
    ]);
    if (!p && !e) {
      const { data } = await db.from("departments").delete().eq("id", id).select("id");
      removedDepts += data?.length ?? 0;
    }
  }
  console.log(`Removed ${existing.length} demo employees (with their documents) and ${removedDepts} demo departments.`);
}

async function seed() {
  // Departments: reuse a real one with the same name, otherwise create the demo one.
  const deptId = {};
  for (const d of departments) {
    const { data: found } = await db.from("departments").select("id").eq("name", d.name).maybeSingle();
    if (found) {
      deptId[d.key] = found.id;
      continue;
    }
    const id = demoId(`dept:${d.key}`);
    const { error } = await db.from("departments").upsert({ id, name: d.name });
    if (error) throw error;
    deptId[d.key] = id;
  }

  const rows = people.map(([key, name, dept, position, hire, type], i) => ({
    id: demoId(`emp:${key}`),
    full_name: name,
    register_no: `ДЕМО${String(i + 1).padStart(3, "0")}`,
    phone: `9900 ${String(1000 + i * 37).slice(0, 4)}`,
    department_id: deptId[dept],
    position,
    hire_date: hire,
    employment_type: type,
    status: key === "tsetseg" ? "leave" : "active",
    emergency_contact: key === "bold" ? "Эхнэр Сарангэрэл — 9911 4455" : null,
    address: key === "bold" ? "Говьсүмбэр, Сүмбэр сум, 4-р баг" : null,
    birth_date: key === "bold" ? "1990-03-15" : null,
    note: MARK,
  }));
  const { error: empErr } = await db.from("employees").upsert(rows);
  if (empErr) throw empErr;

  // Documents: Bold's full folder, plus a contract (some expiring soon) and an ID copy for everyone else.
  const docs = [];
  for (const [key, name] of people) {
    const empId = demoId(`emp:${key}`);
    const list =
      key === "bold"
        ? boldDocs
        : [
            ["contract", "contract", "Хөдөлмөрийн гэрээ", `HR-${people.findIndex((p) => p[0] === key) + 100}`, people.find((p) => p[0] === key)[4], ["bat", "khulan", "dulguun"].includes(key) ? inDays(["bat", "khulan", "dulguun"].indexOf(key) * 9 + 6) : null],
            ...(key.length % 2 ? [["idcard", "identity", "Иргэний үнэмлэхний хуулбар", null, people.find((p) => p[0] === key)[4], null]] : []),
          ];
    for (const [dkey, category, title, num, issued, until] of list) {
      const id = demoId(`doc:${key}:${dkey}`);
      const path = `${empId}/${id}-${dkey}.pdf`;
      const pdf = demoPdf([
        "MCTT LLC - DEMO DOCUMENT",
        `Employee: ${latin(name)}`,
        `Document: ${latin(title)}`,
        `Number: ${num ? latin(num) : "-"}`,
        `Date: ${issued ?? "-"}${until ? `   Valid until: ${until}` : ""}`,
        "Sample data for demonstration only. Remove with: npm run seed-hr-demo:clean",
      ]);
      const { error: upErr } = await db.storage.from(BUCKET).upload(path, pdf, { contentType: "application/pdf", upsert: true });
      if (upErr) throw upErr;
      docs.push({ id, employee_id: empId, category, title, doc_number: num, issued_on: issued, valid_until: until, name: `${title}.pdf`, storage_path: path, mime_type: "application/pdf", size_bytes: pdf.length, uploaded_by: null, note: MARK });
    }
  }
  const { error: docErr } = await db.from("employee_documents").upsert(docs);
  if (docErr) throw docErr;

  console.log(`Seeded ${rows.length} demo employees and ${docs.length} documents. Example: Батбаярын Болд → /admin/employees/${demoId("emp:bold")}`);
}

try {
  await (process.argv.includes("--clean") ? clean() : seed());
} catch (err) {
  console.error(err.message ?? err);
  if (/relation .*employees|does not exist|Bucket not found/i.test(String(err.message))) {
    console.error("→ Apply supabase/migrations/20261117090000_hr_records.sql in the Supabase SQL Editor first.");
  }
  process.exit(1);
}
