/**
 * Migration runner — applies every *.sql file under src/db/migrations in
 * filename order.  Safe to re-run: all statements use IF NOT EXISTS / IF EXISTS.
 *
 * Usage:  bun run db:migrate
 */

import { readdir, readFile } from "fs/promises";
import { join } from "path";
import { db } from "./src/db";
import { sql } from "drizzle-orm";

const MIGRATIONS_DIR = join(import.meta.dir, "src/db/migrations");

async function run() {
  const files = (await readdir(MIGRATIONS_DIR))
    .filter((f) => f.endsWith(".sql"))
    .sort();

  if (files.length === 0) {
    console.log("No migration files found.");
    process.exit(0);
  }

  for (const file of files) {
    const filePath = join(MIGRATIONS_DIR, file);
    const sqlText = await readFile(filePath, "utf-8");
    const statements = sqlText
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean);

    console.log(`▶  Applying ${file} (${statements.length} statement(s))…`);
    let skipped = 0;
    let applied = 0;
    for (const statement of statements) {
      try {
        await db.execute(sql.raw(statement));
        applied++;
      } catch (err: unknown) {
        const drizzleMsg = err instanceof Error ? err.message : String(err);
        // DrizzleQueryError wraps the real PostgresError in `.cause`
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pgMsg: string = (err as any)?.cause?.message ?? "";
        const combined = `${drizzleMsg} ${pgMsg}`.toLowerCase();

        // Ignore "already exists" / "duplicate" — idempotent re-runs
        // Also match Postgres error codes: 42P07 duplicate_table, 42710 duplicate_object, 42701 duplicate_column
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pgCode: string = (err as any)?.cause?.code ?? "";
        const isDuplicate =
          combined.includes("already exists") ||
          combined.includes("duplicate") ||
          ["42p07", "42710", "42701"].includes(pgCode.toLowerCase());
        if (isDuplicate) {
          skipped++;
        } else {
          console.error(`✗  ${file} failed on statement:\n  ${statement}\n  ${drizzleMsg}`);
          process.exit(1);
        }
      }
    }
    console.log(`✓  ${file} done (applied: ${applied}, skipped: ${skipped}).`);
  }

  console.log("\nAll migrations complete.");
  process.exit(0);
}

run();
