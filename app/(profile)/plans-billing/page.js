import PlansBilling from "@/components/PlansBilling/PlansBilling";

import { stripe } from "@/utils/stripe";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";

export const metadata = {
  title: "Plans & Billing - || AiWave - AI SaaS Website NEXTJS14 UI Kit",
  description: "AiWave - AI SaaS Website NEXTJS14 UI Kit",
};

const PlansBillingLayout = async ({ searchParams }) => {
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/signin`);

  const userId = session.user.id;

  await dbConnect();
  const user = await User.findOne({ _id: userId });
  const plan = user.plan;
  const planExpiresAt = user.planExpiresAt;
  const subscriptionId = user.subscriptionId;

  let paymentStatus;

  if (searchParams.session_id) {
    const { session_id } = await searchParams;

    const { status } = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "payment_intent"],
    });

    if (status === "open") {
      paymentStatus = "open";
    }

    if (status === "complete") {
      paymentStatus = "complete";
    }
  }

  return (
    <PlansBilling
      plan={plan}
      planExpiresAt={planExpiresAt}
      paymentStatus={paymentStatus}
      subscriptionId={subscriptionId}
    />
  );
};

export default PlansBillingLayout;
