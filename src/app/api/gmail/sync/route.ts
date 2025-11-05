import { NextResponse } from "next/server";
import { google } from "googleapis";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GMAIL_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GMAIL_REFRESH_TOKEN,
    });

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    // Fetch the latest 10 messages
    const { data } = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10,
    });

    const messages = data.messages ?? [];
    const savedMessages = [];

    for (const msg of messages) {
      const msgData = await gmail.users.messages.get({
        userId: "me",
        id: msg.id!,
        format: "full",
      });

      const headers = msgData.data.payload?.headers || [];
      const from = headers.find((h) => h.name === "From")?.value || "Unknown";
      const subject =
        headers.find((h) => h.name === "Subject")?.value || "(No subject)";
      const date = headers.find((h) => h.name === "Date")?.value || new Date().toISOString();

      const body = extractBody(msgData.data.payload);

      // Parse email address from "Name <email@example.com>"
      const emailMatch = from.match(/<([^>]+)>/);
      const email = emailMatch ? emailMatch[1] : from;

      // Find or create contact
      const contact = await prisma.contact.upsert({
        where: { email },
        update: {},
        create: { name: from.split("<")[0].trim(), email },
      });

      // Check if already stored
      const existing = await prisma.message.findFirst({
        where: { twilioSid: msg.id },
      });

      if (!existing) {
        const newMsg = await prisma.message.create({
          data: {
            contactId: contact.id,
            channel: "email",
            direction: "inbound",
            status: "delivered",
            content: `📧 ${subject}\n\n${body}`,// For now, using subject as content preview
            twilioSid: msg.id, // Using Gmail message ID as unique ID
          },
        });
        savedMessages.push(newMsg);
      }
    }

    return NextResponse.json({
      success: true,
      count: savedMessages.length,
      savedMessages,
    });
  } catch (error: any) {
    console.error("Error syncing Gmail:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// 🔍 Helper: extract plain text content from Gmail message payload
function extractBody(payload: any): string {
  if (!payload) return "";

  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === "text/plain" && part.body?.data) {
        return decodeBase64(part.body.data);
      }
      // Sometimes plain text is nested deeper
      if (part.parts) {
        const nested = extractBody(part);
        if (nested) return nested;
      }
    }
  }

  // Direct text/plain in payload
  if (payload.mimeType === "text/plain" && payload.body?.data) {
    return decodeBase64(payload.body.data);
  }

  return "";
}

// 🧩 Helper: Base64 → UTF-8 text
function decodeBase64(data: string): string {
  try {
    return Buffer.from(data.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf-8");
  } catch {
    return "";
  }
}
