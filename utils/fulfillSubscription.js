import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";
import { stripe } from "./stripe";

export async function fulfillSubscription(sessionId) {
  await dbConnect();

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items", "customer"],
  });

  // Ensure payment was successful
  if (session.payment_status !== "paid") {
    console.log("⚠️ Payment not successful for session:", sessionId);
    return;
  }

  const email = session.customer_email;

  // Check if the session has subscription details
  if (session.subscription) {
    // Retrieve the subscription object
    const subscriptionId = session.subscription;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ["items.data.price.product"],
    });

    // Get the product name from the subscription
    const product = subscription.items.data[0].price.product;
    let productName;

    if (typeof product === "string") {
      // fallback in case product wasn't expanded
      const prod = await stripe.products.retrieve(product);
      productName = prod.name;
    } else {
      productName = product.name;
    }

    // Determine the user's plan based on the product name
    const plan = productName.toLowerCase().includes("enterprise")
      ? "enterprise"
      : "premium";

    const subscriptionDate = subscription.created;
    const subscription30Days = subscriptionDate + 30 * 24 * 60 * 60;
    const planExpiresAt = new Date(subscription30Days * 1000);

    // Update user's plan in MongoDB
    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          plan,
          planExpiresAt,
          "facebook.adsRemaining": plan === "enterprise" ? Infinity : 3,
        },
      }
    );

    if (!updatedUser) {
      console.warn("⚠️ No user found with email:", email);
      return;
    }

    console.log(`✅ Updated user ${email} to plan: ${plan}`);
  } else {
    console.log(`💰 One-time payment completed for ${email}`);
  }
}
