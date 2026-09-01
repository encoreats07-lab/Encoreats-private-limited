import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],

    remotePatterns: [
      // =========================
      // UNSPLASH
      // =========================
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        pathname: "/**",
      },

      // =========================
      // AMAZON AWS / S3
      // =========================
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
        pathname: "/**",
      },

      // =========================
      // PEXELS
      // =========================
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**",
      },

      // =========================
      // PIXABAY
      // =========================
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
        pathname: "/**",
      },

      // =========================
      // CLOUDINARY
      // =========================
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;