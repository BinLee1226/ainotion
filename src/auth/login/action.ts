"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export const loginWithGithub = async () => {
  await signIn("github", {
    redirectTo: "/dashboard",
  });
};
export const loginWithCredentials = async (
  credentials: any,
): Promise<void | { error?: string }> => {
  try {
    await signIn("credentials", {
      ...credentials,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error: "用户名或密码错误",
      };
    }

    throw error;
  }
};
