"use client";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Sign in to continue</h1>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => signIn("google")}
      >
        Sign in with Google
      </button>
    </div>
  );
}
