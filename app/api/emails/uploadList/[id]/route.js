import dbConnect from "@/utils/dbConnect";
import EmailList from "@/models/EmailList";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { id } = params;

  await dbConnect();
  const userList = await EmailList.findOne({ userId: id });

  return NextResponse.json({
    contacts: userList?.contacts,
  });
}

export async function POST(request, { params }) {
  const { id } = params;

  try {
    const body = await request.json();

    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json({
        status: "error",
        message: "CSV-ul este gol.",
      });
    }

    // Prepare contacts
    const contacts = body.map((contact) => ({
      email: contact.email,
      prenume: contact.prenume || "",
      nume_familie: contact.nume_familie || "",
    }));

    // Try to find existing list
    await dbConnect();
    const existingList = await EmailList.findOne({ userId: id });

    if (existingList) {
      existingList.contacts = contacts;
      await existingList.save();
    } else {
      await EmailList.create({
        userId: id,
        contacts,
      });
    }

    return NextResponse.json({
      status: "success",
      message: "CSV-ul a fost încărcat cu succes!",
    });
  } catch (error) {
    console.error("Error uploading CSV:", error);
    return NextResponse.json({
      status: "error",
      message: error.message || "Eroare la încarcarea CSV-ului.",
    });
  }
}
