# Эм Си Ти Ти ХХК — вэб сайт

Next.js 15 (App Router) · Tailwind CSS v4 · Node.js API · SQLite

```
Frontend (Next.js + Tailwind)  ──  Node.js (API routes)  ──  Database (SQLite)
components/, app/page.tsx          app/api/*                 lib/server/db.ts → data/mctt.db
```

## Ажиллуулах

```bash
npm install
cp .env.example .env.local   # ADMIN_PASSWORD-оо солино
npm run dev                  # http://localhost:3000
```

Node.js **22.13+** шаардлагатай (built-in `node:sqlite` ашигладаг). Database файл `data/mctt.db` анх ажиллахад автоматаар үүсч, ФФ-95 / ФФ-97 бүтээгдэхүүнээр дүүрнэ.

## API

| Method | Path | Үүрэг |
|---|---|---|
| `GET` | `/api/products` | Бүтээгдэхүүний жагсаалт |
| `POST` | `/api/requests` | Худалдан авах / хүдэр нийлүүлэх хүсэлт хадгалах |

## Админ

`/admin/requests` — ирсэн хүсэлтүүд. `.env.local` дахь `ADMIN_USER` / `ADMIN_PASSWORD`-аар нэвтэрнэ.

## Бүтэц

- `lib/content.ts` — сайтын статик текст
- `lib/server/` — database холболт, query-нүүд (зөвхөн сервер талд)
- `lib/validation.ts` — form болон API-д хамтдаа ашиглагдах шалгалт
- `components/request/` — хүсэлтийн form, dialog (`#request` холбоосоор нээгдэнэ)

## Дизайн систем (`/styleguide`)

`/styleguide` хуудас нь сайтын бүх токен, үсэг, компонентыг харуулна. Өнгөний утга, contrast, үсгийн хэмжээг хөтөч дээрээс шууд уншдаг тул кодтой үргэлж таарна.

Шинэ хэсэг, хуудас нэмэхдээ дараах дарааллыг баримтална:

1. **Эхлээд `/styleguide`-ээс хайна.** Хэрэгтэй компонент байвал түүнийг ашиглана: `Heading`, `SectionHeader`, `Button`, `FeatureCard`, `Field`/`Input` гэх мэт.
2. **Шинэ өнгө хэрэгтэй бол** `app/globals.css`-ийн `@theme` хэсэгт `--color-*` токен болгож нэмээд `text-*`/`bg-*` class-аар ашиглана. `#hex` утгыг шууд бичихгүй.
3. **Шинэ gradient хэрэгтэй бол** `globals.css`-д `@utility` болгон нэмнэ.
4. **Гарчиг бичихдээ** `<h2 className="...">` гэж гараар бичихгүй, `<Heading level="h2">` ашиглана.
5. **Ижил загвар 2-оос олон газар давтагдвал** `components/ui/` эсвэл `components/cards/` дотор компонент болгоно.
6. **Шинэ компонент нэмсний дараа** `app/styleguide/page.tsx`-ийн "10 Компонент" хэсэгт `<SgDemo>` нэмж харуулна.
7. **Бичвэрийн өнгө сонгохдоо** styleguide-ийн contrast харьцааг шалгана: энгийн бичвэрт 4.5:1-ээс дээш байх ёстой.

## Production-д байршуулахад

SQLite нь нэг файл тул Vercel гэх мэт serverless орчинд хадгалагдахгүй. Байнгын диск бүхий VPS ашиглах, эсвэл `lib/server/` доторх query-нүүдийг PostgreSQL (жишээ нь Supabase) руу шилжүүлнэ.
