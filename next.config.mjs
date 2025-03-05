import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["example.com"],
  },
  env: {
    _next_intl_trailing_slash: "/",
  },
};

export default withNextIntl(nextConfig);
