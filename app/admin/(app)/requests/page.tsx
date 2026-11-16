import type { Metadata } from "next";
import { listQuoteRequests } from "@/lib/server/requests";
import { getProducts } from "@/lib/server/products";
import { requireMe } from "@/lib/auth";
import { PageHeader } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Үнийн хүсэлт — MCTT", robots: { index: false } };

const fmt = new Intl.DateTimeFormat("mn-MN", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Ulaanbaatar" });

/** Website quote requests. Read with the secret key, so the admin check here is what protects them. */
export default async function AdminRequestsPage() {
  await requireMe(["admin"]);
  const [requests, products] = await Promise.all([listQuoteRequests(), getProducts()]);
  const productNames = new Map(products.map((p) => [p.id, p.grade]));

  return (
    <>
      <PageHeader title="Үнийн хүсэлт" description={`Вэб сайтаас ирсэн нийт ${requests.length} хүсэлт`} />

      {requests.length === 0 ? (
        <p className="mt-8 rounded-[20px] border border-line bg-white p-8 text-center text-muted">Одоогоор хүсэлт ирээгүй байна.</p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-[20px] border border-line bg-white">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-line bg-sand text-xs tracking-wide text-muted uppercase">
              <tr>
                {["#", "Огноо", "Төрөл", "Бүтээгдэхүүн", "Байгууллага", "Холбогдох хүн", "Утас / имэйл", "Хэмжээ", "Мессеж"].map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-b border-line-soft align-top last:border-b-0">
                  <td className="px-4 py-3 text-muted">{r.id}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{fmt.format(new Date(r.createdAt))}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        r.requestType === "buy" ? "bg-lilac text-brand" : "bg-mint text-leaf"
                      }`}
                    >
                      {r.requestType === "buy" ? "Худалдан авах" : "Хүдэр нийлүүлэх"}
                    </span>
                  </td>
                  <td className="px-4 py-3">{r.productId ? productNames.get(r.productId) ?? r.productId : "—"}</td>
                  <td className="px-4 py-3 font-semibold">{r.company}</td>
                  <td className="px-4 py-3">{r.contactName}</td>
                  <td className="px-4 py-3">
                    <a href={`tel:${r.phone}`} className="block text-brand">
                      {r.phone}
                    </a>
                    {r.email && (
                      <a href={`mailto:${r.email}`} className="block text-muted">
                        {r.email}
                      </a>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{r.quantityTons != null ? `${r.quantityTons} тн` : "—"}</td>
                  <td className="max-w-[280px] px-4 py-3 whitespace-pre-wrap text-muted">{r.message ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
