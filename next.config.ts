import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/writing", destination: "/tech", permanent: true },
      // Brim is free (26 Oct 2026). Older Brim apps link to these pages from
      // their licence screen, so send those users to the free download.
      // Not permanent, so the paths can come back if Brim charges again.
      { source: "/brim/buy", destination: "/brim", permanent: false },
      { source: "/brim/trial", destination: "/brim", permanent: false },
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
