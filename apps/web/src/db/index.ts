import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/lib/env/server";
import * as schema from "./schema";

function createDb() {
  // Disable prefetch for Supabase Transaction pool mode
  const client = postgres(env.DATABASE_URL, { prepare: false });
  return drizzle({ client, schema });
}

let _db: ReturnType<typeof createDb> | null = null;

export function getDb() {
  if (!_db) _db = createDb();
  return _db;
}

// Convenience alias — lazy-initialized on first access
export const db = new Proxy({} as ReturnType<typeof createDb>, {
  get(_, prop) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (getDb() as any)[prop];
  },
});
