import type { NextConfig } from "next";
import { SERVER_ACTION_UPLOAD_BODY_SIZE_LIMIT } from "./lib/media/constants";

const remotePatterns: NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
> = [];

if (process.env.CLOUDINARY_CLOUD_NAME) {
  remotePatterns.push({
    protocol: "https",
    hostname: "res.cloudinary.com",
    pathname: `/${process.env.CLOUDINARY_CLOUD_NAME}/**`,
  });
}

if (process.env.S3_PUBLIC_HOSTNAME) {
  remotePatterns.push({
    protocol: "https",
    hostname: process.env.S3_PUBLIC_HOSTNAME,
  });
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
  serverExternalPackages: ["pg", "@prisma/adapter-pg"],
  experimental: {
    serverActions: {
      bodySizeLimit: SERVER_ACTION_UPLOAD_BODY_SIZE_LIMIT,
    },
  },
};

export default nextConfig;
