import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { NextIntlClientProvider } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"

import type { ReactNode } from "react"

import "./../globals.css"
import "./../design-v2.css"

import { EditModeProvider } from "@/content/edit"
import { EditToolbar } from "@/components/EditToolbar"
import { Providers } from "@/app/providers"
import { isLocale, localeMeta, routing, type Locale } from "@/i18n/config"

export const dynamicParams = false

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const metadata: Metadata = {
  title: "ParsLinks — پلتفرم توسعه‌دهندگان برای ابر ایران",
  description:
    "ParsLinks — the developer platform (PaaS) layer for Iran's cloud infrastructure. Confidential deck.",
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  // Enables static rendering for the locale's messages.
  setRequestLocale(locale as Locale)
  const messages = await getMessages()

  const dir = localeMeta[locale].dir

  return (
    <html lang={locale} dir={dir}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Vazirmatn (FA), Inter (EN), JetBrains Mono (technical tokens).
            Degrades to Tahoma / system-ui offline — see globals.css. */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;700;800&family=Inter:wght@400;500;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap"
        />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers locale={locale}>
            <EditModeProvider>
              {children}
              <EditToolbar />
            </EditModeProvider>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
