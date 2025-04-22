"use client";

import { useState, useEffect, useMemo } from "react";

import LeftDashboardSidebar from "@/components/Header/LeftDashboardSidebar";
import AIGenerator from "@/components/Common/AIGenerator";
import StaticbarDashboard from "@/components/Common/StaticBarDashboard";

import { useChat } from "@ai-sdk/react";
import Alert from "@/components/Common/Alert";

const sendEmail = async (from, to, subject, body) => {
  try {
    const response = await fetch(`/api/emails/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject, body }),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
};

const EmailGeneratorPage = ({ domainVerified, email, plan }) => {
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
  } = useChat({
    api: "/api/emails/chat",
    body: {},
    maxSteps: 5,
    async onToolCall({ toolCall }) {
      if (toolCall.toolName === "createEmail") {
        const result = await sendEmail(
          email,
          toolCall.args.to,
          toolCall.args.subject,
          toolCall.args.body
        );

        if (result.status === "success") {
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
    if (!domainVerified) {
      setMessages([
        {
          role: "system",
          content:
            "Nu ai setat datele domeniului de email. Te rugăm să le setezi în profilul tău.",
        },
      ]);
    }
  }, [domainVerified]);

  const disabledChat = useMemo(() => {
    return messages.some((msg) =>
      msg.parts?.some(
        (part) =>
          part.type === "tool-invocation" &&
          part.toolInvocation.toolName === "askForConfirmation" &&
          part.toolInvocation.state === "call"
      )
    );
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
