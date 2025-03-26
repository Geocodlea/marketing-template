import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Account from "@/models/Account";

const adAccountId = process.env.FACEBOOK_AD_ACCOUNT_ID;
const pageId = process.env.FACEBOOK_PAGE_ID;

async function fetchWithErrorHandling(url, options) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      console.error(`Facebook API Error: ${JSON.stringify(data, null, 2)}`);
      throw new Error(data.error?.message || "Unknown Facebook API error");
    }

    return data;
  } catch (error) {
    console.error(`Request failed: ${error.message}`);
    throw new Error(`Network or API request failed: ${error.message}`);
  }
}

async function createAdCreative(accessToken) {
  const url = `https://graph.facebook.com/v22.0/act_${adAccountId}/adcreatives`;

  const body = {
    name: "My Ad Creative",
    object_story_spec: {
      page_id: pageId,
      link_data: {
        message: "Check out our new product!",
        link: "https://yourwebsite.com",
      },
    },
    access_token: accessToken,
  };

  return fetchWithErrorHandling(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function createAd(accessToken, adSetId, creativeId) {
  const url = `https://graph.facebook.com/v22.0/act_${adAccountId}/ads`;

  const body = {
    name: "My Automated Ad 3",
    adset_id: adSetId,
    creative: { creative_id: creativeId },
    status: "PAUSED",
    access_token: accessToken,
  };

  return fetchWithErrorHandling(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function GET(req) {
  await dbConnect();

  const campaignId = "120218668356350035";
  const adSetId = "120218668356470035";

  if (!adSetId) {
    return NextResponse.json(
      { error: "Ad Set ID is required" },
      { status: 400 }
    );
  }

  const accounts = await Account.find();
  const accessToken = accounts[0]?.access_token;

  if (!accessToken) {
    return NextResponse.json(
      { error: "Access token not found" },
      { status: 400 }
    );
  }

  try {
    const creative = await createAdCreative(accessToken);

    if (!creative.id) {
      throw new Error(
        `Failed to create ad creative: ${JSON.stringify(creative, null, 2)}`
      );
    }

    const ad = await createAd(accessToken, adSetId, creative.id);

    if (!ad.id) {
      throw new Error(`Failed to create ad: ${JSON.stringify(ad, null, 2)}`);
    }

    return NextResponse.json({ success: true, ad });
  } catch (error) {
    console.error("Error in ad creation:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
