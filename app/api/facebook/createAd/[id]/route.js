import { NextResponse } from "next/server";
import User from "@/models/User";
import Account from "@/models/Account";
import dbConnect from "@/utils/dbConnect";

export async function POST(req, { params }) {
  const {
    adDetails: { campaign, adSet, adCreative },
  } = await req.json();
  const { id } = params;

  console.log("API input:", campaign, adSet, adCreative);

  await dbConnect();

  try {
    if (!campaign || !adSet || !adCreative) {
      return NextResponse.json({
        status: "error",
        message: "Missing required data (campaign, ad set, or ad creative).",
      });
    }

    const user = await User.findOne({ _id: id });
    const account = await Account.findOne({ userId: id });

    if (!user || !account) {
      return NextResponse.json({
        status: "error",
        message: "User or account not found.",
      });
    }

    const accessToken = account.access_token;
    const adAccountId = user.facebook.adAccountId;
    const pageId = user.facebook.pageId;
    const formId = user.facebook.formId;
    const apiBaseUrl = process.env.FACEBOOK_API_URL;

    // Step 1: Create Campaign
    const campaignPayload = {
      name: campaign.name,
      objective: campaign.objective,
      status: campaign.status,
      special_ad_categories: ["NONE"],
      access_token: accessToken,
    };

    let campaignResult;
    try {
      const campaignResponse = await fetch(
        `${apiBaseUrl}/act_${adAccountId}/campaigns`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(campaignPayload),
        }
      );
      campaignResult = await campaignResponse.json();

      if (!campaignResponse.ok) {
        console.error("Campaign creation error:", campaignResult);
        throw new Error(
          campaignResult.error?.message || "Campaign creation failed"
        );
      }
    } catch (err) {
      throw new Error(`Campaign API error: ${err.message}`);
    }

    const campaignId = campaignResult.id;

    // Step 2: Create Ad Set
    const adSetPayload = {
      name: adSet.name,
      campaign_id: campaignId,
      billing_event: adSet.billingEvent,
      optimization_goal: adSet.optimizationGoal,
      daily_budget: adSet.dailyBudget.toString(),
      bid_strategy: adSet.bidStrategy,
      destination_type: "ON_AD",
      targeting: {
        geo_locations: {
          countries: adSet.targeting.geoLocations.countries,
        },
      },
      status: campaign.status,
      promoted_object: {
        page_id: pageId,
        custom_event_type: "LEAD",
      },
      access_token: accessToken,
    };

    let adSetResult;
    try {
      const adSetResponse = await fetch(
        `${apiBaseUrl}/act_${adAccountId}/adsets`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(adSetPayload),
        }
      );
      adSetResult = await adSetResponse.json();

      if (!adSetResponse.ok) {
        console.error("AdSet creation error:", adSetResult);
        throw new Error(adSetResult.error?.message || "Ad set creation failed");
      }
    } catch (err) {
      throw new Error(`Ad Set API error: ${err.message}`);
    }

    const adSetId = adSetResult.id;

    // Step 3: Create Ad Creative
    const adCreativePayload = {
      name: adCreative.name,
      object_story_spec: {
        page_id: pageId,
        link_data: {
          message: adCreative.objectStorySpec.linkData.message,
          link: "https://fb.me/",
          call_to_action: {
            type: adCreative.objectStorySpec.linkData.CTA.type,
            value: {
              lead_gen_form_id: formId,
            },
          },
        },
      },
      access_token: accessToken,
    };

    let creativeResult;
    try {
      const creativeResponse = await fetch(
        `${apiBaseUrl}/act_${adAccountId}/adcreatives`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(adCreativePayload),
        }
      );
      creativeResult = await creativeResponse.json();

      if (!creativeResponse.ok) {
        console.error("Creative creation error:", creativeResult);
        throw new Error(
          creativeResult.error?.message || "Ad creative creation failed"
        );
      }
    } catch (err) {
      throw new Error(`Ad Creative API error: ${err.message}`);
    }

    const creativeId = creativeResult.id;

    // Step 4: Create Ad
    const adPayload = {
      name: adCreative.name,
      status: campaign.status,
      adset_id: adSetId,
      creative: { creative_id: creativeId },
      access_token: accessToken,
    };

    let adResult;
    try {
      const adResponse = await fetch(`${apiBaseUrl}/act_${adAccountId}/ads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adPayload),
      });
      adResult = await adResponse.json();

      if (!adResponse.ok) {
        console.error("Ad creation error:", adResult);
        throw new Error(adResult.error?.message || "Ad creation failed");
      }
    } catch (err) {
      throw new Error(`Ad API error: ${err.message}`);
    }

    return NextResponse.json({
      status: "success",
      message: "Ad campaign, ad set, and ad created successfully!",
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
