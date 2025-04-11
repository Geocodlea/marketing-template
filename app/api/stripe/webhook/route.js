import { NextResponse } from "next/server";
import { fulfillSubscription } from "@/utils/fulfillSubscription";
import { stripe } from "@/utils/stripe";

const endpointSecret =
  "whsec_6b755ea9f1e73e7d5708427c117903d5029ce5c021df33c9a71fba2f672a67df"; // Your webhook secret here

export async function POST(req) {
  const rawBody = await req.text(); // Get the raw body for signature verification
  const signature = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);
  } catch (err) {
    console.error(
      "❌ Stripe webhook signature verification failed:",
      err.message
    );
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;

      try {
        const checkoutSession = await stripe.checkout.sessions.retrieve(
          session.id,
          {
            expand: ["line_items"],
          }
        );

        if (checkoutSession.payment_status === "paid") {
          if (checkoutSession.subscription) {
            await fulfillSubscription(session.id);
          }
        }
      } catch (err) {
        console.error("Error retrieving checkout session:", err);
        return NextResponse.json(
          { error: "Error processing payment" },
          { status: 500 }
        );
      }
      break;

    default:
      console.log(`ℹ️ Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
