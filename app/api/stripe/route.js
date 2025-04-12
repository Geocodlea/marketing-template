import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { stripe } from "@/utils/stripe";

export async function POST(req) {
  const { plan, email } = await req.json();
  let price;

  if (plan === "Premium") price = "price_1RCbWDR50rqLKtmOimuvqfq4";
  if (plan === "Enterprise") price = "price_1RCeEQR50rqLKtmOVGxlW6yX";

  const headersList = await headers();
  const origin = headersList.get("origin");

  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    line_items: [
      {
        price,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${origin}/plans-billing?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/pricing?canceled=true`,
    payment_method_types: ["card"],
  });

  return NextResponse.json(session.url);
}
