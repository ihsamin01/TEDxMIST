import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      /**
       * Registration sends a photo of a student ID card, and phone cameras
       * routinely produce two to four megabyte JPEGs. The default cap on a
       * server action body is 1 MB, which would reject most of them, so this
       * sits just above the 5 MB the form itself allows.
       */
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
