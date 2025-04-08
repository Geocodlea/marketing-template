"use client";

import { Tooltip } from "react-tooltip";

const Form = ({
  input,
  handleInputChange,
  handleSubmit,
  status,
  stop,
  disabledChat,
}) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent new line in textarea
      if (disabledChat) return;
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
          onChange={handleInputChange}
          onKeyDown={handleKeyDown} // Listen for Enter key press
        ></textarea>

        <div className="right-icons">
          {status === "ready" || status === "error" ? (
            <button
              type="submit"
              className="form-icon icon-send"
              data-tooltip-id="my-tooltip"
              data-tooltip-content="Send message"
              disabled={disabledChat}
            >
              <i className="fa-sharp fa-solid fa-paper-plane-top"></i>
            </button>
          ) : (
            <button
              type="submit"
              className="form-icon icon-send"
              onClick={stop}
            >
              <i className="fa-sharp fa-solid fa-stop"></i>
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default Form;
