import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { stripe } from "@/utils/stripe";

export async function POST(req, { params }) {
  const plan = await req.json();
  let price;

  if (plan === "Premium") price = "price_1RCbWDR50rqLKtmOimuvqfq4";
  if (plan === "Enterprise") price = "price_1RCeEQR50rqLKtmOVGxlW6yX";

  const headersList = await headers();
  const origin = headersList.get("origin");

  // Create Checkout Sessions from body params.
  const session = await stripe.checkout.sessions.create({
    customer_email: params.email,
    line_items: [
      {
        price,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${origin}/plans-billing?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/pricing?canceled=true`,
  });

  return NextResponse.json(session.url);
}
