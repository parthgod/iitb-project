/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
      },
    ],
  },
  redirects: async () => [
    {
      source: "/",
      destination: "/bus",
      permanent: true,
    },
  ],
};

export default nextConfig;
