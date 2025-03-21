"use client";
import { logOut } from "@/lib/Actions/auth";
import { LogOut } from "lucide-react";

export default function LogoutGitHub() {
  return (
    <button
      className="text-gray-700 hover:text-red-500 transition"
      onClick={() => logOut()}
    >
      <LogOut className="w-6 h-6" />
    </button>
  );
}
