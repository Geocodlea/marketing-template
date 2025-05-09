import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";
import UserNav from "@/components/Common/UserNav";
import PerformanceChart from "./PerformanceChart";

export default async function AdDetailsPage({ params }) {
  const { id } = params;

  const session = await getServerSession(authOptions);
  if (!session) redirect(`/auth/signin`);

  const userId = session.user.id;

  await dbConnect();
  const user = await User.findOne({ _id: userId });

  const accessToken = user.facebook?.accessToken;
  const apiBaseUrl = process.env.FACEBOOK_API_URL;

  const insightsFields = [
    "impressions",
    "clicks",
    "ctr",
    "spend",
    "reach",
    "frequency",
    "date_start",
    "date_stop",
  ];

  // Prepare the Facebook API request payload
  const queryParams = new URLSearchParams({
    fields: insightsFields.join(","),
    date_preset: "last_7d",
    access_token: accessToken,
  });

  const response = await fetch(
    `${apiBaseUrl}/${id}/insights?${queryParams.toString()}`
  );
  const adInsights = await response.json();

  return (
    <>
      <UserNav title="Facebook Ad Insights" />

      <PerformanceChart data={adInsights.data} />
    </>
  );
}
