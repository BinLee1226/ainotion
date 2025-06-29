"use server";
import { signIn, signOut } from "@/lib/auth";
export const githubSignIn = async () => {
  const res = await signIn("github", { redirectTo: "/dashboard" });
  console.log(res, "---------");
};
export const logOut = async () => {
  await signOut({ redirectTo: "/" });
};
