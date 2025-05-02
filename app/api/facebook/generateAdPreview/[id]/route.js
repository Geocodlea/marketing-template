import { NextResponse } from "next/server";
import User from "@/models/User";
import dbConnect from "@/utils/dbConnect";

export async function POST(req, { params }) {
  const { adDetails } = await req.json();
  const { id } = params;

  await dbConnect();
  const user = await User.findOne({ _id: id });

  const accessToken = user.facebook.accessToken;
  const adAccountId = user.facebook.adAccountId;
  const pageId = user.facebook.pageId;
  const apiBaseUrl = process.env.FACEBOOK_API_URL;

  // Prepare the Facebook API request payload
  const creative = {
    object_story_spec: {
      link_data: {
        name: adDetails.name,
        message: adDetails.message,
        link: adDetails.link,
        picture: adDetails.picture || null,
        description: adDetails.description,
        call_to_action: adDetails.CTA,
      },
      page_id: pageId,
    },
  };

  // Make the GET request to Facebook to generate the ad preview
  const queryParams = new URLSearchParams({
    creative: JSON.stringify(creative),
    ad_format: "MOBILE_FEED_STANDARD",
    access_token: accessToken,
  });

  try {
    const response = await fetch(
      `${apiBaseUrl}/act_${adAccountId}/generatepreviews?${queryParams.toString()}`
    );

    const result = await response.json();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error generating Facebook ad preview:", error);
    return NextResponse.json({
      status: "error",
      message: "An error occurred while generating the ad preview.",
    });
  }
}
