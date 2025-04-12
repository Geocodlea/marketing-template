import { NextResponse } from "next/server";
import User from "@/models/User";
import dbConnect from "@/utils/dbConnect";

export async function POST(req, { params }) {
  const { userId } = params;

  try {
    await dbConnect();
    const user = await User.updateOne(
      { _id: userId },
      {
        $inc: {
          "facebook.adsRemaining": -1,
        },
      },
      { new: true }
    );

    const adsRemaining = user.facebook.adsRemaining;

    return NextResponse.json({
      status: "success",
      adsRemaining,
    });
  } catch (error) {
    console.error("Error generating Facebook ad preview:", error);
    return NextResponse.json({
      status: "danger",
    });
  }
}
