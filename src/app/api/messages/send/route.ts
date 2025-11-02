import { NextResponse } from "next/server";
import twilio from "twilio";
import { prisma } from "@/lib/prisma";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(req: Request) {
  try {
    const { to, body, channel } = await req.json();

    // Format the numbers for WhatsApp or SMS
    const formattedTo = channel === 'whatsapp' 
      ? `whatsapp:${formatPhoneNumber(to)}`
      : formatPhoneNumber(to);

    const from = channel === 'whatsapp'
      ? `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`
      : process.env.TWILIO_SMS_NUMBER;

    console.log('Sending message:', { from, to: formattedTo, channel });

    const message = await client.messages.create({
      from,
      to: formattedTo,
      body,
    });

    // Store in database
    await prisma.message.create({
      data: {
        content: body,
        channel,
        direction: 'outbound',
        status: message.status,
        contactId: to,
        userId: 'system', // Replace with actual user ID
      },
    });

    return NextResponse.json({ success: true, sid: message.sid });
  } catch (error: any) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { 
        error: error.message,
        code: error.code,
        moreInfo: error.moreInfo,
        details: {
          from: process.env.TWILIO_WHATSAPP_NUMBER,
          error: error
        }
      },
      { status: error.status || 500 }
    );
  }
}

function formatPhoneNumber(number: string): string {
  // Remove any non-digit characters except plus sign
  const cleaned = number.replace(/[^\d+]/g, '');
  
  // Add + if not present
  if (!cleaned.startsWith('+')) {
    // Assume Indian number if no country code
    return cleaned.startsWith('91') ? `+${cleaned}` : `+91${cleaned}`;
  }
  
  return cleaned;
}
