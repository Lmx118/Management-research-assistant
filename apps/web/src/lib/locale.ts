import { cookies } from "next/headers";

import { DEFAULT_LOCALE, LOCALE_COOKIE_NAME, isLocale, type Locale } from "@/lib/i18n";


export async function getCurrentLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get(LOCALE_COOKIE_NAME)?.value;

  return isLocale(locale) ? locale : DEFAULT_LOCALE;
}
