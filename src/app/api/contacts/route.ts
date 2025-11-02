// app/api/contacts/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
   const { searchParams } = new URL(req.url);
  const channel = searchParams.get("channel");
  // Return contacts with last message for thread list
  const contacts = await prisma.contact.findMany({
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        ...(channel && channel !== "all"
          ? { where: { channel: channel as any } }
          : {}),
      },
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(
    contacts.map((c) => ({
      id: c.id,
      name: c.name ?? c.phone ?? c.email,
      phone: c.phone,
      email: c.email,
      telegramId: c.telegramId,
      discordId: c.discordId,
      lastMessage: c.messages[0] ?? null,
    }))
  );
}
