import { NextResponse } from "next/server";

export async function POST(req) {
  const event = await req.json(); // Webhook event data
  console.log("🚀 ~ route.js:5 ~ POST ~ event:", event);

  return NextResponse.json({ status: "received" });
}
