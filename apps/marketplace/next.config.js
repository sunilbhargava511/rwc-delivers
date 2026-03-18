/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@rwc/shared", "@rwc/db", "@rwc/ui"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "s3-media0.fl.yelpcdn.com" },
      { protocol: "https", hostname: "s3-media1.fl.yelpcdn.com" },
      { protocol: "https", hostname: "s3-media2.fl.yelpcdn.com" },
      { protocol: "https", hostname: "s3-media3.fl.yelpcdn.com" },
      { protocol: "https", hostname: "s3-media4.fl.yelpcdn.com" },
      { protocol: "https", hostname: "**.yelp.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "**.doordash.com" },
      { protocol: "https", hostname: "img.cdn4dd.com" },
      { protocol: "https", hostname: "doordash-static.s3.amazonaws.com" },
    ],
  },
};

module.exports = nextConfig;
