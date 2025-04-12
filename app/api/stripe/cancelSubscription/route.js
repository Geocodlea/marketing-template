import { NextResponse } from "next/server";
import { stripe } from "@/utils/stripe";

export async function POST(req) {
  const { subscriptionId } = await req.json();

  if (!subscriptionId) {
    return NextResponse.json({
      status: "danger",
      message: "Nu a fost găsit abonamentul. Te rugăm să ne contactezi.",
    });
  }

  try {
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    return NextResponse.json({
      status: "success",
      message: "Abonamentul a fost anulat cu succes!",
    });
  } catch (error) {
    return NextResponse.json({ status: "danger", message: error.message });
  }
}
