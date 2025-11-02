import { NextResponse } from "next/server";
import twilio from "twilio";
import { prisma } from "@/lib/prisma";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export async function POST(req: Request) {
  try {
    const { to, body, channel } = await req.json();

    // Format numbers for WhatsApp or SMS
    const formattedTo =
      channel === "whatsapp"
        ? `whatsapp:${formatPhoneNumber(to)}`
        : formatPhoneNumber(to);

    const from =
      channel === "whatsapp"
        ? `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`
        : process.env.TWILIO_SMS_NUMBER;

    console.log("Sending message:", { from, to: formattedTo, channel });

    // 1️⃣ Ensure contact exists (create or reuse)
    const contact = await prisma.contact.upsert({
      where: { phone: formattedTo },
      update: {},
      create: { phone: formattedTo, name: to },
    });

    // 2️⃣ Send message via Twilio
    const message = await client.messages.create({
      from,
      to: formattedTo,
      body,
      statusCallback: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/twilio-status`,
    });

    // 3️⃣ Store message in DB
    await prisma.message.create({
      data: {
        content: body,
        channel,
        direction: "outbound",
        status: message.status || "sent",
        contactId: contact.id,
        userId: null, // outbound by system or current user later
        twilioSid: message.sid,
      },
    });

    return NextResponse.json({ success: true, sid: message.sid });
  } catch (error: any) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        moreInfo: error.moreInfo,
        details: {
          from: process.env.TWILIO_WHATSAPP_NUMBER,
          error,
        },
      },
      { status: error.status || 500 }
    );
  }
}

function formatPhoneNumber(number: string): string {
  const cleaned = number.replace(/[^\d+]/g, "");
  if (!cleaned.startsWith("+")) {
    return cleaned.startsWith("91") ? `+${cleaned}` : `+91${cleaned}`;
  }
  return cleaned;
}
