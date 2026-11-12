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
  createdAt: string;
};

export function createQuoteRequest(input: QuoteRequestInput): number {
  const result = getDb()
    .prepare(
      `INSERT INTO quote_requests (request_type, product_id, company, contact_name, phone, email, quantity_tons, message)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      input.requestType,
      input.productId,
      input.company,
      input.contactName,
      input.phone,
      input.email,
      input.quantityTons,
      input.message,
    );
  return Number(result.lastInsertRowid);
}

export function listQuoteRequests(limit = 200): StoredQuoteRequest[] {
  return getDb()
    .prepare(
      `SELECT id, request_type AS requestType, product_id AS productId, company, contact_name AS contactName,
              phone, email, quantity_tons AS quantityTons, message, status, created_at AS createdAt
       FROM quote_requests ORDER BY id DESC LIMIT ?`,
    )
    .all(limit) as StoredQuoteRequest[];
}
