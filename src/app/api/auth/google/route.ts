import { NextResponse } from "next/server";
import { getGmailOAuthClient } from "@/lib/gmailAuth";

export async function GET() {
  const oauth2Client = getGmailOAuthClient();

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/gmail.readonly"],
    prompt: "consent",
  });

  return NextResponse.redirect(url);
}
