import Breadcrumb from "@/components/Common/Breadcrumb";
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
    </>
  );
};

export default BlogPage;
