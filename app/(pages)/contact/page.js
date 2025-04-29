import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact/Contact";

export const metadata = {
  title: "Contact",
  description:
    "Suntem aici să te ajutăm. Contactează-ne pentru întrebări, colaborări sau suport legat de platforma noastră de automatizare cu AI.",
};

const ContactPage = () => {
  return (
    <>
      <Breadcrumb title="Trimite-ne un mesaj" text="Contact" />

      <Contact />
    </>
  );
};

export default ContactPage;
