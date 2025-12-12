import { host } from "@/config";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: host,
});
console.log("authClient", authClient);
console.log("host", host);
console.log("VERCEL_URL", process.env.VERCEL_URL);

export const { signIn, signOut, signUp, useSession } = authClient;
