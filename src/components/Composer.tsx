// app/components/Composer.tsx
"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

export default function Composer({
  contactId,
  onSent,
}: {
  contactId: string;
  onSent: () => void;
}) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const qc = useQueryClient();

  const send = async () => {
    if (!text.trim() || loading) return;

    const messageText = text.trim();
    setText("");
    setLoading(true);

    try {
      // 1️⃣ Fetch contact details
      const resContacts = await fetch(`/api/contacts`);
      const contacts = await resContacts.json();
      const contact = contacts.find((c: any) => c.id === contactId);

      if (!contact) {
        throw new Error("Contact not found");
      }

      // 2️⃣ Determine the best way to reach this contact
      let to: string;
      let channel: string;

      if (contact.email) {
        to = contact.email;
        channel = "email";
      } else if (contact.phone) {
        to = contact.phone;
        channel = "whatsapp"; // or "sms" based on preference
      } else if (contact.telegramId) {
        to = contact.telegramId;
        channel = "telegram";
      } else if (contact.discordId) {
        to = contact.discordId;
        channel = "discord";
      } else {
        throw new Error("No contact method available");
      }

      // 3️⃣ Optimistic UI update (instant display)
      const optimisticMessage = {
        id: `temp-${Date.now()}`,
        contactId,
        content: messageText,
        direction: "outbound",
        channel,
        status: "sending",
        createdAt: new Date().toISOString(),
      };

      qc.setQueryData(["messages", contactId], (old: any) => [
        ...(old || []),
        optimisticMessage,
      ]);

      // 4️⃣ Actually send the message
      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to, // ✅ Just the email/phone/id, not prefixed
          body: messageText,
          channel, // ✅ Dynamic channel
          subject: channel === "email" ? "New Message" : undefined,
        }),
      });

      if (res.ok) {
        // ✅ Update optimistic message to "sent"
        qc.setQueryData(["messages", contactId], (old: any) =>
          (old || []).map((msg: any) =>
            msg.id === optimisticMessage.id
              ? { ...msg, status: "sent" }
              : msg
          )
        );
      } else {
        const error = await res.json();
        console.error("Send failed:", error);
        throw new Error(error.error || "Message send failed");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      // ❌ Mark optimistic message as failed
      qc.setQueryData(["messages", contactId], (old: any) =>
        (old || []).map((msg: any) =>
          msg.id?.startsWith("temp-")
            ? { ...msg, status: "failed" }
            : msg
        )
      );
    } finally {
      setLoading(false);
      onSent();
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKey}
        disabled={loading}
        placeholder="Type a message..."
        className="flex-1 p-2 rounded-full border border-zinc-300 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={send}
        disabled={loading || !text.trim()}
        className={`rounded-full p-3 transition ${
          loading || !text.trim()
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        } text-white`}
      >
        <Send size={18} />
      </button>
    </div>
  );
}