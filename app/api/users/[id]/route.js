import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";
import Account from "@/models/Account";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

// Update user from profile
export async function PATCH(request, { params }) {
  const session = await getServerSession(authOptions);
  if (session?.user.id !== params.id) {
    return new NextResponse("Unauthorized", {
      status: 401,
    });
  }

  const { accountDetails } = await request.json();
  const filteredDetails = Object.fromEntries(
    Object.entries(accountDetails).filter(([_, value]) => value !== "")
  );

  await dbConnect();
  await User.updateOne({ _id: params.id }, filteredDetails);

  return NextResponse.json({ success: true });
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (session?.user.id !== params.id) {
    return new NextResponse("Unauthorized", {
      status: 401,
    });
  }

  await dbConnect();
  const deletedUser = await User.findOneAndDelete({ _id: params.id });

  if (!deletedUser) {
    return NextResponse.json({ success: false, message: "User-ul nu există" });
  }

  await Account.deleteMany({ userId: params.id });

  return NextResponse.json({ success: true });
}
