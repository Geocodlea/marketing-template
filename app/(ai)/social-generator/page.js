export const metadata = {
  title: "Postări Social Media cu AI",
  description:
    "Generează conținut pentru rețelele sociale, programează automat postările și optimizează-ți prezența online cu ajutorul inteligenței artificiale.",
};

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";
import SocialGeneratorPage from "./index";

const SocialGeneratorLayout = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/auth/signin`);

  const userId = session.user.id;

  await dbConnect();
  const user = await User.findOne({ _id: userId });

  return (
    <>
      <SocialGeneratorPage
        userId={userId}
        userFacebook={JSON.stringify(user.facebook)}
        plan={user.plan}
      />
    </>
  );
};

export default SocialGeneratorLayout;
