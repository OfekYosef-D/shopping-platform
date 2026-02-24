import postgres from "postgres";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../../../.env.local") });

const sql = postgres(process.env.DATABASE_URL!, { prepare: false });

try {
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_session_id text`;
  console.log("Added stripe_session_id column");
  await sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'orders_stripe_session_id_unique'
      ) THEN
        ALTER TABLE orders ADD CONSTRAINT orders_stripe_session_id_unique UNIQUE (stripe_session_id);
      END IF;
    END
    $$
  `;
  console.log("Added unique constraint");
  console.log("Migration applied successfully");
} catch (e) {
  console.error("Migration error:", (e as Error).message);
  process.exit(1);
} finally {
  await sql.end();
}
