import NextAuth from "next-auth";

import GitHub from "next-auth/providers/github";
const clientId = process.env.GITHUB_ID;
const clientSecret = process.env.GITHUB_SECRET;

if (!clientId || !clientSecret) {
  throw new Error("Missing GitHub OAuth environment variables");
}
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId,
      clientSecret,
    }),
  ],
});
