export const metadata = {
  title: "Text Generator - || AiWave - AI SaaS Website NEXTJS14 UI Kit",
  description: "AiWave - AI SaaS Website NEXTJS14 UI Kit",
};

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";
import AdsGeneratorPage from "./index";

const AdsGeneratorLayout = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/auth/signin`);

  const userId = session.user.id;

  await dbConnect();
  const user = await User.findOne({ _id: userId });

  return (
    <>
      <AdsGeneratorPage
        userId={userId}
        userFacebook={JSON.stringify(user.facebook)}
        plan={user.plan}
      />
    </>
  );
};

export default AdsGeneratorLayout;
