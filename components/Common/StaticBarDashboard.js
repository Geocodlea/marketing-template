import React from "react";
import Form from "./Form";

const StaticbarDashboard = ({
  input,
  handleInputChange,
  handleSubmit,
  status,
  stop,
}) => {
  return (
    <>
      <div className="rbt-static-bar">
        <Form
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          status={status}
          stop={stop}
        />
        <p className="b3 small-text">
          AiWave can make mistakes. Consider checking important information.
        </p>
      </div>
    </>
  );
};

export default StaticbarDashboard;
