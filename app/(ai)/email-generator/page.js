import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";
import EmailGeneratorPage from "./index";

const EmailGeneratorLayout = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/signin`);

  const userId = session.user.id;

  await dbConnect();
  const user = await User.findOne({ _id: userId });
  const brevoEmail = user.brevo.email;
  const brevoName = user.brevo.name;

  const respone = await fetch(
    `${process.env.NEXTAUTH_URL}/api/emails/brevo/${brevoEmail}`,
    {
      method: "PUT",
    }
  );
  const data = await respone.json();
  const domainVerified = data.status === 200;

  return (
    <>
      <EmailGeneratorPage
        brevoEmail={brevoEmail}
        brevoName={brevoName}
        domainVerified={domainVerified}
        plan={user.plan}
      />
    </>
  );
};

export default EmailGeneratorLayout;
