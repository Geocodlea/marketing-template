import dbConnect from "@/utils/dbConnect";
import User from "@/models/User";
import Account from "@/models/Account";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

// Update user from profile
export async function PATCH(request, { params }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.id !== params.id) {
    return new NextResponse("Unauthorized", {
      status: 401,
    });
  }

  const { accountDetails } = await request.json();

  const keys = Object.keys(accountDetails);

  const isFacebookDetails = ["adAccountId", "pageId"].every((key) =>
    keys.includes(key)
  );
  const isBrevoDetails = ["brevoEmail", "brevoName"].some((key) =>
    keys.includes(key)
  );

  let filteredDetails;

  if (isFacebookDetails) {
    filteredDetails = Object.fromEntries(
      Object.entries(accountDetails)
        .filter(([_, value]) => value !== "")
        .map(([key, value]) => [`facebook.${key}`, value])
    );
  } else if (isBrevoDetails) {
    filteredDetails = Object.fromEntries(
      Object.entries(accountDetails)
        .filter(([_, value]) => value !== "")
        .map(([key, value]) => {
          if (key === "brevoEmail") return ["brevo.email", value];
          if (key === "brevoName") return ["brevo.name", value];
        })
    );
  } else {
    filteredDetails = Object.fromEntries(
      Object.entries(accountDetails).filter(([_, value]) => value !== "")
    );
  }

  await dbConnect();
  await User.updateOne({ _id: params.id }, filteredDetails);

  return NextResponse.json({
    status: "success",
    message: "Contul a fost actualizat cu succes!",
  });
}

export async function DELETE(request, { params }) {
  const { id } = params;

  const session = await getServerSession(authOptions);
  if (session?.user?.id !== id) {
    return new NextResponse("Unauthorized", {
      status: 401,
    });
  }

  await dbConnect();
  const deletedUser = await User.findOneAndDelete({ _id: id });

  if (!deletedUser) {
    return NextResponse.json({
      status: "danger",
      message: "A apărut o eroare. User-ul nu există.",
    });
  }

  await Account.deleteMany({ userId: id });

  return NextResponse.json({
    status: "success",
    message: "Contul a fost șters cu succes!",
  });
}
