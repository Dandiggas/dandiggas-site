import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/writing", destination: "/tech", permanent: true },
      { source: "/projects", destination: "/tech", permanent: true },
      {
        source: "/projects/keyboard-manual-assistant",
        destination: "/tech/keyboard-manual-assistant",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
