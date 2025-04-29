export const metadata = {
  title: "Strategie de Vânzări cu AI",
  description:
    "Obține planuri de vânzare personalizate și recomandări inteligente pentru creșterea afacerii tale, generate automat cu ajutorul AI.",
};

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";
import StrategistGeneratorPage from "./index";

const StrategistGeneratorLayout = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/auth/signin`);

  const userId = session.user.id;

  await dbConnect();
  const user = await User.findOne({ _id: userId });

  return (
    <>
      <StrategistGeneratorPage
        userId={userId}
        userFacebook={JSON.stringify(user.facebook)}
        plan={user.plan}
      />
    </>
  );
};

export default StrategistGeneratorLayout;
