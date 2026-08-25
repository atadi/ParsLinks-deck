"use client"

import { useEffect } from "react"

import { defaultLocale } from "@/i18n/config"

/** Back-compat: /main (no locale prefix) -> /fa/main, preserving query + hash. */
export default function MainRedirect() {
  useEffect(() => {
    const url = new URL(window.location.href)
    url.pathname = `/${defaultLocale}/main`
    window.location.replace(url.toString())
  }, [])
  return null
}
