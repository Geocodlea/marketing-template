import { openai } from "@ai-sdk/openai";
import { streamText, generateObject, createDataStreamResponse } from "ai";
import { NextResponse } from "next/server";
import z from "zod";
import {
  findEmptyFields,
  campaignObjectives,
  campaignStatuses,
  adSetBillingEvents,
  adSetOptimizationGoals,
  adSetBidStrategies,
  adCreativeCTAs,
} from "@/utils/fbAdOptions";
import {
  validation,
  unrelated,
  clarification,
  details,
  missingDetails,
  generatePreview,
  confirmation,
  adCreation,
} from "@/utils/aiContent";

const adDetailsSchema = z.object({
  campaign: z.object({
    name: z.string().nullable(),
    objective: z.enum(campaignObjectives).nullable(),
    status: z.enum(campaignStatuses).nullable(),
  }),
  adSet: z.object({
    name: z.string().nullable(),
    billingEvent: z.enum(adSetBillingEvents).nullable(),
    optimizationGoal: z.enum(adSetOptimizationGoals).nullable(),
    bidStrategy: z.enum(adSetBidStrategies).nullable(),
    dailyBudget: z.number().nullable(),
    targeting: z.object({
      geoLocations: z.object({
        countries: z.array(z.string().nullable()),
      }),
    }),
  }),
  adCreative: z.object({
    name: z.string().nullable(),
    objectStorySpec: z.object({
      linkData: z.object({
        message: z.string().nullable(),
        link: z.string().url().nullable(),
        picture: z.string().url().nullable(),
        CTA: z.object({
          type: z.enum(adCreativeCTAs).nullable(),
          value: z.object({
            link: z.string().url().nullable(),
          }),
        }),
      }),
    }),
  }),
});

const generatePreviewSchema = z.object({
  name: z.string(),
  message: z.string(),
  link: z.string().url(),
  picture: z.string().url().nullable(),
  CTA: z.object({
    type: z.enum(adCreativeCTAs),
    value: z.object({
      link: z.string().url(),
    }),
  }),
});

const askForConfirmationSchema = z.object({
  message: z.string().describe("The message to ask for confirmation."),
});

const creatAdSchema = z.object({
  campaign: z.object({
    name: z.string(),
    objective: z.enum(campaignObjectives),
    status: z.enum(campaignStatuses),
  }),
  adSet: z.object({
    name: z.string(),
    billingEvent: z.enum(adSetBillingEvents),
    optimizationGoal: z.enum(adSetOptimizationGoals),
    bidStrategy: z.enum(adSetBidStrategies),
    dailyBudget: z.number(),
    targeting: z.object({
      geoLocations: z.object({
        countries: z.array(z.string()),
      }),
    }),
  }),
  adCreative: z.object({
    name: z.string(),
    objectStorySpec: z.object({
      linkData: z.object({
        message: z.string(),
        link: z.string().url(),
        CTA: z.object({
          type: z.enum(adCreativeCTAs),
          value: z.object({
            link: z.string().url(),
          }),
        }),
      }),
    }),
  }),
});

const parseRequest = async (req) => {
  try {
    return await req.json();
  } catch (err) {
    // Return an empty object if parsing fails, or throw an error.
    return {};
  }
};

const handleValidationStep = async (messages, step, adDetails) => {
  console.log("validation");

  // Primary logic:
  const validationResponse = await generateObject({
    model: openai("gpt-4o-mini"),
    output: "enum",
    enum: ["details", "unrelated", "clarification"],
    messages: [
      {
        role: "system",
        content: validation,
      },
      ...(step === "validation" ? messages : []),
    ],
    max_tokens: 10,
  });
  const validationText = validationResponse.object;

  // If unrelated
  if (validationText === "unrelated") {
    console.log("Unrelated request.");

    step = "validation";
    return createDataStreamResponse({
      execute: (dataStream) => {
        dataStream.writeData({ step, adDetails });
        const unrelatedResponse = streamText({
          model: openai("gpt-4o-mini"),
          messages: [
            {
              role: "system",
              content: unrelated,
            },
            ...messages,
          ],
          max_tokens: 50,
        });
        unrelatedResponse.mergeIntoDataStream(dataStream);
      },
    });
  }

  // If clarification
  if (validationText === "clarification") {
    console.log("Clarification needed.");

    step = "details";
    return createDataStreamResponse({
      execute: (dataStream) => {
        dataStream.writeData({ step, adDetails });
        const clarificationResponse = streamText({
          model: openai("gpt-4o-mini"),
          messages: [
            {
              role: "system",
              content: clarification,
            },
            ...messages,
          ],
          max_tokens: 200,
        });
        clarificationResponse.mergeIntoDataStream(dataStream);
      },
    });
  }

  // Otherwise, assume we have details or can proceed to detail gathering
  // Return null to indicate we should move on to the next step
  return null;
};

