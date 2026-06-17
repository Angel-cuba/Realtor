import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: path.resolve(process.cwd(), "../..")
  },
  transpilePackages: ["@realtor/domain"]
};

export default nextConfig;
