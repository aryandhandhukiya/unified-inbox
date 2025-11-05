import { google } from "googleapis";

export async function fetchRecentEmails(maxResults = 10) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URI
  );

  // ✅ This part must include the REFRESH TOKEN
  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
  });

  // ⚠️ Force a fresh access token
  const { credentials } = await oauth2Client.refreshAccessToken();
  oauth2Client.setCredentials(credentials);

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  const listRes = await gmail.users.messages.list({
    userId: "me",
    maxResults,
  });

  const messages = listRes.data.messages || [];
  return messages;
}
