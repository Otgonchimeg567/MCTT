import { NextResponse } from "next/server";
import { getProducts } from "@/lib/server/products";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/products — list of concentrate products from the database. */
export async function GET() {
  return NextResponse.json({ products: await getProducts() });
}
