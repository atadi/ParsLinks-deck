import next from "eslint-config-next"

const eslintConfig = [
  ...next,
  { ignores: [".next/**", "out/**", "node_modules/**"] },
  {
    rules: {
      // fonts are loaded via <link> in the App Router root layout by design
      // (spec requires Google Fonts links + Tahoma/system-ui fallback)
      "@next/next/no-page-custom-font": "off",
    },
  },
]

export default eslintConfig
