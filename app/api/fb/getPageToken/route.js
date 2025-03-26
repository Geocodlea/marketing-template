import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Account from "@/models/Account";

const pageId = process.env.FACEBOOK_PAGE_ID;
const adAccountId = process.env.FACEBOOK_AD_ACCOUNT_ID;

export async function GET(req) {
  await dbConnect();

  const accounts = await Account.find();
  const userId = accounts[0].providerAccountId;
  const accessToken = accounts[0].access_token;

  const url = `https://graph.facebook.com/v22.0/${userId}/accounts?access_token=${accessToken}`;

  try {
    const res = await fetch(url, {
      method: "GET",
    });
    const data = await res.json();

    const pageToken = data.data[0].access_token;

    const url2 = `https://graph.facebook.com/v22.0/${pageId}/feed`;

    try {
      const res2 = await fetch(url2, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Auto-Created POST form API 2",
          access_token: pageToken,
        }),
      });
      const data = await res2.json();

      return Response.json(data);
    } catch (error) {
      return Response.json({ error: "Failed to fetch posts" }, { status: 500 });
    }
  } catch (error) {
    return Response.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
