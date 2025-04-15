import { testEmail } from "@/utils/emailHelpers";
import { NextResponse } from "next/server";
import { authOptions } from "/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export async function POST(request) {
  //   const session = await getServerSession(authOptions);
  //   if (session?.user.role !== "admin") {
  //     return new NextResponse("Unauthorized", {
  //       status: 401,
  //     });
  //   }

  const { to, subject, html } = await request.json();

  await testEmail(to, subject, html);

  return NextResponse.json({ success: true });
}
