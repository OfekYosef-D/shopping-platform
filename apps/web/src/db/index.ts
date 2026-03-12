import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const POSTGRES_OPTIONS = {
  // Supabase transaction poolers are sensitive to prepared statements.
  prepare: false,
  // Keep the pool intentionally small for serverless/dev hot-reload workloads.
  max: 1,
  connect_timeout: 10,
  idle_timeout: 20,
} as const;

function createDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  const client = postgres(connectionString, POSTGRES_OPTIONS);
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
