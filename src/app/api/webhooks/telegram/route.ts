import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Handle new member or chat updates
    if (data.my_chat_member) {
      const chatId = data.my_chat_member.chat.id.toString();
      const name = data.my_chat_member.chat.first_name || "Unknown";

      console.log("👤 New chat member:", { chatId, name });

      // Create or update contact for new user
      await prisma.contact.upsert({
        where: { telegramId: chatId },
        update: { name },
        create: { name, telegramId: chatId },
      });

      // Optionally send welcome message
      await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: `👋 Hi ${name}! You’re now connected to Unified Inbox.`,
        }),
      });

      return NextResponse.json({ ok: true });
    }

    // Handle regular messages
    const message = data.message;
    if (!message) return NextResponse.json({ ok: true });

    const chatId = message.chat.id.toString();
    const name = message.from.first_name || message.from.username || "Unknown";
    const text = message.text || "";

    console.log("📩 Telegram inbound:", { chatId, name, text });

    // Upsert contact
    const contact = await prisma.contact.upsert({
      where: { telegramId: chatId },
      update: { name },
      create: { name, telegramId: chatId },
    });

    // Store inbound message
    await prisma.message.create({
      data: {
        contactId: contact.id,
        userId: null,
        content: text,
        channel: "telegram",
        direction: "inbound",
        status: "delivered",
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("❌ Error handling Telegram webhook:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
