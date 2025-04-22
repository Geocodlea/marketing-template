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

  const respone = await fetch(
    `${process.env.NEXTAUTH_URL}/api/emails/brevo/${user.emailBrevo}`,
    {
      method: "PUT",
    }
  );
  const data = await respone.json();
  const domainVerified = data.status === 200;

  return (
    <>
      <EmailGeneratorPage
        email={email}
        domainVerified={domainVerified}
        plan={user.plan}
      />
    </>
  );
};

export default EmailGeneratorLayout;
