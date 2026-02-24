import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Spotlight } from "@/components/ui/spotlight";
import { CheckCircle } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { session_id } = await searchParams;

  if (!session_id) redirect("/products");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Look up the order by Stripe session ID, scoped to the authenticated user
  const order = await db.query.orders.findFirst({
    where: eq(orders.stripeSessionId, session_id),
  });

  if (!order || order.userId !== user.id) redirect("/products");

  return (
    <Spotlight className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-dot-grid px-4 rounded-none">
      {/* Background fade */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-background/80 via-background/50 to-background/80" />

      <GlassCard className="relative z-10 flex max-w-md flex-col items-center gap-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10">
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>

        <div className="space-y-2">
          <h1 className="font-display text-4xl font-normal tracking-tight">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thanks for your purchase. Your order has been received and is being processed.
          </p>
        </div>

        <p className="font-mono text-xs text-muted-foreground">
          Order #{order.id.slice(0, 8)}…
        </p>

        <div className="flex w-full flex-col gap-2 sm:flex-row">
          <Link href="/dashboard" className="flex-1">
            <Button className="w-full rounded-full">View Dashboard</Button>
          </Link>
          <Link href="/products" className="flex-1">
            <Button variant="outline" className="w-full rounded-full">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </GlassCard>
    </Spotlight>
  );
}
