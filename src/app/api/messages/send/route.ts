import { NextResponse } from "next/server";
import twilio from "twilio";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

// Twilio setup
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(req: Request) {
  try {
    const { to, body, channel, subject } = await req.json();

    // ✅ Validation
    if (!to || to.trim() === "") {
      return NextResponse.json(
        { error: "Recipient address/number is required" },
        { status: 400 }
      );
    }

    if (!body || body.trim() === "") {
      return NextResponse.json(
        { error: "Message body is required" },
        { status: 400 }
      );
    }

    // ✅ Auto-detect channel if not provided or if 'to' doesn't match channel
    let detectedChannel = channel;
    
    if (!detectedChannel || 
        (channel === 'whatsapp' && to.includes('@')) ||
        (channel === 'sms' && to.includes('@')) ||
        (channel === 'email' && !to.includes('@'))) {
      // Auto-detect based on 'to' format
      if (to.includes('@')) {
        detectedChannel = 'email';
      } else if (to.includes('whatsapp:') || to.startsWith('+')) {
        detectedChannel = 'whatsapp';
      } else {
        detectedChannel = 'sms';
      }
    }

    console.log("📤 Sending message:", { 
      to, 
      channel: detectedChannel, 
      originalChannel: channel,
      bodyLength: body.length 
    });

    let sendResult: any = null;
    let status = "queued";
    let sid: string | null = null;
    let normalizedContactIdentifier: string; // ✅ Add this to store normalized identifier

    switch (detectedChannel) {
      case "whatsapp": {
        const formattedTo = `whatsapp:${formatPhoneNumber(to)}`;
        const from = `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`;

        console.log("📱 WhatsApp:", { from, to: formattedTo });

        sendResult = await twilioClient.messages.create({
          from,
          to: formattedTo,
          body,
        });

        status = sendResult.status ?? "queued";
        sid = sendResult.sid;
        normalizedContactIdentifier = formattedTo; // ✅ Store with whatsapp: prefix
        break;
      }

      case "sms": {
        const formattedTo = formatPhoneNumber(to);
        const from = process.env.TWILIO_SMS_NUMBER;

        console.log("📱 SMS:", { from, to: formattedTo });

        sendResult = await twilioClient.messages.create({
          from,
          to: formattedTo,
          body,
        });

        status = sendResult.status ?? "queued";
        sid = sendResult.sid;
        normalizedContactIdentifier = formattedTo; // ✅ Just the phone number
        break;
      }

      case "email": {
        console.log("📧 Email:", { to, subject });
        
        const info = await sendEmail({
          to,
          subject: subject ?? "New Message from Unified Inbox",
          text: body,
        });
        
        status = "sent";
        sid = info.messageId;
        normalizedContactIdentifier = to;
        break;
      }

      case "telegram": {
        const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN!;
        const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

        const telegramRes = await fetch(telegramUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: to,
            text: body,
          }),
        });

        const telegramData = await telegramRes.json();
        if (!telegramData.ok) {
          throw new Error(`Telegram error: ${telegramData.description}`);
        }

        status = "sent";
        sid = telegramData.result?.message_id?.toString() || null;
        normalizedContactIdentifier = to;
        break;
      }

      case "discord": {
        const discordWebhook = process.env.DISCORD_WEBHOOK_URL!;
        if (!discordWebhook) throw new Error("Missing DISCORD_WEBHOOK_URL in .env");

        const discordRes = await fetch(discordWebhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: body,
            username: "Unified Inbox Bot",
          }),
        });

        if (!discordRes.ok) {
          const errorText = await discordRes.text();
          throw new Error(`Discord webhook failed: ${errorText}`);
        }

        status = "sent";
        normalizedContactIdentifier = to;
        break;
      }

      default:
        throw new Error(`Unsupported channel: ${detectedChannel}`);
    }

    // ✅ Create/find contact using the SAME format as webhooks
    let contact;

    if (detectedChannel === "email") {
      contact = await prisma.contact.upsert({
        where: { email: to },
        update: {},
        create: { email: to, name: to },
      });
    } else if (detectedChannel === "whatsapp" || detectedChannel === "sms") {
      // ✅ Use the normalized identifier (includes whatsapp: prefix for WhatsApp)
      contact = await prisma.contact.upsert({
        where: { phone: normalizedContactIdentifier },
        update: {},
        create: { phone: normalizedContactIdentifier, name: normalizedContactIdentifier },
      });
    } else if (detectedChannel === "telegram") {
      contact = await prisma.contact.upsert({
        where: { telegramId: to },
        update: {},
        create: { telegramId: to, name: to },
      });
    } else if (detectedChannel === "discord") {
      contact = await prisma.contact.upsert({
        where: { discordId: to },
        update: {},
        create: { discordId: to, name: to },
      });
    } else {
      contact = await prisma.contact.create({
        data: { name: to },
      });
    }

    console.log("✅ Contact found/created:", { id: contact.id, phone: contact.phone });

    // 🗄️ Store message in DB
    await prisma.message.create({
      data: {
        content: body,
        channel: detectedChannel,
        direction: "outbound",
        status,
        contactId: contact.id,
        userId: null,
        twilioSid: sid,
      },
    });

    return NextResponse.json({
      success: true,
      channel: detectedChannel,
      status,
      sid,
    });
  } catch (error: any) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        details: error.moreInfo ?? null,
      },
      { status: 500 }
    );
  }
}

// 🧩 Improved phone normalization with validation
function formatPhoneNumber(number: string): string {
  if (!number || typeof number !== 'string') {
    throw new Error("Invalid phone number: must be a non-empty string");
  }

  // Remove whatsapp: prefix if present
  let cleaned = number.replace('whatsapp:', '');
  
  // Remove everything except digits and +
  cleaned = cleaned.replace(/[^\d+]/g, "");
  
  if (cleaned.length === 0 || cleaned === '+') {
    throw new Error(`Invalid phone number: no digits found in "${number}"`);
  }

  if (!cleaned.startsWith("+")) {
    return cleaned.startsWith("91") ? `+${cleaned}` : `+91${cleaned}`;
  }
  return cleaned;
}