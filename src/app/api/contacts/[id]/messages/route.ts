import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ await the Promise
  const messages = await prisma.message.findMany({
    where: { contactId: id },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(messages);
}
