import { withPayload } from '@payloadcms/next/withPayload'

import redirects from './redirects.js'

const target = process.env.API_BASE_URL || "http://localhost:3000"

/** @type {import('next').NextConfig} */
const nextConfig = {
   env: {
    NEXT_PUBLIC_APP_NAME: "RENDPRO GOV Integrator – Admin",
  },
  images: {
    remotePatterns: [
      {
        protocol: process.env.S3_ENDPOINT_URL.split(':')[0],
        hostname: process.env.S3_ENDPOINT_URL.split('/')[2],
        pathname: `/${process.env.S3_BUCKET_NAME}/**`,
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  reactStrictMode: true,
  redirects,
   async rewrites() {
    return [
      // Proxy publicznych eksportów i harvestu do backendu
      {
        source: "/open-data/:path*",
        destination: `${target}/open-data/:path*`,
      },
    ]
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
