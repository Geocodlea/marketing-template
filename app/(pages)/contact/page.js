import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact/Contact";
import CtaTwo from "@/components/CallToActions/Cta-Two";

export const metadata = {
  title: "Contact - || AiWave - AI SaaS Website NEXTJS14 UI Kit",
  description: "AiWave - AI SaaS Website NEXTJS14 UI Kit",
};

const ContactPage = () => {
  return (
    <>
      <Breadcrumb title="Trimite-ne un mesaj" text="Contact" />

      <Contact />

      <div className="rainbow-cta-area rainbow-section-gap rainbow-section-gapBottom-big">
        <div className="container">
          <CtaTwo />
        </div>
      </div>
    </>
  );
};

export default ContactPage;
