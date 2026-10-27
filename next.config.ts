import type { NextConfig } from "next";
import { SERVER_ACTION_UPLOAD_BODY_SIZE_LIMIT } from "./lib/media/constants";

/** Room for multipart overhead above the 20 MB file cap and API route uploads. */
const PROXY_CLIENT_MAX_BODY_SIZE = "25mb";

const deploymentId = process.env.NEXT_DEPLOYMENT_ID?.trim() || undefined;

function getServerActionAllowedOrigins(): string[] {
  const hosts = new Set<string>(["roa-jewerly.com", "www.roa-jewerly.com"]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    try {
      hosts.add(new URL(siteUrl).host);
    } catch {
      // Ignore invalid build-time URL; defaults above cover production.
    }
  }

  return [...hosts];
}

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
  deploymentId,
  images: {
    remotePatterns,
  },
  serverExternalPackages: ["pg", "@prisma/adapter-pg"],
  experimental: {
    serverActions: {
      bodySizeLimit: SERVER_ACTION_UPLOAD_BODY_SIZE_LIMIT,
      allowedOrigins: getServerActionAllowedOrigins(),
    },
    proxyClientMaxBodySize: PROXY_CLIENT_MAX_BODY_SIZE,
  },
  async headers() {
    return [
      {
        source: "/admin/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
