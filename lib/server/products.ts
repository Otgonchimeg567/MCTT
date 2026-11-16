import "server-only";
import { getDb } from "./db";
import type { Product } from "@/lib/types";

type ProductRow = {
  id: string;
  grade: string;
  name: string;
  purity_label: string;
  purity_percent: number;
  usage: string;
  description: string;
  highlighted: boolean;
};

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await getDb()
    .from("products")
    .select("id, grade, name, purity_label, purity_percent, usage, description, highlighted")
    .order("sort_order")
    .order("id")
    .returns<ProductRow[]>();
  if (error) throw error;

  return data.map((r) => ({
    id: r.id,
    grade: r.grade,
    name: r.name,
    purityLabel: r.purity_label,
    purityPercent: r.purity_percent,
    usage: r.usage,
    description: r.description,
    highlighted: r.highlighted,
  }));
}

export async function productExists(id: string): Promise<boolean> {
  const { count, error } = await getDb().from("products").select("id", { count: "exact", head: true }).eq("id", id);
  if (error) throw error;
  return (count ?? 0) > 0;
}
