# Эм Си Ти Ти ХХК — вэб сайт

Next.js 15 (App Router) · Tailwind CSS v4 · Node.js API · Supabase (Postgres)

```
Frontend (Next.js + Tailwind)  ──  Node.js (API routes)  ──  Database (Supabase)
components/, app/page.tsx          app/api/*                 lib/server/db.ts → Supabase "mctt" төсөл
```

## Ажиллуулах

```bash
npm install
cp .env.example .env.local   # ADMIN_PASSWORD, SUPABASE_URL, SUPABASE_SECRET_KEY-ээ бичнэ
npm run dev                  # http://localhost:3000
```

Өгөгдөл Supabase-ийн `products`, `quote_requests` хүснэгтэд хадгалагдана. Хоёр хүснэгтэд RLS асаалттай, policy байхгүй — тиймээс зөвхөн сервер талын `SUPABASE_SECRET_KEY` уншиж, бичиж чадна. Энэ түлхүүрийг `NEXT_PUBLIC_` угтвартай болгож хэзээ ч бүү ил гарга.

## API

| Method | Path | Үүрэг |
|---|---|---|
| `GET` | `/api/products` | Бүтээгдэхүүний жагсаалт |
| `POST` | `/api/requests` | Худалдан авах / хүдэр нийлүүлэх хүсэлт хадгалах |

## Ажлын систем (`/admin`)

Ажилтны өдөр тутмын ажлын бүртгэл, даалгавар, файлыг нэг дор төвлөрүүлнэ. `/admin/login`-оор Supabase Auth (имэйл + нууц үг) ашиглан нэвтэрнэ.

| Хуудас | Админ | Менежер | Ажилтан |
|---|---|---|---|
| Хяналтын самбар | бүх байгууллага | өөрийн хэлтэс | өөрийн ажил |
| Ажилтнууд | нэмэх, засах, идэвхгүй болгох | хэлтсээ харах | — |
| Ажлын бүртгэл | бүгдийг харах, засах | хэлтсийг харах | өөрийнхөө бүртгэл |
| Даалгавар | бүгд | хэлтэст үүсгэх, оноох | оноогдсоноо харах, төлөв солих |
| Файл / хавтас | бүгд | хэлтсийн файл | өөрийн, даалгавартай холбогдсон |
| Үнийн хүсэлт | вэбээс ирсэн хүсэлт | — | — |

- Эрхийг зөвхөн `profiles.role`-оос уншина. Бүх шүүлтийг Postgres RLS хийнэ: `supabase/migrations/`.
- Файл нь Storage-ийн хаалттай `work-files` bucket-д `<user id>/<uuid>-<нэр>` замаар хадгалагдана. Мета өгөгдөл, хавтас нь `files`, `folders` хүснэгтэд байна. Татахад 60 секундын signed URL үүснэ.
- Хэлтсийг **Тохиргоо**-оос нэмнэ. Менежер зөвхөн өөрийн хэлтсийн ажилтнуудыг харна.

**Анхны админ:** `.env.local`-д `ADMIN_USER` (имэйл) болон `ADMIN_PASSWORD`-ийг бичээд `npm run bootstrap-admin` ажиллуулна. Дараагийн ажилтнуудыг админ **Ажилтнууд** хуудаснаас нэмнэ.

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

Vercel зэрэг орчинд `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `ADMIN_USER`, `ADMIN_PASSWORD`-ийг environment variable болгож тохируулна. Хуучин `data/mctt.db` (SQLite) файлыг ашиглахаа больсон.
