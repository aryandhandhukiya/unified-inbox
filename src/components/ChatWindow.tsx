// app/components/ChatWindow.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { User, FileText, MoreVertical, Phone, Video, Search, CheckCheck, Check, Clock } from "lucide-react";
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sending":
        return <Clock className="w-3 h-3 opacity-60" />;
      case "sent":
        return <Check className="w-3 h-3" />;
      case "delivered":
        return <CheckCheck className="w-3 h-3" />;
      case "read":
        return <CheckCheck className="w-3 h-3 text-blue-300" />;
      case "failed":
        return <span className="text-xs">❌</span>;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* ======= Chat Header ======= */}
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shadow-sm">
        {/* Left: avatar + name */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-lg shadow-lg">
              {contact?.name?.[0]?.toUpperCase() ??
                contact?.phone?.slice(-2) ??
                "?"}
            </div>
            {/* Online indicator */}
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <div className="font-semibold text-slate-900 text-lg">
              {contact?.name ?? contact?.phone ?? contact?.email ?? "Contact"}
            </div>
            <div className="text-xs text-green-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              Active now
            </div>
          </div>
        </div>

        {/* Right: quick actions */}
        <div className="flex items-center gap-2">
          <button
            className="p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-all"
            title="Search in conversation"
          >
            <Search size={20} />
          </button>
          
          <button
            className="p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-all"
            title="Voice call"
          >
            <Phone size={20} />
          </button>

          <button
            className="p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-all"
            title="Video call"
          >
            <Video size={20} />
          </button>

          <div className="w-px h-6 bg-slate-200 mx-1"></div>

          <button
            onClick={onOpenProfile}
            className="p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-all"
            title="View Profile"
          >
            <User size={20} />
          </button>

          <button
            className="p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-all"
            title="Add Note"
          >
            <FileText size={20} />
          </button>

          <button
            className="p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-all"
            title="More options"
          >
            <MoreVertical size={20} />
          </button>
        </div>
      </header>

      {/* ======= Messages ======= */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-auto p-6 space-y-4"
        style={{
          backgroundImage: `
            linear-gradient(to bottom, rgba(248, 250, 252, 0.8), rgba(241, 245, 249, 0.8)),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23cbd5e1' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
          `,
        }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
              <div className="text-slate-500 text-sm">Loading messages...</div>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-4 max-w-sm">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mx-auto">
                <span className="text-4xl">👋</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-1">
                  Start the conversation
                </h3>
                <p className="text-sm text-slate-500">
                  Send a message to begin chatting with this contact
                </p>
              </div>
            </div>
          </div>
        ) : (
          messages.map((m: any, idx: number) => {
            const isOutbound = m.direction === "outbound";
            const showDate = idx === 0 || 
              new Date(messages[idx - 1].createdAt).toDateString() !== new Date(m.createdAt).toDateString();
            
            return (
              <React.Fragment key={m.id}>
                {/* Date separator */}
                {showDate && (
                  <div className="flex items-center justify-center my-4">
                    <div className="px-4 py-1.5 rounded-full bg-white shadow-sm border border-slate-200 text-xs font-medium text-slate-600">
                      {new Date(m.createdAt).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                )}

                {/* Message bubble */}
                <div
                  className={`flex ${isOutbound ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`group relative max-w-[70%] px-4 py-3 rounded-2xl shadow-sm text-sm break-words ${
                      isOutbound
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md"
                        : "bg-white text-slate-800 rounded-bl-md border border-slate-200"
                    }`}
                  >
                    {/* message content */}
                    <div className="leading-relaxed">{m.content}</div>

                    {/* timestamp + status */}
                    <div
                      className={`flex justify-end items-center text-[10px] mt-1.5 gap-1 ${
                        isOutbound ? "text-blue-100" : "text-slate-500"
                      }`}
                    >
                      <span>
                        {new Date(m.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>

                      {/* Outbound message status indicators */}
                      {isOutbound && (
                        <span className="ml-1 flex items-center">
                          {getStatusIcon(m.status)}
                        </span>
                      )}
                    </div>

                    {/* tooltip on hover */}
                    <div className="absolute hidden group-hover:block bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-3 py-1.5 rounded-lg opacity-95 whitespace-nowrap shadow-lg z-10">
                      {isOutbound
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
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-2 h-2 bg-slate-800 rotate-45"></div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })
        )}
      </div>

      {/* ======= Composer ======= */}
      <footer className="p-4 bg-white border-t border-slate-200">
        <Composer
          contactId={contactId}
          onSent={() => qc.invalidateQueries({ queryKey: ["messages", contactId] })}
        />
      </footer>
    </div>
  );
}