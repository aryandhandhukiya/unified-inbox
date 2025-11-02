import { prisma, ChannelType, MessageStatus, MessageDirection } from "@/lib/prisma";

export async function POST(req: Request) {
  const formData = await req.formData();
  const from = formData.get("From")?.toString() || "";
  const body = formData.get("Body")?.toString() || "";

  const channel = from.includes("whatsapp")
    ? ChannelType.whatsapp
    : ChannelType.sms;

  let contact = await prisma.contact.findFirst({
    where: { phone: from },
  });

  if (!contact) {
    contact = await prisma.contact.create({
      data: { phone: from, name: from },
    });
  }

  await prisma.message.create({
    data: {
      contactId: contact.id,
      userId: null,
      channel,
      content: body,
      direction: MessageDirection.inbound,
      status: MessageStatus.queued, // ✅ lowercase per schema
    },
  });

  return new Response("", { status: 200 });
}
