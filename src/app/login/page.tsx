"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="border w-full p-2 mb-2 rounded"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border w-full p-2 mb-4 rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={() => signIn("credentials", { email, password })}
          className="bg-blue-600 text-white w-full py-2 rounded mb-2"
        >
          Login
        </button>

        <button
          onClick={() => signIn("google")}
          className="bg-red-500 text-white w-full py-2 rounded"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
