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
  highlighted: number;
};

export function getProducts(): Product[] {
  const rows = getDb()
    .prepare(
      `SELECT id, grade, name, purity_label, purity_percent, usage, description, highlighted
       FROM products ORDER BY sort_order, id`,
    )
    .all() as ProductRow[];

  return rows.map((r) => ({
    id: r.id,
    grade: r.grade,
    name: r.name,
    purityLabel: r.purity_label,
    purityPercent: r.purity_percent,
    usage: r.usage,
    description: r.description,
    highlighted: r.highlighted === 1,
  }));
}

export function productExists(id: string): boolean {
  return getDb().prepare("SELECT 1 FROM products WHERE id = ?").get(id) !== undefined;
}
