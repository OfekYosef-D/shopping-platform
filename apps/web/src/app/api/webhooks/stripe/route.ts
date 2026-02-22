import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // TODO: Verify Stripe webhook signature
  // const body = await request.text();
  // const sig = request.headers.get("stripe-signature");

  return NextResponse.json({ received: true });
}
