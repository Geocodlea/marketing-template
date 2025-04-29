import Breadcrumb from "@/components/Common/Breadcrumb";
import Roadmap from "@/components/Roadmap/Roadmap";

export const metadata = {
  title: "Ghid de Utilizare",
  description:
    "Află cum să folosești platforma noastră de marketing automatizat cu AI. Ghid pas cu pas pentru a maximiza beneficiile funcționalităților disponibile.",
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
