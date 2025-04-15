import { openai } from "@ai-sdk/openai";
import { streamText, generateObject, createDataStreamResponse } from "ai";
import { NextResponse } from "next/server";
import z from "zod";

const generateEmailSchema = z.object({
  subject: z.string().describe("The subject of the email."),
  body: z.string().describe("The body of the email."),
});

const askForConfirmationSchema = z.object({
  message: z.string().describe("The message to ask for confirmation."),
});

const createEmailSchema = z.object({
  subject: z.string().describe("The subject of the email."),
  body: z.string().describe("The body of the email."),
});

export async function POST(req) {
  let { messages } = await req.json();

  const response = streamText({
    model: openai("gpt-4o-mini"),
    messages: [
      {
        role: "system",
        content: `You are an AI assistant that helps generate high-quality marketing emails. 

    Your job is to:
    1. Understand the intent behind the user's input message.
    2. Generate a compelling, engaging **email subject line**.
    3. Write a clear, persuasive **email body**, written in a friendly and professional tone, with the goal of engagement or conversion.
    4. Adapt the language style to match the type of email (informative, promotional, transactional, follow-up, etc.).

    Output format should be:

    📌 Subject: [Generated Subject Line]

    📨 Body:
    [Generated Email Body (HTML-friendly, paragraph format, clear CTA if needed)]

    Guidelines:
    - Keep the subject line short and attention-grabbing (max 10 words).
    - Make the body easy to scan: use short paragraphs, bold key points if helpful.
    - Use personalization placeholders if appropriate (e.g. {{first_name}}).
    - Match the tone to the intent (warm for follow-ups, exciting for launches, helpful for onboarding, etc.).

    The user will give you short natural-language prompts like:
    - “remind people about the webinar tomorrow”
    - “announce our new integration with Slack”
    - “welcome email for new subscribers”

    Always assume the user is a marketing manager looking to use the generated email in a professional campaign tool.`,
      },
      ...messages,
    ],
    tools: {
      generateEmail: {
        description: "Generate an email.",
        parameters: generateEmailSchema,
      },
      askForConfirmation: {
        description: "Ask the user for confirmation.",
        parameters: askForConfirmationSchema,
      },
      createEmail: {
        description: "Create an email.",
        parameters: createEmailSchema,
      },
    },
    toolCallStreaming: true,
    max_tokens: 200,
  });

  return response.toDataStreamResponse();
}
