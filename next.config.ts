import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
    serverActions: {
      allowedOrigins: [
        'aquipay.site',
        'www.aquipay.site',
        'admin-aquip.vercel.app' // 如果你有其他子域名也建议加上
      ]
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.alicdn.com",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
