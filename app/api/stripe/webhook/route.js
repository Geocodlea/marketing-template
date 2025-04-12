import { NextResponse } from "next/server";
import {
  fulfillSubscription,
  fulfillCancelSubscription,
} from "@/utils/fulfillSubscription";
import { stripe } from "@/utils/stripe";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

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

    case "customer.subscription.deleted":
    case "invoice.payment_failed":
      const subscription = event.data.object;

      fulfillCancelSubscription(subscription.customer);

      break;

    default:
      console.log(`ℹ️ Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
