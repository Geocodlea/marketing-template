import AIGeneratorPage from "./index";

export const metadata = {
  title: "Text Generator - || AiWave - AI SaaS Website NEXTJS14 UI Kit",
  description: "AiWave - AI SaaS Website NEXTJS14 UI Kit",
};

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";

const AIGeneratorLayout = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/signin`);

  const userId = session.user.id;

  await dbConnect();
  const user = await User.findOne({ _id: userId });

  return (
    <>
      <AIGeneratorPage
        userId={userId}
        userFacebook={JSON.stringify(user.facebook)}
        plan={user.plan}
      />
    </>
  );
};

export default AIGeneratorLayout;
