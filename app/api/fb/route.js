import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Account from "@/models/Account";

const pageId = process.env.FACEBOOK_PAGE_ID;
const adAccountId = process.env.FACEBOOK_AD_ACCOUNT_ID;

export async function GET(req) {
  await dbConnect();

  const accounts = await Account.find();
  const accessToken = accounts[0]?.access_token;

  if (!accessToken) {
    return NextResponse.json(
      { error: "No access token found" },
      { status: 401 }
    );
  }

  try {
    // 1️⃣ Check for Existing Campaign
    let campaignResponse = await fetch(
      `https://graph.facebook.com/v18.0/act_${adAccountId}/campaigns?fields=id,name,status&access_token=${accessToken}`
    );
    let campaignData = await campaignResponse.json();
    let campaign_id = campaignData.data?.[0]?.id; // Get first campaign if exists

    if (!campaign_id) {
      // 2️⃣ Create Campaign (if none exists)
      const newCampaignResponse = await fetch(
        `https://graph.facebook.com/v18.0/act_${adAccountId}/campaigns`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            name: "Auto-Created Campaign",
            objective: "PAGE_LIKES", // Or other objective like 'LINK_CLICKS'
            status: "ACTIVE",
            special_ad_categories: [], // Required field, leave empty if not applicable
          }),
        }
      );

      const newCampaignData = await newCampaignResponse.json();
      campaign_id = newCampaignData.id;
    }

    // 3️⃣ Check for Existing Ad Set
    let adSetResponse = await fetch(
      `https://graph.facebook.com/v18.0/act_${adAccountId}/adsets?fields=id,name,status&access_token=${accessToken}`
    );
    let adSetData = await adSetResponse.json();
    let adset_id = adSetData.data?.[0]?.id; // Get first ad set if exists

    if (!adset_id) {
      // 4️⃣ Create Ad Set (if none exists)
      const newAdSetResponse = await fetch(
        `https://graph.facebook.com/v18.0/act_${adAccountId}/adsets`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            name: "Auto-Created Ad Set",
            campaign_id: campaign_id,
            daily_budget: 1000, // Minimum budget requirement
            billing_event: "IMPRESSIONS",
            optimization_goal: "REACH",
            targeting: {
              geo_locations: { countries: ["US"] },
            },
            status: "ACTIVE",
          }),
        }
      );

      const newAdSetData = await newAdSetResponse.json();
      adset_id = newAdSetData.id;
    }

    // 5️⃣ Create Ad Creative (Unpublished Post)
    const creativeResponse = await fetch(
      `https://graph.facebook.com/v18.0/act_${adAccountId}/adcreatives`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          object_story_spec: {
            page_id: pageId,
            link_data: {
              message: "Check out our latest offer!",
              link: "https://www.example.com", // Replace with a real URL
              picture: "https://www.w3schools.com/html/img_chania.jpg", // ✅ Use "picture" instead of "image_url"
            },
          },
        }),
      }
    );

    const creativeData = await creativeResponse.json();
    console.log("Ad Creative Response:", creativeData); // Add this line to debug

    if (!creativeData.id) {
      return NextResponse.json(
        { error: "Failed to create ad creative", details: creativeData },
        { status: 500 }
      );
    }

    // 6️⃣ Create Ad Using Auto-Created Ad Set
    const adResponse = await fetch(
      `https://graph.facebook.com/v18.0/act_${adAccountId}/ads`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: "Auto Created Ad",
          adset_id: adset_id, // Auto-selected Ad Set
          creative: { creative_id: creativeData.id },
          status: "ACTIVE",
        }),
      }
    );

    const adData = await adResponse.json();
    return NextResponse.json(adData);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
