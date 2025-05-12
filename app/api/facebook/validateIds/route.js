import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";

export async function POST(req) {
  const body = await req.json();
  const { adAccountId, pageId } = body;

  const session = await getServerSession(authOptions);
  const userId = session.user.id;

  await dbConnect();
  const user = await User.findOne({ _id: userId });
  const accessToken = user.facebook?.accessToken;

  if (!accessToken) {
    return NextResponse.json({
      status: "danger",
      message: "Access token is missing.",
    });
  }

  try {
    // Check if the user owns the ad account
    if (adAccountId) {
      const fbRes = await fetch(
        `${process.env.FACEBOOK_API_URL}/me/adaccounts?access_token=${accessToken}`
      );
      const fbData = await fbRes.json();

      if (!fbRes.ok) {
        return NextResponse.json({
          status: "danger",
          message: "Facebook API returned an error.",
        });
      }

      const userAdAccounts = fbData.data || [];
      const ownsAdAccount = userAdAccounts.some(
        (adAccount) => adAccount.account_id === adAccountId
      );

      if (!ownsAdAccount) {
        return NextResponse.json({
          status: "danger",
          message: "Ad Account ID is invalid.",
        });
      }
    }

    // Check if the user owns the page
    if (pageId) {
      const fbRes = await fetch(
        `${process.env.FACEBOOK_API_URL}/me/accounts?access_token=${accessToken}`
      );
      const fbData = await fbRes.json();

      if (!fbRes.ok) {
        return NextResponse.json({
          status: "danger",
          message: "Facebook API returned an error.",
        });
      }

      const userPages = fbData.data || [];
      const ownsPage = userPages.some((page) => page.id === pageId);

      if (!ownsPage) {
        return NextResponse.json({
          status: "danger",
          message: "Page ID is invalid.",
        });
      }
    }

    return NextResponse.json({
      status: "success",
      message: "Contul a fost actualizat cu succes!",
    });
  } catch (error) {
    return NextResponse.json({
      status: "danger",
      message: error.message || "An error occurred.",
    });
  }
}
