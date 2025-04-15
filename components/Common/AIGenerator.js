"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import TopBar from "../Common/TopBar";
import DocImg from "../../public/images/icons/document-file.png";
import Reaction from "../Common/Reaction";

import { MemoizedMarkdown } from "@/components/Common/Markdown";
import { renderToolInvocation } from "@/utils/aiTools";

const AIGenerator = ({ title, messages, reload, addToolResult }) => {
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
        title={title}
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
                            <MemoizedMarkdown id={msg.id} content={part.text} />
                          </div>
                        );

                      case "tool-invocation":
                        return renderToolInvocation(part, addToolResult);
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

export default AIGenerator;
