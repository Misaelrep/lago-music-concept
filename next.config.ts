import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 90 para logo y flyers del archivo (texto fino), 75 para fotografía.
    qualities: [75, 90],
  },
};

export default nextConfig;
