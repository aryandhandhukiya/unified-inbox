import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const messageSid = formData.get("MessageSid")?.toString();
    const messageStatus = formData.get("MessageStatus")?.toString();

    if (!messageSid) {
      console.error("❌ Missing MessageSid in Twilio webhook");
      return new Response("Missing SID", { status: 400 });
    }

    console.log("📡 Twilio status update:", { messageSid, messageStatus });

    await prisma.message.updateMany({
      where: { twilioSid: messageSid },
      data: { status: messageStatus ?? "unknown" },
    });

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("Error in Twilio status webhook:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
