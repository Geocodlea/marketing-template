"use client";

import { useState, useEffect } from "react";

import LeftDashboardSidebar from "@/components/Header/LeftDashboardSidebar";
import AIGenerator from "@/components/Common/AIGenerator";
import StaticbarDashboard from "@/components/Common/StaticBarDashboard";

import { useChat } from "@ai-sdk/react";
import Alert from "@/components/Common/Alert";

const sendEmail = async (to, subject, html) => {
  try {
    const response = await fetch(`/api/emails/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, subject, html }),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
};

const EmailGeneratorPage = ({ email, plan }) => {
  const [disabledChat, setDisabledChat] = useState(false);
  const [alert, setAlert] = useState(null);

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
    api: "/api/emails/chat",
    body: {},
    maxSteps: 5,
    async onToolCall({ toolCall }) {
      if (toolCall.toolName === "generateEmail") {
        console.log("🚀 ~ generateEmail ~ toolCall.args:", toolCall.args);

        return null;
      }
      if (toolCall.toolName === "createEmail") {
        console.log("🚀 ~ createEmail ~ toolCall.args:", toolCall.args);
        const result = await sendEmail(
          email,
          toolCall.args.subject,
          toolCall.args.body
        );

        if (result.status === "success") {
          const data = await adFetch("", userId, "adsRemaining");

          setAlert({
            status: result.status,
            message: result.message,
          });
        } else {
          setAlert({
            status: result.status,
            message: result.message,
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
    const isAskForConfirmation = messages.some((msg) =>
      msg.parts?.some(
        (part) =>
          part.type === "tool-invocation" &&
          part.toolInvocation.toolName === "askForConfirmation" &&
          part.toolInvocation.state === "call"
      )
    );

    setDisabledChat(isAskForConfirmation);
  }, [messages]);

  return (
    <>
      <LeftDashboardSidebar plan={plan} />

      <div className="chat-box-section">
        <AIGenerator
          title="Email Generator"
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

export default EmailGeneratorPage;
