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
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    console.warn("⚠️ No user found with email:", email);
    return;
  }

  // Check if the session has subscription details
  if (session.subscription) {
    // Retrieve the subscription object
    const subscriptionId = session.subscription;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ["items.data.price.product"],
    });

    const customerId = subscription.customer;
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

    // Cancel old subscription if exists and is different
    const oldSubscriptionId = existingUser.stripe?.subscriptionId;
    if (oldSubscriptionId && oldSubscriptionId !== subscriptionId) {
      try {
        await stripe.subscriptions.cancel(oldSubscriptionId);
        console.log(`🗑️ Cancelled old subscription: ${oldSubscriptionId}`);
      } catch (error) {
        console.error(
          `❌ Error cancelling old subscription: ${oldSubscriptionId}`,
          error
        );
      }
    }

    await User.findOneAndUpdate(
      { email },
      {
        $set: {
          plan,
          planExpiresAt,
          "stripe.subscriptionId": subscriptionId,
          "stripe.customerId": customerId,
          "facebook.adsRemaining": plan === "enterprise" ? Infinity : 3,
        },
      }
    );

    console.log(`✅ Updated user ${email} to plan: ${plan}`);
  } else {
    console.log(`💰 One-time payment completed for ${email}`);
  }
}

export async function fulfillCancelSubscription(customerId) {
  await dbConnect();
  const updatedUser = await User.findOneAndUpdate(
    { "stripe.customerId": customerId },
    {
      $unset: {
        plan: "",
        planExpiresAt: "",
        stripe: "",
        "facebook.adsRemaining": "",
      },
    }
  );

  if (!updatedUser) {
    console.warn("⚠️ No user found with customerId: ", customerId);
    return;
  }

  console.log(`✅ Updated user with customerId: ${customerId} to no plan`);
}
