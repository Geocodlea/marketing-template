import AdPreview from "@/components/AdsGenerator/AdPreview";

export const renderToolInvocation = (part, addToolResult) => {
  const callId = part.toolInvocation.toolCallId;
  const toolName = part.toolInvocation.toolName;
  const state = part.toolInvocation.state;

  switch (toolName) {
    case "generateAdPreview": {
      if (state === "call") {
        return <div key={callId}>Se generează previzualizarea...</div>;
      }
      if (state === "result") {
        return (
          <div key={callId}>
            <p>Iată previzualizarea reclamei tale:</p>
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
                Aprobă ✅
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
                Modifică ✏️
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
        return <div key={callId}>Se creează reclama...</div>;
      }
      if (state === "result") {
        return null;
      }
      break;
    }

    case "generateEmail": {
      if (state === "call") {
        return <div key={callId}>Se generează previzualizarea...</div>;
      }
      if (state === "result") {
        const recipients = part.toolInvocation.args.to;
        const isSingleRecipient = recipients.length === 1;
        const recipientText = isSingleRecipient
          ? recipients[0].email
          : "lista ta de contacte";

        return (
          <div key={callId}>
            <p>
              Iată previzualizarea emailului tău, care va fi trimis către{" "}
              {recipientText}:
            </p>
            <div className="container my-5 p-4 border rounded shadow-sm bg-white">
              <h5 className="text-primary mb-4">
                {part.toolInvocation.args.subject}
              </h5>
              <div
                className="text-body"
                dangerouslySetInnerHTML={{
                  __html: part.toolInvocation.args.body,
                }}
              />
            </div>
          </div>
        );
      }
      break;
    }

    case "createEmail": {
      if (state === "call") {
        return <div key={callId}>Se creează emailul...</div>;
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
