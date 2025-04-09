"use client";

import React, { useState, useEffect, useRef } from "react";
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
import { initialAdDetails } from "@/utils/fbAdOptions";
import isEqual from "lodash/isEqual";

const adFetch = async (adDetails, session, api) => {
  try {
    const response = await fetch(`/api/facebook/${api}/${session.user.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adDetails }),
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
  const [adDetails, setAdDetails] = useState(initialAdDetails);
  const [disabledChat, setDisabledChat] = useState(false);
  const [showAdPreview, setShowAdPreview] = useState(false);
  const [adPreview, setAdPreview] = useState(null);
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
    // async onError(error) {
    //   console.log("error: ", error);
    // },
  });

  useEffect(() => {
    if (data) {
      const latest = data.at(-1);
      if (!latest) return;

      if (latest.step !== step) {
        setStep(latest.step);
      }
      if (!isEqual(latest.adDetails, adDetails)) {
        setAdDetails(latest.adDetails || initialAdDetails);
      }
    }
  }, [data]);

  useEffect(() => {
    if (sessionStatus === "unauthenticated") router.push("/signin");
  }, [sessionStatus]);

  useEffect(() => {
    // Loop through messages to find the result state
    const resultMessage = messages.find((msg) =>
      msg.parts.some(
        (part) =>
          part.type === "tool-invocation" &&
          part.toolInvocation.toolName === "generateAdPreview" &&
          part.toolInvocation.state === "result"
      )
    );

    // If a result message is found, set showAdPreview to true
    if (resultMessage) {
      const iframe = resultMessage.parts.filter(
        (part) =>
          part.type === "tool-invocation" &&
          part.toolInvocation.toolName === "generateAdPreview" &&
          part.toolInvocation.state === "result"
      );

      const newAdPreview = iframe[0].toolInvocation.result.data[0].body;
      if (newAdPreview === adPreview) return;

      setShowAdPreview(true);
      setAdPreview(iframe[0].toolInvocation.result.data[0].body);
    }
  }, [messages]); // This will trigger when messages change

  useEffect(() => {
    const isAskForConfirmation = messages.some((msg) =>
      msg.parts?.some(
        (part) =>
          part.type === "tool-invocation" &&
          part.toolInvocation.toolName === "askForConfirmation" &&
          part.toolInvocation.state === "call"
      )
    );

    if (isAskForConfirmation) {
      setDisabledChat(true);
    } else {
      setDisabledChat(false);
    }
  }, [messages]);

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
                      disabledChat={disabledChat}
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
