import "server-only";
import { getDb } from "./db";
import type { QuoteRequestInput } from "@/lib/validation";

export type StoredQuoteRequest = {
  id: number;
  requestType: "buy" | "supply";
  productId: string | null;
  company: string;
  contactName: string;
  phone: string;
  email: string | null;
  quantityTons: number | null;
  message: string | null;
  status: string;
  /** ISO timestamp (timestamptz). */
  createdAt: string;
};

type QuoteRequestRow = {
  id: number;
  request_type: "buy" | "supply";
  product_id: string | null;
  company: string;
  contact_name: string;
  phone: string;
  email: string | null;
  quantity_tons: number | null;
  message: string | null;
  status: string;
  created_at: string;
};

export async function createQuoteRequest(input: QuoteRequestInput): Promise<number> {
  const { data, error } = await getDb()
    .from("quote_requests")
    .insert({
      request_type: input.requestType,
      product_id: input.productId,
      company: input.company,
      contact_name: input.contactName,
      phone: input.phone,
      email: input.email,
      quantity_tons: input.quantityTons,
      message: input.message,
    })
    .select("id")
    .single<{ id: number }>();
  if (error) throw error;
  return data.id;
}

export async function listQuoteRequests(limit = 200): Promise<StoredQuoteRequest[]> {
  const { data, error } = await getDb()
    .from("quote_requests")
    .select("*")
    .order("id", { ascending: false })
    .limit(limit)
    .returns<QuoteRequestRow[]>();
  if (error) throw error;

  return data.map((r) => ({
    id: r.id,
    requestType: r.request_type,
    productId: r.product_id,
    company: r.company,
    contactName: r.contact_name,
    phone: r.phone,
    email: r.email,
    // numeric can come back as a string from PostgREST
    quantityTons: r.quantity_tons === null ? null : Number(r.quantity_tons),
    message: r.message,
    status: r.status,
    createdAt: r.created_at,
  }));
}
