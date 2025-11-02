import { NextResponse } from "next/server";
import twilio from "twilio";

const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

export async function POST(req: Request) {
  const { to, body, channel } = await req.json();

  try {
    const from =
      channel === "whatsapp"
        ? "whatsapp:+14155238886" // ✅ Twilio Sandbox WhatsApp number
        : process.env.TWILIO_PHONE_NUMBER; // your SMS number for SMS messages

    const message = await client.messages.create({
      from,
      to,
      body,
    });

    return NextResponse.json({ success: true, sid: message.sid });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
