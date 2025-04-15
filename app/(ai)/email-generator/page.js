import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";
import EmailGeneratorPage from "./index";

const EmailGeneratorLayout = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/signin`);

  const email = session.user.email;

  await dbConnect();
  const user = await User.findOne({ email });

  return (
    <>
      <EmailGeneratorPage email={email} plan={user.plan} />
    </>
  );
};

export default EmailGeneratorLayout;
