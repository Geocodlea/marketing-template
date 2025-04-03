import { openai } from "@ai-sdk/openai";
import { generateText, streamText } from "ai";
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

export async function POST(req) {
  const { messages } = await req.json();

  // **Step 1: Determine if input is ad-related, vague, or unrelated**
  const validationResponse = generateText({
    model: openai("gpt-4o-mini"),
    messages: [
      {
        role: "system",
        content: `You determine if a user request is for Facebook ad creation.
        Respond with:
        - "yes" if the input contains enough details to generate an ad.
        - "no" if it is unrelated.
        - "clarification" if it is missing key creative details (too vague).`,
      },
      ...messages,
    ],
    max_tokens: 10,
  });

  const response = await validationResponse;
  const validationText = response.text;

  if (validationText === "no") {
    console.log("unrelated");

    // Generate a polite response for unrelated prompts
    const unrelatedResponse = streamText({
      model: openai("gpt-4o-mini"),
      messages: [
        { role: "system", content: "You guide users to create Facebook ads." },
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
    console.log("clarification");
    // **Step 1A: AI-generated clarification message**
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

    return clarificationResponse.toDataStreamResponse();
  }

  console.log("YES");

  // **Step 2: Try to infer missing details before generating the ad**
  const inferenceResponse = streamText({
    model: openai("gpt-4o-mini"),
    messages: [
      {
        role: "system",
        content: `You generate a Facebook ad JSON object.
          The response should not create the ad and should not contain any aditional text, other then the tool responses.
          The user has already set their campaign and ad set, so **do not ask about objectives or audience**.

          **Required ad details:**
          - "name" (creative title)
          - "description" (short, engaging)
          - "message" (persuasive ad text)
          - "call_to_action" (one of: ${validCTAOptions.join(", ")})
          - "link" (use a real URL placeholder if missing)

          **Your job:**
          - Try to infer missing ad details if possible.
          - Only if critical details are missing and can't be inferred, do NOT assume and ask for them instead, but in a natural way.
          - If you can infer all required details, call the generateAdPreview tool, with the ad details as parameters.
          - After generating the ad preview, call the askForConfirmation tool.
          - If the response is "approved", immediately call the createAd tool with the given ad details.
          - If the response is "rejected", ask the user what they would like to modify before retrying.
          - DON'T respond with the JSON object.
          - DON'T create the ad, just call the tools.`,
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
          message: z.string().describe("The message to ask for confirmation."),
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

  return inferenceResponse.toDataStreamResponse();
}
