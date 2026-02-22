import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

function createDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  // Disable prefetch for Supabase Transaction pool mode
  const client = postgres(connectionString, { prepare: false });
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
    return (getDb() as any)[prop];
  },
});
