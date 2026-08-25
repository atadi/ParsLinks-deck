import { getRequestConfig } from "next-intl/server"
import { routing, type Locale } from "./config"

/**
 * Static-export compatible request config.
 *
 * Under output:"export", next-intl cannot read the request at runtime, so we
 * resolve the locale from the [locale] segment param (passed by the page) and
 * load the UI message catalog for that locale. Presentation content is NOT
 * handled here — it stays in presentation.json / the override store and is
 * resolved by the CT primitive (see src/content/edit.tsx).
 */
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale
  }

  const messages = (await import(`../content/messages/${locale}.json`)).default

  return {
    locale,
    messages,
  }
})
