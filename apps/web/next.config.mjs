import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: path.resolve(process.cwd(), "../..")
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ufs.sh" },
      { protocol: "https", hostname: "*.ufs.sh" },
      { protocol: "https", hostname: "utfs.io" },
      { protocol: "https", hostname: "loremflickr.com" }
    ]
  },
  transpilePackages: ["@realtor/domain"]
};

export default nextConfig;
