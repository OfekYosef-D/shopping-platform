import { pgTable, uuid, text, integer, numeric, timestamp } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  priceInCents: integer("price_in_cents").notNull(),
  imageUrl: text("image_url"),
  category: text("category"),
  stock: integer("stock").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
