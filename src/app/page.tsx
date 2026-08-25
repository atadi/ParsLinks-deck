"use client"

import { useEffect } from "react"

import { defaultLocale, isLocale, locales } from "@/i18n/config"

/**
 * Root `/` redirect (static-export safe).
 *
 * There is no server middleware in output:"export", so locale auto-detection
 * happens on the client: prefer a remembered locale (set by the language
 * switcher), else the default locale. The full path including any query
 * (e.g. ?edit=1) and the slide hash is preserved.
 */
const REMEMBERED_KEY = "pl-locale"

export default function RootRedirect() {
  useEffect(() => {
    const url = new URL(window.location.href)
    let target: string = defaultLocale
    try {
      const remembered = window.localStorage.getItem(REMEMBERED_KEY)
      if (remembered && isLocale(remembered)) target = remembered
    } catch {
      /* ignore */
    }
    if (!locales.includes(target as never)) target = defaultLocale
    url.pathname = `/${target}${url.pathname === "/" ? "" : url.pathname}`
    window.location.replace(url.toString())
  }, [])
  return null
}
