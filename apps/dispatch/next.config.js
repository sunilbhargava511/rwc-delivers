/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@rwc/shared", "@rwc/db", "@rwc/ui"],
};

module.exports = nextConfig;
