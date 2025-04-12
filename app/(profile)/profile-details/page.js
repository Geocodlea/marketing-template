import ProfileDetails from "@/components/ProfileDetails/ProfileDetails";

import { authOptions } from "/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Profile Details - || AiWave - AI SaaS Website NEXTJS14 UI Kit",
  description: "AiWave - AI SaaS Website NEXTJS14 UI Kit",
};

const ProfileDetailsPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/signin`);

  return <ProfileDetails />;
};

export default ProfileDetailsPage;
