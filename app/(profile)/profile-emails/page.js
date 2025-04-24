import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";

import Emails from "./Emails";

export const metadata = {
  title: "Plans & Billing - || AiWave - AI SaaS Website NEXTJS14 UI Kit",
  description: "AiWave - AI SaaS Website NEXTJS14 UI Kit",
};

const EmailsLayout = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/signin`);

  const userId = session.user.id;

  await dbConnect();
  const user = await User.findOne({ _id: userId });

  const apiBaseUrl = process.env.BREVO_API_URL;

  let filteredEmails;
  try {
    const response = await fetch(
      `${apiBaseUrl}/smtp/statistics/events?event=delivered`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          "api-key": process.env.BREVO_API_KEY,
        },
      }
    );

    const { events } = await response.json();
    filteredEmails = events.filter((event) => event.from === user.brevo.email);
  } catch (err) {
    throw new Error(`GET Ads error: ${err.message}`);
  }

  return <Emails emails={filteredEmails} />;
};

export default EmailsLayout;
