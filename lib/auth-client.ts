import { host } from "@/config";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: host,
});

export const { signIn, signOut, signUp, useSession } = authClient;
