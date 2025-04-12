"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Breadcrumb from "@/components/Common/Breadcrumb";
import SingleBlog from "@/components/BlogDetails/BlogDetails";

const BlogDetailsLayout = ({ params }) => {
  const router = useRouter();
  const postId = params.blogId;

  useEffect(() => {
    if (postId === undefined) {
      router.push("/blog");
    }
  }, []);

  return (
    <>
      <Breadcrumb title="Blog Details" text="Blog Details" />

      <SingleBlog getBlog={params} />
    </>
  );
};

export default BlogDetailsLayout;
