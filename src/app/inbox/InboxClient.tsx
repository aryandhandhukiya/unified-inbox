"use client";
import React, { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import ContactList from "@/components/ContactList";
import ChatWindow from "@/components/ChatWindow";
import ContactModal from "@/components/ContactModel";
import { useMutation } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import { 
  MessageSquare, 
  RefreshCw, 
  LogOut, 
  Inbox,
  MessageCircle,
  Mail,
  Phone,
  Send,
  Hash
} from "lucide-react";

const queryClient = new QueryClient();

export default function InboxClient() {
  return (
    <QueryClientProvider client={queryClient}>
      <InboxShell />
    </QueryClientProvider>
  );
}

function InboxShell() {
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<"all" | "whatsapp" | "sms" | "email" | "telegram" | "discord">("all");

  // Add Gmail sync mutation
  const syncGmail = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/gmail/sync");
      if (!response.ok) {
        throw new Error("Failed to sync Gmail");
      }
      return response.json();
    },
    onSuccess: () => {
      alert("Gmail synced successfully!");
    },
    onError: (error) => {
      alert(`Error syncing Gmail: ${error.message}`);
    },
  });

  const channelIcons = {
    all: Inbox,
    whatsapp: MessageCircle,
    sms: Phone,
    email: Mail,
    telegram: Send,
    discord: Hash,
  };

  const channelColors = {
    all: "from-slate-500 to-slate-600",
    whatsapp: "from-green-500 to-emerald-600",
    sms: "from-blue-500 to-cyan-600",
    email: "from-red-500 to-orange-600",
    telegram: "from-sky-500 to-blue-600",
    discord: "from-indigo-500 to-purple-600",
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shadow-xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-900">
                Unified Inbox
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                All messages, one place
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => syncGmail.mutate()}
              disabled={syncGmail.isPending}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Sync Gmail"
            >
              <RefreshCw className={`w-4 h-4 ${syncGmail.isPending ? 'animate-spin' : ''}`} />
              {syncGmail.isPending ? 'Syncing...' : 'Sync'}
            </button>
            
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all shadow-sm"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>

            {/* 📈 Analytics Button */}
            <button
              onClick={() => (window.location.href = "/analytics")}
              className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
              title="View Analytics"
            >
              📈  
            </button>
          </div>
        </div>

        {/* Channel Filter */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="grid grid-cols-3 gap-2">
            {(["all", "whatsapp", "sms", "email", "telegram", "discord"] as const).map((ch) => {
              const Icon = channelIcons[ch];
              const isActive = selectedChannel === ch;
              
              return (
                <button
                  key={ch}
                  onClick={() => setSelectedChannel(ch)}
                  className={`group relative flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl font-medium transition-all ${
                    isActive
                      ? `bg-gradient-to-br ${channelColors[ch]} text-white shadow-lg`
                      : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'}`} />
                  <span className="text-xs capitalize">{ch}</span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white shadow-lg"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto">
          <ContactList
            channel={selectedChannel}
            onSelect={(id) => setSelectedContactId(id)}
          />
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col bg-white">
        {selectedContactId ? (
          <ChatWindow
            contactId={selectedContactId}
            onOpenProfile={() => setModalOpen(true)}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-6 p-8">
            {/* Illustration */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <MessageSquare className="w-16 h-16 text-slate-300" strokeWidth={1.5} />
              </div>
              {/* Decorative circles */}
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Text content */}
            <div className="text-center space-y-3 max-w-md">
              <h3 className="text-2xl font-bold text-slate-800">
                No conversation selected
              </h3>
              <p className="text-slate-500 leading-relaxed">
                Choose a contact from the sidebar to start messaging across WhatsApp, SMS, Email, Telegram, or Discord
              </p>
            </div>

            {/* Quick stats or features */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { label: "Channels", value: "5+", icon: Hash },
                { label: "Unified", value: "100%", icon: MessageCircle },
                { label: "Secure", value: "🔒", icon: null },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="text-center px-4 py-3 rounded-xl bg-slate-50 border border-slate-100"
                >
                  {stat.icon && <stat.icon className="w-5 h-5 text-slate-400 mx-auto mb-1" />}
                  {!stat.icon && <div className="text-2xl mb-1">{stat.value}</div>}
                  {stat.icon && <div className="text-lg font-bold text-slate-700">{stat.value}</div>}
                  <div className="text-xs text-slate-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {selectedContactId && (
        <ContactModal
          contactId={selectedContactId}
          open={isModalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}