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
    errorMessage = err instanceof Error ? err.message : "לא ניתן להתחיל את תהליך התשלום.";
  }

  // redirect() must be outside the try/catch block
  if (stripeUrl) redirect(stripeUrl);

  return (
    <main className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">תשלום</h1>
      <p className="mb-6 text-destructive">{errorMessage ?? "אירעה תקלה לא צפויה."}</p>
      <Link href="/cart">
        <Button variant="outline">חזרה לסל</Button>
      </Link>
    </main>
  );
}
