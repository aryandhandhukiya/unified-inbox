import { NextResponse } from "next/server";
import { getGmailOAuthClient } from "@/lib/gmailAuth";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });

  const oauth2Client = getGmailOAuthClient();
  const { tokens } = await oauth2Client.getToken(code);

  // ⚠️ For now, log the tokens (access_token, refresh_token)
  console.log("GMAIL TOKENS:", tokens);

  // You should store these tokens securely (e.g., in DB or Supabase)
  return NextResponse.json({ success: true, tokens });
}
