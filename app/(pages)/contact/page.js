import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact/Contact";

export const metadata = {
  title: "Contact - || AiWave - AI SaaS Website NEXTJS14 UI Kit",
  description: "AiWave - AI SaaS Website NEXTJS14 UI Kit",
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
