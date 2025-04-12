"use client";

import { useState, useEffect } from "react";

import LeftDashboardSidebar from "@/components/Header/LeftDashboardSidebar";
// import RightDashboardSidebar from "@/components/Header/RightDashboardSidebar";
import Modal from "@/components/Common/Modal";
import TextGenerator from "@/components/TextGenerator/TextGenerator";
import StaticbarDashboard from "@/components/Common/StaticBarDashboard";

import { useChat } from "@ai-sdk/react";
import { initialAdDetails } from "@/utils/fbAdOptions";
import isEqual from "lodash/isEqual";
import Alert from "@/components/Common/Alert";

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

const TextGeneratorPage = ({ userId, userAdsRemaining, plan }) => {
  const [step, setStep] = useState("validation");
  const [adDetails, setAdDetails] = useState(initialAdDetails);
  const [disabledChat, setDisabledChat] = useState(false);
  const [adsRemaining, setAdsRemaining] = useState(userAdsRemaining);
  const [alert, setAlert] = useState(null);

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
    body: { step, adDetails },
    maxSteps: 5,
    async onToolCall({ toolCall }) {
      if (toolCall.toolName === "generateAdPreview") {
        const result = await adFetch(toolCall.args, userId, "generatePreview");
        return result;
      }
      if (toolCall.toolName === "createAd") {
        const result = await adFetch(toolCall.args, userId, "createAd");

        if (result.status === "success") {
          const data = await adFetch("", userId, "adsRemaining");
          console.log("adsRemaining: ", data.adsRemaining);

          setAdsRemaining(data.adsRemaining);
          setAlert({
            status: "success",
            message: "Reclama a fost creată cu succes!",
          });
        }
        return null;
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
    <>
      <LeftDashboardSidebar plan={plan} />
      {/* <RightDashboardSidebar /> */}
      <Modal />
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
                {alert && <Alert alert={alert} setAlert={setAlert} />}
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
    </>
  );
};

export default TextGeneratorPage;
