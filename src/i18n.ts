import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

const locales = ["en", "ar"];

export default async function getMessages({ locale }: { locale: string }) {
  if (!locales.includes(locale)) notFound();

  return {
    messages: (await import(`./Messages/${locale}.json`)).default,
  };
}
