import { parseString, parseUrl, readEnv } from "./schema";

export const publicEnv = readEnv({
  NEXT_PUBLIC_SITE_URL: { parser: parseUrl, optional: true },
  NEXT_PUBLIC_SUPABASE_URL: { parser: parseUrl },
  NEXT_PUBLIC_SUPABASE_ANON_KEY: { parser: parseString },
});
