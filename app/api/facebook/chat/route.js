import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import z from "zod";
import {
  findEmptyFields,
  campaignStatuses,
  leadFormCTAs,
  adCreativeCTAs,
} from "@/utils/fbAdOptions";

const model = process.env.AI_MODEL;

const adDetailsSchema = z.object({
  campaign: z.object({
    name: z.string().nullable(),
    status: z.enum(campaignStatuses).nullable(),
  }),
  adSet: z.object({
    name: z.string().nullable(),
    daily_budget: z.number().nullable(),
    targeting: z.object({
      geo_locations: z.object({
        countries: z.array(z.string().nullable()),
      }),
    }),
  }),
  leadForm: z.object({
    name: z.string().nullable(),
    intro: z.object({
      title: z.string().nullable(),
      body: z.string().nullable(),
    }),
    questions: z.array(
      z.object({ type: z.string().nullable(), label: z.string().nullable() })
    ),
    thank_you_page: z.object({
      title: z.string().nullable(),
      body: z.string().nullable(),
      button_text: z.string().nullable(),
      button_type: z.enum(leadFormCTAs).nullable(),
      website_url: z.string().url().nullable(),
    }),
  }),
  adCreative: z.object({
    name: z.string().nullable(),
    object_story_spec: z.object({
      link_data: z.object({
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
    status: z.enum(campaignStatuses),
  }),
  adSet: z.object({
    name: z.string(),
    daily_budget: z.number(),
    targeting: z.object({
      geo_locations: z.object({
        countries: z.array(z.string()),
      }),
    }),
  }),
  leadForm: z.object({
    name: z.string(),
    intro: z.object({
      title: z.string(),
      body: z.string(),
    }),
    questions: z.array(z.object({ type: z.string(), label: z.string() })),
    thank_you_page: z.object({
      title: z.string(),
      body: z.string(),
      button_text: z.string(),
      button_type: z.enum(leadFormCTAs),
      website_url: z.string().url(),
    }),
  }),
  adCreative: z.object({
    name: z.string(),
    object_story_spec: z.object({
      link_data: z.object({
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

export async function POST(req) {
  let { messages } = await req.json();

  // Pass the contact list to the generateEmail tool
  const response = streamText({
    model: openai(model),
    messages: [
      {
        role: "system",
        content: `You are an autonomous Facebook Ad Builder agent. Your goal is to guide the user through creating a complete, publishable Facebook lead-gen ad. The API will provide the Zod schemas for your three tools: generatePreview, askForConfirmation, and createAd.

Agent Behavior Reminders

1. Persistence  
   - Do not return control until after createAd is successfully called.

2. Tool-calling  
   - As soon as you have all **essential** information, emit **only** the JavaScript object argument for a single tool call—no natural-language or backticks.  
   - The three tools are:
     • generatePreview  
     • askForConfirmation  
     • createAd  
   - If the user omits any essential fields (daily_budget, countries array), ask **only** for those.  
   - For **destination URL** and **CTA.type**, infer defaults if missing:  
     – link → "https://example.com"  
     – CTA.type → first option from adCreativeCTAs (e.g. "Learn More")  

3. Inference  
   - Infer sensible defaults for everything else (ad name, campaign name, picture, lead form details, thank-you page text).  
   - Never ask about non-essential fields.

4. Planning  
   - You may think internally but strip out all planning commentary.  
   - On tool call, output only the JS object argument.

Conversation Flow

1. Read user input.  
2. Determine missing **essential** fields: daily_budget, countries array.  
3. Ask **only** for missing essentials.  
4. Infer URL and CTA.type if absent.  
5. Infer all other defaults.  
6. When ready, emit a single call argument to generatePreview.  
7. After confirmation, emit a single call argument to createAd.  
8. Stop.
`,
      },
      ...messages,
    ],
    tools: {
      generatePreview: {
        description: "Generate a Facebook ad preview",
        parameters: generatePreviewSchema,
      },
      askForConfirmation: {
        description: "Ask the user for confirmation.",
        parameters: askForConfirmationSchema,
      },
      creatAd: {
        description: "Create a Facebook ad.",
        parameters: creatAdSchema,
      },
    },
    toolCallStreaming: true,
  });

  return response.toDataStreamResponse();
}
