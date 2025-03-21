"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, Languages } from "lucide-react";
import { useLocale } from "next-intl";
import { deleteCookie, getCookie } from "cookies-next";
import { GetUser, SetGithubUSer } from "@/Toolkit/Slices/UserSlice";

export default function Header() {
  const dispatch = useDispatch() as any;
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const localActive = useLocale();
  const [isPending, startTransition] = useTransition();
  const { User } = useSelector((state: any) => state.User);

  const ChangeLanguage = (lang: string) => {
    startTransition(() => {
      const newPath = pathname.replace(/\/en|\/ar/, `/${lang}`);
      router.replace(newPath);
    });
  };

  useEffect(() => {
    if (getCookie("Template_Cookies")) {
      dispatch(GetUser());
    } else if (session) {
      dispatch(SetGithubUSer(session.user));
    }
  }, [session, dispatch]);

  const HandleLogout = () => {
    deleteCookie("Template_Cookies");
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="container">
      <header className="flex justify-between items-center bg-white px-6 py-3">
        <div className="text-xl font-semibold text-gray-800">
          Welcome, {session?.user?.name || User.name || "Guest"}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => ChangeLanguage(localActive == "en" ? "ar" : "en")}
          >
            <Languages className="w-6 h-6" />
          </button>
          <div className="relative">
            {session?.user?.image && (
              <Image
                src={session.user.image}
                alt={session.user.name || "Guest"}
                width={40}
                height={40}
                className="rounded-full border border-gray-300 shadow-sm"
              />
            )}
            {User?.avatar && (
              <Image
                src={User.avatar}
                alt={User.name}
                width={40}
                height={40}
                className="rounded-full border border-gray-300 shadow-sm"
              />
            )}
          </div>

          <button
            className="text-gray-700 hover:text-red-500 transition"
            onClick={HandleLogout}
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </header>
    </div>
  );
}
