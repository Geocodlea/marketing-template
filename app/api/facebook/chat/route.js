import { openai } from "@ai-sdk/openai";
import { streamText, generateObject, createDataStreamResponse } from "ai";
import { NextResponse } from "next/server";
import z from "zod";
import { requiredFields, CTAOptions } from "@/utils/fbAdOptions";

export async function POST(req) {
  let { messages, step, adDetails } = await req.json();
  console.log("Step: ", step);
  console.log("Ad Details: ", adDetails);

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
        - "ad" if the input contains enough details to generate an ad.
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
            content:
              "You guide users to create Facebook ads. The input was unrelated. Redirect them politely.",
          },
          ...messages,
        ],
        max_tokens: 50,
      });

      return unrelatedResponse.toDataStreamResponse();
    }

    if (validationText === "clarification") {
      step = "details";
      console.log("Clarification needed.");

      // **Step 2A: AI-generated clarification message**
      return createDataStreamResponse({
        execute: (dataStream) => {
          dataStream.writeData({
            step,
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

  if (step === "details") {
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

    adDetails = detailsResponse.object;

    let missingFields = [];

    for (const section in requiredFields) {
      requiredFields[section].forEach((field) => {
        if (!adDetails[section][field]) {
          missingFields.push(`${section}.${field}`);
        }
      });
    }

    console.log(missingFields);

    if (missingFields.length > 0) {
      console.log("Ask for missing fields.");
      console.log(adDetails, step);

      // **Step 4: Ask for Missing Campaign, Ad Set, or Ad Creative Details**
      return createDataStreamResponse({
        execute: (dataStream) => {
          dataStream.writeData({
            step,
            adDetails,
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
    step = "preview";
  }

  if (step === "preview") {
    console.log("Generate preview");
    step = "confirmation";

    // **Step 4: Proceed with Ad Creative Generation**
    return createDataStreamResponse({
      execute: (dataStream) => {
        dataStream.writeData({
          step,
          adDetails,
        });

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
              - "call_to_action": must be one of [${CTAOptions.join(", ")}]
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
              parameters: z.object({
                name: z.string(),
                description: z.string(),
                message: z.string(),
                call_to_action: z.enum(CTAOptions),
                link: z.string().optional(),
              }),
            },
            // askForConfirmation: {
            //   description: "Ask the user for confirmation.",
            //   parameters: z.object({
            //     message: z
            //       .string()
            //       .describe("The message to ask for confirmation."),
            //   }),
            // },
            // createAd: {
            //   description: "Create a Facebook ad.",
            //   parameters: z.object({
            //     campaign: z.object({
            //       name: z.string(),
            //       objective: z.string(),
            //     }),
            //     ad_set: z.object({
            //       name: z.string(),
            //       billing_event: z.string(),
            //       optimization_goal: z.string(),
            //       daily_budget: z.number(),
            //       targeting: z.string(),
            //     }),
            //     ad_creative: z.object({
            //       headline: z.string(),
            //       copy: z.string(),
            //       image_video: z.string(),
            //       call_to_action: z.enum(CTAOptions),
            //     }),
            // campaign: z.object({
            //   name: z.string(),
            //   objective: z.enum(validObjectives),
            // }),
            // ad_set: z.object({
            //   name: z.string(),
            //   objective: z.enum(validObjectives),
            //   bid_strategy: z.enum(validBidStrategies),
            //   daily_budget: z.number(),
            //   targeting: z.object({
            //     location: z.object({
            //       countries: z.array(z.string()),
            //       regions: z.array(z.string()),
            //       cities: z.array(z.string()),
            //     }),
            //     age_min: z.number(),
            //     age_max: z.number(),
            //     gender: z.enum(["male", "female"]),
            //     interests: z.array(z.string()),
            //     keywords: z.array(z.string()),
            //     languages: z.array(z.string()),
            //   })
            // }),
            // ad_creative: z.object({
            //   name: z.string(),
            //   description: z.string(),
            //   message: z.string(),
            //   call_to_action: z.enum(CTAOptions),
            //   link: z.string().optional(),
            // }),
            // }),
            // },
          },
          toolCallStreaming: true,
          toolChoice: "required",
          max_tokens: 200,
        });

        previewResponse.mergeIntoDataStream(dataStream);
      },
    });
  }

  if (step === "confirmation") {
    console.log("Ask for confirmation");
    step = "adCreation";

    // **Step 4: Proceed with Ad Creative Generation**
    return createDataStreamResponse({
      execute: (dataStream) => {
        dataStream.writeData({
          step,
          adDetails,
        });

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
              parameters: z.object({
                message: z
                  .string()
                  .describe("The message to ask for confirmation."),
              }),
            },
          },
          toolCallStreaming: true,
          toolChoice: "required",
          max_tokens: 200,
        });

        confirmationResponse.mergeIntoDataStream(dataStream);
      },
    });
  }

  if (step === "adCreation") {
    console.log("Create Ad");

    console.log("last message: ", messages[messages.length - 1]);

    step = "end";

    return createDataStreamResponse({
      execute: (dataStream) => {
        dataStream.writeData({
          step,
          adDetails,
        });

        const createAdResponse = streamText({
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
            - Your ONLY task is to immediately call the 'createAd' tool with the ad details: ${adDetails}.
            - If the 'createAd' tool returns a successful response, respond with the success message "Ad created successfully."`,
            },
            ...messages,
          ],
          tools: {
            createAd: {
              description: "Create a Facebook ad.",
              parameters: z.object({
                campaign: z.object({
                  name: z.string(),
                  objective: z.string(),
                }),
                ad_set: z.object({
                  name: z.string(),
                  billing_event: z.string(),
                  optimization_goal: z.string(),
                  daily_budget: z.number(),
                  targeting: z.string(),
                }),
                ad_creative: z.object({
                  headline: z.string(),
                  copy: z.string(),
                  image_video: z.string(),
                  call_to_action: z.enum(CTAOptions),
                }),
              }),
            },
          },
          toolCallStreaming: true,
          toolChoice: "required",
          max_tokens: 200,
        });

        createAdResponse.mergeIntoDataStream(dataStream);
      },
    });
  }

  return NextResponse.json({ succes: true });
}
