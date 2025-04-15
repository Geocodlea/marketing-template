"use client";

import LeftDashboardSidebar from "@/components/Header/LeftDashboardSidebar";

const MyComponent = () => {
  const sendEmail = async () => {
    try {
      const response = await fetch(`/api/emails/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "geocodlea@gmail.com",
          subject: "Test subject",
          html: "Test html",
        }),
      });
      const result = await response.json();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <LeftDashboardSidebar />

      <button onClick={sendEmail}>Send Email</button>
    </>
  );
};

export default MyComponent;
