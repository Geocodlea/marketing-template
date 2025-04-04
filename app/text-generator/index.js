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

const adFetch = async (adCreative, session, api) => {
  try {
    const response = await fetch(`/api/facebook/${api}/${session.user.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adCreative }),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
};

const TextGeneratorPage = () => {
  const { data: session, status: sessionStatus } = useSession();
  const [step, setStep] = useState("validation");
  const [adDetails, setAdDetails] = useState({});
  const router = useRouter();

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    stop,
    reload,
    addToolResult,
    data,
  } = useChat({
    api: "/api/facebook/chat",
    body: { step, adDetails },
    maxSteps: 5,
    async onToolCall({ toolCall }) {
      if (toolCall.toolName === "generateAdPreview") {
        const result = await adFetch(toolCall.args, session, "generatePreview");
        return result;
      }
      if (toolCall.toolName === "createAd") {
        const result = await adFetch(toolCall.args, session, "createAd");
        return result.message;
      }
    },
  });

  useEffect(() => {
    if (data) {
      setStep(data?.at(-1)?.step);
      setAdDetails(data?.at(-1)?.adDetails || {});
    }
  }, [data]);

  console.log(data);

  useEffect(() => {
    if (sessionStatus === "unauthenticated") router.push("/signin");
  }, [sessionStatus]);

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
                      reload={reload}
                      addToolResult={addToolResult}
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
