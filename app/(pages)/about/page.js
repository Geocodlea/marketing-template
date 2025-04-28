import Breadcrumb from "@/components/Common/Breadcrumb";
import Team from "@/components/Team/Team";

export const metadata = {
  title: "Team - || AiWave - AI SaaS Website NEXTJS14 UI Kit",
  description: "AiWave - AI SaaS Website NEXTJS14 UI Kit",
};

const AboutPage = () => {
  return (
    <>
      <Breadcrumb title="Echipa nostră" text="Echipa" />

      <Team />
    </>
  );
};

export default AboutPage;
