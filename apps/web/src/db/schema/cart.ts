import { pgTable, uuid, integer, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { users } from "./users";
import { products } from "./products";

export const cartItems = pgTable("cart_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  productId: uuid("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("cart_user_product_idx").on(table.userId, table.productId),
]);
