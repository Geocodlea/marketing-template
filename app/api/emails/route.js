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

  const { from, to, subject, html } = await request.json();

  try {
    await testEmail(process.env.BREVO_EMAIL_USER, to, subject, html);

    return NextResponse.json({
      status: "success",
      message: "Email created successfully!",
    });
  } catch (error) {
    console.error("Error creating email: ", error);
    return NextResponse.json({
      status: "error",
      message: error.message || "An error occurred while creating the email.",
    });
  }
}
