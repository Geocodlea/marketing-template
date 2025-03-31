import { NextResponse } from "next/server";
import User from "@/models/User";
import Account from "@/models/Account";
import dbConnect from "@/utils/dbConnect";

export async function POST(req, { params }) {
  const { creative } = await req.json();
  const { id } = params;

  await dbConnect();
  const user = await User.findOne({ _id: id });
  const account = await Account.findOne({
    userId: id,
  });

  try {
    if (!creative) {
      return NextResponse.json({
        status: "error",
        message: "Missing ad creative data.",
      });
    }

    // Prepare the ad creative payload
    const adCreativePayload = {
      name: creative.name,
      object_story_spec: {
        link_data: {
          message: creative.message,
          link: creative.link,
          //   description: creative.description,
          call_to_action: {
            type: creative.call_to_action,
            value: { link: creative.link },
          },
        },
        page_id: user.facebook.pageId,
      },
      access_token: account.access_token,
    };

    // Step 1: Create Ad Creative
    const creativeResponse = await fetch(
      `${process.env.FACEBOOK_API_URL}/act_${user.facebook.adAccountId}/adcreatives`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adCreativePayload),
      }
    );

    const creativeResult = await creativeResponse.json();

    if (!creativeResult.id) {
      throw new Error(
        creativeResult.error?.message || "Failed to create ad creative."
      );
    }

    // Step 2: Create the Ad using the Ad Creative ID
    const adPayload = {
      name: creative.name,
      status: "PAUSED",
      adset_id: user.facebook.adSetId, // Make sure this is set in your environment variables
      creative: { creative_id: creativeResult.id },
      access_token: account.access_token,
    };

    const adResponse = await fetch(
      `${process.env.FACEBOOK_API_URL}/act_${user.facebook.adAccountId}/ads`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adPayload),
      }
    );

    const adResult = await adResponse.json();

    if (!adResult.id) {
      throw new Error(adResult.error?.message || "Failed to create ad.");
    }

    return NextResponse.json({
      status: "success",
      message: "Ad created successfully!",
      adId: adResult.id,
    });
  } catch (error) {
    console.error("Error creating Facebook ad:", error);
    return NextResponse.json({
      status: "error",
      message: error.message || "An error occurred while creating the ad.",
    });
  }
}
