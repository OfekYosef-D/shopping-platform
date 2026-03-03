import { parseString, parseUrl, readEnv } from "./schema";
import { publicEnv } from "./public";

const serverEnv = readEnv({
  DATABASE_URL: { parser: parseUrl },
  STRIPE_SECRET_KEY: { parser: parseString },
  STRIPE_WEBHOOK_SECRET: { parser: parseString },
});

export const env = {
  ...publicEnv,
  ...serverEnv,
};
