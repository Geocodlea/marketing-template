import { NextResponse } from "next/server";

const apiBaseUrl = process.env.BREVO_API_URL;
const brevoApiKey = process.env.BREVO_API_KEY;

export async function GET(req, { params }) {
  const { email } = params;

  if (!email) {
    return NextResponse.json({ error: "Invalid email" });
  }

  const domain = email.split("@")[1]; // Extract the domain

  const response = await fetch(`${apiBaseUrl}/senders/domains/${domain}`, {
    headers: {
      accept: "application/json",
      "api-key": brevoApiKey,
    },
  });
  const data = await response.json();
  return NextResponse.json({
    dnsRecords: data.dns_records,
  });
}

export async function POST(req, { params }) {
  const { email } = params;
  const domain = email.split("@")[1]; // Extract the domain

  const response = await fetch(`${apiBaseUrl}/senders/domains`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
      "api-key": brevoApiKey,
    },
    body: JSON.stringify({
      name: domain,
    }),
  });

  const data = await response.json();
  return NextResponse.json({
    dnsRecords: data.dns_records,
  });
}

export async function PUT(req, { params }) {
  const { email } = params;
  const domain = email.split("@")[1]; // Extract the domain

  const response = await fetch(
    `${apiBaseUrl}/senders/domains/${domain}/authenticate`,
    {
      method: "PUT",
      headers: {
        accept: "application/json",
        "api-key": brevoApiKey,
      },
    }
  );

  return NextResponse.json({
    status: response.status,
  });
}
