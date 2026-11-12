import "server-only";
import fs from "node:fs";
import path from "node:path";

/**
 * Database layer (the "red box").
 * Uses Node's built-in SQLite (node:sqlite) — no extra server or account needed.
 * Loaded via process.getBuiltinModule so the bundler never tries to resolve it.
 */

type RunResult = { changes: number | bigint; lastInsertRowid: number | bigint };
type Statement = {
  run(...params: unknown[]): RunResult;
  get(...params: unknown[]): unknown;
  all(...params: unknown[]): unknown[];
};
export type Database = { exec(sql: string): void; prepare(sql: string): Statement };

const { DatabaseSync } = (
  process as unknown as { getBuiltinModule(id: string): unknown }
).getBuiltinModule("node:sqlite") as { DatabaseSync: new (file: string) => Database };

const DB_PATH = process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "mctt.db");

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS products (
    id              TEXT PRIMARY KEY,
    grade           TEXT NOT NULL,
    name            TEXT NOT NULL,
    purity_label    TEXT NOT NULL,
    purity_percent  INTEGER NOT NULL CHECK (purity_percent BETWEEN 0 AND 100),
    usage           TEXT NOT NULL,
    description     TEXT NOT NULL,
    highlighted     INTEGER NOT NULL DEFAULT 0,
    sort_order      INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS quote_requests (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    request_type    TEXT NOT NULL CHECK (request_type IN ('buy', 'supply')),
    product_id      TEXT REFERENCES products(id),
    company         TEXT NOT NULL,
    contact_name    TEXT NOT NULL,
    phone           TEXT NOT NULL,
    email           TEXT,
    quantity_tons   REAL,
    message         TEXT,
    status          TEXT NOT NULL DEFAULT 'new',
    created_at      TEXT NOT NULL DEFAULT (datetime('now'))
  );
`;

const SEED_PRODUCTS = [
  {
    id: "ff-95",
    grade: "FF-95",
    name: "ФФ-95 баяжмал",
    purity_label: "≥ 95%",
    purity_percent: 95,
    usage: "Химийн, металлурги",
    description: "Химийн болон металлургийн үйлдвэрт хэрэглэгддэг флотацийн баяжмал.",
    highlighted: 0,
    sort_order: 1,
  },
  {
    id: "ff-97",
    grade: "FF-97",
    name: "ФФ-97 баяжмал",
    purity_label: "≥ 97%",
    purity_percent: 97,
    usage: "Химийн үйлдвэр",
    description: "Өндөр цэвэршилттэй, химийн үйлдвэрийн шаардлагад нийцсэн баяжмал.",
    highlighted: 1,
    sort_order: 2,
  },
];

function open(): Database {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const db = new DatabaseSync(DB_PATH);
  db.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");
  db.exec(SCHEMA);

  const { count } = db.prepare("SELECT COUNT(*) AS count FROM products").get() as { count: number };
  if (count === 0) {
    const insert = db.prepare(
      `INSERT INTO products (id, grade, name, purity_label, purity_percent, usage, description, highlighted, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    );
    for (const p of SEED_PRODUCTS) {
      insert.run(p.id, p.grade, p.name, p.purity_label, p.purity_percent, p.usage, p.description, p.highlighted, p.sort_order);
    }
  }
  return db;
}

// Reuse one connection across hot reloads in development.
const globalForDb = globalThis as unknown as { __mcttDb?: Database };

export function getDb(): Database {
  globalForDb.__mcttDb ??= open();
  return globalForDb.__mcttDb;
}
