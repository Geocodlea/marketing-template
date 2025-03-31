import { NextResponse } from "next/server";
import User from "@/models/User";
import Account from "@/models/Account";
import dbConnect from "@/utils/dbConnect";

export async function POST(req, { params }) {
  const { adCreative } = await req.json();
  const { id } = params;

  await dbConnect();
  const user = await User.findOne({ _id: id });
  const account = await Account.findOne({
    userId: id,
  });

  // Prepare the Facebook API request payload
  const facebookAdRequest = {
    creative: {
      object_story_spec: {
        link_data: {
          call_to_action: {
            type: adCreative.call_to_action,
            value: { link: adCreative.link },
          },
          description: adCreative.description,
          link: adCreative.link,
          message: adCreative.message,
          name: adCreative.name,
        },
        page_id: user.facebook.pageId,
      },
    },
  };

  // Make the GET request to Facebook to generate the ad preview
  const queryParams = new URLSearchParams({
    creative: JSON.stringify(facebookAdRequest.creative),
    ad_format: "DESKTOP_FEED_STANDARD",
    access_token: account.access_token,
  });

  try {
    const response = await fetch(
      `${process.env.FACEBOOK_API_URL}/act_${
        user.facebook.adAccountId
      }/generatepreviews?${queryParams.toString()}`,
      {
        method: "GET",
      }
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
