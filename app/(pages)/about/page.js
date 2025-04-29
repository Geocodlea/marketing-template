import Breadcrumb from "@/components/Common/Breadcrumb";
import Team from "@/components/Team/Team";

export const metadata = {
  title: "Despre Noi",
  description:
    "Află cine suntem, ce ne motivează și cum folosim inteligența artificială pentru a ajuta afacerile să își automatizeze procesele de marketing și vânzări.",
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
