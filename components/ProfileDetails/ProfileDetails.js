import ProfileBody from "./ProfileBody";
import UserNav from "../Common/UserNav";

import { authOptions } from "/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";

const ProfileDetails = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/auth/signin`);

  await dbConnect();
  const user = await User.findOne({ _id: session.user.id });
  const userClientData = {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    brevo: { email: user.brevo.email, name: user.brevo.name },
    facebook: {
      pageId: user.facebook.pageId,
      adAccountId: user.facebook.adAccountId,
      hasAccessToken: Boolean(user.facebook.accessToken),
    },
  };

  return (
    <>
      <UserNav title="Detalii Profil" />

      <div className="content-page pb--50">
        <div className="chat-box-list">
          <ProfileBody user={userClientData} />
        </div>
      </div>
    </>
  );
};

export default ProfileDetails;
