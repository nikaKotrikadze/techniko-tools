import type { NextConfig } from "next";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL && new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname;

const nextConfig: NextConfig = {
  // Dev only: lets phones on your Wi-Fi (192.168.x.x / 10.x.x.x) load the dev server's JS.
  // Without this the page renders but search and buttons are dead.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*"],
  images: {
    // Tool logos live in the Supabase "logos" bucket.
    remotePatterns: supabaseHost
      ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }]
      : [],
  },
};

export default nextConfig;
