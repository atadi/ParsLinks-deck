/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // this worktree sits next to the primary tree's lockfile
  turbopack: { root: import.meta.dirname },
  eslint: { ignoreDuringBuilds: false },
}

export default nextConfig
