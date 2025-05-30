import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Suspense } from "react";
import Loading from "./loading";
import ToastProvider from "@/Toast/ToastProvider";
import StoreProvider from "@/Toolkit/StoreProvider";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Small Ecommerce",
  description: "Generated by create next app",
};

async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </head>
      <body
        dir={locale == "ar" ? "rtl" : "ltr"}
        style={{
          fontFamily: locale == "ar" ? "HelveticaNeueLTArabic" : "Helvetica",
        }}
      >
        <Suspense fallback={<Loading />}>
          <ToastProvider>
            <SessionProvider>
              <NextIntlClientProvider messages={messages}>
                <StoreProvider>{children}</StoreProvider>
              </NextIntlClientProvider>
            </SessionProvider>
          </ToastProvider>
        </Suspense>
      </body>
    </html>
  );
}
export default RootLayout;
