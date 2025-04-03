"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import TopBar from "../Common/TopBar";
import DocImg from "../../public/images/icons/document-file.png";
import Reaction from "../Common/Reaction";

const TextGenerator = ({ messages, handleApprove, handleModify, reload }) => {
  const { data: session } = useSession();

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
                        return <div key={`${msg.id}-${i}`}>{part.text}</div>;
                    }
                  })}

                  {msg.preview && (
                    <div style={{ marginTop: "10px" }}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: msg.preview.data[0].body,
                        }}
                      />
                      <div style={{ marginTop: "10px", textAlign: "center" }}>
                        <p>
                          Do you approve this ad, or would you like
                          modifications?
                        </p>
                        <div className="d-flex flex-wrap justify-content-center gap-5">
                          <button
                            onClick={handleApprove}
                            className="btn btn-default btn-border btn-small"
                          >
                            Approve ✅
                          </button>
                          <button
                            onClick={handleModify}
                            className="btn btn-default btn-border btn-small"
                          >
                            Modify ✏️
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {msg.role === "assistant" && <Reaction reload={reload} />}
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
