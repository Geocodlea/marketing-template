"use client";

import React, { useState, useEffect } from "react";
import Context from "@/context/Context";
import PopupMobileMenu from "@/components/Header/PopUpMobileMenu";
import BackToTop from "../backToTop";
import LeftDashboardSidebar from "@/components/Header/LeftDashboardSidebar";
import HeaderDashboard from "@/components/Header/HeaderDashboard";
// import RightDashboardSidebar from "@/components/Header/RightDashboardSidebar";
import Modal from "@/components/Common/Modal";
import TextGenerator from "@/components/TextGenerator/TextGenerator";
import StaticbarDashboard from "@/components/Common/StaticBarDashboard";

import { useChat } from "@ai-sdk/react";
import { initialAdDetails } from "@/utils/fbAdOptions";
import isEqual from "lodash/isEqual";

const adFetch = async (adDetails, userId, api) => {
  try {
    const response = await fetch(`/api/facebook/${api}/${userId}`, {
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

const TextGeneratorPage = ({ userId, userAdsRemaining }) => {
  const [step, setStep] = useState("validation");
  const [adDetails, setAdDetails] = useState(initialAdDetails);
  const [disabledChat, setDisabledChat] = useState(false);
  const [adsRemaining, setAdsRemaining] = useState(userAdsRemaining);

  const {
    messages,
    setMessages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    stop,
    reload,
    addToolResult,
    data,
    setData,
  } = useChat({
    api: "/api/facebook/chat",
    body: { step, adDetails, userId, adsRemaining },
    maxSteps: 5,
    async onToolCall({ toolCall }) {
      if (toolCall.toolName === "generateAdPreview") {
        const result = await adFetch(toolCall.args, userId, "generatePreview");
        return result;
      }
      if (toolCall.toolName === "createAd") {
        const result = await adFetch(toolCall.args, userId, "createAd");
        return result.message;
      }
    },
  });

  if (!adsRemaining) {
    setMessages([
      {
        role: "system",
        content:
          "Ai depășit numărul de reclame conform planului tău. Pentru a crea mai multe reclame va trebui să te abonezi la alt plan.",
      },
    ]);
  }

  useEffect(() => {
    if (data) {
      const latest = data.at(-1);
      if (!latest) return;

      if (latest.step !== step) {
        setStep(latest.step);
      }
      if (latest.adsRemaining !== adsRemaining) {
        setAdsRemaining(latest.adsRemaining);
      }
      if (!isEqual(latest.adDetails, adDetails)) {
        setAdDetails(latest.adDetails);
      }

      if (latest.step === "end") {
        setAdDetails(initialAdDetails);
        setData(undefined);
      }
    }
  }, [data]);

  useEffect(() => {
    const isAskForConfirmation = messages.some((msg) =>
      msg.parts?.some(
        (part) =>
          part.type === "tool-invocation" &&
          part.toolInvocation.toolName === "askForConfirmation" &&
          part.toolInvocation.state === "call"
      )
    );

    setDisabledChat(isAskForConfirmation);
    if (!adsRemaining) setDisabledChat(true);
  }, [messages, adsRemaining]);

  return (
    <main className="page-wrapper rbt-dashboard-page">
      <div className="rbt-panel-wrapper">
        <Context>
          <LeftDashboardSidebar />
          <HeaderDashboard display="" />
          {/* <RightDashboardSidebar /> */}
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
