import ProfileBody from "./ProfileBody";
import UserNav from "../Common/UserNav";

import { authOptions } from "/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";

const ProfileDetails = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/signin`);

  await dbConnect();
  const user = await User.findOne({ _id: session.user.id });

  return (
    <>
      <UserNav title="Detalii Profil" />

      <div className="content-page pb--50">
        <div className="chat-box-list">
          <ProfileBody userData={JSON.stringify(user)} />
        </div>
      </div>
    </>
  );
};

export default ProfileDetails;
