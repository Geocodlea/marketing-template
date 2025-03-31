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

  // Step 1: Determine if the input is ad-related, requires clarification, or is unrelated
  const validationResponse = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You determine if a user request is for Facebook ad creation.
        Respond with:
        - "yes" if the input contains enough details to generate an ad.
        - "no" if it is unrelated.
        - "clarification" if it is missing important creative details.`,
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
    // Step 2: Try to infer missing ad details before asking
    const inferenceResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You generate a Facebook ad JSON object. The response **must be valid JSON**.
          The user has already set their campaign and ad set, so **do not ask about objectives or audience**.
          Your job is to infer missing ad details before requesting more information.
          
          **Rules:**
          - **Deduce the following ad details:** 
            - "name" (generate creatively)
            - "description" (generate based on context)
            - "message" (generate)
            - "call_to_action" (choose from: ${validCTAOptions.join(", ")})
            - "link" (use a placeholder if missing)
          - **Only ask for details if they are impossible to deduce**.
          
          Respond with a JSON object formatted like this:
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

    // Check for missing fields
    let missingFields = [];
    if (!inferredAd.name) missingFields.push("name");
    if (!inferredAd.description) missingFields.push("description");
    if (!inferredAd.message) missingFields.push("message");
    if (!validCTAOptions.includes(inferredAd.call_to_action))
      missingFields.push("call_to_action");

    // If all details are inferred, proceed to Step 3 (generate final ad)
    if (missingFields.length === 0) {
      return NextResponse.json({
        status: "ready",
        adCreative: inferredAd,
      });
    }

    // Ask only for the missing details
    return NextResponse.json({
      status: "clarification",
      message: `I inferred some details, but I still need: ${missingFields.join(
        ", "
      )}. Could you provide them?`,
    });
  }

  // Step 3: Generate the final ad creative
  const adResponse = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You generate a Facebook ad JSON object. The response **must be valid JSON**.
          The JSON must include:
          - "name": A creative title.
          - "description": A short, engaging description.
          - "message": A persuasive ad message.
          - "call_to_action": A valid CTA from this list: ${validCTAOptions.join(
            ", "
          )}.
          - "link": Use a placeholder if none is provided.
          
          Respond with a JSON object formatted like this:
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
    max_tokens: 250,
    response_format: { type: "json_object" },
  });

  let adCreative = adResponse.choices[0]?.message?.content;

  if (typeof adCreative === "string") {
    try {
      adCreative = JSON.parse(adCreative);
    } catch (error) {
      return NextResponse.json({
        status: "error",
        message: "Failed to parse AI response as JSON.",
      });
    }
  }

  if (!validCTAOptions.includes(adCreative.call_to_action)) {
    adCreative.call_to_action = "CONTACT_US";
  }

  return NextResponse.json({ status: "ready", adCreative });
}
