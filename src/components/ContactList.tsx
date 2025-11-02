"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  MessageSquare,
  Mail,
  Phone,
  Send,
  MessageCircle,
  Hash,
} from "lucide-react";

type ContactShort = {
  id: string;
  name: string;
  phone: string | null;
  lastMessage: {
    id: string;
    content: string;
    createdAt: string;
    direction: string;
    status: string;
    channel: string;
  } | null;
};

export default function ContactList({
  onSelect,
  channel,
}: {
  onSelect: (id: string) => void;
  channel: "all" | "whatsapp" | "sms" | "email" | "telegram" | "discord";
}) {
  const [selected, setSelected] = useState<string | null>(null);

  const { data = [], isLoading } = useQuery<ContactShort[]>({
    queryKey: ["contacts", channel],
    queryFn: async () => {
      const res = await fetch("/api/contacts");
      if (!res.ok) throw new Error("Failed to fetch contacts");
      const allContacts = await res.json();
      if (channel === "all") return allContacts;
      return allContacts.filter(
        (c: any) => c.lastMessage?.channel === channel
      );
    },
    refetchInterval: 5000, // Poll for updates every 5s
  });

  const getChannelIcon = (ch: string) => {
    switch (ch) {
      case "whatsapp":
        return <MessageCircle size={14} className="text-green-600" />;
      case "sms":
        return <Phone size={14} className="text-blue-600" />;
      case "email":
        return <Mail size={14} className="text-red-500" />;
      case "telegram":
        return <Send size={14} className="text-sky-500" />;
      case "discord":
        return <Hash size={14} className="text-indigo-500" />;
      default:
        return <MessageSquare size={14} className="text-gray-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900">
      {/* Header */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-700">
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">
          Contacts
        </h2>
      </div>

      {/* Search bar */}
      <div className="px-3 py-2">
        <input
          placeholder="Search..."
          className="w-full p-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Contact list */}
      <ul className="flex-1 overflow-auto divide-y divide-zinc-100 dark:divide-zinc-800">
        {isLoading && (
          <div className="p-4 text-gray-400 text-sm">Loading contacts...</div>
        )}
        {data.length === 0 && !isLoading && (
          <div className="p-4 text-gray-400 text-sm">
            No contacts found for this channel
          </div>
        )}

        {data.map((c) => {
          const lastMsg = c.lastMessage?.content ?? "No messages yet";
          const time = c.lastMessage
            ? new Date(c.lastMessage.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "";

          const unread =
            c.lastMessage?.direction === "inbound" &&
            c.lastMessage?.status !== "read";

          const channelIcon = getChannelIcon(c.lastMessage?.channel || "all");

          return (
            <li
              key={c.id}
              onClick={() => {
                setSelected(c.id);
                onSelect(c.id);
              }}
              className={`p-3 cursor-pointer transition ${
                selected === c.id
                  ? "bg-blue-50 dark:bg-blue-950"
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-medium">
                  {c.name?.[0]?.toUpperCase() ?? c.phone?.slice(-2) ?? "?"}
                </div>

                {/* Contact Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <div className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
                      {c.name ?? c.phone}
                    </div>
                    <div className="text-xs text-zinc-500">{time}</div>
                  </div>
                  <div className="text-sm text-zinc-500 truncate flex items-center gap-1">
                    {channelIcon}
                    {lastMsg.length > 40
                      ? lastMsg.substring(0, 40) + "..."
                      : lastMsg}
                    {unread && (
                      <span className="w-2 h-2 rounded-full bg-blue-500 inline-block ml-1" />
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
