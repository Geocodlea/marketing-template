// File: app/api/brevo/domain/route.js
export async function POST(req) {
  const body = await req.json();
  const { domain } = body;

  if (!domain) {
    return new Response(JSON.stringify({ error: "Missing domain" }), {
      status: 400,
    });
  }

  const response = await fetch("https://api.brevo.com/v3/senders/domains", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
      "api-key": process.env.BREVO_API_KEY, // keep it secure in your .env
    },
    body: JSON.stringify({
      name: "cbgshop.ro",
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    return new Response(JSON.stringify(data), { status: response.status });
  }

  return Response.json(data);
}
