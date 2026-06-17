import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async headers() {
    return [
      {
        source: "/install.sh",
        headers: [
          {
            key: "Content-Type",
            value: "text/x-shellscript; charset=utf-8",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        // Redirect www → apex (www is added as a project domain on Vercel so it
        // gets a cert; this sends its traffic to the canonical apex host).
        source: "/:path*",
        has: [{ type: "host", value: "www.layoutpick.com" }],
        destination: "https://layoutpick.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
