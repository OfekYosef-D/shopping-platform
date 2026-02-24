import { redirect } from "next/navigation";
import Link from "next/link";
import { createCheckoutSession } from "@/actions/checkout.actions";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  let stripeUrl: string | null = null;
  let errorMessage: string | null = null;

  try {
    stripeUrl = await createCheckoutSession();
  } catch (err) {
    errorMessage = err instanceof Error ? err.message : "Failed to start checkout.";
  }

  // redirect() must be outside the try/catch block
  if (stripeUrl) redirect(stripeUrl);

  return (
    <main className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Checkout</h1>
      <p className="text-destructive mb-6">{errorMessage ?? "Something went wrong."}</p>
      <Link href="/cart">
        <Button variant="outline">Back to Cart</Button>
      </Link>
    </main>
  );
}
