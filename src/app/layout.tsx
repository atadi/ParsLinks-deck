import type { Metadata } from "next"
import type { ReactNode } from "react"

import "./globals.css"
import "./design-v2.css"
import { Providers } from "./providers"
import { EditModeProvider } from "@/content/edit"
import { EditToolbar } from "@/components/EditToolbar"

export const metadata: Metadata = {
  title: "ParsLinks — پلتفرم توسعه‌دهندگان برای ابر ایران",
  description:
    "ParsLinks — the developer platform (PaaS) layer for Iran's cloud infrastructure. Confidential deck.",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
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
        <Providers>
          <EditModeProvider>
            {children}
            <EditToolbar />
          </EditModeProvider>
        </Providers>
      </body>
    </html>
  )
}
