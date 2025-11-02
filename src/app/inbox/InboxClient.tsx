// app/inbox/InboxClient.tsx
"use client";
import React, { useState } from "react";
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from "@tanstack/react-query";
import ContactList from "@/components/ContactList";
import ChatWindow from "@/components/ChatWindow";
import ContactModal from "@/components/ContactModel";

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

  return (
    <div className="h-screen grid grid-cols-4 bg-gray-50/50 antialiased">
      <aside className="col-span-1 border-r border-gray-200 bg-white shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 tracking-tight">
            Unified Inbox
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Your messages in one place
          </p>
        </div>
        <ContactList
          onSelect={(id) => {
            setSelectedContactId(id);
          }}
        />
      </aside>

      <main className="col-span-3 bg-white">
        {selectedContactId ? (
          <ChatWindow 
            contactId={selectedContactId} 
            onOpenProfile={() => setModalOpen(true)} 
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
            <svg
              className="w-12 h-12 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <div className="text-lg font-medium">No conversation selected</div>
            <p className="text-sm text-gray-400">
              Choose a contact from the sidebar to start messaging
            </p>
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
