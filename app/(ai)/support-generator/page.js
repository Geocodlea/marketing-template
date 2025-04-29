export const metadata = {
  title: "Suport Clienți Automatizat cu AI",
  description:
    "Gestionează comentariile și mesajele de pe rețelele sociale folosind răspunsuri automate bazate pe inteligență artificială – rapid, eficient și personalizat.",
};

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";
import SupportGeneratorPage from "./index";

const SupportGeneratorLayout = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/auth/signin`);

  const userId = session.user.id;

  await dbConnect();
  const user = await User.findOne({ _id: userId });

  return (
    <>
      <SupportGeneratorPage
        userId={userId}
        userFacebook={JSON.stringify(user.facebook)}
        plan={user.plan}
      />
    </>
  );
};

export default SupportGeneratorLayout;
