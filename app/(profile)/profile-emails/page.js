import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";

import Emails from "./Emails";

const EmailsLayout = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/auth/signin`);

  const userId = session.user.id;

  await dbConnect();
  const user = await User.findOne({ _id: userId });

  const apiBaseUrl = process.env.BREVO_API_URL;
  const brevoApiKey = process.env.BREVO_API_KEY;

  const response = await fetch(
    // `${apiBaseUrl}/smtp/statistics/events?email=geocodlea@gmail.com`,
    `${apiBaseUrl}/smtp/statistics/events?tags=${user.brevo?.email}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        "api-key": brevoApiKey,
      },
    }
  );

  const data = await response.json();
  const events = data?.events;

  return <Emails emails={events} />;
};

export default EmailsLayout;
