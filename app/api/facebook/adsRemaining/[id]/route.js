import { NextResponse } from "next/server";
import User from "@/models/User";
import dbConnect from "@/utils/dbConnect";

export async function POST(req, { params }) {
  const { id } = params;

  try {
    await dbConnect();
    const {
      facebook: { adsRemaining },
    } = await User.findOneAndUpdate(
      { _id: id },
      {
        $inc: {
          "facebook.adsRemaining": -1,
        },
      },
      { new: true }
    ).select("facebook.adsRemaining");

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
