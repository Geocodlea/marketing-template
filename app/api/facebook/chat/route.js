import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
  const { message, history } = await req.json();
  let conversation = [...history, { role: "user", content: message }];

  // **Step 1: Determine if input is ad-related, vague, or unrelated**
  const validationResponse = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You determine if a user request is for Facebook ad creation.
        Respond with:
        - "yes" if the input contains enough details to generate an ad.
        - "no" if it is unrelated.
        - "clarification" if it is missing key creative details (too vague).`,
      },
      ...conversation,
    ],
    max_tokens: 10,
    response_format: { type: "text" },
  });

  const validationText = validationResponse.choices[0]?.message?.content
    ?.toLowerCase()
    .trim();

  if (validationText === "no") {
    // Generate a polite response for unrelated prompts
    const unrelatedResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You guide users to create Facebook ads." },
        {
          role: "user",
          content: "The input was unrelated. Redirect them politely.",
        },
      ],
      max_tokens: 50,
    });

    return NextResponse.json({
      status: "error",
      message:
        unrelatedResponse.choices[0]?.message?.content ||
        "I'm here to assist with Facebook ads! What do you need an ad for?",
    });
  }

  if (validationText === "clarification") {
    // **Step 1A: AI-generated clarification message**
    const clarificationResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `The user input was too vague to create an ad. Ask the user to clarify their request in a natural and helpful way.
          - Tailor the response based on what is missing.
          - Keep it polite and concise.
          - Example: "Could you provide more details? Are you selling a product or offering a service?"`,
        },
        { role: "user", content: message },
      ],
      max_tokens: 200,
    });

    return NextResponse.json({
      status: "clarification",
      message:
        clarificationResponse.choices[0]?.message?.content ||
        "Could you clarify your ad request with more details?",
    });
  }

  // **Step 2: Try to infer missing details before generating the ad**
  const inferenceResponse = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You generate a Facebook ad JSON object. The response **must be valid JSON**.
          The user has already set their campaign and ad set, so **do not ask about objectives or audience**.
  
          **Your job:**
          - Try to infer missing ad details if possible.
          - If critical details are missing, do NOT assume—ask for them instead.
  
          **Required ad details:**
          - "name" (creative title)
          - "description" (short, engaging)
          - "message" (persuasive ad text)
          - "call_to_action" (one of: ${validCTAOptions.join(", ")})
          - "link" (use a placeholder if missing)
  
          **Respond strictly in this JSON format:**
          {
            "name": "string",
            "description": "string",
            "message": "string",
            "call_to_action": "string",
            "link": "string"
          }`,
      },
      ...conversation,
    ],
    max_tokens: 200,
    response_format: { type: "json_object" },
  });

  let inferredAd = inferenceResponse.choices[0]?.message?.content;

  if (typeof inferredAd === "string") {
    try {
      inferredAd = JSON.parse(inferredAd);
    } catch (error) {
      return NextResponse.json({
        status: "error",
        message: "Failed to parse AI response as JSON.",
      });
    }
  }

  // **Step 2A: Validate inferred ad details**
  let missingFields = [];
  if (!inferredAd.name) missingFields.push("name");
  if (!inferredAd.description) missingFields.push("description");
  if (!inferredAd.message) missingFields.push("message");
  if (!validCTAOptions.includes(inferredAd.call_to_action))
    missingFields.push("call_to_action");

  if (missingFields.length > 0) {
    return NextResponse.json({
      status: "clarification",
      message: `I inferred some details, but I still need: ${missingFields.join(
        ", "
      )}. Could you provide them?`,
    });
  }

  return NextResponse.json({
    status: "ready",
    adCreative: inferredAd,
  });
}
