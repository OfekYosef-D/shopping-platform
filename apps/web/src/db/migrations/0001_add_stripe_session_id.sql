ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "stripe_session_id" text;
CREATE UNIQUE INDEX IF NOT EXISTS "orders_stripe_session_id_unique" ON "orders"("stripe_session_id");
