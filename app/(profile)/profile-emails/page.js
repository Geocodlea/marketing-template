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

  let emails;
  try {
    const response = await fetch(
      `${apiBaseUrl}/smtp/emails?email=geocodlea@gmail.com`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          "api-key": process.env.BREVO_API_KEY,
        },
      }
    );

    emails = await response.json();
    console.log("🚀 ~ page.js:46 ~ EmailsLayout ~ emails:", emails);
  } catch (err) {
    throw new Error(`GET Ads error: ${err.message}`);
  }

  return <Emails emails={emails.transactionalEmails} />;
};

export default EmailsLayout;
