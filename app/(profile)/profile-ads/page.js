import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";
import Account from "@/models/Account";

import Ads from "./Ads";

export const metadata = {
  title: "Plans & Billing - || AiWave - AI SaaS Website NEXTJS14 UI Kit",
  description: "AiWave - AI SaaS Website NEXTJS14 UI Kit",
};

const AdsLayout = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/signin`);

  const userId = session.user.id;

  await dbConnect();
  const user = await User.findOne({ _id: userId });
  const account = await Account.findOne({ userId });

  const accessToken = account.access_token;
  const adAccountId = user.facebook.adAccountId;
  const apiBaseUrl = process.env.FACEBOOK_API_URL;

  const fields = [
    "id",
    "name",
    "effective_status",
    "created_time",
    "targeting",
  ];

  // Prepare the Facebook API request payload
  const queryParams = new URLSearchParams({
    fields: fields.join(","),
    access_token: accessToken,
  });

  let ads;
  try {
    const response = await fetch(
      `${apiBaseUrl}/act_${adAccountId}/ads?${queryParams.toString()}`,
      {
        method: "GET",
      }
    );

    ads = await response.json();
  } catch (err) {
    throw new Error(`GET Ads error: ${err.message}`);
  }

  return <Ads ads={ads.data} />;
};

export default AdsLayout;
