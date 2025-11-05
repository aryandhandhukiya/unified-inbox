// app/inbox/page.tsx
"use client";
import React from "react";
import InboxClient from "./InboxClient";
import { SessionProvider } from "next-auth/react";

export default function InboxPage() {
  return (
    <SessionProvider>
      <InboxClient />
    </SessionProvider>
  );
}
