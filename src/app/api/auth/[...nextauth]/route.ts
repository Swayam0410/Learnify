// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { authOptions } from "@/lib/authOptions"; // Move options to a separate file

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
