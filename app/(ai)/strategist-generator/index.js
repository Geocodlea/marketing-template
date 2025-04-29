"use client";

import { useState, useEffect, useMemo } from "react";

import LeftDashboardSidebar from "@/components/Header/LeftDashboardSidebar";
import AIGenerator from "@/components/Common/AIGenerator";

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

const StrategistGeneratorPage = ({ userId, userFacebook, plan }) => {
  const userFb = JSON.parse(userFacebook);
  const [step, setStep] = useState("validation");
  const [adDetails, setAdDetails] = useState(initialAdDetails);
  const [adsRemaining, setAdsRemaining] = useState(userFb.adsRemaining);
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
          setAdsRemaining(data.adsRemaining);
          setAlert({
            status: "success",
            message: "Reclama a fost creată cu succes!",
          });
        } else {
          setAlert({
            status: "danger",
            message: "A apărut o eroare la crearea reclamei.",
          });
        }
        return result.message;
      }
    },
    // async onResponse(response) {
    //   console.log(response);
    // },
    async onError(error) {
      console.error("Error:", error);
      setAlert({
        status: "danger",
        message: "A apărut o eroare. Te rugăm să încerci mai târziu.",
      });
    },
  });

  useEffect(() => {
    if (!adsRemaining) {
      setMessages([
        {
          role: "system",
          content:
            "Ai depășit numărul de reclame conform planului tău. Pentru a crea mai multe reclame va trebui să te abonezi la alt plan.",
        },
      ]);
    } else if (!userFb.adAccountId || !userFb.pageId) {
      setMessages([
        {
          role: "system",
          content:
            "Nu ai setat datele de conexiune pentru Facebook. Te rugăm să le setezi în profilul tău.",
        },
      ]);
    }
  }, [adsRemaining, userFb.adAccountId, userFb.pageId, userFb.formId]);

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

  const disabledChat = useMemo(() => {
    const isAskForConfirmation = messages.some((msg) =>
      msg.parts?.some(
        (part) =>
          part.type === "tool-invocation" &&
          part.toolInvocation.toolName === "askForConfirmation" &&
          part.toolInvocation.state === "call"
      )
    );

    return isAskForConfirmation || !adsRemaining;
  }, [messages, adsRemaining]);

  return (
    <>
      <LeftDashboardSidebar plan={plan} />

      <div className="chat-box-section">
        <AIGenerator
          title="Strategist Vânzări"
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
    </>
  );
};

export default StrategistGeneratorPage;
