// app/api/contacts/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // Return contacts with last message for thread list
  const contacts = await prisma.contact.findMany({
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { name: "asc" },
  });

  const payload = contacts.map((c) => ({
    id: c.id,
    name: c.name ?? c.phone,
    phone: c.phone,
    lastMessage: c.messages[0] ?? null,
  }));

  return NextResponse.json(payload);
}
