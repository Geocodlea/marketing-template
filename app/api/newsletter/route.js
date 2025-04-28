import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Unauthorized", {
      status: 401,
    });
  }

  const { email } = await request.json();

  await dbConnect();
  await User.updateOne({ _id: session.user.id }, { newsletterEmail: email });

  return NextResponse.json({
    status: "success",
    message: "Te-ai abonat cu succes!",
  });
}
