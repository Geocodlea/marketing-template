import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  const { message, history } = await req.json();

  return NextResponse.json({ response: message });

  //   try {
  //     const { message, history } = await req.json();

  //     const response = await openai.chat.completions.create({
  //       model: "gpt-4o-mini",
  //       messages: [...history, { role: "user", content: message }],
  //     });

  //     return NextResponse.json({ response: response.choices[0].message.content });
  //   } catch (error) {
  //     return NextResponse.json(
  //       { error: error.message || "Something went wrong" },
  //       { status: 500 }
  //     );
  //   }
}
