"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import TopBar from "../Common/TopBar";
import DocImg from "../../public/images/icons/document-file.png";
import Reaction from "../Common/Reaction";

const TextGenerator = ({ messages, reload, addToolResult }) => {
  const { data: session } = useSession();
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <TopBar
        barImg={DocImg}
        title="AI Ad Generator"
        wdt={14}
        htd={18}
        msg={messages.length}
      />

      {messages.map((msg, index) => (
        <div className="chat-box-list pb-0" key={index}>
          <div
            className={`chat-box ${
              msg.role === "user" ? "author-speech" : "ai-speech"
            }`}
          >
            <div className="inner">
              <div className="chat-section">
                <div className="author">
                  <Image
                    className="w-100"
                    width={40}
                    height={40}
                    src={
                      msg.role === "user"
                        ? session?.user?.image
                        : "/images/ai/chatgpt.png"
                    }
                    alt={msg.role}
                  />
                </div>
                <div className="chat-content">
                  <h6 className="title">
                    {msg.role === "user" ? "User" : "AI"}
                  </h6>
                  {msg.parts.map((part, i) => {
                    switch (part.type) {
                      case "text":
                        return (
                          <div className="my-4" key={`${msg.id}-${i}`}>
                            {part.text}
                          </div>
                        );

                      case "tool-invocation": {
                        const callId = part.toolInvocation.toolCallId;

                        switch (part.toolInvocation.toolName) {
                          case "generateAdPreview": {
                            switch (part.toolInvocation.state) {
                              case "call":
                                return (
                                  <div key={callId}>Generating preview...</div>
                                );
                              case "result":
                                return (
                                  <div key={callId}>
                                    <p>Here is your ad preview:</p>
                                    <div
                                      dangerouslySetInnerHTML={{
                                        __html:
                                          part.toolInvocation.result.data[0]
                                            .body,
                                      }}
                                    />
                                  </div>
                                );
                            }
                            break;
                          }

                          case "askForConfirmation": {
                            switch (part.toolInvocation.state) {
                              case "call":
                                return (
                                  <div className="my-4" key={callId}>
                                    {part.toolInvocation.args.message}
                                    <div className="d-flex flex-wrap justify-content-center gap-5 my-4">
                                      <button
                                        onClick={() =>
                                          addToolResult({
                                            toolCallId: callId,
                                            result: "approved",
                                          })
                                        }
                                        className="btn btn-default btn-border btn-small"
                                      >
                                        Approve ✅
                                      </button>
                                      <button
                                        onClick={() =>
                                          addToolResult({
                                            toolCallId: callId,
                                            result: "rejected",
                                          })
                                        }
                                        className="btn btn-default btn-border btn-small"
                                      >
                                        Modify ✏️
                                      </button>
                                    </div>
                                  </div>
                                );
                              case "result":
                                return null;
                            }
                            break;
                          }

                          case "createAd": {
                            switch (part.toolInvocation.state) {
                              case "call":
                                return <div key={callId}>Creating ad...</div>;
                              case "result":
                                return null;
                            }
                            break;
                          }
                        }
                      }
                    }
                  })}

                  {msg.role === "assistant" && <Reaction reload={reload} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* This is the auto-scroll reference element */}
      <div ref={messagesEndRef} />
    </>
  );
};

export default TextGenerator;
