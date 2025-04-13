import {
  parseRequest,
  handleValidationStep,
  handleDetailsStep,
  handlePreviewStep,
  handleConfirmationStep,
  handleAdCreationStep,
  handleDefaultStep,
} from "@/utils/aiHelpers";

export async function POST(req) {
  let { messages, step, adDetails } = await parseRequest(req);
  // Coerce data if null or undefined
  messages = messages || [];
  step = step || "validation"; // default to "validation"
  adDetails = adDetails || {};

  console.log("Step: ", step);
  console.log("Ad Details: ", JSON.stringify(adDetails, null, 2));

  switch (step) {
    case "validation":
    case "end": {
      const validationResult = await handleValidationStep(
        messages,
        step,
        adDetails
      );

      if (validationResult) {
        // If the validation step returned a DataStream, send it
        return validationResult;
      }
      // Otherwise, proceed to details step
      return handleDetailsStep(messages, "details", adDetails);
    }

    case "details": {
      const detailsResult = await handleDetailsStep(messages, step, adDetails);

      if (detailsResult) {
        // Direct response for missing fields was returned
        return detailsResult;
      }
      // Otherwise, proceed to preview step
      return handlePreviewStep(messages, "preview", adDetails);
    }

    case "preview": {
      return handlePreviewStep(messages, step, adDetails);
    }

    case "confirmation": {
      return handleConfirmationStep(messages, step, adDetails);
    }

    case "adCreation": {
      return handleAdCreationStep(messages, step, adDetails);
    }

    default:
      // Unrecognized step
      return handleDefaultStep();
  }
}
