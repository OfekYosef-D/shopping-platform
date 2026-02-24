ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "stripe_session_id" text;
ALTER TABLE "orders" ADD CONSTRAINT IF NOT EXISTS "orders_stripe_session_id_unique" UNIQUE("stripe_session_id");
