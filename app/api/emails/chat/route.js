import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import z from "zod";

const model = process.env.AI_MODEL;

const contactSchema = z.object({
  email: z.string().email(),
  prenume: z.string().optional(),
  nume_familie: z.string().optional(),
});

const generateEmailPreviewSchema = z.object({
  to: z
    .array(contactSchema)
    .describe(
      "The list of email addresses to send the email to. Each contact must include 'email', and optionally 'prenume' and 'nume_familie'."
    ),
  subject: z.string().describe("The subject of the email."),
  body: z.string().describe("The body of the email."),
});

const askForConfirmationSchema = z.object({
  message: z.string().describe("The message to ask for confirmation."),
});

const createEmailSchema = z.object({
  to: z
    .array(contactSchema)
    .describe(
      "The list of email addresses to send the email to. Each contact must include 'email', and optionally 'prenume' and 'nume_familie'."
    ),
  subject: z.string().describe("The subject of the email."),
  body: z.string().describe("The body of the email."),
});

export async function POST(req) {
  let { messages, contacts } = await req.json();

  // Extract the user's last tool invocations to see if they approved or not
  const toolInvocations = messages[messages.length - 1]?.toolInvocations || [];
  const confirmationResult = toolInvocations.length
    ? toolInvocations[toolInvocations.length - 1].result
    : "";

  // Pass the contact list to the generateEmail tool
  const response = streamText({
    model: openai(model),
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
        Contact List Behavior:
        - If the user says "send to my contact list" or "send to all contacts", use the provided contact list: ${JSON.stringify(
          contacts
        )}.
        - If the user provides a specific email address that is not inside the contact list, send to that email directly.
        - Do not invent fake email addresses if the user does not specify them.
        - When populating the "to" field:
          - If sending to the contact list, include "email", "prenume", "nume_familie".
          - If sending to a manually provided email address, only the "email" field is required (no prenume or nume_familie needed).

        - IMPORTANT: Always use the "email" field from the contact list.
        - IMPORTANT: Do not fabricate any fake emails.

        Placeholder usage:
        - In the email body, always use dynamic placeholders like {prenume} and {nume_familie} instead of inserting real names.
        - Always use {prenume} to represent the first name.
        - Always use {nume_familie} to represent the last name.
        - Never hardcode names inside the email body; always rely on placeholders when needed.
        
        Behavior based on confirmation:
        - ${
          confirmationResult === "approve"
            ? "Call the 'createEmail' tool immediately with the subject and body."
            : "Ask if the user wants to make any modifications using the 'askForConfirmation' tool."
        }

        Assume the user is preparing this for a professional email marketing platform. 
        Please respond **only in Romanian** from now on.`,
      },
      ...messages,
    ],
    tools: {
      generateEmailPreview: {
        description: "Generate an email.",
        parameters: generateEmailPreviewSchema,
        execute: async ({ to, subject, body }) => {
          return { to, subject, body };
        },
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
