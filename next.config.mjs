/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
      },
    ],
  },
  redirects: async () => [
    {
      source: "/",
      destination: "/vendors",
      permanent: true,
    },
  ],
};

export default nextConfig;
