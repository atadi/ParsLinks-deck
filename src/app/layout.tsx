import type { ReactNode } from "react"

/**
 * Root layout — passthrough only.
 * The real <html>/<body> (with per-locale lang/dir) is rendered by
 * src/app/[locale]/layout.tsx, which is the effective root for every real
 * route. This file exists only so Next has a root layout boundary for the
 * bare `/`, `/main`, `/technical` back-compat redirect pages.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
