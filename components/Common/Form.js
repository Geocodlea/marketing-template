"use client";

import React, { useState } from "react";
import { Tooltip } from "react-tooltip";

const Form = ({ onSendMessage }) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    setLoading(true);
    await onSendMessage(input);
    setInput("");
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent new line in textarea
      handleSubmit(e);
    }
  };

  return (
    <>
      <Tooltip id="my-tooltip" className="custom-tooltip tooltip-inner" />
      <form className="new-chat-form border-gradient" onSubmit={handleSubmit}>
        <textarea
          rows="1"
          placeholder="Send a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown} // Listen for Enter key press
          disabled={loading}
        ></textarea>

        <div className="left-icons">
          <div title="AiWave" className="form-icon icon-gpt">
            <i className="fa-sharp fa-regular fa-aperture"></i>
          </div>
        </div>

        <div className="right-icons">
          <div
            className="form-icon icon-plus"
            data-tooltip-id="my-tooltip"
            data-tooltip-content="Choose File"
          >
            <input type="file" className="input-file" name="myfile" multiple />
            <i className="fa-sharp fa-regular fa-plus"></i>
          </div>
          <a
            className="form-icon icon-mic"
            data-tooltip-id="my-tooltip"
            data-tooltip-content="Voice Search"
          >
            <i className="fa-regular fa-waveform-lines"></i>
          </a>
          <button
            type="submit"
            className="form-icon icon-send"
            data-tooltip-id="my-tooltip"
            data-tooltip-content="Send message"
            disabled={loading}
          >
            <i className="fa-sharp fa-solid fa-paper-plane-top"></i>
          </button>
        </div>
      </form>
    </>
  );
};

export default Form;
