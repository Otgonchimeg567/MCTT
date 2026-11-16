import { NextResponse } from "next/server";
import { validateQuoteRequest } from "@/lib/validation";
import { productExists } from "@/lib/server/products";
import { createQuoteRequest } from "@/lib/server/requests";

export const runtime = "nodejs";

/** POST /api/requests — store a purchase / ore-supply request. */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Буруу хүсэлт." }, { status: 400 });
  }

  const result = validateQuoteRequest(body);
  if (!result.ok) {
    return NextResponse.json({ error: "Мэдээллээ шалгана уу.", fields: result.errors }, { status: 400 });
  }

  try {
    if (result.data.productId && !(await productExists(result.data.productId))) {
      return NextResponse.json(
        { error: "Мэдээллээ шалгана уу.", fields: { productId: "Ийм бүтээгдэхүүн олдсонгүй." } },
        { status: 400 },
      );
    }

    const id = await createQuoteRequest(result.data);
    return NextResponse.json({ id }, { status: 201 });
  } catch (err) {
    console.error("Failed to save quote request", err);
    return NextResponse.json({ error: "Хадгалах үед алдаа гарлаа. Дахин оролдоно уу." }, { status: 500 });
  }
}
