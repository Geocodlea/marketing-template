import React from "react";
import Form from "./Form";

const StaticbarDashboard = ({ onSendMessage }) => {
  return (
    <>
      <div className="rbt-static-bar">
        <Form onSendMessage={onSendMessage} />
        <p className="b3 small-text">
          AiWave can make mistakes. Consider checking important information.
        </p>
      </div>
    </>
  );
};

export default StaticbarDashboard;
