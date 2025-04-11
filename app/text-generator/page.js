import BackToTop from "../backToTop";
import TextGeneratorPage from "./index";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";

export const metadata = {
  title: "Text Generator - || AiWave - AI SaaS Website NEXTJS14 UI Kit",
  description: "AiWave - AI SaaS Website NEXTJS14 UI Kit",
};

const TextGeneratorLayout = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/signin`);

  const userId = session.user.id;

  await dbConnect();
  const user = await User.findOne({ _id: userId });

  return (
    <>
      <TextGeneratorPage
        userId={userId}
        userAdsRemaining={user.facebook.adsRemaining}
      />
      <BackToTop />
    </>
  );
};

export default TextGeneratorLayout;
