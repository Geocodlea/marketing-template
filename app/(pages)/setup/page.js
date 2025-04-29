import Breadcrumb from "@/components/Common/Breadcrumb";
import Utilize from "@/components/Utilize/Utilize";

export const metadata = {
  title: "Configurare",
  description:
    "Urmează pașii simpli pentru a configura platforma și a începe să folosești funcționalitățile noastre de marketing automatizat cu AI. Ghid complet pentru o integrare rapidă.",
};

const SetupPage = () => {
  return (
    <>
      <Breadcrumb title="Ghid de instrucțiuni" text="Setup" />

      <Utilize />
    </>
  );
};

export default SetupPage;