const handleDetailsStep = async (messages, step, adDetails) => {
  console.log("Details");

  step = "details";
  const detailsResponse = await generateObject({
    model: openai("gpt-4o-mini"),
    messages: [
      {
        role: "system",
        content: details(
          adDetails,
          campaignObjectives,
          campaignStatuses,
          adSetBillingEvents,
          adSetOptimizationGoals,
          adSetBidStrategies,
          adCreativeCTAs
        ),
      },
      ...messages,
    ],
    schema: adDetailsSchema,
  });

  adDetails = detailsResponse.object;
  const missingFields = findEmptyFields(
    adDetails,
    [],
    ["adCreative.objectStorySpec.linkData.picture"]
  );

  if (missingFields.length > 0) {
    console.log("❌ Missing fields:");
    console.log(missingFields);

    console.log("Ask for missing fields.");

    // Ask for missing fields
    return createDataStreamResponse({
      execute: (dataStream) => {
        dataStream.writeData({ step, adDetails });
        const missingDetailsResponse = streamText({
          model: openai("gpt-4o-mini"),
          messages: [
            {
              role: "system",
              content: missingDetails(missingFields),
            },
            ...messages,
          ],
          max_tokens: 200,
        });
        missingDetailsResponse.mergeIntoDataStream(dataStream);
      },
    });
  }

  console.log("✅ All fields are filled!");

  // If all details are complete, proceed to preview
  return handlePreviewStep(messages, "preview", adDetails);
};

const handlePreviewStep = async (messages, step, adDetails) => {
  console.log("Generate preview");

  step = "confirmation";
  return createDataStreamResponse({
    execute: (dataStream) => {
      dataStream.writeData({ step, adDetails });
      const previewResponse = streamText({
        model: openai("gpt-4o-mini"),
        messages: [
          {
            role: "system",
            content: generatePreview(adDetails, adCreativeCTAs),
          },
          ...messages,
        ],
        tools: {
          generateAdPreview: {
            description: "Generate a Facebook ad preview",
            parameters: generatePreviewSchema,
          },
        },
        toolCallStreaming: true,
        toolChoice: "required",
        max_tokens: 200,
      });

      previewResponse.mergeIntoDataStream(dataStream);
    },
  });
};

const handleConfirmationStep = async (messages, step, adDetails) => {
  console.log("Ask for confirmation");

  step = "adCreation";
  return createDataStreamResponse({
    execute: (dataStream) => {
      dataStream.writeData({ step, adDetails });
      const confirmationResponse = streamText({
        model: openai("gpt-4o-mini"),
        messages: [
          {
            role: "system",
            content: confirmation,
          },
          ...messages,
        ],
        tools: {
          askForConfirmation: {
            description: "Ask the user for confirmation.",
            parameters: askForConfirmationSchema,
          },
        },
        toolCallStreaming: true,
        toolChoice: "required",
        max_tokens: 200,
      });
      confirmationResponse.mergeIntoDataStream(dataStream);
    },
  });
};

const handleAdCreationStep = async (messages, step, adDetails) => {
  console.log("Ad Creation");

  // Extract the user's last tool invocations to see if they approved or not
  const toolInvocations = messages[messages.length - 1]?.toolInvocations || [];
  const confirmationResult = toolInvocations.length
    ? toolInvocations[toolInvocations.length - 1].result
    : "";

  console.log("confirmationResult: ", confirmationResult);

  // If user approved => create ad
  if (confirmationResult === "approve") {
    step = "end";
  } else {
    // Otherwise, they want to revise => go back to details
    step = "details";
  }

  return createDataStreamResponse({
    execute: (dataStream) => {
      dataStream.writeData({ step, adDetails });
      const createAdResponse = streamText({
        model: openai("gpt-4o-mini"),
        messages: [
          {
            role: "system",
            content: adCreation(confirmationResult, adDetails),
          },
          ...messages,
        ],
        tools: {
          createAd: {
            description: "Create a Facebook ad.",
            parameters: creatAdSchema,
          },
        },
        toolCallStreaming: true,
        max_tokens: 200,
      });

      createAdResponse.mergeIntoDataStream(dataStream);
    },
  });
};

const handleDefaultStep = () => {
  return NextResponse.json({
    success: false,
    error: "Unrecognized step or no step provided.",
  });
};

export {
  parseRequest,
  handleValidationStep,
  handleDetailsStep,
  handlePreviewStep,
  handleConfirmationStep,
  handleAdCreationStep,
  handleDefaultStep,
};
