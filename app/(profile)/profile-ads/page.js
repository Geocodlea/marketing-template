import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";

import Ads from "./Ads";

const AdsLayout = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/auth/signin`);

  const userId = session.user.id;

  await dbConnect();
  const user = await User.findOne({ _id: userId });

  const accessToken = user.facebook?.accessToken;
  const adAccountId = user.facebook?.adAccountId;
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

  const response = await fetch(
    `${apiBaseUrl}/act_${adAccountId}/ads?${queryParams.toString()}`
  );
  const ads = await response.json();

  return <Ads ads={ads?.data} />;
};

export default AdsLayout;
