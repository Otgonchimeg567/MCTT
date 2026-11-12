/** Shared by the API route (authoritative) and the form (instant feedback). */

export type QuoteRequestInput = {
  requestType: "buy" | "supply";
  productId: string | null;
  company: string;
  contactName: string;
  phone: string;
  email: string | null;
  quantityTons: number | null;
  message: string | null;
};

export type FieldErrors = Partial<Record<keyof QuoteRequestInput, string>>;

export type ValidationResult = { ok: true; data: QuoteRequestInput } | { ok: false; errors: FieldErrors };

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export function validateQuoteRequest(raw: unknown): ValidationResult {
  const body = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const errors: FieldErrors = {};

  const requestType = body.requestType === "supply" ? "supply" : body.requestType === "buy" ? "buy" : null;
  if (!requestType) errors.requestType = "Хүсэлтийн төрлөө сонгоно уу.";

  const productId = str(body.productId) || null;
  if (requestType === "buy" && !productId) errors.productId = "Бүтээгдэхүүнээ сонгоно уу.";

  const company = str(body.company);
  if (company.length < 2 || company.length > 120) errors.company = "Байгууллагын нэрээ оруулна уу.";

  const contactName = str(body.contactName);
  if (contactName.length < 2 || contactName.length > 80) errors.contactName = "Холбогдох хүний нэрээ оруулна уу.";

  const phone = str(body.phone);
  if (!/^\+?[0-9 ()-]{8,20}$/.test(phone)) errors.phone = "Утасны дугаар буруу байна.";

  const email = str(body.email) || null;
  if (email && (email.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) errors.email = "Имэйл хаяг буруу байна.";

  let quantityTons: number | null = null;
  const rawQty = body.quantityTons;
  if (rawQty !== undefined && rawQty !== null && rawQty !== "") {
    const n = Number(rawQty);
    if (!Number.isFinite(n) || n <= 0 || n > 1_000_000) errors.quantityTons = "Хэмжээ 0-ээс их тоо байна.";
    else quantityTons = n;
  }

  const message = str(body.message) || null;
  if (message && message.length > 2000) errors.message = "Мессеж хэт урт байна (2000 тэмдэгт хүртэл).";

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    data: {
      requestType: requestType!,
      productId: requestType === "buy" ? productId : null,
      company,
      contactName,
      phone,
      email,
      quantityTons,
      message,
    },
  };
}
