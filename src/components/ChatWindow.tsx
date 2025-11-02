// app/components/ChatWindow.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { User, FileText, MoreVertical } from "lucide-react";
import Composer from "./Composer";

export default function ChatWindow({
  contactId,
  onOpenProfile,
}: {
  contactId: string;
  onOpenProfile: () => void;
}) {
  const qc = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [contact, setContact] = useState<any>(null);

  // Fetch messages for this contact
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["messages", contactId],
    queryFn: async () => {
      const r = await fetch(`/api/contacts/${contactId}/messages`);
      if (!r.ok) throw new Error("Failed");
      return r.json();
    },
    refetchInterval: 3000,
  });

  // Fetch contact details (for header)
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/contacts");
      const allContacts = await res.json();
      const found = allContacts.find((c: any) => c.id === contactId);
      setContact(found);
    })();
  }, [contactId]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="h-full flex flex-col bg-zinc-50 dark:bg-zinc-900">
      {/* ======= Chat Header ======= */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-sm">
        {/* Left: avatar + name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-semibold">
            {contact?.name?.[0]?.toUpperCase() ??
              contact?.phone?.slice(-2) ??
              "?"}
          </div>
          <div>
            <div className="font-medium text-zinc-900 dark:text-zinc-100">
              {contact?.name ?? contact?.phone ?? "Contact"}
            </div>
            <div className="text-xs text-green-600 dark:text-green-400">
              ● Active now
            </div>
          </div>
        </div>

        {/* Right: quick actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenProfile}
            className="text-zinc-600 hover:text-blue-600 dark:text-zinc-300"
            title="View Profile"
          >
            <User size={18} />
          </button>

          <button
            className="text-zinc-600 hover:text-blue-600 dark:text-zinc-300"
            title="Add Note"
          >
            <FileText size={18} />
          </button>

          <button
            className="text-zinc-600 hover:text-blue-600 dark:text-zinc-300"
            title="More options"
          >
            <MoreVertical size={18} />
          </button>
        </div>
      </header>

      {/* ======= Messages ======= */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-auto p-4 space-y-3 bg-[url('/chat-bg.png')] bg-cover"
      >
        {isLoading ? (
          <div className="text-center text-gray-400 mt-10">Loading chat...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            No messages yet 👋
          </div>
        ) : (
          messages.map((m: any) => (
            <div
              key={m.id}
              className={`flex ${
                m.direction === "outbound" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`group relative max-w-[75%] p-3 rounded-2xl shadow-sm text-sm break-words ${
                  m.direction === "outbound"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-900 rounded-bl-none"
                }`}
              >
                {/* message content */}
                <div>{m.content}</div>

                {/* timestamp + status */}
                <div
                  className={`flex justify-end items-center text-[10px] mt-1 gap-1 ${
                    m.direction === "outbound"
                      ? "text-blue-100"
                      : "text-gray-600"
                  }`}
                >
                  <span>
                    {new Date(m.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>

                  {/* Outbound message status indicators */}
                  {m.direction === "outbound" && (
                    <span className="ml-1">
                      {m.status === "sending" && "🕓"}
                      {m.status === "sent" && "✅"}
                      {m.status === "delivered" && "✅✅"}
                      {m.status === "read" && (
                        <span className="text-blue-300">✅✅</span>
                      )}
                      {m.status === "failed" && "❌"}
                    </span>
                  )}
                </div>

                {/* tooltip on hover */}
                <div className="absolute hidden group-hover:block bottom-full mb-1 right-0 bg-zinc-800 text-white text-[10px] px-2 py-1 rounded opacity-90">
                  {m.direction === "outbound"
                    ? m.status === "failed"
                      ? "Failed to send"
                      : m.status === "sent"
                      ? "Sent"
                      : m.status === "delivered"
                      ? "Delivered"
                      : m.status === "read"
                      ? "Read"
                      : "Sending..."
                    : "Received message"}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ======= Composer ======= */}
      <footer className="p-4 border-t border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
        <Composer
          contactId={contactId}
          onSent={() => qc.invalidateQueries({ queryKey: ["messages", contactId] })}
        />
      </footer>
    </div>
  );
}
