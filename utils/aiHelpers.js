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

const AdDetailsSchema = z.object({
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
        content: `You determine if a user request is for Facebook ad creation. Respond with:
                 - "details" if the input contains enough details to generate an ad.
                 - "unrelated" if the input is unrelated.
                 - "clarification" if the input is missing key ad creation details (too vague).`,
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
              content:
                "You guide users to create Facebook ads. The input was unrelated. Redirect them politely.",
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
              content: `The user input was too vague to create an ad. Ask the user to clarify their request in a natural and helpful way.
              - Tailor the response based on what is missing.
              - Keep it polite and concise.
              - You DON'T create an ad.
              - Example: "Could you provide more details? Are you selling a product or offering a service?"`,
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
        content: `
          You are a helpful assistant. Your task is to return a complete JSON object matching the schema provided using the prrevious messages and ${JSON.stringify(
            adDetails
          )}. Do not include any explanation, description, or extra text.
            
          Strict output rule:
          - Return ONLY the JSON object.
          - Do NOT wrap it in markdown.
          - Do NOT add any headings or comments.

           Guidelines:
            - **Do NOT infer the following critical details:**
              - Campaign objective
              - Ad set billing event
              - Ad set optimization goal
              - Ad set daily budget
              - Ad set targeting audience
              - Ad creative picture

            - **⚠️ Critical Field Compatibility Rules**:
              When generating values, ensure that the following **field pairs are logically valid together**. If any pair does not match a valid combination, return both fields as null
              1. **billingEvent and optimizationGoal must be a valid combination.** Valid pairs include:
                - billingEvent: "IMPRESSIONS", optimizationGoal: "REACH"
                - billingEvent: "LINK_CLICKS", optimizationGoal: "LINK_CLICKS"
                - billingEvent: "THRUPLAY", optimizationGoal: "VIDEO_VIEWS"
                - billingEvent: "IMPRESSIONS", optimizationGoal: "VIDEO_VIEWS"
                - billingEvent: "IMPRESSIONS", optimizationGoal: "POST_ENGAGEMENT"
                - billingEvent: "IMPRESSIONS", optimizationGoal: "LEAD_GENERATION"
              2. If billingEvent is not valid for the selected optimizationGoal, return BOTH fields as null and wait for the user to clarify.
              3. If bidStrategy is "LOWEST_COST_WITHOUT_CAP", do NOT provide bidAmount.
            - You MUST enforce these compatibility rules before returning any values.

            - If any of the following fields are missing or null, request them explicitly:
            - **Check for missing fields in the provided object and ask the user directly for them.**  
              - If any of the following fields are missing or null, request them explicitly:
                - Campaign objective: ${
                  adDetails.campaign.objective ? "Provided" : "Missing"
                }
                - Campaign status: ${
                  adDetails.campaign.status ? "Provided" : "Missing"
                }
                - Ad set daily budget: ${
                  adDetails.adSet.dailyBudget ? "Provided" : "Missing"
                }
                
            - **Enum rules:**
              - The following fields MUST match EXACTLY one of the valid enum values listed below or be null if unknown or not provided. DO NOT invent or infer new values outside of these lists:
              - Campaign objective: Must match EXACTLY one of the valid enum values: ${campaignObjectives.join(
                ", "
              )}
              - Campaign status: Must match EXACTLY one of the valid enum values: ${campaignStatuses.join(
                ", "
              )}
              - Ad set billing event: Must match EXACTLY one of the valid enum values: ${adSetBillingEvents.join(
                ", "
              )}
              - Ad set optimization goal: Must match EXACTLY one of the valid enum values: ${adSetOptimizationGoals.join(
                ", "
              )}
              - Ad set bid strategy: Must match EXACTLY one of the valid enum values: ${adSetBidStrategies.join(
                ", "
              )}
              - Ad creative CTA type: Must match EXACTLY one of the valid enum values: ${adCreativeCTAs.join(
                ", "
              )}
              - If the correct value is not available or cannot be inferred, return null.

            - **Infer all the following fields:**
              - Campaign: name
              - Ad set: 
                - name
                - optimizationGoal
                - bidStrategy
              - Ad creative:
                - name
                - objectStorySpec.linkData.message: A compelling ad message
                - objectStorySpec.linkData.link: Use a placeholder like https://example.com
                - objectStorySpec.linkData.CTA.type: Choose a valid CTA from the enum
                - objectStorySpec.linkData.CTA.value.link: Same as above link or another relevant one
            - If adCreative already exists, preserve existing fields.
          
            - **Return null for any missing details you cannot infer.**
            - **Final Rule**: Validate field compatibility before returning the object. If a field is invalid in context, return it as null and await clarification from the user.
          `,
      },
      ...messages,
    ],
    schema: AdDetailsSchema,
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
              content: `The user has not provided some required details (${missingFields.join(
                ", "
              )}).
                    - Ask naturally for only the missing fields.
                    - Keep it conversational and avoid overwhelming the user.
                    - Example: "Could you provide a campaign name and its objective?"`,
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
            content: `You are a tool-using assistant that helps generate Facebook ad previews.
  
              You are given ad input data as a JavaScript object: ${JSON.stringify(
                adDetails
              )}
              
              Instructions:
              - Extract the following fields from the data and use them to call the 'generateAdPreview' tool:
                - "name": a short creative title
                - "description": a short and catchy description
                - "message": the persuasive ad text
                - "CTA": must be one of [${adCreativeCTAs.join(", ")}]
                - "link": use "https://example.com" if missing
              
              STRICT output rules:
              - Do not generate text.
              - Do not describe the ad.
              - Do not wrap the tool call in markdown or text.
              - Do not output iframe code.
              - Do not explain anything.
              - DO NOT respond with JSON or text.
              - Your ONLY task is to immediately call the 'generateAdPreview' tool with the structured fields above.`,
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
            content: `You are a tool-using assistant.
              
              STRICT output rules:
              - Do not generate text.
              - Do not describe the ad.
              - Do not wrap the tool call in markdown or text.
              - Do not explain anything.
              - DO NOT respond with JSON or text.
              - Your ONLY task is to immediately call the 'askForConfirmation' tool with the message "Do you approve this ad?".`,
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
            content: `You are a tool-using assistant that helps generate Facebook ads.
              
              STRICT output rules:
              - Do not describe the ad.
              - Do not wrap the tool call in markdown or text.
              - Do not explain anything.
              - ${
                confirmationResult === "approve"
                  ? "Immediately call the 'createAd' tool with the following parameters:" +
                    JSON.stringify(adDetails)
                  : "Ask the user what details they want to modify."
              }
              - If the 'createAd' tool returns a successful response, respond with "Ad created successfully.", else respond with "Ad creation failed."`,
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
  AdDetailsSchema,
  parseRequest,
  handleValidationStep,
  handleDetailsStep,
  handlePreviewStep,
  handleConfirmationStep,
  handleAdCreationStep,
  handleDefaultStep,
};
