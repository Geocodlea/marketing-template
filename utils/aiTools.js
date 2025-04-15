import AdPreview from "@/components/AdsGenerator/AdPreview";

export const renderToolInvocation = (part, addToolResult) => {
  const callId = part.toolInvocation.toolCallId;
  const toolName = part.toolInvocation.toolName;
  const state = part.toolInvocation.state;

  switch (toolName) {
    case "generateAdPreview": {
      if (state === "call") {
        return <div key={callId}>Generating preview...</div>;
      }
      if (state === "result") {
        return (
          <div key={callId}>
            <p>Here is your ad preview:</p>
            <AdPreview html={part.toolInvocation.result.data[0].body} />
          </div>
        );
      }
      break;
    }

    case "askForConfirmation": {
      if (state === "call") {
        return (
          <div className="my-4" key={callId}>
            {part.toolInvocation.args.message}
            <div className="d-flex flex-wrap justify-content-center gap-5 my-4">
              <button
                onClick={() =>
                  addToolResult({
                    toolCallId: callId,
                    result: "approve",
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
                    result: "modify",
                  })
                }
                className="btn btn-default btn-border btn-small"
              >
                Modify ✏️
              </button>
            </div>
          </div>
        );
      }
      if (state === "result") {
        return null;
      }
      break;
    }

    case "createAd": {
      if (state === "call") {
        return <div key={callId}>Creating ad...</div>;
      }
      if (state === "result") {
        return null;
      }
      break;
    }

    case "generateEmail": {
      if (state === "call") {
        return <div key={callId}>Generating preview...</div>;
      }
      if (state === "result") {
        return (
          <div key={callId}>
            <p>Here is your email preview:</p>
            {/* <AdPreview html={part.toolInvocation.result.data[0].body} /> */}
          </div>
        );
      }
      break;
    }

    case "createEmail": {
      if (state === "call") {
        return <div key={callId}>Creating email...</div>;
      }
      if (state === "result") {
        return null;
      }
      break;
    }

    // Add more cases as needed for other tools
    default:
      return null;
  }
};
