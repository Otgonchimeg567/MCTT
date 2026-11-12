import type { Metadata } from "next";
import { listQuoteRequests } from "@/lib/server/requests";
import { getProducts } from "@/lib/server/products";
import { Container } from "@/components/layout/Container";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Хүсэлтүүд — MCTT админ", robots: { index: false } };

const fmt = new Intl.DateTimeFormat("mn-MN", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Ulaanbaatar" });

export default function AdminRequestsPage() {
  const requests = listQuoteRequests();
  const productNames = new Map(getProducts().map((p) => [p.id, p.grade]));

  return (
    <Container className="py-12">
      <h1 className="font-display text-3xl font-extrabold text-ink">Ирсэн хүсэлтүүд</h1>
      <p className="pt-2 text-muted">Нийт {requests.length} хүсэлт</p>

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
                  <td className="px-4 py-3 whitespace-nowrap">{fmt.format(new Date(r.createdAt.replace(" ", "T") + "Z"))}</td>
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
    </Container>
  );
}
