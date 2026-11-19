import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Stop `next dev` from writing AGENTS.md / CLAUDE.md into the repo root.
  agentRules: false,
};

export default nextConfig;
