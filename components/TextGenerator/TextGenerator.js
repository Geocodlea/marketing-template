"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import TopBar from "../Common/TopBar";
import DocImg from "../../public/images/icons/document-file.png";
import Reaction from "../Common/Reaction";

const TextGenerator = ({ messages }) => {
  const { data: session } = useSession();

  return (
    <>
      <TopBar
        barImg={DocImg}
        title="Website roadmap title write me"
        wdt={14}
        htd={18}
      />

      {messages?.map((msg, index) => (
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
                  <p>{msg.content}</p>
                  {msg.role === "assistant" && <Reaction />}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default TextGenerator;
