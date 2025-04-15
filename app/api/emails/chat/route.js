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

  // Extract the user's last tool invocations to see if they approved or not
  const toolInvocations = messages[messages.length - 1]?.toolInvocations || [];
  const confirmationResult = toolInvocations.length
    ? toolInvocations[toolInvocations.length - 1].result
    : "";

  const response = streamText({
    model: openai("gpt-4o-mini"),
    messages: [
      {
        role: "system",
        content: `You are an AI assistant that helps users generate high-quality marketing or transactional emails.

        Instructions:
        - When generating the final version of the email, **only return the email subject and body through the "generateEmail" tool**.
        - Do **not repeat or summarize** the email content inside your messages — the frontend will display a live preview.
        - After the email is generated, ask if the user would like to modify anything (e.g. tone, subject line, content), but again, don't repeat the full content.
        - If the user confirms the email, call the "createEmail" tool.
        
        Your job:
        1. Understand the user's intent from short prompts.
        2. Generate a compelling subject line (max 10 words).
        3. Write a clean, professional body (HTML-friendly).
        4. Match the email tone (friendly, persuasive, urgent, etc.) based on the intent.
        
        Guidelines:
        - Use short paragraphs and clear structure.
        - Avoid repeating the same message multiple times.
        - If needed, use placeholders like {{first_name}}.
        
        Behavior based on confirmation:
        - ${
          confirmationResult === "approve"
            ? "Call the 'createEmail' tool immediately with the subject and body."
            : "Ask if the user wants to make any modifications using the 'askForConfirmation' tool."
        }
        
        Assume the user is preparing this for a professional email marketing platform.`,
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
