import { NextResponse } from "next/server";
import User from "@/models/User";
import Account from "@/models/Account";
import dbConnect from "@/utils/dbConnect";

export async function POST(req, { params }) {
  const { adCreative, campaignData, adSetData } = await req.json();
  const { id } = params;

  await dbConnect();
  const user = await User.findOne({ _id: id });
  const account = await Account.findOne({ userId: id });

  try {
    if (!adCreative || !campaignData || !adSetData) {
      return NextResponse.json({
        status: "error",
        message: "Missing required data (ad creative, campaign, or ad set).",
      });
    }

    const accessToken = account.access_token;
    const adAccountId = user.facebook.adAccountId;
    const apiBaseUrl = process.env.FACEBOOK_API_URL;

    // Step 1: Create Campaign
    const campaignPayload = {
      name: campaignData.name,
      objective: campaignData.objective, // e.g., "LINK_CLICKS"
      status: "PAUSED",
      special_ad_categories: ["NONE"],
      access_token: accessToken,
    };

    const campaignResponse = await fetch(
      `${apiBaseUrl}/act_${adAccountId}/campaigns`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campaignPayload),
      }
    );

    const campaignResult = await campaignResponse.json();

    if (!campaignResult.id) {
      throw new Error(
        campaignResult.error?.message || "Failed to create campaign."
      );
    }

    const campaignId = campaignResult.id;

    // Step 2: Create Ad Set
    const adSetPayload = {
      name: adSetData.name,
      campaign_id: campaignId,
      billing_event: adSetData.billing_event, // e.g., "IMPRESSIONS"
      optimization_goal: adSetData.optimization_goal, // e.g., "LINK_CLICKS"
      targeting: adSetData.targeting,
      status: "PAUSED",
      daily_budget: adSetData.daily_budget,
      access_token: accessToken,
    };

    const adSetResponse = await fetch(
      `${apiBaseUrl}/act_${adAccountId}/adsets`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adSetPayload),
      }
    );

    const adSetResult = await adSetResponse.json();

    if (!adSetResult.id) {
      throw new Error(adSetResult.error?.message || "Failed to create ad set.");
    }

    const adSetId = adSetResult.id;

    // Step 3: Create Ad Creative
    const adCreativePayload = {
      name: adCreative.name,
      object_story_spec: {
        link_data: {
          message: adCreative.message,
          link: adCreative.link,
          call_to_action: {
            type: adCreative.call_to_action,
            value: { link: adCreative.link },
          },
        },
        page_id: user.facebook.pageId,
      },
      access_token: accessToken,
    };

    const creativeResponse = await fetch(
      `${apiBaseUrl}/act_${adAccountId}/adcreatives`,
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

    const creativeId = creativeResult.id;

    // Step 4: Create Ad
    const adPayload = {
      name: adCreative.name,
      status: "PAUSED",
      adset_id: adSetId,
      creative: { creative_id: creativeId },
      access_token: accessToken,
    };

    const adResponse = await fetch(`${apiBaseUrl}/act_${adAccountId}/ads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(adPayload),
    });

    const adResult = await adResponse.json();

    if (!adResult.id) {
      throw new Error(adResult.error?.message || "Failed to create ad.");
    }

    return NextResponse.json({
      status: "success",
      message: "Ad campaign, ad set, and ad created successfully!",
      campaignId,
      adSetId,
      adId: adResult.id,
    });
  } catch (error) {
    console.error("Error creating Facebook ad campaign:", error);
    return NextResponse.json({
      status: "error",
      message:
        error.message || "An error occurred while creating the ad campaign.",
    });
  }
}
