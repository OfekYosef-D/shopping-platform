import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq, desc, inArray } from "drizzle-orm";
import { formatPrice } from "@/lib/constants";
import { GlassCard } from "@/components/ui/glass-card";
import { ShoppingBag, DollarSign, Clock, Package } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const recentOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, user.id))
    .orderBy(desc(orders.createdAt))
    .limit(10);

  // Fetch all line items for these orders in one query
  const orderIds = recentOrders.map((o) => o.id);
  const allOrderItems =
    orderIds.length > 0
      ? await db
          .select()
          .from(orderItems)
          .where(inArray(orderItems.orderId, orderIds))
      : [];

  // Group items by orderId for quick lookup
  const itemsByOrder = allOrderItems.reduce<Record<string, typeof allOrderItems>>(
    (acc, item) => {
      acc[item.orderId] = [...(acc[item.orderId] ?? []), item];
      return acc;
    },
    {}
  );

  const totalOrders = recentOrders.length;
  const totalSpent = recentOrders
    .filter((o) => o.status === "paid")
    .reduce((sum, o) => sum + o.totalInCents, 0);
  const lastOrder = recentOrders[0];

  return (
    <main className="container mx-auto max-w-7xl px-4 py-12">
      {/* Header */}
      <div className="mb-10 space-y-1">
        <h1 className="font-display text-5xl font-normal tracking-tight sm:text-6xl">Dashboard</h1>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>

      {/* Stats */}
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <GlassCard className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/40 bg-muted">
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Total Orders</p>
            <p className="text-2xl font-semibold">{totalOrders}</p>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/40 bg-muted">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Total Spent</p>
            <p className="text-2xl font-semibold">{formatPrice(totalSpent)}</p>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/40 bg-muted">
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Last Order</p>
            <p className="text-2xl font-semibold">
              {lastOrder ? new Date(lastOrder.createdAt).toLocaleDateString() : "—"}
            </p>
          </div>
        </GlassCard>
      </div>

      {/* Orders */}
      <section>
        <h2 className="mb-4 text-lg font-semibold tracking-tight">Order History</h2>
        {recentOrders.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <Package className="h-10 w-10 text-muted-foreground/40" />
            <p className="text-muted-foreground">No orders yet. Start shopping!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <GlassCard
                key={order.id}
                className="p-4"
              >
                {/* Order header */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-sm text-muted-foreground">
                      #{order.id.slice(0, 8)}…
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(order.totalInCents)}</p>
                    <span
                      className={`text-xs capitalize font-medium ${
                        order.status === "paid"
                          ? "text-green-600 dark:text-green-400"
                          : order.status === "cancelled"
                            ? "text-destructive"
                            : "text-muted-foreground"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Line items */}
                {(itemsByOrder[order.id]?.length ?? 0) > 0 && (
                  <div className="mt-3 space-y-1 border-t border-border/40 pt-3">
                    {itemsByOrder[order.id].map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-xs text-muted-foreground"
                      >
                        <span>
                          {item.productName}
                          <span className="ml-1 opacity-60">× {item.quantity}</span>
                        </span>
                        <span>{formatPrice(item.priceInCents * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
