import { openai } from "@ai-sdk/openai";
import { streamText, generateObject, createDataStreamResponse } from "ai";
import z from "zod";

const validCTAOptions = [
  "BOOK_TRAVEL",
  "CONTACT_US",
  "DONATE",
  "DOWNLOAD",
  "GET_DIRECTIONS",
  "GO_LIVE",
  "LEARN_MORE",
  "LIKE_PAGE",
  "MESSAGE_PAGE",
  "SHOP_NOW",
  "SIGN_UP",
  "VIEW_INSTAGRAM_PROFILE",
  "INSTAGRAM_MESSAGE",
  "PURCHASE_GIFT_CARDS",
  "ORDER_NOW",
  "WHATSAPP_MESSAGE",
  "PLAY_GAME",
  "WATCH_VIDEO",
  "BUY_NOW",
  "BUY_TICKETS",
  "SUBSCRIBE",
];

const requiredFields = {
  campaign: ["name", "objective"],
  ad_set: [
    "name",
    "billing_event",
    "optimization_goal",
    "daily_budget",
    "targeting",
  ],
  ad_creative: ["headline", "copy", "image_video", "call_to_action"],
};

export async function POST(req) {
  const { messages, step, adDetails } = await req.json();

  console.log("step", step, "adDetails", adDetails);

  if (step === "validation") {
    console.log("validation");
    // **Step 1: Validate if the input is ad-related, vague, or unrelated**
    const validationResponse = await generateObject({
      model: openai("gpt-4o-mini"),
      output: "enum",
      enum: ["ad-related", "unrelated", "clarification"],
      messages: [
        {
          role: "system",
          content: `You determine if a user request is for Facebook ad creation.
        Respond with:
        - "ad-related" if the input contains enough details to generate an ad.
        - "unrelated" if the input is unrelated.
        - "clarification" if the input is missing key ad creation details (too vague).`,
        },
        ...messages,
      ],
      max_tokens: 10,
    });

    const validationText = validationResponse.object;

    if (validationText === "unrelated") {
      console.log("Unrelated request.");

      // **Step 2: If the input is unrelated, guide the user to create Facebook ads**
      const unrelatedResponse = streamText({
        model: openai("gpt-4o-mini"),
        messages: [
          {
            role: "system",
            content: "You guide users to create Facebook ads.",
          },
          {
            role: "user",
            content: "The input was unrelated. Redirect them politely.",
          },
        ],
        max_tokens: 50,
      });

      return unrelatedResponse.toDataStreamResponse();
    }

    if (validationText === "clarification") {
      console.log("Clarification needed.");

      // **Step 2A: AI-generated clarification message**
      return createDataStreamResponse({
        execute: (dataStream) => {
          dataStream.writeData({
            step: "ad-related",
          });

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
  }

  if (step === "ad-related") {
    console.log("Request is ad-related.");

    // **Step 3: Extract Campaign & Ad Set Details from Messages**
    const detailsResponse = await generateObject({
      model: openai("gpt-4o-mini"),
      messages: [
        {
          role: "system",
          content: `
              Based on the previous messages and ${adDetails}, identify any missing details for the campaign, ad set, and ad creative.
              
              - **Do NOT infer the following critical details:**
                - Campaign objective
                - Ad set daily budget
                - Targeting audience (location, interests, age range, etc.)
                - Ad set billing event
                - Ad set optimization goal
              
              - **Check for missing fields in the provided object and ask the user directly for them.**  
                - If any of the following fields are missing or null, request them explicitly:
                  - Campaign objective: ${
                    adDetails?.campaign?.objective === null
                  } ? 'Missing' : 'Provided'}
                  - Ad set daily budget: ${
                    adDetails?.ad_set?.daily_budget === null
                  } ? 'Missing' : 'Provided'}
                  - Targeting: ${
                    adDetails?.ad_set?.targeting === null
                  } ? 'Missing' : 'Provided'}
                  - Billing event: ${
                    adDetails?.ad_set?.billing_event === null
                  } ? 'Missing' : 'Provided'}
                  - Optimization goal: ${
                    adDetails?.ad_set?.optimization_goal === null
                  } ? 'Missing' : 'Provided'}
            
              - **You can infer other ad details such as:**
                - Campaign name
                - Ad set name
                - Ad creative elements (headline, copy, image/video, call to action)
            
              - **Return null for any missing details you cannot infer and ask the user for those specific details.**  
              - Ensure that the missing fields (objective, daily budget, targeting, billing event, and optimization goal) are explicitly requested from the user before proceeding.
            `,
        },
        ...messages,
      ],
      schema: z.object({
        campaign: z.object({
          name: z.string().nullable(),
          objective: z.string().nullable(),
        }),
        ad_set: z.object({
          name: z.string().nullable(),
          billing_event: z.string().nullable(),
          optimization_goal: z.string().nullable(),
          daily_budget: z.number().nullable(),
          targeting: z.string().nullable(),
        }),
        ad_creative: z.object({
          headline: z.string().nullable(),
          copy: z.string().nullable(),
          image_video: z.string().nullable(),
          call_to_action: z.string().nullable(),
        }),
      }),
    });

    const newAdDetails = detailsResponse.object;
    console.log(newAdDetails);

    let missingFields = [];

    for (const section in requiredFields) {
      requiredFields[section].forEach((field) => {
        if (!newAdDetails[section][field]) {
          missingFields.push(`${section}.${field}`);
        }
      });
    }

    console.log(missingFields);

    if (missingFields.length > 0) {
      console.log("Ask for missing fields.");

      // **Step 4: Ask for Missing Campaign, Ad Set, or Ad Creative Details**
      return createDataStreamResponse({
        execute: (dataStream) => {
          dataStream.writeData({
            step: "ad-related",
            adDetails: newAdDetails,
          });

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
  }

  console.log("Generate preview");

  // **Step 4: Proceed with Ad Creative Generation**
  return createDataStreamResponse({
    execute: (dataStream) => {
      dataStream.writeData({
        step: "preview",
      });

      const adResponse = streamText({
        model: openai("gpt-4o-mini"),
        messages: [
          {
            role: "system",
            content: `You generate a Facebook ad JSON object.
          - Do NOT create the ad, just prepare its details.
          - Required fields:
            - "name" (creative title)
            - "description" (short, engaging)
            - "message" (persuasive ad text)
            - "call_to_action" (one of: ${validCTAOptions.join(", ")})
            - "link" (use a placeholder if missing)
          - If all details are available, call the generateAdPreview tool.
          - Ask the user for confirmation before creating the ad.
          - If rejected, ask what they want to modify.
          - Do NOT include additional text, only tool calls.`,
          },
          ...messages,
        ],
        tools: {
          generateAdPreview: {
            description: "Generate a Facebook ad preview",
            parameters: z.object({
              name: z.string(),
              description: z.string(),
              message: z.string(),
              call_to_action: z.enum(validCTAOptions),
              link: z.string().optional(),
            }),
          },
          askForConfirmation: {
            description: "Ask the user for confirmation.",
            parameters: z.object({
              message: z
                .string()
                .describe("The message to ask for confirmation."),
            }),
          },
          createAd: {
            description: "Create a Facebook ad.",
            parameters: z.object({
              name: z.string(),
              description: z.string(),
              message: z.string(),
              call_to_action: z.enum(validCTAOptions),
              link: z.string().optional(),
            }),
          },
        },
        toolCallStreaming: true,
        max_tokens: 200,
      });

      adResponse.mergeIntoDataStream(dataStream);
    },
  });
}
