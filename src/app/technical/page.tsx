"use client"

import { useEffect } from "react"

import { defaultLocale } from "@/i18n/config"

/** Back-compat: /technical (no locale prefix) -> /fa/technical, preserving query + hash. */
export default function TechnicalRedirect() {
  useEffect(() => {
    const url = new URL(window.location.href)
    url.pathname = `/${defaultLocale}/technical`
    window.location.replace(url.toString())
  }, [])
  return null
}
