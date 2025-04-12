import Breadcrumb from "@/components/Common/Breadcrumb";
import Roadmap from "@/components/Roadmap/Roadmap";

export const metadata = {
  title: "Roadmap - || AiWave - AI SaaS Website NEXTJS14 UI Kit",
  description: "AiWave - AI SaaS Website NEXTJS14 UI Kit",
};

const UtilizePage = () => {
  return (
    <>
      <Breadcrumb title="Cum funcționează" text="Utilizare" />

      <Roadmap />
    </>
  );
};

export default UtilizePage;
