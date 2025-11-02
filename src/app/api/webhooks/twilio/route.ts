import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const formData = await req.formData();
  const from = formData.get("From")?.toString() || "";
  const body = formData.get("Body")?.toString() || "";

  const channel = from.includes("whatsapp") ? "whatsapp" : "sms";

  // Find existing contact by phone
  let contact = await prisma.contact.findFirst({
    where: { phone: from },
  });

  // If not found, create new contact
  if (!contact) {
    contact = await prisma.contact.create({
      data: { phone: from, name: from},
    });
  }

  // Store inbound message
await prisma.message.create({
  data: {
    contactId: contact.id,
    userId: null,
    channel,
    content: body,
    direction: "inbound",
    status: "received",
  } as any, // ✅ Temporary workaround
});

  return new Response("OK", { status: 200 });
}