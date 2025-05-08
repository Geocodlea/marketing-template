export const metadata = {
  title: "Generare Reclame cu AI",
  description:
    "Creează reclame eficiente pentru Facebook și alte platforme cu ajutorul inteligenței artificiale – texte persuasive, sugestii vizuale și segmentare automată a audienței.",
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

  const accessToken = user.facebook.accessToken;
  const adAccountId = user.facebook.adAccountId;
  const pageId = user.facebook.pageId;
  const adsRemaining = user.facebook.adsRemaining;

  const isFacebookData = Boolean(
    accessToken && adAccountId && pageId && adsRemaining
  );

  return (
    <>
      <AdsGeneratorPage
        userId={userId}
        isFacebookData={isFacebookData}
        fbAdsRemaining={adsRemaining}
        plan={user.plan}
      />
    </>
  );
};

export default AdsGeneratorLayout;
