import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { email } = params;
  const domain = email.split("@")[1]; // Extract the domain

  const response = await fetch(
    `${process.env.BREVO_API_URL}/senders/domains/${domain}`,
    {
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
    }
  );
  const data = await response.json();
  return NextResponse.json({
    dnsRecords: data.dns_records,
  });
}

export async function POST(req, { params }) {
  const { email } = params;
  const domain = email.split("@")[1]; // Extract the domain

  const response = await fetch(`${process.env.BREVO_API_URL}/senders/domains`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
      "api-key": process.env.BREVO_API_KEY,
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
    `${process.env.BREVO_API_URL}/senders/domains/${domain}/authenticate`,
    {
      method: "PUT",
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
    }
  );

  return NextResponse.json({
    status: response.status,
  });
}
