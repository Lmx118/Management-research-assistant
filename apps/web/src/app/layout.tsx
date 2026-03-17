import type { Metadata } from "next";
import { IBM_Plex_Sans, Source_Serif_4 } from "next/font/google";
import type { ReactNode } from "react";

import { AppFrame } from "@/components/app-frame";
import { LocaleProvider } from "@/components/locale-provider";
import { getMessages } from "@/lib/i18n";
import { getCurrentLocale } from "@/lib/locale";

import "./globals.css";


const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getCurrentLocale();
  const messages = getMessages(locale);

  return {
    title: messages.meta.title,
    description: messages.meta.description,
  };
}

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const locale = await getCurrentLocale();

  return (
    <html lang={locale === "zh" ? "zh-CN" : "en"}>
      <body className={`${sans.variable} ${serif.variable} font-[family:var(--font-sans)]`}>
        <LocaleProvider locale={locale}>
          <AppFrame locale={locale}>{children}</AppFrame>
        </LocaleProvider>
      </body>
    </html>
  );
}
