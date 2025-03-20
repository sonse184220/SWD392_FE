// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  // your config options here
  // async headers() {
  //   return [
  //     {
  //       source: "/(.*)",
  //       headers: [
  //         { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" }, // ✅ Allow popups
  //         { key: "Cross-Origin-Embedder-Policy", value: "credentialless" }, // 🔄 Use `credentialless` instead of `require-corp`
  //       ],
  //     },
  //   ];
  // },
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
}

module.exports = nextConfig