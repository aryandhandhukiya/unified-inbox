"use client";

import { signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-gray-800 shadow-md">
      <div className="text-lg font-semibold">Unified Inbox</div>
      {session?.user ? (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-300">
            👤 {session.user.name || session.user.email}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="bg-red-500 hover:bg-red-400 px-4 py-2 rounded-md text-white text-sm"
          >
            Sign out
          </button>
        </div>
      ) : null}
    </header>
  );
}
