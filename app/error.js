"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ErrorPage = () => {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/");
    }, 3000); // Redirect after 3 seconds

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center text-center">
      <div className="p-4">
        <h1 className="display-4 text-danger">Oops!</h1>
        <p className="lead">Something went wrong.</p>
        <p className="text-muted">Redirecting to the homepage...</p>
      </div>
    </div>
  );
};

export default ErrorPage;
