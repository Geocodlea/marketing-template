import Breadcrumb from "@/components/Common/Breadcrumb";
import Blog from "@/components/Blog/Blog";

export const metadata = {
  title: "Blog",
  description:
    "Citeste articole, ghiduri și sfaturi despre marketingul automatizat, strategii de vânzări și cum poți să îți crești afacerea cu ajutorul inteligenței artificiale.",
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
