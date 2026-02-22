import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id),
  status: text("status", { enum: ["pending", "processing", "shipped", "delivered", "cancelled"] }).notNull().default("pending"),
  totalInCents: integer("total_in_cents").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
