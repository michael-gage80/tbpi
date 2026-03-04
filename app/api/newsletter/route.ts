import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  const server = process.env.MAILCHIMP_API_SERVER; // e.g. "us1"

  if (!apiKey || !audienceId || !server) {
    return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
  }

  const url = `https://${server}.api.mailchimp.com/3.0/lists/${audienceId}/members`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString("base64")}`,
    },
    body: JSON.stringify({ email_address: email, status: "subscribed" }),
  });

  const data = await res.json();

  // 400 with title "Member Exists" means already subscribed — treat as success
  if (res.ok || data.title === "Member Exists") {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json(
    { error: data.detail || "Subscription failed. Please try again." },
    { status: res.status }
  );
}
