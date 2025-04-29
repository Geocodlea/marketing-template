import SigninPage from "./index";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Autentificare",
  description:
    "Accesează-ți contul pentru a începe să folosești platforma noastră de marketing automatizat cu AI. Conectează-te acum pentru a beneficia de toate funcționalitățile.",
};

const SigninLayout = async () => {
  const session = await getServerSession(authOptions);
  if (session) redirect("/");

  return (
    <>
      <SigninPage />
    </>
  );
};

export default SigninLayout;
