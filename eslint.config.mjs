import next from "eslint-config-next"

const nextConfig = next.flat(process.cwd())

/** @type {import("eslint").Linter.Config[]} */
const config = [
  ...nextConfig,
  {
    ignores: [
      ".next/**",
      "out/**",
      "node_modules/**",
      ".worktrees/**",
    ],
  },
  {
    rules: {
      "@next/next/no-page-custom-font": "off",
    },
  },
]

export default config
