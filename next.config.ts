/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";
import { type NextConfig } from "next";

const config = {
  reactStrictMode: true,
  poweredByHeader: false,
  reactCompiler: true,
  experimental: {
    scrollRestoration: true,
    largePageDataBytes: 512 * 100000,
    serverSourceMaps: true,
    optimizeServerReact: true,
  },
} satisfies NextConfig;

export default config;
