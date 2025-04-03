"use client";

import { useState, useEffect } from "react";
import Context from "@/context/Context";
import PopupMobileMenu from "@/components/Header/PopUpMobileMenu";
import BackToTop from "../backToTop";
import LeftDashboardSidebar from "@/components/Header/LeftDashboardSidebar";
import HeaderDashboard from "@/components/Header/HeaderDashboard";
import RightDashboardSidebar from "@/components/Header/RightDashboardSidebar";
import Modal from "@/components/Common/Modal";
import TextGenerator from "@/components/TextGenerator/TextGenerator";
import StaticbarDashboard from "@/components/Common/StaticBarDashboard";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";

const TextGeneratorPage = () => {
  const [currentCreative, setCurrentCreative] = useState(null);
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  const {
    messages,
    setMessages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    stop,
    reload,
  } = useChat({ api: "/api/facebook/chat" });

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/signin");
    }
  }, [sessionStatus]);

  const sendMessage = async (inputText) => {
    const newMessage = { role: "user", content: inputText };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);

    try {
      const response = await fetch("/api/facebook/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputText, history: updatedMessages }),
      });

      // const decoder = new TextDecoder("utf-8");
      // let final = "";
      // let accumulatedMessage = "";

      // for await (const textPart of response.body) {
      //   const text = decoder.decode(textPart, { stream: true });
      //   final += text;

      //   // Attempt to extract structured data
      //   const messageMatch = final.match(/0: ?"([^"]+)"/g); // Matches `0: "text"`
      //   if (messageMatch) {
      //     // Extract words properly
      //     const extractedText = messageMatch
      //       .map((m) => m.split(":")[1].trim().replace(/"/g, "")) // Remove quotes
      //       .join(" "); // Join words

      //     // Fix spaces before punctuation
      //     accumulatedMessage = (accumulatedMessage + " " + extractedText)
      //       .replace(/\s+([.,!?])/g, "$1") // Remove space before punctuation
      //       .trim(); // Trim any leading spaces

      //     setMessages([
      //       ...updatedMessages,
      //       { role: "assistant", content: accumulatedMessage },
      //     ]);

      //     final = ""; // Reset chunk processing but keep accumulatedMessage
      //   }
      // }

      // const data = await response.json();

      // if (data.status === "clarification" || data.status === "unrelated") {
      //   setMessages([
      //     ...updatedMessages,
      //     { role: "assistant", content: data.message },
      //   ]);
      // } else if (data.status === "ready") {
      //   setCurrentCreative(data.adCreative); // Store creative object
      //   generateAdPreview(data.adCreative, updatedMessages);
      // }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const generateAdPreview = async (adCreative, updatedMessages) => {
    try {
      const response = await fetch(
        `/api/facebook/generatePreview/${session.user.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ adCreative }),
        }
      );

      const result = await response.json();

      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "Here is your ad preview:",
          preview: result,
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleApprove = async () => {
    if (!currentCreative) {
      console.error("No creative found for approval.");
      return;
    }

    try {
      const response = await fetch(
        `/api/facebook/createAd/${session.user.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ creative: currentCreative }),
        }
      );

      const result = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            result.status === "success"
              ? "Your ad has been successfully created! 🎉"
              : `Error creating ad: ${result.message}`,
        },
      ]);
    } catch (error) {
      console.error("Error creating ad:", error);
    }
  };

  const handleModify = () => {
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "Sure! What would you like to change?" },
    ]);
  };

  return (
    <main className="page-wrapper rbt-dashboard-page">
      <div className="rbt-panel-wrapper">
        <Context>
          <LeftDashboardSidebar />
          <HeaderDashboard display="" />
          <RightDashboardSidebar />
          <Modal />
          <PopupMobileMenu />
          <div className="rbt-main-content">
            <div className="rbt-daynamic-page-content">
              <div className="rbt-dashboard-content">
                <div className="content-page">
                  <div className="chat-box-section">
                    <TextGenerator
                      messages={messages}
                      handleApprove={handleApprove}
                      handleModify={handleModify}
                      reload={reload}
                    />
                    <StaticbarDashboard
                      input={input}
                      handleInputChange={handleInputChange}
                      handleSubmit={handleSubmit}
                      status={status}
                      stop={stop}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <BackToTop />
        </Context>
      </div>
    </main>
  );
};

export default TextGeneratorPage;
