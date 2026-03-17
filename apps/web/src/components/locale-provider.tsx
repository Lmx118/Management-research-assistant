"use client";

import { createContext, type ReactNode, useContext } from "react";

import { getMessages, type Locale, type Messages } from "@/lib/i18n";


type LocaleContextValue = {
  locale: Locale;
  messages: Messages;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children, locale }: { children: ReactNode; locale: Locale }) {
  return (
    <LocaleContext.Provider value={{ locale, messages: getMessages(locale) }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useI18n(): LocaleContextValue {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useI18n must be used within a LocaleProvider.");
  }

  return context;
}
