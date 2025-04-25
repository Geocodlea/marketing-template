import PricingPage from "./index";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";

export const metadata = {
  title: "Pricing - || AiWave - AI SaaS Website NEXTJS14 UI Kit",
  description: "AiWave - AI SaaS Website NEXTJS14 UI Kit",
};

const PricingLayout = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  await dbConnect();
  const user = await User.findOne({ _id: userId }).select("plan");
  const plan = user?.plan;

  return (
    <>
      <PricingPage plan={plan} />
    </>
  );
};

export default PricingLayout;
