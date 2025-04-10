import BackToTop from "../backToTop";
import ProfileDetailsPage from "./index";
import { authOptions } from "/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Profile Details - || AiWave - AI SaaS Website NEXTJS14 UI Kit",
  description: "AiWave - AI SaaS Website NEXTJS14 UI Kit",
};

const ProfileDetailsLayout = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/`);

  return (
    <>
      <ProfileDetailsPage />
      <BackToTop />
    </>
  );
};

export default ProfileDetailsLayout;
