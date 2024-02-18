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
  // webpack: (config) => {
  //   config.resolve.fallback = {
  //     "mongodb-client-encryption": false,
  //     aws4: false,
  //   };

  //   return config;
  // },
};

export default nextConfig;
