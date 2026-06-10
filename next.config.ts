import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  
  env: {
    API_URL_UNIVERSITYMANAGEMENT: process.env.API_URL_UNIVERSITYMANAGEMENT,
    API_URL_FORMMANAGEMENT: process.env.API_URL_FORMMANAGEMENT,
    API_URL_USERMANAGEMENT: process.env.API_URL_USERMANAGEMENT,
  },
};

export default nextConfig;
