"use server";
import { signIn, signOut, auth } from "@/auth";

export const login = async () => {
  await signIn("github", { redirectTo: "/" });
};
export const logOut = async () => {
  await signOut({ redirectTo: "/" });
};

export const getSession = async () => {
  const session = await auth();
  return session;
};
