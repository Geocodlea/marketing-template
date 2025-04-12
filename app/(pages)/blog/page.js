import Breadcrumb from "@/components/Common/Breadcrumb";
import CtaTwo from "@/components/CallToActions/Cta-Two";
import Blog from "@/components/Blog/Blog";

export const metadata = {
  title: "Blog - || AiWave - AI SaaS Website NEXTJS14 UI Kit",
  description: "AiWave - AI SaaS Website NEXTJS14 UI Kit",
};

const BlogPage = () => {
  return (
    <>
      <Breadcrumb title="Blogul nostru" text="Blog" />

      <Blog />

      <div className="rainbow-cta-area rainbow-section-gap rainbow-section-gapBottom-big bg-color-1">
        <div className="container">
          <CtaTwo />
        </div>
      </div>
    </>
  );
};

export default BlogPage;
