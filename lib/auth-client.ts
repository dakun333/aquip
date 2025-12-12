import { createAuthClient } from "better-auth/react";
const baseURL: string | undefined =
  process.env.VERCEL === "1"
    ? process.env.VERCEL_ENV === "production"
      ? process.env.BETTER_AUTH_URL
      : process.env.VERCEL_ENV === "preview"
      ? `https://${process.env.VERCEL_URL}`
      : undefined
    : undefined;
export const authClient = createAuthClient({
  baseURL,
});
console.log("baseURL", baseURL);

console.log("VERCEL_URL", process.env.VERCEL_URL);

export const { signIn, signOut, signUp, useSession } = authClient;
